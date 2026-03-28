[CmdletBinding()]
param(
    [string]$DataDir = "data",
    [switch]$IncludeLegacy
)

$ErrorActionPreference = "Stop"

function Get-ProjectPath([string]$RelativePath) {
    return Join-Path -Path $PSScriptRoot -ChildPath ("..\" + $RelativePath)
}

function Get-RelativeDataPath([string]$BasePath, [string]$FullPath) {
    $resolvedBase = (Resolve-Path $BasePath).Path.TrimEnd('\') + '\'
    $resolvedFull = (Resolve-Path $FullPath).Path
    if (-not $resolvedFull.StartsWith($resolvedBase, [System.StringComparison]::OrdinalIgnoreCase)) {
        throw "Path is outside of data directory: $resolvedFull"
    }
    return $resolvedFull.Substring($resolvedBase.Length).Replace('\', '/')
}

function Is-PlainObject($value) {
    return $null -ne $value -and $value -isnot [System.Collections.IList] -and $value.PSObject -and $value.PSObject.Properties
}

function Is-NonEmptyString($value) {
    return $value -is [string] -and $value.Trim().Length -gt 0
}

function Is-PositiveInteger($value) {
    try {
        $number = [int]$value
        return $number -gt 0
    } catch {
        return $false
    }
}

function Is-DataFilePath([string]$value) {
    if (-not (Is-NonEmptyString $value)) { return $false }
    return ($value.Trim().Replace('\', '/')) -match '^\.?\/?data\/.+\.json$'
}

function Add-Issue($message) {
    [void]$script:Issues.Add($message)
}

function Validate-IndexData($path, $data) {
    if (-not (Is-PlainObject $data) -or -not ($data.grades -is [System.Collections.IList]) -or $data.grades.Count -eq 0) {
        Add-Issue("${path}: grades[] absent ou vide")
        return
    }

    $gradeIds = @{}
    foreach ($grade in $data.grades) {
        if (-not (Is-PlainObject $grade)) {
            Add-Issue("${path}: une classe n'est pas un objet")
            continue
        }
        if (-not (Is-NonEmptyString $grade.id) -or -not (Is-NonEmptyString $grade.title) -or -not (Is-DataFilePath $grade.dataFile)) {
            Add-Issue("${path}: classe incomplÃƒÂ¨te ($($grade.id))")
            continue
        }
        if ($gradeIds.ContainsKey($grade.id)) {
            Add-Issue("${path}: id de classe dupliquÃƒÂ© ($($grade.id))")
        } else {
            $gradeIds[$grade.id] = $true
        }

        $target = Join-Path $script:ResolvedDataDir ([IO.Path]::GetFileName($grade.dataFile))
        if (-not (Test-Path $target)) {
            Add-Issue("${path}: dataFile introuvable ($($grade.dataFile))")
        }
    }
}

function Validate-Exercise($path, $themeId, $exercise) {
    $knownEngines = @(
        'choice-engine',
        'clock',
        'conjugation',
        'conversion',
        'counting',
        'math-input',
        'audio-spelling',
        'reading',
        'timeline'
    )

    if (-not (Is-PlainObject $exercise)) {
        Add-Issue("${path}: exercice invalide dans $themeId")
        return
    }
    if (-not (Is-NonEmptyString $exercise.id) -or -not (Is-NonEmptyString $exercise.title)) {
        Add-Issue("${path}: exercice incomplet dans $themeId")
        return
    }
    if (-not (Is-NonEmptyString $exercise.engine) -or $exercise.engine -notin $knownEngines) {
        Add-Issue("${path}: engine invalide pour $($exercise.id) ($($exercise.engine))")
    }
    if (-not (Is-PlainObject $exercise.params)) {
        Add-Issue("${path}: params invalides pour $($exercise.id)")
        return
    }
    if (-not (Is-PositiveInteger $exercise.params.questions)) {
        Add-Issue("${path}: questions invalide pour $($exercise.id)")
    }
    if ($exercise.params.dataFile -and -not (Is-DataFilePath $exercise.params.dataFile)) {
        Add-Issue("${path}: dataFile invalide pour $($exercise.id)")
    }
    if ($exercise.params.choices -and ((-not ($exercise.params.choices -is [System.Collections.IList])) -or $exercise.params.choices.Count -lt 2)) {
        Add-Issue("${path}: choices invalide pour $($exercise.id)")
    }
    if ($exercise.params.options -and ((-not ($exercise.params.options -is [System.Collections.IList])) -or $exercise.params.options.Count -lt 2)) {
        Add-Issue("${path}: options invalide pour $($exercise.id)")
    }
    if ($exercise.params.type -eq 'factual-qcm' -and -not (Is-NonEmptyString $exercise.params.category)) {
        Add-Issue("${path}: category manquante pour $($exercise.id)")
    }
    if ($exercise.engine -eq 'timeline') {
        if (-not (Is-NonEmptyString $exercise.params.grade)) {
            Add-Issue("${path}: grade manquant pour $($exercise.id)")
        }
        if (-not (Is-NonEmptyString $exercise.params.mode) -or $exercise.params.mode -notin @('order', 'place')) {
            Add-Issue("${path}: mode timeline invalide pour $($exercise.id)")
        }
        if (-not (Is-NonEmptyString $exercise.params.timelineId)) {
            Add-Issue("${path}: timelineId manquant pour $($exercise.id)")
        }
    }

    if ($exercise.params.dataFile) {
        $script:ExerciseRefs += [pscustomobject]@{
            GradeFile = $path
            ThemeId = $themeId
            ExerciseId = $exercise.id
            Engine = $exercise.engine
            Type = $exercise.params.type
            Grade = $exercise.params.grade
            Mode = $exercise.params.mode
            TimelineId = $exercise.params.timelineId
            Category = $exercise.params.category
            DataFile = $exercise.params.dataFile.Replace('\', '/').TrimStart('./')
        }
    }
}

function Validate-GradeData($path, $data) {
    $hasThemes = ($data.themes -is [System.Collections.IList]) -and $data.themes.Count -gt 0
    $hasSubjects = ($data.subjects -is [System.Collections.IList]) -and $data.subjects.Count -gt 0

    if (-not (Is-PlainObject $data) -or -not (Is-NonEmptyString $data.gradeId) -or (-not $hasThemes -and -not $hasSubjects)) {
        Add-Issue("${path}: gradeId/themes/subjects manquants ou vides")
        return
    }

    $themeIds = @{}
    $subjectIds = @{}
    $subthemeIds = @{}
    $exerciseIds = @{}

    if ($hasThemes) {
        foreach ($theme in $data.themes) {
            if (-not (Is-PlainObject $theme)) {
                Add-Issue("${path}: thÃƒÂ¨me invalide")
                continue
            }
            if (-not (Is-NonEmptyString $theme.id) -or -not (Is-NonEmptyString $theme.title) -or -not ($theme.exercises -is [System.Collections.IList]) -or $theme.exercises.Count -eq 0) {
                Add-Issue("${path}: thÃƒÂ¨me incomplet ($($theme.id))")
                continue
            }
            if ($themeIds.ContainsKey($theme.id)) {
                Add-Issue("${path}: id de thÃƒÂ¨me dupliquÃƒÂ© ($($theme.id))")
            } else {
                $themeIds[$theme.id] = $true
            }
            foreach ($exercise in $theme.exercises) {
                if (Is-NonEmptyString $exercise.id) {
                    if ($exerciseIds.ContainsKey($exercise.id)) {
                        Add-Issue("${path}: id d'exercice dupliquÃƒÂ© ($($exercise.id))")
                    } else {
                        $exerciseIds[$exercise.id] = $true
                    }
                }
                Validate-Exercise $path $theme.id $exercise
            }
        }
    }

    if ($hasSubjects) {
        foreach ($subject in $data.subjects) {
            if (-not (Is-PlainObject $subject)) {
                Add-Issue("${path}: matiÃƒÂ¨re invalide")
                continue
            }
            if (-not (Is-NonEmptyString $subject.id) -or -not (Is-NonEmptyString $subject.title) -or -not ($subject.subthemes -is [System.Collections.IList]) -or $subject.subthemes.Count -eq 0) {
                Add-Issue("${path}: matiÃƒÂ¨re incomplÃƒÂ¨te ($($subject.id))")
                continue
            }
            if ($subjectIds.ContainsKey($subject.id)) {
                Add-Issue("${path}: id de matiÃƒÂ¨re dupliquÃƒÂ© ($($subject.id))")
            } else {
                $subjectIds[$subject.id] = $true
            }

            foreach ($subtheme in $subject.subthemes) {
                if (-not (Is-PlainObject $subtheme)) {
                    Add-Issue("${path}: sous-thÃƒÂ¨me invalide dans $($subject.id)")
                    continue
                }
                if (-not (Is-NonEmptyString $subtheme.id) -or -not (Is-NonEmptyString $subtheme.title) -or -not ($subtheme.exercises -is [System.Collections.IList]) -or $subtheme.exercises.Count -eq 0) {
                    Add-Issue("${path}: sous-thÃƒÂ¨me incomplet ($($subtheme.id))")
                    continue
                }
                if ($subthemeIds.ContainsKey($subtheme.id)) {
                    Add-Issue("${path}: id de sous-thÃƒÂ¨me dupliquÃƒÂ© ($($subtheme.id))")
                } else {
                    $subthemeIds[$subtheme.id] = $true
                }
                foreach ($exercise in $subtheme.exercises) {
                    if (Is-NonEmptyString $exercise.id) {
                        if ($exerciseIds.ContainsKey($exercise.id)) {
                            Add-Issue("${path}: id d'exercice dupliquÃƒÂ© ($($exercise.id))")
                        } else {
                            $exerciseIds[$exercise.id] = $true
                        }
                    }
                    Validate-Exercise $path $subtheme.id $exercise
                }
            }
        }
    }
}

function Validate-FrenchLibrary($path, $data) {
    $required = @('spelling', 'conjugation', 'homophones', 'grammar')
    foreach ($section in $required) {
        if (-not (Is-PlainObject $data.$section)) {
            Add-Issue("${path}: section absente ($section)")
        }
    }
}

function Validate-FrenchLibrarySection($path, $sectionName, $data) {
    if (-not (Is-PlainObject $data)) {
        Add-Issue("${path}: section invalide ($sectionName)")
    }

    if ($sectionName -eq 'reading') {
        foreach ($category in $data.PSObject.Properties) {
            if (-not ($category.Value -is [System.Collections.IList]) -or $category.Value.Count -eq 0) {
                Add-Issue("${path}: catÃƒÂ©gorie de lecture vide ou invalide ($($category.Name))")
                continue
            }

            foreach ($entry in $category.Value) {
                if (-not (Is-PlainObject $entry)) {
                    Add-Issue("${path}: entrÃƒÂ©e de lecture invalide ($($category.Name))")
                    break
                }

                if (-not (Is-NonEmptyString $entry.text)) {
                    Add-Issue("${path}: texte absent en lecture ($($category.Name))")
                    break
                }

                if (-not ($entry.syllables -is [System.Collections.IList]) -or $entry.syllables.Count -eq 0) {
                    Add-Issue("${path}: syllabes absentes en lecture ($($category.Name))")
                    break
                }

                $badSyllable = $entry.syllables | Where-Object { -not (Is-NonEmptyString $_) } | Select-Object -First 1
                if ($badSyllable) {
                    Add-Issue("${path}: syllabe invalide en lecture ($($category.Name))")
                    break
                }

                $answer = if (Is-NonEmptyString $entry.answer) { $entry.answer } elseif (Is-NonEmptyString $entry.a) { $entry.a } else { $entry.text }
                if (-not (Is-NonEmptyString $answer)) {
                    Add-Issue("${path}: rÃƒÂ©ponse absente en lecture ($($category.Name))")
                    break
                }

                if (-not ($entry.choices -is [System.Collections.IList]) -or $entry.choices.Count -lt 2) {
                    Add-Issue("${path}: choices invalides en lecture ($($category.Name))")
                    break
                }

                $badChoice = $entry.choices | Where-Object { -not (Is-NonEmptyString $_) } | Select-Object -First 1
                if ($badChoice) {
                    Add-Issue("${path}: choix vide en lecture ($($category.Name))")
                    break
                }

                if ($answer -notin $entry.choices) {
                    Add-Issue("${path}: rÃƒÂ©ponse hors choix en lecture ($($category.Name))")
                    break
                }

                if ($null -ne $entry.silent) {
                    if (-not ($entry.silent -is [System.Collections.IList])) {
                        Add-Issue("${path}: silent invalide en lecture ($($category.Name))")
                        break
                    }
                    $badSilent = $entry.silent | Where-Object {
                        try {
                            ([int]$_) -lt 0
                        } catch {
                            $true
                        }
                    } | Select-Object -First 1
                    if ($badSilent -ne $null) {
                        Add-Issue("${path}: index silent invalide ($($category.Name))")
                        break
                    }
                }
            }
        }
    }

    if ($sectionName -eq 'grammar') {
        foreach ($category in $data.PSObject.Properties) {
            if (-not ($category.Value -is [System.Collections.IList]) -or $category.Value.Count -eq 0) {
                Add-Issue("${path}: catÃƒÂ©gorie de grammaire vide ou invalide ($($category.Name))")
                continue
            }

            foreach ($entry in $category.Value) {
                if (-not (Is-PlainObject $entry)) {
                    Add-Issue("${path}: entrÃƒÂ©e de grammaire invalide ($($category.Name))")
                    break
                }

                $isGenderEntry = (Is-NonEmptyString $entry.word) -and (Is-NonEmptyString $entry.gender) -and (Is-NonEmptyString $entry.article)
                $prompt = if (Is-NonEmptyString $entry.question) { $entry.question } else { $entry.sentence }
                $answer = if (Is-NonEmptyString $entry.answer) { $entry.answer } else { $entry.a }
                $isQcmEntry = (Is-NonEmptyString $prompt) -and ($entry.choices -is [System.Collections.IList]) -and $entry.choices.Count -ge 2 -and (Is-NonEmptyString $answer)

                if (-not $isGenderEntry -and -not $isQcmEntry) {
                    Add-Issue("${path}: format de grammaire inconnu ($($category.Name))")
                    break
                }
            }
        }
    }
}

function Validate-FactualDataset($ref, $dataSet) {
    if (-not (Is-PlainObject $dataSet.categories)) {
        Add-Issue("$($ref.DataFile): categories absentes (rÃƒÂ©f. $($ref.ExerciseId))")
        return
    }
    $pool = $dataSet.categories.$($ref.Category)
    if (-not ($pool -is [System.Collections.IList]) -or $pool.Count -eq 0) {
        Add-Issue("$($ref.DataFile): catÃƒÂ©gorie introuvable ($($ref.Category))")
        return
    }
    foreach ($item in $pool) {
        if (-not (Is-PlainObject $item) -or -not (Is-NonEmptyString $item.question) -or -not ($item.choices -is [System.Collections.IList]) -or $item.choices.Count -lt 2 -or -not (Is-NonEmptyString $item.answer) -or $item.answer -notin $item.choices) {
            Add-Issue("$($ref.DataFile): question documentaire invalide dans $($ref.Category)")
            break
        }
    }
}

function Validate-TimelineDataset($ref, $dataSet) {
    if (-not (Is-PlainObject $dataSet.grades)) {
        Add-Issue("$($ref.DataFile): grades absents (rÃƒÂ©f. $($ref.ExerciseId))")
        return
    }

    $gradeId = [string]$ref.Grade
    $gradeData = $dataSet.grades.$gradeId
    if (-not (Is-PlainObject $gradeData)) {
        Add-Issue("$($ref.DataFile): grade introuvable ($gradeId)")
        return
    }

    if (-not ($gradeData.events -is [System.Collections.IList]) -or $gradeData.events.Count -eq 0) {
        Add-Issue("$($ref.DataFile): events absents pour $gradeId")
        return
    }
    if (-not ($gradeData.timelines -is [System.Collections.IList]) -or $gradeData.timelines.Count -eq 0) {
        Add-Issue("$($ref.DataFile): timelines absentes pour $gradeId")
        return
    }

    $eventIds = @{}
    $periodIds = @{}
    foreach ($period in @($gradeData.periods)) {
        if (Is-NonEmptyString $period.id) {
            $periodIds[$period.id] = $true
        }
    }

    foreach ($event in $gradeData.events) {
        if (-not (Is-PlainObject $event) -or -not (Is-NonEmptyString $event.id) -or -not (Is-NonEmptyString $event.label) -or $null -eq $event.year -or -not (Is-NonEmptyString $event.period)) {
            Add-Issue("$($ref.DataFile): event invalide pour $gradeId")
            return
        }
        if ($eventIds.ContainsKey($event.id)) {
            Add-Issue("$($ref.DataFile): event dupliquÃƒÂ© ($($event.id)) pour $gradeId")
        } else {
            $eventIds[$event.id] = $event
        }
        if ($periodIds.Count -gt 0 -and -not $periodIds.ContainsKey($event.period)) {
            Add-Issue("$($ref.DataFile): pÃƒÂ©riode inconnue pour event $($event.id)")
        }
    }

    $timeline = @($gradeData.timelines) | Where-Object { $_.id -eq $ref.TimelineId } | Select-Object -First 1
    if (-not $timeline) {
        Add-Issue("$($ref.DataFile): timeline introuvable ($($ref.TimelineId))")
        return
    }
    if (-not (Is-NonEmptyString $timeline.mode) -or $timeline.mode -notin @('order', 'place')) {
        Add-Issue("$($ref.DataFile): mode invalide pour timeline $($ref.TimelineId)")
    }
    if ($timeline.mode -ne $ref.Mode) {
        Add-Issue("$($ref.DataFile): mode incohÃƒÂ©rent pour timeline $($ref.TimelineId)")
    }
    if (-not ($timeline.items -is [System.Collections.IList]) -or $timeline.items.Count -eq 0) {
        Add-Issue("$($ref.DataFile): items absents pour timeline $($ref.TimelineId)")
    } else {
        foreach ($id in $timeline.items) {
            if (-not $eventIds.ContainsKey($id)) {
                Add-Issue("$($ref.DataFile): event introuvable dans timeline $($ref.TimelineId) ($id)")
            }
        }
    }
    if ($timeline.mode -eq 'place') {
        if (-not ($timeline.range -is [System.Collections.IList]) -or $timeline.range.Count -ne 2) {
            Add-Issue("$($ref.DataFile): range invalide pour timeline $($ref.TimelineId)")
        }
        if (-not (Is-PositiveInteger $timeline.step)) {
            Add-Issue("$($ref.DataFile): step invalide pour timeline $($ref.TimelineId)")
        }
    }
}

$script:ResolvedDataDir = Get-ProjectPath $DataDir
if (-not (Test-Path $script:ResolvedDataDir)) {
    throw "Data directory not found: $script:ResolvedDataDir"
}

$script:Issues = New-Object System.Collections.ArrayList
$script:ExerciseRefs = @()

$files = Get-ChildItem -Path $script:ResolvedDataDir -Filter *.json -Recurse | Sort-Object FullName
if (-not $IncludeLegacy) {
    $files = $files | Where-Object { $_.Name -ne 'cpold.json' }
}

$parsed = @{}
foreach ($file in $files) {
    $relativePath = ('data/' + (Get-RelativeDataPath $script:ResolvedDataDir $file.FullName))
    try {
        $parsed[$file.Name] = Get-Content $file.FullName -Raw | ConvertFrom-Json
        $parsed[$relativePath] = $parsed[$file.Name]
    } catch {
        Add-Issue("JSON invalide: $relativePath - $($_.Exception.Message)")
    }
}

if ($parsed.ContainsKey('index.json')) {
    Validate-IndexData 'data/index.json' $parsed['index.json']
} else {
    Add-Issue('data/index.json manquant')
}

$frenchSectionPaths = @{
    spelling = 'data/french/spelling.json'
    conjugation = 'data/french/conjugation.json'
    homophones = 'data/french/homophones.json'
    grammar = 'data/french/grammar.json'
    reading = 'data/french/reading.json'
}

$frenchSectionKeys = @($frenchSectionPaths.Keys)
$missingFrenchSections = $frenchSectionKeys | Where-Object { -not $parsed.ContainsKey($frenchSectionPaths[$_]) }

foreach ($sectionName in $frenchSectionKeys) {
    $sectionPath = $frenchSectionPaths[$sectionName]
    if ($parsed.ContainsKey($sectionPath)) {
        Validate-FrenchLibrarySection $sectionPath $sectionName $parsed[$sectionPath]
    }
}

foreach ($sectionName in $missingFrenchSections) {
    Add-Issue(($frenchSectionPaths[$sectionName]) + ': section modulaire manquante (' + $sectionName + ')')
}

if ($missingFrenchSections.Count -eq $frenchSectionKeys.Count) {
    Add-Issue('Bibliothèque française absente: data/french/*.json manquants')
}

foreach ($entry in $parsed.GetEnumerator()) {
    if ($entry.Key -notmatch '^[^/]+\.json$') { continue }
    if ($entry.Key -eq 'index.json') { continue }

    $hasThemes = ($entry.Value.themes -is [System.Collections.IList]) -and $entry.Value.themes.Count -gt 0
    $hasSubjects = ($entry.Value.subjects -is [System.Collections.IList]) -and $entry.Value.subjects.Count -gt 0
    if ($entry.Value.gradeId -and ($hasThemes -or $hasSubjects)) {
        Validate-GradeData ("data/" + $entry.Key) $entry.Value
    }
}

foreach ($ref in $script:ExerciseRefs) {
    $targetName = [IO.Path]::GetFileName($ref.DataFile)
    if (-not $parsed.ContainsKey($targetName)) {
        Add-Issue("$($ref.GradeFile): dataFile introuvable pour $($ref.ExerciseId) ($($ref.DataFile))")
        continue
    }

    $dataSet = $parsed[$targetName]
    if ($ref.Type -eq 'factual-qcm') {
        Validate-FactualDataset $ref $dataSet
    } elseif ($ref.Engine -eq 'timeline') {
        Validate-TimelineDataset $ref $dataSet
    }
}

if ($script:Issues.Count -gt 0) {
    Write-Host "DATA_VALIDATION_FAILED"
    $script:Issues | ForEach-Object { Write-Host "- $_" }
    exit 1
}

Write-Host "DATA_VALIDATION_OK"
Write-Host "Files checked:" $files.Count
Write-Host "Exercise references checked:" $script:ExerciseRefs.Count

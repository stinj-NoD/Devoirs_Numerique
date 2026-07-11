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

function Is-SafeLessonText($value) {
    return (Is-NonEmptyString $value) -and ($value -notmatch '<\/?[a-zA-Z!][^>]*>')
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
            Add-Issue("${path}: classe incomplète ($($grade.id))")
            continue
        }
        if ($gradeIds.ContainsKey($grade.id)) {
            Add-Issue("${path}: id de classe dupliqué ($($grade.id))")
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
        'board-interactive',
        'reading',
        'timeline',
        'matching',
        'word-order',
        'cloze-fill-in'
    )

    if (-not (Is-PlainObject $exercise)) {
        Add-Issue("${path}: exercice invalide dans $themeId")
        return
    }
    if (-not (Is-NonEmptyString $exercise.id) -or -not (Is-SafeLessonText $exercise.title)) {
        Add-Issue("${path}: exercice incomplet ou titre non sur dans $themeId")
        return
    }
    if ($null -ne $exercise.subtitle -and -not (Is-SafeLessonText $exercise.subtitle)) {
        Add-Issue("${path}: subtitle non sur pour $($exercise.id)")
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

function Validate-LessonBlock($path, $subthemeId, $lessonId, $block) {
    if (-not (Is-PlainObject $block) -or -not (Is-NonEmptyString $block.type)) {
        Add-Issue("${path}: bloc de leçon invalide dans ${subthemeId}/${lessonId}")
        return
    }

    $type = $block.type.Trim()

    if ($type -eq 'paragraph') {
        if (-not (Is-SafeLessonText $block.text)) {
            Add-Issue("${path}: bloc paragraph sans texte ou texte invalide dans ${subthemeId}/${lessonId}")
        }
        return
    }

    if ($type -in @('example', 'tip')) {
        if (-not (Is-SafeLessonText $block.content)) {
            Add-Issue("${path}: bloc ${type} sans contenu ou contenu invalide dans ${subthemeId}/${lessonId}")
        }
        return
    }

    if ($type -eq 'bullets') {
        $valid = ($block.items -is [System.Collections.IList]) -and $block.items.Count -gt 0
        if ($valid) {
            foreach ($item in $block.items) {
                if (-not (Is-SafeLessonText $item)) {
                    $valid = $false
                    break
                }
            }
        }
        if (-not $valid) {
            Add-Issue("${path}: bloc bullets invalide dans ${subthemeId}/${lessonId}")
        }
        return
    }

    if ($type -eq 'mini-table') {
        $hasHeaders = ($block.headers -is [System.Collections.IList]) -and $block.headers.Count -ge 2
        $hasRows = ($block.rows -is [System.Collections.IList]) -and $block.rows.Count -gt 0
        if ($hasHeaders) {
            foreach ($header in $block.headers) {
                if (-not (Is-SafeLessonText $header)) {
                    $hasHeaders = $false
                    break
                }
            }
        }
        if ($hasRows) {
            foreach ($row in $block.rows) {
                if (-not ($row -is [System.Collections.IList]) -or $row.Count -ne $block.headers.Count) {
                    $hasRows = $false
                    break
                }
                foreach ($cell in $row) {
                    if (-not (Is-SafeLessonText $cell)) {
                        $hasRows = $false
                        break
                    }
                }
                if (-not $hasRows) { break }
            }
        }
        if (-not $hasHeaders -or -not $hasRows) {
            Add-Issue("${path}: bloc mini-table invalide dans ${subthemeId}/${lessonId}")
        }
        return
    }

    Add-Issue("${path}: type de bloc de leçon inconnu (${type}) dans ${subthemeId}/${lessonId}")
}

function Validate-Lesson($path, $subthemeId, $lesson) {
    if (-not (Is-PlainObject $lesson)) {
        Add-Issue("${path}: leçon invalide dans ${subthemeId}")
        return
    }
    if (-not (Is-NonEmptyString $lesson.id) -or -not (Is-NonEmptyString $lesson.title) -or -not (Is-NonEmptyString $lesson.format)) {
        Add-Issue("${path}: leçon incomplète dans ${subthemeId} ($($lesson.id))")
        return
    }
    if (-not ($lesson.blocks -is [System.Collections.IList]) -or $lesson.blocks.Count -eq 0) {
        Add-Issue("${path}: blocks absents ou vides pour la leçon $($lesson.id)")
        return
    }

    foreach ($block in $lesson.blocks) {
        Validate-LessonBlock $path $subthemeId $lesson.id $block
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
                Add-Issue("${path}: thème invalide")
                continue
            }
            if (-not (Is-NonEmptyString $theme.id) -or -not (Is-SafeLessonText $theme.title) -or -not ($theme.exercises -is [System.Collections.IList]) -or $theme.exercises.Count -eq 0) {
                Add-Issue("${path}: theme incomplet ou titre non sur ($($theme.id))")
                continue
            }
            if ($themeIds.ContainsKey($theme.id)) {
                Add-Issue("${path}: id de thème dupliqué ($($theme.id))")
            } else {
                $themeIds[$theme.id] = $true
            }
            foreach ($exercise in $theme.exercises) {
                if (Is-NonEmptyString $exercise.id) {
                    if ($exerciseIds.ContainsKey($exercise.id)) {
                        Add-Issue("${path}: id d'exercice dupliqué ($($exercise.id))")
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
                Add-Issue("${path}: matière invalide")
                continue
            }
            if (-not (Is-NonEmptyString $subject.id) -or -not (Is-SafeLessonText $subject.title) -or -not ($subject.subthemes -is [System.Collections.IList]) -or $subject.subthemes.Count -eq 0) {
                Add-Issue("${path}: matiere incomplete ou titre non sur ($($subject.id))")
                continue
            }
            if ($subjectIds.ContainsKey($subject.id)) {
                Add-Issue("${path}: id de matière dupliqué ($($subject.id))")
            } else {
                $subjectIds[$subject.id] = $true
            }

            foreach ($subtheme in $subject.subthemes) {
                if (-not (Is-PlainObject $subtheme)) {
                    Add-Issue("${path}: sous-thème invalide dans $($subject.id)")
                    continue
                }
                $hasExercises = ($subtheme.exercises -is [System.Collections.IList]) -and $subtheme.exercises.Count -gt 0
                $hasLessons = ($subtheme.lessons -is [System.Collections.IList]) -and $subtheme.lessons.Count -gt 0
                if (-not (Is-NonEmptyString $subtheme.id) -or -not (Is-SafeLessonText $subtheme.title) -or (-not $hasExercises -and -not $hasLessons)) {
                    Add-Issue("${path}: sous-theme incomplet ou titre non sur ($($subtheme.id))")
                    continue
                }
                if ($subthemeIds.ContainsKey($subtheme.id)) {
                    Add-Issue("${path}: id de sous-theme duplique ($($subtheme.id))")
                } else {
                    $subthemeIds[$subtheme.id] = $true
                }
                if ($hasLessons) {
                    foreach ($lesson in $subtheme.lessons) {
                        Validate-Lesson $path $subtheme.id $lesson
                    }
                }
                if ($hasExercises) {
                    foreach ($exercise in $subtheme.exercises) {
                        if (Is-NonEmptyString $exercise.id) {
                            if ($exerciseIds.ContainsKey($exercise.id)) {
                                Add-Issue("${path}: id d'exercice duplique ($($exercise.id))")
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
                Add-Issue("${path}: catégorie de lecture vide ou invalide ($($category.Name))")
                continue
            }

            foreach ($entry in $category.Value) {
                if (-not (Is-PlainObject $entry)) {
                    Add-Issue("${path}: entrée de lecture invalide ($($category.Name))")
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
                    Add-Issue("${path}: réponse absente en lecture ($($category.Name))")
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
                    Add-Issue("${path}: réponse hors choix en lecture ($($category.Name))")
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
                Add-Issue("${path}: catégorie de grammaire vide ou invalide ($($category.Name))")
                continue
            }

            foreach ($entry in $category.Value) {
                if (-not (Is-PlainObject $entry)) {
                    Add-Issue("${path}: entrée de grammaire invalide ($($category.Name))")
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
        Add-Issue("$($ref.DataFile): categories absentes (ref. $($ref.ExerciseId))")
        return
    }
    $pool = $dataSet.categories.$($ref.Category)
    if (-not ($pool -is [System.Collections.IList]) -or $pool.Count -eq 0) {
        Add-Issue("$($ref.DataFile): categorie introuvable ($($ref.Category))")
        return
    }
    foreach ($item in $pool) {
        $choicesSafe = ($item.choices -is [System.Collections.IList]) -and $item.choices.Count -ge 2 -and (@($item.choices) | Where-Object { -not (Is-SafeLessonText $_) }).Count -eq 0
        $contextSafe = ($null -eq $item.context) -or (Is-SafeLessonText $item.context)
        $explanationSafe = ($null -eq $item.explanation) -or (Is-SafeLessonText $item.explanation)
        if (-not (Is-PlainObject $item) -or -not (Is-SafeLessonText $item.question) -or -not $choicesSafe -or -not (Is-NonEmptyString $item.answer) -or $item.answer -notin $item.choices -or -not $contextSafe -or -not $explanationSafe) {
            Add-Issue("$($ref.DataFile): question documentaire invalide ou non sure dans $($ref.Category)")
            break
        }
    }
}

function Validate-MatchingDataset($ref, $dataSet) {
    if (-not (Is-PlainObject $dataSet.categories)) {
        Add-Issue("$($ref.DataFile): categories absentes (ref. $($ref.ExerciseId))")
        return
    }
    $pool = $dataSet.categories.$($ref.Category)
    if (-not ($pool -is [System.Collections.IList]) -or $pool.Count -eq 0) {
        Add-Issue("$($ref.DataFile): categorie d'appariement introuvable ($($ref.Category))")
        return
    }
    foreach ($item in $pool) {
        $titleSafe = ($null -eq $item.title) -or (Is-SafeLessonText $item.title)
        $explanationSafe = ($null -eq $item.explanation) -or (Is-SafeLessonText $item.explanation)
        $pairsValid = ($item.pairs -is [System.Collections.IList]) -and $item.pairs.Count -ge 2
        if ($pairsValid) {
            foreach ($pair in $item.pairs) {
                if (-not ($pair -is [System.Collections.IList]) -or $pair.Count -ne 2 -or -not (Is-SafeLessonText $pair[0]) -or -not (Is-SafeLessonText $pair[1])) {
                    $pairsValid = $false
                    break
                }
            }
        }
        if (-not (Is-PlainObject $item) -or -not $titleSafe -or -not $explanationSafe -or -not $pairsValid) {
            Add-Issue("$($ref.DataFile): appariement invalide ou non sur dans $($ref.Category)")
            break
        }
    }
}

function Validate-WordOrderDataset($ref, $dataSet) {
    if (-not (Is-PlainObject $dataSet.categories)) {
        Add-Issue("$($ref.DataFile): categories absentes (ref. $($ref.ExerciseId))")
        return
    }
    $pool = $dataSet.categories.$($ref.Category)
    if (-not ($pool -is [System.Collections.IList]) -or $pool.Count -eq 0) {
        Add-Issue("$($ref.DataFile): categorie de remise en ordre introuvable ($($ref.Category))")
        return
    }
    foreach ($item in $pool) {
        $instructionSafe = ($null -eq $item.instruction) -or (Is-SafeLessonText $item.instruction)
        $explanationSafe = ($null -eq $item.explanation) -or (Is-SafeLessonText $item.explanation)
        if ($item.sentences -is [System.Collections.IList]) {
            $sentencesSafe = ($item.sentences.Count -ge 3) -and (-not ($item.sentences | Where-Object { -not (Is-SafeLessonText $_) }))
            $sentenceSafe = $sentencesSafe
        } else {
            $sentenceSafe = (Is-SafeLessonText $item.sentence) -and ($item.sentence.Trim() -split '\s+').Count -ge 3
        }
        if (-not (Is-PlainObject $item) -or -not $sentenceSafe -or -not $instructionSafe -or -not $explanationSafe) {
            Add-Issue("$($ref.DataFile): phrase de remise en ordre invalide ou non sure dans $($ref.Category)")
            break
        }
    }
}

function Validate-BoardDataset($ref, $dataSet) {
    if (-not (Is-PlainObject $dataSet.categories)) {
        Add-Issue("$($ref.DataFile): categories absentes (ref. $($ref.ExerciseId))")
        return
    }
    $pool = $dataSet.categories.$($ref.Category)
    if (-not ($pool -is [System.Collections.IList]) -or $pool.Count -eq 0) {
        Add-Issue("$($ref.DataFile): categorie interactive introuvable ($($ref.Category))")
        return
    }
    foreach ($item in $pool) {
        if ($ref.Type -eq 'map-locate') {
            $zoneIdValid = (Is-SafeLessonText $item.targetZoneId) -and ($item.targetZoneId -match '^[a-zA-Z0-9-]+$')
            $labelValid = Is-SafeLessonText $item.targetLabel
            $promptValid = ($null -eq $item.prompt) -or (Is-SafeLessonText $item.prompt)
            if (-not (Is-PlainObject $item) -or -not $zoneIdValid -or -not $labelValid -or -not $promptValid) {
                Add-Issue("$($ref.DataFile): map-locate invalide dans $($ref.Category)")
                break
            }
            continue
        }
        if ($ref.Type -eq 'memory-match') {
            $pairsValid = ($item.pairs -is [System.Collections.IList]) -and ($item.pairs.Count -ge 3)
            if ($pairsValid) {
                foreach ($pair in $item.pairs) {
                    if (-not ($pair -is [System.Collections.IList]) -or $pair.Count -ne 2 -or -not (Is-SafeLessonText $pair[0]) -or -not (Is-SafeLessonText $pair[1])) {
                        $pairsValid = $false
                        break
                    }
                }
            }
            $titleValid = ($null -eq $item.title) -or (Is-SafeLessonText $item.title)
            $explanationValid = ($null -eq $item.explanation) -or (Is-SafeLessonText $item.explanation)
            if (-not (Is-PlainObject $item) -or -not $pairsValid -or -not $titleValid -or -not $explanationValid) {
                Add-Issue("$($ref.DataFile): memory-match invalide dans $($ref.Category)")
                break
            }
            continue
        }
        if (-not (Is-PlainObject $item) -or -not (Is-SafeLessonText $item.prompt) -or -not (Is-PlainObject $item.board)) {
            Add-Issue("$($ref.DataFile): entree interactive invalide dans $($ref.Category)")
            break
        }
    }
}

function Validate-TimelineDataset($ref, $dataSet) {
    if (-not (Is-PlainObject $dataSet.grades)) {
        Add-Issue("$($ref.DataFile): grades absents (réf. $($ref.ExerciseId))")
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
            Add-Issue("$($ref.DataFile): event dupliqué ($($event.id)) pour $gradeId")
        } else {
            $eventIds[$event.id] = $event
        }
        if ($periodIds.Count -gt 0 -and -not $periodIds.ContainsKey($event.period)) {
            Add-Issue("$($ref.DataFile): période inconnue pour event $($event.id)")
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
        Add-Issue("$($ref.DataFile): mode incohérent pour timeline $($ref.TimelineId)")
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
    } elseif ($ref.Engine -eq 'matching') {
        Validate-MatchingDataset $ref $dataSet
    } elseif ($ref.Engine -eq 'word-order') {
        Validate-WordOrderDataset $ref $dataSet
    } elseif ($ref.Engine -eq 'board-interactive') {
        Validate-BoardDataset $ref $dataSet
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

[CmdletBinding()]
param(
    [string]$Path = "data/cm1.json"
)

$ErrorActionPreference = "Stop"

function T([int[]]$codes) {
    $sb = New-Object System.Text.StringBuilder
    foreach ($code in $codes) {
        [void]$sb.Append([char]::ConvertFromUtf32($code))
    }
    return $sb.ToString()
}

function Get-Node([object]$root, [string]$id) {
    foreach ($subject in $root.subjects) {
        if ($subject.id -eq $id) { return $subject }
        foreach ($sub in $subject.subthemes) {
            if ($sub.id -eq $id) { return $sub }
        }
    }
    throw "Node not found: $id"
}

function Add-Lesson([object]$subtheme, [object]$lesson) {
    if (-not $subtheme.lessons) {
        $subtheme | Add-Member -NotePropertyName lessons -NotePropertyValue @()
    }
    $existing = @($subtheme.lessons)
    if (-not ($existing | Where-Object { $_.id -eq $lesson.id })) {
        $subtheme.lessons = @($existing + $lesson)
    }
}

$raw = Get-Content $Path -Raw -Encoding utf8

$replacements = @(
    @((T 195,169), (T 233)),
    @((T 195,168), (T 232)),
    @((T 195,170), (T 234)),
    @((T 195,171), (T 235)),
    @((T 195,160), (T 224)),
    @((T 195,162), (T 226)),
    @((T 195,174), (T 238)),
    @((T 195,175), (T 239)),
    @((T 195,180), (T 244)),
    @((T 195,187), (T 251)),
    @((T 195,167), (T 231)),
    @((T 195,137), (T 201)),
    @((T 195,128), (T 192)),
    @((T 195,138), (T 202)),
    @((T 195,136), (T 200)),
    @((T 195,130), (T 194)),
    @((T 195,141), (T 205)),
    @((T 195,147), (T 211)),
    @((T 195,156), (T 220)),
    @((T 195,159), (T 223)),
    @((T 195,163), (T 195)),
    @((T 240,376,8221,162), (T 128290)),
    @((T 240,376,8221,144), (T 128208)),
    @((T 240,376,8221,150), (T 128214)),
    @((T 240,376,143,8216,239,184,143), (T 127963,65039)),
    @((T 240,376,8212,186,239,184,143), (T 128506,65039)),
    @((T 240,376,8221,172), (T 128300)),
    @((T 240,376,162,182,162), (T 129309)),
    @((T 226,154,150,239,184,143), (T 9878,65039)),
    @((T 240,376,8215,8216,8217), (T 128338))
)

foreach ($pair in $replacements) {
    $raw = $raw.Replace($pair[0], $pair[1])
}

$data = $raw | ConvertFrom-Json

function Set-Title([string]$id, [string]$title) {
    (Get-Node $data $id).title = $title
}

function Set-Icon([string]$id, [string]$icon) {
    (Get-Node $data $id).icon = $icon
}

Set-Title "cm1-maths-subject" "Mathématiques"
Set-Icon "cm1-maths-subject" (T 128290)
Set-Title "cm1-francais-subject" "Français"
Set-Icon "cm1-francais-subject" (T 128214)
Set-Title "cm1-histoire-subject" "Histoire"
Set-Icon "cm1-histoire-subject" ((T 127963) + (T 65039))
Set-Title "cm1-geographie-subject" "Géographie"
Set-Icon "cm1-geographie-subject" ((T 128506) + (T 65039))
Set-Title "cm1-sciences-subject" "Sciences"
Set-Icon "cm1-sciences-subject" (T 128300)
Set-Title "cm1-emc-subject" "EMC"
Set-Icon "cm1-emc-subject" ((T 9878) + (T 65039))

Set-Title "cm1-nombres-calculs" "Nombres & Calculs"
Set-Icon "cm1-nombres-calculs" (T 128208)
Set-Title "cm1-grandeurs-mesures" "Grandeurs & Mesures"
Set-Icon "cm1-grandeurs-mesures" (T 128207)
Set-Title "cm1-francais-homophones" "Homophones"
Set-Title "cm1-francais-conjugaison" "Conjugaison"
Set-Title "cm1-francais-articles" "Articles et genre"
Set-Title "cm1-francais-grammaire" "Grammaire"
Set-Title "cm1-histoire-periodes" "Grandes périodes"
Set-Title "cm1-histoire-frises" "Frises historiques"
Set-Title "cm1-geo-relief-subtheme" "Reliefs et fleuves"
Set-Title "cm1-geo-territoires-subtheme" "Territoires"
Set-Title "cm1-geo-deplacements-subtheme" "Se déplacer"
Set-Title "cm1-sciences-vivant-subtheme" "Le vivant"
Set-Title "cm1-sciences-matiere-subtheme" "Matière et énergie"
Set-Title "cm1-sciences-corps-subtheme" "Corps et hygiène"
Set-Title "cm1-emc-vivre-ensemble-subtheme" "Vivre ensemble"
Set-Title "cm1-emc-droits-devoirs-subtheme" "Droits et devoirs"
Set-Title "cm1-emc-citoyennete-subtheme" "Citoyenneté"

Add-Lesson (Get-Node $data "cm1-nombres-calculs") ([pscustomobject]@{
    id = "cm1-lesson-problemes-calcul"
    title = "Résoudre un problème"
    subtitle = "Lire, chercher, vérifier"
    format = "lesson-card"
    blocks = @(
        [pscustomobject]@{ type = "paragraph"; text = "Un problème raconte une situation. Je lis les données, je cherche ce qu'il faut calculer puis je vérifie ma réponse." },
        [pscustomobject]@{ type = "example"; label = "Exemple"; content = "Lina a 24 billes. Elle en donne 7. Combien lui en reste-t-il ?" },
        [pscustomobject]@{ type = "bullets"; label = "Je fais attention à"; items = @("repérer les nombres utiles", "choisir l'opération", "vérifier si la réponse est logique", "écrire la phrase réponse") },
        [pscustomobject]@{ type = "tip"; label = "À retenir"; content = "Je commence toujours par comprendre la question avant de calculer." }
    )
})

Add-Lesson (Get-Node $data "cm1-grandeurs-mesures") ([pscustomobject]@{
    id = "cm1-lesson-formes-geometriques"
    title = "Repérer des formes géométriques"
    subtitle = "Carré, rectangle, triangle, cercle"
    format = "lesson-card"
    blocks = @(
        [pscustomobject]@{ type = "paragraph"; text = "En géométrie, je reconnais les formes en regardant leurs côtés, leurs sommets et leurs contours." },
        [pscustomobject]@{ type = "example"; label = "Exemple"; content = "Un carré a 4 côtés égaux. Un triangle a 3 côtés. Un cercle n'a ni côté ni sommet." },
        [pscustomobject]@{ type = "bullets"; label = "Je repère"; items = @("les côtés", "les sommets", "les angles", "la forme générale") },
        [pscustomobject]@{ type = "tip"; label = "À retenir"; content = "Une forme se décrit avec des mots précis, pas seulement avec son nom." }
    )
})

Add-Lesson (Get-Node $data "cm1-francais-grammaire") ([pscustomobject]@{
    id = "cm1-lesson-familles-mots"
    title = "Les familles de mots"
    subtitle = "Même idée, mots proches"
    format = "lesson-card"
    blocks = @(
        [pscustomobject]@{ type = "paragraph"; text = "Des mots de la même famille ont un lien de sens et partagent souvent une partie commune." },
        [pscustomobject]@{ type = "example"; label = "Exemple"; content = "terre, terrain, terrestre, atterrir" },
        [pscustomobject]@{ type = "bullets"; label = "Je cherche"; items = @("le mot de base", "les mots proches", "le sens commun", "la partie commune du mot") },
        [pscustomobject]@{ type = "tip"; label = "À retenir"; content = "Chercher une famille de mots aide à mieux comprendre et mieux écrire." }
    )
})

Add-Lesson (Get-Node $data "cm1-francais-homophones") ([pscustomobject]@{
    id = "cm1-lesson-homophones-a-a"
    title = "A ou à ?"
    subtitle = "Un verbe ou une préposition"
    format = "lesson-card"
    blocks = @(
        [pscustomobject]@{ type = "paragraph"; text = "A sans accent est souvent un verbe. À avec accent sert souvent à indiquer un lieu, un moment ou une relation." },
        [pscustomobject]@{ type = "example"; label = "Exemple"; content = "Il a un livre. / Il va à l'école." },
        [pscustomobject]@{ type = "bullets"; label = "Je vérifie"; items = @("je peux remplacer a par avait", "à reste souvent devant un lieu ou un verbe à l'infinitif", "je relis la phrase entière") },
        [pscustomobject]@{ type = "tip"; label = "À retenir"; content = "Le sens de la phrase m'aide à choisir entre a et à." }
    )
})

Add-Lesson (Get-Node $data "cm1-histoire-periodes") ([pscustomobject]@{
    id = "cm1-lesson-vie-moyen-age"
    title = "La vie au Moyen Âge"
    subtitle = "Châteaux, campagnes et métiers"
    format = "lesson-card"
    blocks = @(
        [pscustomobject]@{ type = "paragraph"; text = "Au Moyen Âge, la vie est organisée autour du château, des campagnes et du travail des habitants." },
        [pscustomobject]@{ type = "example"; label = "Exemple"; content = "Un seigneur protège son territoire depuis un château fort, tandis que beaucoup d'habitants vivent et travaillent dans les campagnes." },
        [pscustomobject]@{ type = "bullets"; label = "Mots à connaître"; items = @("seigneur", "paysan", "château fort", "protection", "campagne") },
        [pscustomobject]@{ type = "tip"; label = "À retenir"; content = "Comprendre une période, c'est aussi connaître la vie des personnes qui y vivaient." }
    )
})

$json = $data | ConvertTo-Json -Depth 100
Set-Content -Path $Path -Value $json -Encoding utf8

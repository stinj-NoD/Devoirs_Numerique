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
    $sb.ToString()
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

Set-Title "cm1-maths-subject" ("Math" + (T 233) + "matiques")
Set-Icon "cm1-maths-subject" (T 128290)
Set-Title "cm1-francais-subject" ("Fran" + (T 231) + "ais")
Set-Icon "cm1-francais-subject" (T 128214)
Set-Title "cm1-histoire-subject" "Histoire"
Set-Icon "cm1-histoire-subject" ((T 127963) + (T 65039))
Set-Title "cm1-geographie-subject" ("G" + (T 233) + "ographie")
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
Set-Title "cm1-histoire-periodes" "Grandes p" + (T 233) + "riodes"
Set-Title "cm1-histoire-frises" "Frises historiques"
Set-Title "cm1-geo-relief-subtheme" "Reliefs et fleuves"
Set-Title "cm1-geo-territoires-subtheme" "Territoires"
Set-Title "cm1-geo-deplacements-subtheme" "Se d" + (T 233) + "placer"
Set-Title "cm1-sciences-vivant-subtheme" "Le vivant"
Set-Title "cm1-sciences-matiere-subtheme" ("Mati" + (T 232) + "re et " + (T 233) + "nergie")
Set-Title "cm1-sciences-corps-subtheme" ("Corps et hygi" + (T 232) + "ne")
Set-Title "cm1-emc-vivre-ensemble-subtheme" "Vivre ensemble"
Set-Title "cm1-emc-droits-devoirs-subtheme" "Droits et devoirs"
Set-Title "cm1-emc-citoyennete-subtheme" ("Citoyennet" + (T 233))

Add-Lesson (Get-Node $data "cm1-nombres-calculs") ([pscustomobject]@{
    id = "cm1-lesson-problemes-calcul"
    title = "R" + (T 233) + "soudre un probl" + (T 232) + "me"
    subtitle = "Lire, chercher, v" + (T 233) + "rifier"
    format = "lesson-card"
    blocks = @(
        [pscustomobject]@{ type = "paragraph"; text = "Un probl" + (T 232) + "me raconte une situation. Je lis les donn" + (T 233) + "es, je cherche ce qu'il faut calculer puis je v" + (T 233) + "rifie ma r" + (T 233) + "ponse." },
        [pscustomobject]@{ type = "example"; label = "Exemple"; content = "Lina a 24 billes. Elle en donne 7. Combien lui en reste-t-il ?" },
        [pscustomobject]@{ type = "bullets"; label = "Je fais attention " + (T 224) + ""; items = @("rep" + (T 233) + "rer les nombres utiles", "choisir l'op" + (T 233) + "ration", "v" + (T 233) + "rifier si la r" + (T 233) + "ponse est logique", "" + (T 201) + "crire la phrase r" + (T 233) + "ponse") },
        [pscustomobject]@{ type = "tip"; label = (T 192) + " retenir"; content = "Je commence toujours par comprendre la question avant de calculer." }
    )
})

Add-Lesson (Get-Node $data "cm1-grandeurs-mesures") ([pscustomobject]@{
    id = "cm1-lesson-formes-geometriques"
    title = "Rep" + (T 233) + "rer des formes g" + (T 233) + "om" + (T 233) + "triques"
    subtitle = "Carr" + (T 233) + ", rectangle, triangle, cercle"
    format = "lesson-card"
    blocks = @(
        [pscustomobject]@{ type = "paragraph"; text = "En g" + (T 233) + "om" + (T 233) + "trie, je reconnais les formes en regardant leurs c" + (T 244) + "t" + (T 233) + "s, leurs sommets et leurs contours." },
        [pscustomobject]@{ type = "example"; label = "Exemple"; content = "Un carr" + (T 233) + " a 4 c" + (T 244) + "t" + (T 233) + "s " + (T 233) + "gaux. Un triangle a 3 c" + (T 244) + "t" + (T 233) + "s. Un cercle n'a ni c" + (T 244) + "t" + (T 233) + " ni sommet." },
        [pscustomobject]@{ type = "bullets"; label = "Je rep" + (T 232) + "re"; items = @("les c" + (T 244) + "t" + (T 233) + "s", "les sommets", "les angles", "la forme g" + (T 233) + "n" + (T 233) + "rale") },
        [pscustomobject]@{ type = "tip"; label = (T 192) + " retenir"; content = "Une forme se d" + (T 233) + "crit avec des mots pr" + (T 233) + "cis, pas seulement avec son nom." }
    )
})

Add-Lesson (Get-Node $data "cm1-francais-grammaire") ([pscustomobject]@{
    id = "cm1-lesson-familles-mots"
    title = "Les familles de mots"
    subtitle = "M" + (T 234) + "me id" + (T 233) + "e, mots proches"
    format = "lesson-card"
    blocks = @(
        [pscustomobject]@{ type = "paragraph"; text = "Des mots de la m" + (T 234) + "me famille ont un lien de sens et partagent souvent une partie commune." },
        [pscustomobject]@{ type = "example"; label = "Exemple"; content = "terre, terrain, terrestre, atterrir" },
        [pscustomobject]@{ type = "bullets"; label = "Je cherche"; items = @("le mot de base", "les mots proches", "le sens commun", "la partie commune du mot") },
        [pscustomobject]@{ type = "tip"; label = (T 192) + " retenir"; content = "Chercher une famille de mots aide à mieux comprendre et mieux " + (T 233) + "crire." }
    )
})

Add-Lesson (Get-Node $data "cm1-francais-homophones") ([pscustomobject]@{
    id = "cm1-lesson-homophones-a-a"
    title = "A ou " + (T 192) + " ?"
    subtitle = "Un verbe ou une pr" + (T 233) + "position"
    format = "lesson-card"
    blocks = @(
        [pscustomobject]@{ type = "paragraph"; text = "A sans accent est souvent un verbe. " + (T 192) + " avec accent sert souvent " + (T 224) + " indiquer un lieu, un moment ou une relation." },
        [pscustomobject]@{ type = "example"; label = "Exemple"; content = "Il a un livre. / Il va " + (T 192) + " l'" + (T 233) + "cole." },
        [pscustomobject]@{ type = "bullets"; label = "Je v" + (T 233) + "rifie"; items = @("je peux remplacer a par avait", (T 192) + " reste souvent devant un lieu ou un verbe " + (T 224) + " l'infinitif", "je relis la phrase enti" + (T 232) + "re") },
        [pscustomobject]@{ type = "tip"; label = (T 192) + " retenir"; content = "Le sens de la phrase m'aide " + (T 224) + " choisir entre a et " + (T 192) + "." }
    )
})

Add-Lesson (Get-Node $data "cm1-histoire-periodes") ([pscustomobject]@{
    id = "cm1-lesson-vie-moyen-age"
    title = "La vie au Moyen " + (T 192) + "ge"
    subtitle = "Ch" + (T 226) + "teaux, campagnes et m" + (T 233) + "tiers"
    format = "lesson-card"
    blocks = @(
        [pscustomobject]@{ type = "paragraph"; text = "Au Moyen " + (T 192) + "ge, la vie est organis" + (T 233) + "e autour du ch" + (T 226) + "teau, des campagnes et du travail des habitants." },
        [pscustomobject]@{ type = "example"; label = "Exemple"; content = "Un seigneur prot" + (T 232) + "ge son territoire depuis un ch" + (T 226) + "teau fort, tandis que beaucoup d'habitants vivent et travaillent dans les campagnes." },
        [pscustomobject]@{ type = "bullets"; label = "Mots " + (T 224) + " conna" + (T 238) + "tre"; items = @("seigneur", "paysan", "ch" + (T 226) + "teau fort", "protection", "campagne") },
        [pscustomobject]@{ type = "tip"; label = (T 192) + " retenir"; content = "Comprendre une p" + (T 233) + "riode, c'est aussi conna" + (T 238) + "tre la vie des personnes qui y vivaient." }
    )
})

Add-Lesson (Get-Node $data "cm1-geo-territoires-subtheme") ([pscustomobject]@{
    id = "cm1-lesson-carte-legende"
    title = "Lire une carte de France"
    subtitle = "L" + (T 233) + "gende, rep" + (T 232) + "res et couleurs"
    format = "lesson-card"
    blocks = @(
        [pscustomobject]@{ type = "paragraph"; text = "Une carte repr" + (T 233) + "sente un espace vu de haut. La l" + (T 233) + "gende aide " + (T 224) + " comprendre ce que montrent les couleurs et les symboles." },
        [pscustomobject]@{ type = "example"; label = "Exemple"; content = "Sur une carte, le bleu peut montrer les fleuves, le vert les plaines et des symboles peuvent montrer les villes." },
        [pscustomobject]@{ type = "bullets"; label = "Je regarde"; items = @("le titre", "la l" + (T 233) + "gende", "les couleurs", "les symboles") },
        [pscustomobject]@{ type = "tip"; label = (T 192) + " retenir"; content = "Lire une carte, c'est comprendre des rep" + (T 232) + "res et un vocabulaire pr" + (T 233) + "cis." }
    )
})

Add-Lesson (Get-Node $data "cm1-sciences-vivant-subtheme") ([pscustomobject]@{
    id = "cm1-lesson-vivant-non-vivant"
    title = "Vivant ou non-vivant ?"
    subtitle = "Comparer et classer"
    format = "lesson-card"
    blocks = @(
        [pscustomobject]@{ type = "paragraph"; text = "Un " + (T 234) + "tre vivant na" + (T 238) + "t, grandit, se nourrit, se reproduit et meurt." },
        [pscustomobject]@{ type = "example"; label = "Exemple"; content = "Un arbre et un chat sont vivants, mais une pierre ne l'est pas." },
        [pscustomobject]@{ type = "bullets"; label = "Je compare"; items = @("les besoins", "le milieu de vie", "les caract" + (T 232) + "res communs", "les ressemblances et diff" + (T 233) + "rences") },
        [pscustomobject]@{ type = "tip"; label = (T 192) + " retenir"; content = "Pour classer le vivant, je regarde les caract" + (T 232) + "res communs, le milieu de vie et les besoins." }
    )
})

Add-Lesson (Get-Node $data "cm1-sciences-corps-subtheme") ([pscustomobject]@{
    id = "cm1-lesson-cinq-sens"
    title = "Les cinq sens"
    subtitle = "Voir, entendre, toucher, goûter, sentir"
    format = "lesson-card"
    blocks = @(
        [pscustomobject]@{ type = "paragraph"; text = "Les cinq sens nous aident " + (T 224) + " comprendre le monde autour de nous." },
        [pscustomobject]@{ type = "example"; label = "Exemple"; content = "Je vois avec les yeux, j'entends avec les oreilles, je touche avec la peau, je goûte avec la langue et je sens avec le nez." },
        [pscustomobject]@{ type = "bullets"; label = "Sens et organes"; items = @("la vue : les yeux", "l'ou" + (T 239) + "e : les oreilles", "le toucher : la peau", "le go" + (T 251) + "t : la langue", "l'odorat : le nez") },
        [pscustomobject]@{ type = "tip"; label = (T 192) + " retenir"; content = "Chaque sens a un r" + (T 244) + "le pr" + (T 233) + "cis pour nous aider " + (T 224) + " vivre." }
    )
})

Add-Lesson (Get-Node $data "cm1-emc-citoyennete-subtheme") ([pscustomobject]@{
    id = "cm1-lesson-symboles-republique"
    title = "Les symboles de la République"
    subtitle = "Drapeau, devise, Marseillaise"
    format = "lesson-card"
    blocks = @(
        [pscustomobject]@{ type = "paragraph"; text = "La République a des symboles communs qui rassemblent les citoyens." },
        [pscustomobject]@{ type = "example"; label = "Exemple"; content = "Le drapeau tricolore, la devise et l'hymne national sont des symboles de la République." },
        [pscustomobject]@{ type = "bullets"; label = "Je reconnais"; items = @("le drapeau", "la devise", "l'hymne", "les lieux officiels") },
        [pscustomobject]@{ type = "tip"; label = (T 192) + " retenir"; content = "Les symboles rappellent l'histoire et les valeurs communes." }
    )
})

Add-Lesson (Get-Node $data "cm1-emc-droits-devoirs-subtheme") ([pscustomobject]@{
    id = "cm1-lesson-laicite-ecole"
    title = "La la" + (T 239) + "cit" + (T 233) + " " + (T 224) + " l'" + (T 233) + "cole"
    subtitle = "Respecter chacun et la r" + (T 232) + "gle commune"
    format = "lesson-card"
    blocks = @(
        [pscustomobject]@{ type = "paragraph"; text = "La la" + (T 239) + "cit" + (T 233) + " permet " + (T 224) + " chacun d'avoir ses opinions ou ses croyances tout en respectant la r" + (T 232) + "gle commune." },
        [pscustomobject]@{ type = "example"; label = "Exemple"; content = "À l'école, on respecte toutes les personnes et on garde un cadre commun pour travailler ensemble." },
        [pscustomobject]@{ type = "bullets"; label = "Je fais attention"; items = @("au respect", "aux paroles de chacun", "à la règle commune", "au climat de confiance") },
        [pscustomobject]@{ type = "tip"; label = (T 192) + " retenir"; content = "La la" + (T 239) + "cit" + (T 233) + " prot" + (T 232) + "ge la libert" + (T 233) + " de chacun et la paix dans le groupe." }
    )
})

$json = $data | ConvertTo-Json -Depth 100
Set-Content -Path $Path -Value $json -Encoding utf8

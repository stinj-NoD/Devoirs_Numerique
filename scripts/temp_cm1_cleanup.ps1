[CmdletBinding()]
param(
    [string]$Path = "data/cm1.json"
)

$ErrorActionPreference = "Stop"

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
    @("MathÃ©matiques","Mathématiques"),
    @("FranÃ§ais","Français"),
    @("GÃ©ographie","Géographie"),
    @("DÃ©cimaux","Décimaux"),
    @("DixiÃ¨mes","Dixièmes"),
    @("CentiÃ¨mes","centièmes"),
    @("TrÃ©s","Très"),
    @("trÃ¨s","très"),
    @("La MoitiÃ©","La moitié"),
    @("Divisions Simples","Divisions simples"),
    @("Tables inversÃ©es","Tables inversées"),
    @("inversÃ©es","inversées"),
    @("piÃ¨ges","pièges"),
    @("prÃ©cises","précises"),
    @("prÃ©cision","précision"),
    @("prÃ©cise","précise"),
    @("numÃ©rateur","numérateur"),
    @("dÃ©nominateur","dénominateur"),
    @("unitÃ©s","unités"),
    @("partie entiÃ¨re","partie entière"),
    @("AprÃ¨s","Après"),
    @("aprÃ¨s","après"),
    @("Avant la virgule, je lis les unitÃ©s, dizaines, centaines.","Avant la virgule, je lis les unités, dizaines, centaines."),
    @("La matiÃ¨re","La matière"),
    @("matiÃ¨re","matière"),
    @("Ã©nergie","énergie"),
    @("Ã‰nergie","Énergie"),
    @("Ã‡","Ç"),
    @("Ã€","À"),
    @("Ã‰","É"),
    @("ÃŠ","Ê"),
    @("Ãˆ","È"),
    @("Ã‚","Â"),
    @("Ã™","Ù"),
    @("ÃŽ","Î"),
    @("Ã’","Ô"),
    @("Ãœ","Ü"),
    @("ÃŸ","ß"),
    @("Ãƒ","Ã"),
    @("ðŸ”¢","🔢"),
    @("ðŸ“","📐"),
    @("ðŸ“–","📚"),
    @("ðŸ›ï¸","🏛️"),
    @("ðŸ—ºï¸","🗺️"),
    @("ðŸ”¬","🔬"),
    @("ðŸ¤","🤝"),
    @("âš–ï¸","⚖️"),
    @("ðŸ•’","🕒")
)

foreach ($pair in $replacements) {
    $raw = $raw.Replace($pair[0], $pair[1])
}

$data = $raw | ConvertFrom-Json

(Get-Node $data "cm1-maths-subject").title = "Mathématiques"
(Get-Node $data "cm1-maths-subject").icon = "🔢"
(Get-Node $data "cm1-francais-subject").title = "Français"
(Get-Node $data "cm1-francais-subject").icon = "📚"
(Get-Node $data "cm1-histoire-subject").title = "Histoire"
(Get-Node $data "cm1-histoire-subject").icon = "🏛️"
(Get-Node $data "cm1-geographie-subject").title = "Géographie"
(Get-Node $data "cm1-geographie-subject").icon = "🗺️"
(Get-Node $data "cm1-sciences-subject").title = "Sciences"
(Get-Node $data "cm1-sciences-subject").icon = "🔬"
(Get-Node $data "cm1-emc-subject").title = "EMC"
(Get-Node $data "cm1-emc-subject").icon = "⚖️"

(Get-Node $data "cm1-nombres-calculs").title = "Nombres & Calculs"
(Get-Node $data "cm1-nombres-calculs").icon = "📐"
(Get-Node $data "cm1-grandeurs-mesures").title = "Grandeurs & Mesures"
(Get-Node $data "cm1-grandeurs-mesures").icon = "📏"
(Get-Node $data "cm1-francais-homophones").title = "Homophones"
(Get-Node $data "cm1-francais-conjugaison").title = "Conjugaison"
(Get-Node $data "cm1-francais-articles").title = "Articles et genre"
(Get-Node $data "cm1-francais-grammaire").title = "Grammaire"
(Get-Node $data "cm1-histoire-periodes").title = "Grandes périodes"
(Get-Node $data "cm1-histoire-frises").title = "Frises historiques"
(Get-Node $data "cm1-geo-relief-subtheme").title = "Reliefs et fleuves"
(Get-Node $data "cm1-geo-territoires-subtheme").title = "Territoires"
(Get-Node $data "cm1-geo-deplacements-subtheme").title = "Se déplacer"
(Get-Node $data "cm1-sciences-vivant-subtheme").title = "Le vivant"
(Get-Node $data "cm1-sciences-matiere-subtheme").title = "Matière et énergie"
(Get-Node $data "cm1-sciences-corps-subtheme").title = "Corps et hygiène"
(Get-Node $data "cm1-emc-vivre-ensemble-subtheme").title = "Vivre ensemble"
(Get-Node $data "cm1-emc-droits-devoirs-subtheme").title = "Droits et devoirs"
(Get-Node $data "cm1-emc-citoyennete-subtheme").title = "Citoyenneté"

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

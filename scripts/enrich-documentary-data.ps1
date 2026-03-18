$ErrorActionPreference = "Stop"

function Load-Json($path) {
    Get-Content $path -Raw | ConvertFrom-Json
}

function Save-Json($path, $obj) {
    $json = $obj | ConvertTo-Json -Depth 100
    [System.IO.File]::WriteAllText((Resolve-Path $path), $json, [System.Text.UTF8Encoding]::new($false))
}

function Append-CategoryItems($obj, $categoryName, $items) {
    $existing = @($obj.categories.$categoryName)
    $obj.categories.PSObject.Properties[$categoryName].Value = @($existing + $items)
}

function Set-CategoryItems($obj, $categoryName, $items) {
    if ($obj.categories.PSObject.Properties.Name -contains $categoryName) {
        $obj.categories.PSObject.Properties[$categoryName].Value = @($items)
    } else {
        $obj.categories | Add-Member -NotePropertyName $categoryName -NotePropertyValue @($items)
    }
}

function Append-Exercises($grade, $themeId, $items) {
    $theme = $grade.themes | Where-Object id -eq $themeId
    $theme.PSObject.Properties["exercises"].Value = @($theme.exercises + $items)
}

function Enrich-Category($path, $categoryName, $items) {
    $json = Load-Json $path
    Append-CategoryItems $json $categoryName $items
    Save-Json $path $json
}

$historyCp = Load-Json "data/history_cp.json"
Append-CategoryItems $historyCp "cp-avant-apres" @([pscustomobject]@{ question = "Sur une frise du temps, ce qui vient avant est place..."; choices = @("a gauche", "a droite", "au milieu toujours"); answer = "a gauche" })
Append-CategoryItems $historyCp "cp-vie-autrefois" @([pscustomobject]@{ question = "Un moulin ancien fait penser..."; choices = @("au passe", "a demain", "a l'espace"); answer = "au passe" })
Set-CategoryItems $historyCp "cp-personnages-traces" @(
    [pscustomobject]@{ question = "Un monument ancien est une trace..."; choices = @("du passe", "de la cantine", "de la meteo"); answer = "du passe" },
    [pscustomobject]@{ question = "Une statue tres ancienne peut raconter..."; choices = @("l'histoire", "une recette", "un match"); answer = "l'histoire" },
    [pscustomobject]@{ question = "Dans un musee, on peut voir..."; choices = @("des objets anciens", "des devoirs de maths seulement", "des fusees toujours"); answer = "des objets anciens" },
    [pscustomobject]@{ question = "Une vieille piece de monnaie est..."; choices = @("un objet du passe", "un objet du futur", "un animal"); answer = "un objet du passe" },
    [pscustomobject]@{ question = "Un chateau ancien nous aide a connaitre..."; choices = @("la vie d'autrefois", "la table de 9", "les saisons de demain"); answer = "la vie d'autrefois" },
    [pscustomobject]@{ question = "Une trace du passe peut etre..."; choices = @("un vieux batiment", "un nuage", "un bruit"); answer = "un vieux batiment" }
)
Save-Json "data/history_cp.json" $historyCp

$geoCp = Load-Json "data/geography_cp.json"
Append-CategoryItems $geoCp "cp-se-reperer" @([pscustomobject]@{ question = "Pour retrouver la bibliotheque de l'ecole, un plan peut aider a..."; choices = @("se reperer", "chanter", "mesurer le temps"); answer = "se reperer" })
Append-CategoryItems $geoCp "cp-paysages" @([pscustomobject]@{ question = "Un lac contient surtout..."; choices = @("de l'eau", "du bitume", "des escaliers"); answer = "de l'eau" })
Set-CategoryItems $geoCp "cp-transports-lieux" @(
    [pscustomobject]@{ question = "Le bus sert a..."; choices = @("se deplacer", "arroser les plantes", "cuisiner"); answer = "se deplacer" },
    [pscustomobject]@{ question = "Le train roule surtout..."; choices = @("sur des rails", "dans la mer", "dans le ciel"); answer = "sur des rails" },
    [pscustomobject]@{ question = "Le trottoir est fait pour..."; choices = @("marcher", "nager", "dormir"); answer = "marcher" },
    [pscustomobject]@{ question = "Un pont permet souvent de passer..."; choices = @("au-dessus de l'eau", "sous la classe", "dans les nuages"); answer = "au-dessus de l'eau" },
    [pscustomobject]@{ question = "La gare est un lieu ou l'on prend souvent..."; choices = @("le train", "un bateau de peche", "un ascenseur"); answer = "le train" },
    [pscustomobject]@{ question = "Pour traverser la rue, on utilise..."; choices = @("un passage pieton", "une barque", "une echelle"); answer = "un passage pieton" }
)
Save-Json "data/geography_cp.json" $geoCp

$scienceCp = Load-Json "data/science_cp.json"
Append-CategoryItems $scienceCp "cp-vivant" @([pscustomobject]@{ question = "Un poisson vit surtout..."; choices = @("dans l'eau", "dans un cartable", "dans le sable chaud"); answer = "dans l'eau" })
Append-CategoryItems $scienceCp "cp-matiere" @([pscustomobject]@{ question = "La pluie, c'est..."; choices = @("de l'eau", "du fer", "du bois"); answer = "de l'eau" })
Set-CategoryItems $scienceCp "cp-corps-sens" @(
    [pscustomobject]@{ question = "Les yeux servent a..."; choices = @("voir", "ecouter", "sentir"); answer = "voir" },
    [pscustomobject]@{ question = "Le nez sert a..."; choices = @("sentir", "sauter", "ecrire"); answer = "sentir" },
    [pscustomobject]@{ question = "La langue aide a..."; choices = @("gouter", "courir", "compter"); answer = "gouter" },
    [pscustomobject]@{ question = "Les mains servent souvent a..."; choices = @("toucher", "respirer", "entendre"); answer = "toucher" },
    [pscustomobject]@{ question = "Pour etre en forme, il faut aussi..."; choices = @("dormir", "jamais se laver", "oublier de boire"); answer = "dormir" },
    [pscustomobject]@{ question = "Se laver les mains aide a..."; choices = @("rester propre", "faire pousser les arbres", "fabriquer une table"); answer = "rester propre" }
)
Save-Json "data/science_cp.json" $scienceCp

$emcCp = Load-Json "data/emc_cp.json"
Append-CategoryItems $emcCp "cp-vivre-ensemble" @([pscustomobject]@{ question = "Quand je gagne un jeu, je peux..."; choices = @("rester gentil", "me moquer", "casser le jeu"); answer = "rester gentil" })
Append-CategoryItems $emcCp "cp-securite" @([pscustomobject]@{ question = "Dans un couloir, je marche pour..."; choices = @("eviter les accidents", "aller plus vite en poussant", "faire du bruit"); answer = "eviter les accidents" })
Set-CategoryItems $emcCp "cp-entraide" @(
    [pscustomobject]@{ question = "Si un camarade tombe, je peux..."; choices = @("l'aider ou prevenir un adulte", "rire", "partir en courant"); answer = "l'aider ou prevenir un adulte" },
    [pscustomobject]@{ question = "Preter un crayon a un camarade, c'est..."; choices = @("rendre service", "tricher", "interdit"); answer = "rendre service" },
    [pscustomobject]@{ question = "Dire bonjour, c'est..."; choices = @("poli", "mechant", "dangereux"); answer = "poli" },
    [pscustomobject]@{ question = "On peut aider la classe en..."; choices = @("rangeant", "salissant expres", "cassant les affaires"); answer = "rangeant" },
    [pscustomobject]@{ question = "Encourager un camarade, c'est..."; choices = @("gentil", "moqueur", "inutile toujours"); answer = "gentil" },
    [pscustomobject]@{ question = "Faire la paix apres une dispute, c'est..."; choices = @("important", "impossible", "interdit"); answer = "important" }
)
Save-Json "data/emc_cp.json" $emcCp

$historyCe1 = Load-Json "data/history_ce1.json"
Append-CategoryItems $historyCe1 "ce1-temps" @([pscustomobject]@{ question = "Une date aide a savoir..."; choices = @("quand un evenement s'est passe", "combien mesure une table", "combien de syllabes a un mot"); answer = "quand un evenement s'est passe" })
Append-CategoryItems $historyCe1 "ce1-vie-autrefois" @([pscustomobject]@{ question = "Dans une maison d'autrefois, on trouvait souvent..."; choices = @("moins d'ecrans", "plus de tablettes", "des robots partout"); answer = "moins d'ecrans" })
Set-CategoryItems $historyCe1 "ce1-monuments-personnages" @(
    [pscustomobject]@{ question = "Un monument ancien nous aide a connaitre..."; choices = @("le passe", "les tables de division", "la meteo"); answer = "le passe" },
    [pscustomobject]@{ question = "Une statue d'un roi ou d'une reine est..."; choices = @("une trace historique", "une regle de sport", "une operation"); answer = "une trace historique" },
    [pscustomobject]@{ question = "Le musee garde souvent..."; choices = @("des objets anciens", "des nuages", "des fusees de papier seulement"); answer = "des objets anciens" },
    [pscustomobject]@{ question = "Un vieux chateau raconte..."; choices = @("la vie d'autrefois", "la conjugaison du futur", "le trajet du bus"); answer = "la vie d'autrefois" },
    [pscustomobject]@{ question = "Une vieille photo de famille est..."; choices = @("une trace du passe", "une carte routiere", "un panneau de circulation"); answer = "une trace du passe" },
    [pscustomobject]@{ question = "Des ruines anciennes montrent..."; choices = @("qu'il existait des constructions avant nous", "qu'il va neiger", "que la mer arrive"); answer = "qu'il existait des constructions avant nous" }
)
Save-Json "data/history_ce1.json" $historyCe1

$geoCe1 = Load-Json "data/geography_ce1.json"
Append-CategoryItems $geoCe1 "ce1-reperage" @([pscustomobject]@{ question = "Sur un plan, la salle de classe peut etre representee par..."; choices = @("un symbole", "une conjugaison", "une operation"); answer = "un symbole" })
Append-CategoryItems $geoCe1 "ce1-paysages" @([pscustomobject]@{ question = "Le fleuve est..."; choices = @("un grand cours d'eau", "une route de montagne", "un immeuble"); answer = "un grand cours d'eau" })
Set-CategoryItems $geoCe1 "ce1-transports-france" @(
    [pscustomobject]@{ question = "La voiture roule surtout..."; choices = @("sur la route", "sur les rails", "dans les airs"); answer = "sur la route" },
    [pscustomobject]@{ question = "Le train est utile pour..."; choices = @("voyager loin", "nager", "grimper a un arbre"); answer = "voyager loin" },
    [pscustomobject]@{ question = "Un port est un lieu pour les..."; choices = @("bateaux", "trains", "bus scolaires"); answer = "bateaux" },
    [pscustomobject]@{ question = "La capitale de la France est..."; choices = @("Paris", "Lyon", "Marseille"); answer = "Paris" },
    [pscustomobject]@{ question = "Un aeroport sert aux..."; choices = @("avions", "velos", "peniches"); answer = "avions" },
    [pscustomobject]@{ question = "Pour aller d'une ville a une autre, on peut utiliser..."; choices = @("des transports", "une conjugaison", "un compas seulement"); answer = "des transports" }
)
Save-Json "data/geography_ce1.json" $geoCe1

$scienceCe1 = Load-Json "data/science_ce1.json"
Append-CategoryItems $scienceCe1 "ce1-vivant" @([pscustomobject]@{ question = "Pour grandir, les enfants ont besoin..."; choices = @("de manger et dormir", "de rouler sur des rails", "de devenir transparents"); answer = "de manger et dormir" })
Append-CategoryItems $scienceCe1 "ce1-matiere" @([pscustomobject]@{ question = "La vapeur d'eau est..."; choices = @("de l'eau sous une autre forme", "de la terre", "du metal"); answer = "de l'eau sous une autre forme" })
Set-CategoryItems $scienceCe1 "ce1-corps-hygiene" @(
    [pscustomobject]@{ question = "Se brosser les dents aide a..."; choices = @("garder des dents propres", "mieux courir", "entendre plus fort"); answer = "garder des dents propres" },
    [pscustomobject]@{ question = "Se laver les mains avant de manger est..."; choices = @("une bonne habitude", "inutile", "dangereux"); answer = "une bonne habitude" },
    [pscustomobject]@{ question = "Le cerveau aide a..."; choices = @("penser", "nager dans le cartable", "faire pousser les arbres"); answer = "penser" },
    [pscustomobject]@{ question = "Les muscles servent a..."; choices = @("bouger", "ecouter", "sentir"); answer = "bouger" },
    [pscustomobject]@{ question = "Pour rester en bonne sante, il faut aussi..."; choices = @("faire un peu d'exercice", "ne jamais dormir", "manger seulement des bonbons"); answer = "faire un peu d'exercice" },
    [pscustomobject]@{ question = "Quand on est malade, on peut demander de l'aide a..."; choices = @("un adulte ou un medecin", "personne", "un caillou"); answer = "un adulte ou un medecin" }
)
Save-Json "data/science_ce1.json" $scienceCe1

$emcCe1 = Load-Json "data/emc_ce1.json"
Append-CategoryItems $emcCe1 "ce1-regles" @([pscustomobject]@{ question = "Respecter une regle commune permet de..."; choices = @("mieux vivre ensemble", "faire plus de disputes", "perdre du temps"); answer = "mieux vivre ensemble" })
Append-CategoryItems $emcCe1 "ce1-citoyen" @([pscustomobject]@{ question = "Quand on range la classe ensemble, on fait preuve de..."; choices = @("cooperation", "moquerie", "violence"); answer = "cooperation" })
Set-CategoryItems $emcCe1 "ce1-entraide-respect" @(
    [pscustomobject]@{ question = "Aider quelqu'un qui ne comprend pas, c'est..."; choices = @("solidaire", "mechant", "interdit"); answer = "solidaire" },
    [pscustomobject]@{ question = "On respecte les differences en..."; choices = @("etant poli", "se moquant", "refusant de parler"); answer = "etant poli" },
    [pscustomobject]@{ question = "Si un camarade est triste, je peux..."; choices = @("l'ecouter", "me moquer", "l'ignorer toujours"); answer = "l'ecouter" },
    [pscustomobject]@{ question = "Dire merci, c'est une marque de..."; choices = @("politesse", "colere", "danger"); answer = "politesse" },
    [pscustomobject]@{ question = "Le materiel de la classe appartient..."; choices = @("a tout le monde", "a une seule personne", "a personne"); answer = "a tout le monde" },
    [pscustomobject]@{ question = "Ecouter avant de repondre aide a..."; choices = @("mieux se comprendre", "se disputer", "oublier les regles"); answer = "mieux se comprendre" }
)
Save-Json "data/emc_ce1.json" $emcCe1

Enrich-Category "data/history_ce2.json" "ce2-reperes" @([pscustomobject]@{ question = "Un siecle dure..."; choices = @("100 ans", "10 ans", "1000 ans"); answer = "100 ans" }, [pscustomobject]@{ question = "Sur une frise, un evenement de 1900 est..."; choices = @("plus recent que 1800", "plus ancien que 1800", "identique a 1800"); answer = "plus recent que 1800" })
Enrich-Category "data/history_ce2.json" "ce2-vie-autrefois" @([pscustomobject]@{ question = "Autrefois, les nouvelles circulaient souvent plus..."; choices = @("lentement", "vite qu'aujourd'hui", "par satellite"); answer = "lentement" }, [pscustomobject]@{ question = "Une lampe a huile appartient surtout..."; choices = @("au passe", "au futur", "a l'espace"); answer = "au passe" })
Enrich-Category "data/history_ce2.json" "ce2-personnages-monuments" @([pscustomobject]@{ question = "Une eglise ancienne est..."; choices = @("un monument", "un vehicule", "un paysage"); answer = "un monument" }, [pscustomobject]@{ question = "Le nom d'une rue peut rappeler..."; choices = @("un personnage du passe", "une operation", "une saison"); answer = "un personnage du passe" })
Enrich-Category "data/geography_ce2.json" "ce2-espaces" @([pscustomobject]@{ question = "Un village est souvent plus..."; choices = @("petit qu'une ville", "grand qu'un pays", "grand qu'un continent"); answer = "petit qu'une ville" }, [pscustomobject]@{ question = "Une carte sert a..."; choices = @("representer un espace", "compter des syllabes", "conjuguer un verbe"); answer = "representer un espace" })
Enrich-Category "data/geography_ce2.json" "ce2-france" @([pscustomobject]@{ question = "La France a aussi des montagnes appelees..."; choices = @("les Alpes", "les Andes francaises", "les Rocheuses"); answer = "les Alpes" }, [pscustomobject]@{ question = "La mer est utile entre autres pour..."; choices = @("les ports et la peche", "les pistes de ski", "les volcans"); answer = "les ports et la peche" })
Enrich-Category "data/geography_ce2.json" "ce2-se-reperer" @([pscustomobject]@{ question = "La legende d'un plan permet de comprendre..."; choices = @("les symboles", "les resultats de maths", "les conjugaisons"); answer = "les symboles" }, [pscustomobject]@{ question = "Pour se reperer dans la classe, on peut utiliser..."; choices = @("des reperes fixes", "des nuages", "des fusees"); answer = "des reperes fixes" })
Enrich-Category "data/science_ce2.json" "ce2-vivant" @([pscustomobject]@{ question = "Les animaux ont besoin de nourriture pour..."; choices = @("vivre", "devenir des rochers", "s'arreter de grandir"); answer = "vivre" }, [pscustomobject]@{ question = "Une graine germe si elle trouve notamment..."; choices = @("de l'eau", "du metal", "du plastique"); answer = "de l'eau" })
Enrich-Category "data/science_ce2.json" "ce2-matiere" @([pscustomobject]@{ question = "Quand l'eau bout, elle peut devenir..."; choices = @("de la vapeur", "du sable", "du carton"); answer = "de la vapeur" }, [pscustomobject]@{ question = "Un glacon est de l'eau a l'etat..."; choices = @("solide", "liquide", "gazeux"); answer = "solide" })
Enrich-Category "data/science_ce2.json" "ce2-observer-experimenter" @([pscustomobject]@{ question = "Observer en sciences, c'est regarder avec..."; choices = @("attention", "colere", "vitesse seulement"); answer = "attention" }, [pscustomobject]@{ question = "Pour comparer deux objets, on peut les..."; choices = @("mesurer", "cacher", "oublier"); answer = "mesurer" })
Enrich-Category "data/emc_ce2.json" "ce2-regles" @([pscustomobject]@{ question = "Une regle commune sert a proteger..."; choices = @("tout le monde", "personne", "seulement le maitre"); answer = "tout le monde" }, [pscustomobject]@{ question = "Respecter le materiel collectif, c'est..."; choices = @("important", "inutile", "interdit"); answer = "important" })
Enrich-Category "data/emc_ce2.json" "ce2-citoyen" @([pscustomobject]@{ question = "Dire la verite aide a construire..."; choices = @("la confiance", "la colere", "le desordre"); answer = "la confiance" }, [pscustomobject]@{ question = "Aider un plus jeune, c'est faire preuve de..."; choices = @("solidarite", "violence", "moquerie"); answer = "solidarite" })
Enrich-Category "data/emc_ce2.json" "ce2-entraide" @([pscustomobject]@{ question = "On peut regler un conflit en..."; choices = @("parlant calmement", "criant plus fort", "cassant un objet"); answer = "parlant calmement" }, [pscustomobject]@{ question = "Encourager un camarade, c'est lui montrer..."; choices = @("du respect", "du mepris", "de l'indifference"); answer = "du respect" })
Enrich-Category "data/history_cm1.json" "cm1-antiquite" @([pscustomobject]@{ question = "La Gaule etait habitee par les..."; choices = @("Gaulois", "Samourais", "Vikings"); answer = "Gaulois" }, [pscustomobject]@{ question = "Les Romains ont construit beaucoup de..."; choices = @("routes et monuments", "gratte-ciel", "stations spatiales"); answer = "routes et monuments" })
Enrich-Category "data/history_cm1.json" "cm1-moyen-age" @([pscustomobject]@{ question = "Le seigneur habitait souvent dans..."; choices = @("un chateau fort", "une gare", "un aeroport"); answer = "un chateau fort" }, [pscustomobject]@{ question = "Au Moyen Age, un chevalier est lie au..."; choices = @("chateau et au seigneur", "metro", "sous-marin"); answer = "chateau et au seigneur" })
Enrich-Category "data/history_cm1.json" "cm1-temps-modernes" @([pscustomobject]@{ question = "L'imprimerie aide a diffuser plus facilement..."; choices = @("les livres", "les montagnes", "les fleuves"); answer = "les livres" }, [pscustomobject]@{ question = "Christophe Colomb est associe a..."; choices = @("une grande exploration", "la construction de la Tour Eiffel", "la Republique"); answer = "une grande exploration" })
Enrich-Category "data/geography_cm1.json" "cm1-france-relief" @([pscustomobject]@{ question = "Un relief eleve peut etre..."; choices = @("une montagne", "un port", "une plage plate"); answer = "une montagne" }, [pscustomobject]@{ question = "La Loire est..."; choices = @("un fleuve", "une montagne", "un desert"); answer = "un fleuve" })
Enrich-Category "data/geography_cm1.json" "cm1-france-regions" @([pscustomobject]@{ question = "Une grande ville concentre souvent..."; choices = @("beaucoup d'habitants", "des champs uniquement", "peu de services"); answer = "beaucoup d'habitants" }, [pscustomobject]@{ question = "Le territoire francais comprend aussi..."; choices = @("des littoraux", "seulement des montagnes", "seulement des campagnes"); answer = "des littoraux" })
Enrich-Category "data/geography_cm1.json" "cm1-se-deplacer" @([pscustomobject]@{ question = "Le train est utile pour..."; choices = @("relier des villes", "naviguer en mer", "monter une montagne"); answer = "relier des villes" }, [pscustomobject]@{ question = "Les routes servent au transport des..."; choices = @("personnes et marchandises", "poissons uniquement", "nuages"); answer = "personnes et marchandises" })
Enrich-Category "data/science_cm1.json" "cm1-vivant" @([pscustomobject]@{ question = "Le developpement d'un animal suit souvent..."; choices = @("des etapes de vie", "un calcul", "une carte routiere"); answer = "des etapes de vie" }, [pscustomobject]@{ question = "Les plantes vertes ont besoin notamment de..."; choices = @("lumiere", "plastique", "metal"); answer = "lumiere" })
Enrich-Category "data/science_cm1.json" "cm1-matiere-energie" @([pscustomobject]@{ question = "Une source d'energie peut etre..."; choices = @("le soleil", "un cahier", "un feutre"); answer = "le soleil" }, [pscustomobject]@{ question = "Chauffer de l'eau peut changer..."; choices = @("son etat", "sa couleur toujours", "son alphabet"); answer = "son etat" })
Enrich-Category "data/science_cm1.json" "cm1-corps-hygiene" @([pscustomobject]@{ question = "L'activite physique aide a..."; choices = @("rester en bonne sante", "devenir invisible", "arreter de respirer"); answer = "rester en bonne sante" }, [pscustomobject]@{ question = "Une alimentation variee sert a..."; choices = @("bien grandir", "remplacer le sommeil", "eviter de boire"); answer = "bien grandir" })
Enrich-Category "data/emc_cm1.json" "cm1-vivre-ensemble" @([pscustomobject]@{ question = "Ecouter un avis different, c'est faire preuve de..."; choices = @("respect", "violence", "triche"); answer = "respect" }, [pscustomobject]@{ question = "Cooperer en groupe permet de..."; choices = @("reussir ensemble", "se disputer plus", "travailler seul contre tous"); answer = "reussir ensemble" })
Enrich-Category "data/emc_cm1.json" "cm1-droits-devoirs" @([pscustomobject]@{ question = "Avoir des droits signifie aussi avoir..."; choices = @("des devoirs", "plus aucune regle", "tous les privileges"); answer = "des devoirs" }, [pscustomobject]@{ question = "Respecter la loi protege..."; choices = @("les personnes", "les disputes", "les injustices"); answer = "les personnes" })
Enrich-Category "data/emc_cm1.json" "cm1-citoyennete" @([pscustomobject]@{ question = "Voter sert a..."; choices = @("choisir un representant ou une decision", "gagner un jeu video", "eviter toute discussion"); answer = "choisir un representant ou une decision" }, [pscustomobject]@{ question = "Debattre calmement permet de..."; choices = @("mieux decider ensemble", "crier plus fort", "supprimer les regles"); answer = "mieux decider ensemble" })
Enrich-Category "data/history_cm2.json" "cm2-revolution" @([pscustomobject]@{ question = "1789 marque le debut de la Revolution..."; choices = @("francaise", "romaine", "industrielle"); answer = "francaise" }, [pscustomobject]@{ question = "La prise de la Bastille est un evenement de..."; choices = @("la Revolution francaise", "l'Antiquite", "la Prehistoire"); answer = "la Revolution francaise" })
Enrich-Category "data/history_cm2.json" "cm2-xxe-siecle" @([pscustomobject]@{ question = "Le XXe siecle connait notamment..."; choices = @("deux guerres mondiales", "la construction des pyramides", "la Gaule romaine"); answer = "deux guerres mondiales" }, [pscustomobject]@{ question = "Le 11 novembre rappelle surtout..."; choices = @("l'armistice de 1918", "la prise de la Bastille", "un roi du Moyen Age"); answer = "l'armistice de 1918" })
Enrich-Category "data/history_cm2.json" "cm2-republique" @([pscustomobject]@{ question = "La Marianne represente..."; choices = @("la Republique francaise", "une region", "un fleuve"); answer = "la Republique francaise" }, [pscustomobject]@{ question = "La devise de la France contient le mot..."; choices = @("egalite", "montagne", "vitesse"); answer = "egalite" })
Enrich-Category "data/geography_cm2.json" "cm2-france-europe" @([pscustomobject]@{ question = "La France fait partie du continent..."; choices = @("europeen", "africain", "americain"); answer = "europeen" }, [pscustomobject]@{ question = "Une frontiere separe..."; choices = @("deux territoires", "deux calculs", "deux saisons"); answer = "deux territoires" })
Enrich-Category "data/geography_cm2.json" "cm2-habiter" @([pscustomobject]@{ question = "Une metropole est souvent..."; choices = @("une grande ville", "un petit hameau", "une montagne"); answer = "une grande ville" }, [pscustomobject]@{ question = "Le littoral est l'espace situe pres..."; choices = @("de la mer", "de la montagne", "du desert"); answer = "de la mer" })
Enrich-Category "data/geography_cm2.json" "cm2-mondialisation" @([pscustomobject]@{ question = "Un grand port sert aux..."; choices = @("echanges de marchandises", "courses a pied", "pistes de ski"); answer = "echanges de marchandises" }, [pscustomobject]@{ question = "Les avions et les bateaux facilitent..."; choices = @("les echanges lointains", "la croissance des arbres", "les eclipses"); answer = "les echanges lointains" })
Enrich-Category "data/science_cm2.json" "cm2-corps-sante" @([pscustomobject]@{ question = "Le sang transporte notamment..."; choices = @("de l'oxygene et des nutriments", "des rochers", "des regles de grammaire"); answer = "de l'oxygene et des nutriments" }, [pscustomobject]@{ question = "Dormir suffisamment aide le corps a..."; choices = @("recuperer", "se figer", "oublier de grandir"); answer = "recuperer" })
Enrich-Category "data/science_cm2.json" "cm2-techno-energie" @([pscustomobject]@{ question = "Une energie renouvelable peut etre..."; choices = @("le vent", "le charbon", "le petrole"); answer = "le vent" }, [pscustomobject]@{ question = "L'electricite permet notamment de..."; choices = @("faire fonctionner des appareils", "faire pousser les montagnes", "arreter le temps"); answer = "faire fonctionner des appareils" })
Enrich-Category "data/science_cm2.json" "cm2-environnement" @([pscustomobject]@{ question = "Recycler sert a..."; choices = @("reutiliser des materiaux", "polluer plus", "bruler les forets"); answer = "reutiliser des materiaux" }, [pscustomobject]@{ question = "Economiser l'eau permet de..."; choices = @("proteger une ressource utile", "remplir les deserts", "creer de l'electricite toujours"); answer = "proteger une ressource utile" })
Enrich-Category "data/emc_cm2.json" "cm2-citoyennete" @([pscustomobject]@{ question = "Respecter la parole d'autrui, c'est respecter..."; choices = @("la personne", "la dispute", "le desordre"); answer = "la personne" }, [pscustomobject]@{ question = "Un debat democratique demande de..."; choices = @("s'ecouter", "se couper sans cesse", "refuser tout avis different"); answer = "s'ecouter" })
Enrich-Category "data/emc_cm2.json" "cm2-solidarite" @([pscustomobject]@{ question = "La solidarite consiste a..."; choices = @("aider ceux qui en ont besoin", "garder tout pour soi", "ignorer les autres"); answer = "aider ceux qui en ont besoin" }, [pscustomobject]@{ question = "Un projet collectif reussit mieux quand on..."; choices = @("coopere", "triche", "travaille contre les autres"); answer = "coopere" })
Enrich-Category "data/emc_cm2.json" "cm2-engagement" @([pscustomobject]@{ question = "S'engager, c'est..."; choices = @("participer a une action utile", "rester passif toujours", "refuser toute responsabilite"); answer = "participer a une action utile" }, [pscustomobject]@{ question = "On peut s'engager a l'ecole en..."; choices = @("aidant dans un projet commun", "cassant le materiel", "refusant les regles"); answer = "aidant dans un projet commun" })

$cp = Load-Json "data/cp.json"
Append-Exercises $cp "cp-histoire" @([pscustomobject]@{ id = "cp-histoire-traces"; title = "Traces du passe"; subtitle = "Monuments et objets"; engine = "choice-engine"; params = [pscustomobject]@{ type = "factual-qcm"; dataFile = "data/history_cp.json"; category = "cp-personnages-traces"; questions = 6 } })
Append-Exercises $cp "cp-geographie" @([pscustomobject]@{ id = "cp-geo-transports"; title = "Transports"; subtitle = "Se deplacer et traverser"; engine = "choice-engine"; params = [pscustomobject]@{ type = "factual-qcm"; dataFile = "data/geography_cp.json"; category = "cp-transports-lieux"; questions = 6 } })
Append-Exercises $cp "cp-sciences" @([pscustomobject]@{ id = "cp-sciences-corps"; title = "Le corps"; subtitle = "Les sens et l'hygiene"; engine = "choice-engine"; params = [pscustomobject]@{ type = "factual-qcm"; dataFile = "data/science_cp.json"; category = "cp-corps-sens"; questions = 6 } })
Append-Exercises $cp "cp-emc" @([pscustomobject]@{ id = "cp-emc-entraide"; title = "Entraide"; subtitle = "Aider et etre poli"; engine = "choice-engine"; params = [pscustomobject]@{ type = "factual-qcm"; dataFile = "data/emc_cp.json"; category = "cp-entraide"; questions = 6 } })
Save-Json "data/cp.json" $cp

$ce1 = Load-Json "data/ce1.json"
Append-Exercises $ce1 "ce1-histoire" @([pscustomobject]@{ id = "ce1-histoire-monuments"; title = "Monuments"; subtitle = "Traces et personnages"; engine = "choice-engine"; params = [pscustomobject]@{ type = "factual-qcm"; dataFile = "data/history_ce1.json"; category = "ce1-monuments-personnages"; questions = 6 } })
Append-Exercises $ce1 "ce1-geographie" @([pscustomobject]@{ id = "ce1-geo-transports"; title = "Transports"; subtitle = "Routes, train et France"; engine = "choice-engine"; params = [pscustomobject]@{ type = "factual-qcm"; dataFile = "data/geography_ce1.json"; category = "ce1-transports-france"; questions = 6 } })
Append-Exercises $ce1 "ce1-sciences" @([pscustomobject]@{ id = "ce1-sciences-corps"; title = "Le corps"; subtitle = "Bouger et rester propre"; engine = "choice-engine"; params = [pscustomobject]@{ type = "factual-qcm"; dataFile = "data/science_ce1.json"; category = "ce1-corps-hygiene"; questions = 6 } })
Append-Exercises $ce1 "ce1-emc" @([pscustomobject]@{ id = "ce1-emc-entraide"; title = "Entraide"; subtitle = "Respect et cooperation"; engine = "choice-engine"; params = [pscustomobject]@{ type = "factual-qcm"; dataFile = "data/emc_ce1.json"; category = "ce1-entraide-respect"; questions = 6 } })
Save-Json "data/ce1.json" $ce1

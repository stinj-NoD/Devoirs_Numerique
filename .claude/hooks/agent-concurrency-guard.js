/*
 * agent-concurrency-guard.js — un seul agent à la fois sur ce projet.
 *
 * Règle du projet (CLAUDE.md, « Agents : un à la fois ») : on ne fait tourner
 * qu'un agent à la fois, un niveau à la fois. Lancer plusieurs agents
 * simultanément exige une validation EXPLICITE de l'utilisateur, qui ne doit
 * pas pouvoir être contournée par le mode auto ni par bypassPermissions.
 *
 * Pourquoi ce mécanisme et pas un simple « ask » :
 *   - une décision `ask` peut être tranchée par le classifieur en mode auto ;
 *     une décision `deny` d'un hook PreToolUse, elle, bloque dans tous les modes ;
 *   - la validation passe par un mot-clé tapé par l'utilisateur dans SON message,
 *     capté par le hook UserPromptSubmit : aucun mode ne peut écrire un message
 *     utilisateur à sa place ;
 *   - l'état (agents en cours, autorisation) vit dans .claude/.etat-agents/, et
 *     un hook anti-falsification refuse tout outil d'écriture qui y touche :
 *     l'assistant ne peut pas se fabriquer une autorisation.
 *
 * Modes (argv[2]) :
 *   pre-agent          PreToolUse sur Agent|Task : refuse si un autre agent tourne
 *   start / stop       SubagentStart / SubagentStop : tient le registre à jour
 *   prompt             UserPromptSubmit : mots-clés de l'utilisateur
 *   anti-falsification PreToolUse sur les outils d'écriture
 *
 * Mots-clés utilisateur (dans le message, n'importe où) :
 *   #agents-simultanes-ok     autorise des lancements simultanés pendant 10 min
 *   #agents-reinitialiser     vide le registre (agent mort sans signal de fin)
 *
 * Node pur, aucune dépendance (convention du projet).
 */
'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = process.env.CLAUDE_PROJECT_DIR || path.join(__dirname, '..', '..');
const DIR = path.join(ROOT, '.claude', '.etat-agents');
const EN_COURS = path.join(DIR, 'en-cours.json');
const AUTORISATION = path.join(DIR, 'autorisation.json');
const JOURNAL = path.join(DIR, 'journal.log');

const MOT_CLE_AUTORISER = /#agents-simultanes-ok\b/i;
const MOT_CLE_REINITIALISER = /#agents-reinitialiser\b/i;
const DUREE_AUTORISATION_MS = 10 * 60 * 1000;
// Un agent qui meurt sans SubagentStop (limite de session, crash) ne doit pas
// verrouiller le projet indéfiniment. Les audits les plus longs ont duré ~35 min.
const PEREMPTION_AGENT_MS = 3 * 60 * 60 * 1000;
// Entrée provisoire posée au moment du PreToolUse, remplacée par SubagentStart :
// couvre deux appels Agent émis dans le même message, avant tout démarrage.
const PEREMPTION_PROVISOIRE_MS = 2 * 60 * 1000;

function lireEntree() {
    try {
        const brut = fs.readFileSync(0, 'utf8');
        return brut.trim() ? JSON.parse(brut) : {};
    } catch (e) {
        return {};
    }
}

function lireJson(fichier, defaut) {
    try { return JSON.parse(fs.readFileSync(fichier, 'utf8')); } catch (e) { return defaut; }
}

function ecrireJson(fichier, valeur) {
    fs.mkdirSync(DIR, { recursive: true });
    fs.writeFileSync(fichier, JSON.stringify(valeur, null, 2));
}

function journal(ligne) {
    try {
        fs.mkdirSync(DIR, { recursive: true });
        let lignes = [];
        try { lignes = fs.readFileSync(JOURNAL, 'utf8').split('\n').filter(Boolean); } catch (e) { /* vide */ }
        lignes.push(new Date().toISOString() + ' ' + ligne);
        fs.writeFileSync(JOURNAL, lignes.slice(-300).join('\n') + '\n');
    } catch (e) { /* le journal ne doit jamais faire échouer le hook */ }
}

function registrePurge() {
    const registre = lireJson(EN_COURS, {});
    const maintenant = Date.now();
    for (const [cle, e] of Object.entries(registre)) {
        const age = maintenant - Date.parse(e.depuis || 0);
        const limite = e.provisoire ? PEREMPTION_PROVISOIRE_MS : PEREMPTION_AGENT_MS;
        if (!(age < limite)) {
            journal(`purge ${cle} (${e.type || '?'}, ${e.provisoire ? 'provisoire' : 'périmé'})`);
            delete registre[cle];
        }
    }
    return registre;
}

function autorisationValide() {
    const a = lireJson(AUTORISATION, null);
    return !!(a && Date.parse(a.jusqua) > Date.now());
}

function sortir(objet) {
    if (objet) process.stdout.write(JSON.stringify(objet));
    process.exit(0);
}

function refuser(evenement, raison) {
    sortir({
        hookSpecificOutput: {
            hookEventName: evenement,
            permissionDecision: 'deny',
            permissionDecisionReason: raison
        }
    });
}

const mode = process.argv[2];
const entree = lireEntree();

try {
    if (mode === 'pre-agent') {
        const registre = registrePurge();
        const appelant = entree.agent_id || null;
        const autres = Object.entries(registre).filter(([cle]) => cle !== appelant);
        const type = (entree.tool_input && entree.tool_input.subagent_type) || 'general-purpose';
        journal(`pre-agent type=${type} appelant=${appelant || 'principal'} autres=${autres.length} cles=${Object.keys(entree).join(',')}`);

        if (autres.length && !autorisationValide()) {
            const liste = autres.map(([cle, e]) => `- ${e.type || '?'} (${e.provisoire ? 'en démarrage' : 'depuis ' + e.depuis}) [${cle}]`).join('\n');
            refuser('PreToolUse',
                'Garde-fou du projet : un agent tourne déjà, et la règle est UN SEUL agent à la fois (CLAUDE.md, « Agents : un à la fois »).\n'
                + 'Agents en cours :\n' + liste + '\n'
                + 'Attends la fin de cet agent avant d\'en lancer un autre. Si des agents simultanés sont réellement nécessaires, '
                + 'demande-le à l\'utilisateur en expliquant pourquoi : il doit écrire lui-même « #agents-simultanes-ok » dans son message '
                + '(autorisation valable 10 minutes). Ne tente pas de contourner ce refus. '
                + 'Si le registre est faux (agent mort sans signal de fin), c\'est aussi à l\'utilisateur d\'écrire « #agents-reinitialiser ».');
        }

        // Entrée provisoire : voir PEREMPTION_PROVISOIRE_MS.
        registre['provisoire-' + Date.now() + '-' + Math.random().toString(36).slice(2, 6)] = {
            type, depuis: new Date().toISOString(), provisoire: true, parent: appelant
        };
        ecrireJson(EN_COURS, registre);
        if (autres.length) {
            journal(`lancement simultané AUTORISÉ par l'utilisateur (type=${type})`);
            sortir({ systemMessage: `Agent « ${type} » lancé en parallèle d'un autre, sur autorisation #agents-simultanes-ok.` });
        }
        sortir(null);
    }

    if (mode === 'start') {
        const registre = registrePurge();
        const type = entree.agent_type || entree.subagent_type || '?';
        // Remplace l'entrée provisoire la plus ancienne du même type (sinon la plus ancienne tout court).
        const provisoires = Object.entries(registre).filter(([, e]) => e.provisoire)
            .sort((a, b) => Date.parse(a[1].depuis) - Date.parse(b[1].depuis));
        const cible = provisoires.find(([, e]) => e.type === type) || provisoires[0];
        if (cible) delete registre[cible[0]];
        const cle = entree.agent_id || ('sans-id-' + Date.now());
        registre[cle] = { type, depuis: new Date().toISOString() };
        ecrireJson(EN_COURS, registre);
        journal(`start ${cle} type=${type} cles=${Object.keys(entree).join(',')}`);
        sortir(null);
    }

    if (mode === 'stop') {
        const registre = registrePurge();
        const cle = entree.agent_id;
        if (cle && registre[cle]) {
            delete registre[cle];
        } else {
            // Pas d'identifiant exploitable : on retire l'entrée confirmée la plus ancienne.
            const plusAncienne = Object.entries(registre).filter(([, e]) => !e.provisoire)
                .sort((a, b) => Date.parse(a[1].depuis) - Date.parse(b[1].depuis))[0];
            if (plusAncienne) delete registre[plusAncienne[0]];
        }
        ecrireJson(EN_COURS, registre);
        journal(`stop ${cle || '(sans id)'} restants=${Object.keys(registre).length} cles=${Object.keys(entree).join(',')}`);
        sortir(null);
    }

    if (mode === 'prompt') {
        const texte = String(entree.prompt || '');
        const messages = [];
        if (MOT_CLE_REINITIALISER.test(texte)) {
            ecrireJson(EN_COURS, {});
            journal('registre réinitialisé par l\'utilisateur');
            messages.push('Registre des agents en cours réinitialisé par l\'utilisateur (#agents-reinitialiser).');
        }
        if (MOT_CLE_AUTORISER.test(texte)) {
            const jusqua = new Date(Date.now() + DUREE_AUTORISATION_MS).toISOString();
            ecrireJson(AUTORISATION, { jusqua, accordee: new Date().toISOString() });
            journal(`autorisation de lancements simultanés accordée jusqu'à ${jusqua}`);
            messages.push(`L'utilisateur autorise des lancements d'agents simultanés jusqu'à ${jusqua} (#agents-simultanes-ok). Au-delà, la règle « un agent à la fois » reprend.`);
        }
        if (messages.length) {
            sortir({ hookSpecificOutput: { hookEventName: 'UserPromptSubmit', additionalContext: messages.join('\n') } });
        }
        sortir(null);
    }

    if (mode === 'anti-falsification') {
        const ti = entree.tool_input || {};
        // Outils d'édition : seul le chemin écrit compte — un fichier qui
        // MENTIONNE le dossier (la doc qui décrit ce garde-fou) est légitime.
        // Shell : la commande entière, puisqu'elle peut écrire n'importe où.
        const cible = ['Write', 'Edit', 'NotebookEdit'].includes(entree.tool_name)
            ? String(ti.file_path || ti.notebook_path || '')
            : JSON.stringify(ti);
        if (cible.includes('.etat-agents')) {
            journal(`anti-falsification : refus de ${entree.tool_name}`);
            refuser('PreToolUse',
                'Garde-fou du projet : l\'état du garde-fou des agents (.claude/.etat-agents/) ne se modifie que par les mots-clés '
                + 'que l\'utilisateur écrit lui-même (#agents-simultanes-ok, #agents-reinitialiser). Aucun outil ne peut y écrire.');
        }
        sortir(null);
    }

    sortir(null);
} catch (erreur) {
    journal(`ERREUR mode=${mode} : ${erreur && erreur.message}`);
    sortir({ systemMessage: `Garde-fou des agents : erreur interne (${erreur && erreur.message}). Voir .claude/.etat-agents/journal.log.` });
}

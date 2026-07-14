/*
 * Devoir Numerique - Bootstrap Runtime
 * Fallbacks non-inline + registration SW
 */
(function () {
    const Sec = window.SecurityUtils || {
        escapeHtml: (v) => String(v ?? ''),
        clampNumber: (v, min, max, fallback = 0) => {
            const n = Number(v);
            if (!Number.isFinite(n)) return fallback;
            return Math.min(max, Math.max(min, n));
        }
    };

    window.dnOpenGradesFallback = async function () {
        try {
            if (window.App && typeof window.App.loadGradesMenu === 'function') {
                await window.App.loadGradesMenu();
                const gradesScreen = document.getElementById('screen-grades');
                if (gradesScreen && gradesScreen.classList.contains('active')) return true;
            }
        } catch (error) {
            console.error('loadGradesMenu a échoué', error);
        }

        try {
            const response = await fetch('data/index.json', { cache: 'no-store' });
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            const data = await response.json();
            const grades = Array.isArray(data && data.grades) ? data.grades : [];
            if (!grades.length) throw new Error('Aucun niveau trouvé');
            window.__dnGradesFallback = grades;

            if (window.Storage && typeof window.Storage.getCurrentUser === 'function' && window.UI) {
                const user = window.Storage.getCurrentUser() || 'Invité';
                if (typeof window.UI.updateHeader === 'function') window.UI.updateHeader(`Joueur : ${user}`);

                const gradesList = document.getElementById('grades-list');
                if (gradesList) {
                    gradesList.innerHTML = '';
                    grades.forEach((grade, index) => {
                        const rawIcon = (grade?.icon || '').toString().trim();
                        const gradeIcon = (!rawIcon || ['📘', '📗', '📕', '📙', '📚'].includes(rawIcon)) ? '🎒' : rawIcon;
                        const card = document.createElement('button');
                        card.type = 'button';
                        card.className = 'card menu-card';
                        card.innerHTML = `
                            <span class="card-icon">${Sec.escapeHtml(gradeIcon)}</span>
                            <div class="card-content">
                                <span class="card-title">${Sec.escapeHtml(grade.title || 'Classe')}</span>
                                ${grade.subtitle ? `<span class="card-subtitle">${Sec.escapeHtml(grade.subtitle)}</span>` : ''}
                            </div>
                        `;
                        card.addEventListener('click', () => window.dnSelectGradeFallback(index));
                        gradesList.appendChild(card);
                    });
                }
                if (typeof window.UI.showScreen === 'function') window.UI.showScreen('screen-grades');
                return true;
            }
        } catch (error) {
            console.error('Fallback ouverture niveaux impossible', error);
        }
        return false;
    };

    window.dnSelectGradeFallback = function (index) {
        const grades = Array.isArray(window.__dnGradesFallback) ? window.__dnGradesFallback : [];
        const safeIndex = Sec.clampNumber(index, 0, Math.max(0, grades.length - 1), -1);
        const grade = grades[safeIndex];
        if (!grade) return false;
        if (window.App && typeof window.App.loadGrade === 'function') window.App.loadGrade(grade);
        return false;
    };

    window.dnCreateProfileFallback = async function (event) {
        if (event) {
            event.preventDefault?.();
            event.stopPropagation?.();
            event.stopImmediatePropagation?.();
        }

        const input = document.getElementById('new-profile-name');
        const name = input ? input.value : '';

        if (window.App && typeof window.App.createProfile === 'function') {
            try {
                await window.App.createProfile();
                return false;
            } catch (error) {
                console.error('App.createProfile a échoué', error);
            }
        }

        if (window.Storage && typeof window.Storage.addProfile === 'function' && typeof window.Storage.setCurrentUser === 'function') {
            const result = window.Storage.addProfile(name);
            if (result && result.ok) {
                window.Storage.setCurrentUser(result.cleanName);
                if (input) input.value = '';
                const opened = await window.dnOpenGradesFallback();
                if (!opened && window.App && typeof window.App.renderProfilesScreen === 'function') {
                    window.App.renderProfilesScreen();
                }
                return false;
            }

            const messages = {
                empty: "Merci d'entrer un prénom.",
                invalid: "Ce prénom contient uniquement des caractères non autorisés.",
                too_short: "Merci d'entrer au moins 2 caractères.",
                duplicate: "Ce profil existe déjà."
            };
            const message = messages[result && result.code] || "Merci d'entrer un prénom valide.";
            alert(message);
            return false;
        }

        alert("Le module de création de profil n'est pas disponible.");
        return false;
    };

    window.dnHandleProfileKey = function (event) {
        if (event && event.key === 'Enter') {
            window.dnCreateProfileFallback(event);
            return false;
        }
        return true;
    };

    function bindProfileInlineFallback() {
        const input = document.getElementById('new-profile-name');
        const button = document.getElementById('btn-add-profile');
        const toggle = document.getElementById('btn-new-profile-toggle');
        const form = document.getElementById('profile-form');

        if (button) {
            button.addEventListener('click', (event) => {
                window.dnCreateProfileFallback(event);
            }, true);
        }

        if (input) {
            input.addEventListener('keydown', (event) => {
                if (event.key === 'Enter') window.dnCreateProfileFallback(event);
            }, true);
        }

        if (toggle && form && input) {
            toggle.addEventListener('click', () => {
                form.classList.remove('is-collapsed');
                toggle.hidden = true;
                // focus() SYNCHRONE dans le geste utilisateur : condition
                // indispensable pour que iOS/iPadOS fasse monter le clavier
                // virtuel (aucun setTimeout/await avant cet appel).
                input.focus();
            });
        }

        bindProfileKeyboard(input);
    }

    function isIPad() {
        const ua = navigator.userAgent || '';
        if (/iPad/i.test(ua)) return true; // anciens iPadOS
        // iPadOS 13+ se présente comme un Mac : Mac + multi-touch = iPad
        // (aucun Mac de bureau n'a d'écran tactile).
        return /Mac/i.test(ua) && (navigator.maxTouchPoints || 0) > 1;
    }

    // Clavier virtuel AZERTY optionnel du formulaire profil. Le clavier
    // natif reste le défaut partout ; sur iPad uniquement (où il ne monte
    // pas de façon fiable, constaté sur iPadOS 15.8), un bouton propose
    // d'ouvrir le clavier interne. Jamais imposé aux autres plateformes.
    function bindProfileKeyboard(input) {
        const container = document.getElementById('profile-keyboard');
        const toggle = document.getElementById('btn-profile-keyboard');
        if (!container || !toggle || !input) return;

        const LABEL_SHOW = '⌨️ Afficher le clavier';
        const LABEL_HIDE = '⌨️ Masquer le clavier';
        let rendered = false;

        function close() {
            container.hidden = true;
            input.removeAttribute('inputmode');
            toggle.textContent = LABEL_SHOW;
        }

        function open() {
            // Rendu paresseux : le clavier n'existe dans le DOM que si un
            // enfant l'a demandé au moins une fois.
            // UIKeyboards est un const top-level (binding global lexical) :
            // accessible en bare, pas via window.
            if (!rendered && typeof UIKeyboards !== 'undefined' && typeof UIKeyboards.renderProfileKeyboard === 'function') {
                UIKeyboards.renderProfileKeyboard(container);
                rendered = true;
            }
            container.hidden = false;
            // Tant que le clavier interne est ouvert, on évite que le natif
            // vienne se superposer si l'enfant retape dans le champ.
            input.setAttribute('inputmode', 'none');
            toggle.textContent = LABEL_HIDE;
        }

        window.dnResetProfileKeyboard = close;

        if (isIPad()) toggle.hidden = false;

        toggle.addEventListener('click', () => {
            if (container.hidden) open();
            else close();
        });

        container.addEventListener('click', (event) => {
            const key = event.target.closest('.key');
            if (!key || !key.hasAttribute('data-val')) return;
            const val = key.getAttribute('data-val');

            if (val === 'ok') {
                window.dnCreateProfileFallback(event);
                return;
            }
            if (val === 'backspace') {
                input.value = input.value.slice(0, -1);
                return;
            }
            const max = input.maxLength > 0 ? input.maxLength : 15;
            if (input.value.length < max) input.value += val;
        });
    }

    function registerServiceWorker() {
        const isLocalLive =
            ['localhost', '127.0.0.1', '::1'].includes(window.location.hostname) ||
            /^192\.168\./.test(window.location.hostname);

        if (!('serviceWorker' in navigator) || window.location.protocol === 'file:') return;

        window.addEventListener('load', () => {
            if (isLocalLive) {
                const cacheResetDone = sessionStorage.getItem('dn_local_sw_reset') === '1';
                navigator.serviceWorker.getRegistrations()
                    .then((registrations) => Promise.all(registrations.map((registration) => registration.unregister())))
                    .then(() => {
                        if (!window.caches) return Promise.resolve();
                        return caches.keys().then((keys) => Promise.all(keys.map((key) => caches.delete(key))));
                    })
                    .then(() => {
                        console.log('[SW] desactive en live local');
                        if (!cacheResetDone) {
                            sessionStorage.setItem('dn_local_sw_reset', '1');
                            window.location.reload();
                            return;
                        }
                        sessionStorage.removeItem('dn_local_sw_reset');
                    })
                    .catch((err) => console.warn('[SW] nettoyage local impossible', err));
                return;
            }

            let refreshing = false;
            navigator.serviceWorker.addEventListener('controllerchange', () => {
                if (refreshing) return;
                refreshing = true;
                window.location.reload();
            });

            navigator.serviceWorker.register('./sw.js')
                .then((reg) => {
                    if (reg.waiting) reg.waiting.postMessage({ type: 'SKIP_WAITING' });
                    reg.addEventListener('updatefound', () => {
                        const worker = reg.installing;
                        if (!worker) return;
                        worker.addEventListener('statechange', () => {
                            if (worker.state === 'installed' && navigator.serviceWorker.controller) {
                                worker.postMessage({ type: 'SKIP_WAITING' });
                            }
                        });
                    });
                    console.log('[SW] inscrit', reg.scope);

                    // Sur iOS/Safari (surtout en PWA plein écran), le check de
                    // mise à jour automatique du navigateur est peu fiable et
                    // peut ne jamais se déclencher pendant des jours. On force
                    // ici une vérification à chaque ouverture d'app plutôt que
                    // de compter uniquement sur ce cycle natif.
                    reg.update().catch(() => {});
                })
                .catch((err) => console.log('[SW] echec', err));
        });
    }

    function renderAppVersionLabel() {
        const label = document.getElementById('app-version-label');
        if (label && typeof window.APP_VERSION === 'string') {
            label.textContent = 'v' + window.APP_VERSION;
        }
    }

    window.addEventListener('DOMContentLoaded', () => {
        bindProfileInlineFallback();
        renderAppVersionLabel();
        registerServiceWorker();
    });
})();



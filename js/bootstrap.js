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
            console.error('loadGradesMenu a Ã©chouÃ©', error);
        }

        try {
            const response = await fetch('data/index.json', { cache: 'no-store' });
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            const data = await response.json();
            const grades = Array.isArray(data && data.grades) ? data.grades : [];
            if (!grades.length) throw new Error('Aucun niveau trouvÃ©');
            window.__dnGradesFallback = grades;

            if (window.Storage && typeof window.Storage.getCurrentUser === 'function' && window.UI) {
                const user = window.Storage.getCurrentUser() || 'InvitÃ©';
                if (typeof window.UI.updateHeader === 'function') window.UI.updateHeader(`Joueur : ${user}`);

                const gradesList = document.getElementById('grades-list');
                if (gradesList) {
                    gradesList.innerHTML = '';
                    grades.forEach((grade, index) => {
                        const card = document.createElement('button');
                        card.type = 'button';
                        card.className = 'card menu-card';
                        card.innerHTML = `
                            <span class="card-icon">${Sec.escapeHtml(grade.icon || 'ï¿½Y"~')}</span>
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
                console.error('App.createProfile a Ã©chouÃ©', error);
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
                empty: "Merci d'entrer un prÃ©nom.",
                invalid: "Ce prÃ©nom contient uniquement des caractÃ¨res non autorisÃ©s.",
                too_short: "Merci d'entrer au moins 2 caractÃ¨res.",
                duplicate: "Ce profil existe dÃ©jÃ ."
            };
            const message = messages[result && result.code] || "Merci d'entrer un prÃ©nom valide.";
            alert(message);
            return false;
        }

        alert("Le module de crÃ©ation de profil n'est pas disponible.");
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
                })
                .catch((err) => console.log('[SW] echec', err));
        });
    }

    window.addEventListener('DOMContentLoaded', () => {
        bindProfileInlineFallback();
        registerServiceWorker();
    });
})();


/*
 * Devoir Numérique - UI.js
 * Copyright (C) 2026 [Stinj-NoD]
 * Version : 3.0 (Hardened & Secure)
 */

const UI = {
    // Getters sécurisés (retournent null si élément absent)
    get screens() { return document.querySelectorAll('.screen'); },
    get btnBack() { return document.getElementById('btn-back'); },
    get btnHome() { return document.getElementById('btn-home'); },
    get navSheet() { return document.getElementById('nav-sheet'); },
    get navSheetActions() { return document.getElementById('nav-sheet-actions'); },
    lastFocusedElement: null,
    navSheetHideTimer: null,
    _navInitialized: false,

    /**
     * Gestionnaire d'affichage des écrans
     */
    showScreen(id) {
        // 1. Gestion des écrans
        if (this.screens.length === 0) return console.warn("UI: Aucun écran trouvé dans le DOM");

        this.screens.forEach(s => {
            if (s.id === id) {
                s.classList.add('active');
                s.style.display = 'flex';
                s.scrollTop = 0;
            } else {
                s.classList.remove('active');
                s.style.display = 'none';
            }
        });

        // 2. Sync navigation contextuelle
        if (typeof window !== 'undefined' && window.App?.getNavUiState) {
            this.syncHeaderNav(window.App.getNavUiState(id));
        }
    },

    syncHeaderNav(state = {}) {
        const model = {
            showBack: state.showBack !== false,
            backLabel: state.backLabel || '←',
            backTitle: state.backTitle || 'Retour',
            showMenu: state.showMenu !== false,
            menuLabel: state.menuLabel || '☰',
            menuTitle: state.menuTitle || 'Menu'
        };

        if (this.btnBack) {
            this.btnBack.style.visibility = model.showBack ? 'visible' : 'hidden';
            this.btnBack.disabled = !model.showBack;
            this.btnBack.textContent = model.backLabel;
            this.btnBack.setAttribute('aria-label', model.backTitle);
            this.btnBack.setAttribute('title', model.backTitle);
        }

        if (this.btnHome) {
            this.btnHome.style.visibility = model.showMenu ? 'visible' : 'hidden';
            this.btnHome.disabled = !model.showMenu;
            this.btnHome.textContent = model.menuLabel;
            this.btnHome.setAttribute('aria-label', model.menuTitle);
            this.btnHome.setAttribute('title', model.menuTitle);
        }
    },

    openNavSheet(actions = []) {
        if (!this.navSheet || !this.navSheetActions) return;
        if (this.navSheetHideTimer) {
            clearTimeout(this.navSheetHideTimer);
            this.navSheetHideTimer = null;
        }
        this.navSheetActions.innerHTML = '';
        this.lastFocusedElement = document.activeElement instanceof HTMLElement ? document.activeElement : null;

        const normalizedActions = Array.isArray(actions) ? actions : [];
        normalizedActions.forEach((action) => {
            const button = document.createElement('button');
            button.type = 'button';
            button.className = 'btn btn--soft nav-sheet-action';
            if (action?.variant) button.classList.add(`nav-sheet-action--${action.variant}`);
            const title = document.createElement('span');
            title.className = 'nav-sheet-action-title';
            title.textContent = action?.title || 'Action';
            button.appendChild(title);
            if (action?.subtitle) {
                const subtitle = document.createElement('span');
                subtitle.className = 'nav-sheet-action-subtitle';
                subtitle.textContent = action.subtitle;
                button.appendChild(subtitle);
            }
            button.onclick = () => {
                this.closeNavSheet();
                if (typeof action?.onSelect === 'function') action.onSelect();
            };
            this.navSheetActions.appendChild(button);
        });

        if (!normalizedActions.length) {
            const empty = document.createElement('p');
            empty.className = 'nav-sheet-empty';
            empty.textContent = 'Aucune action disponible ici.';
            this.navSheetActions.appendChild(empty);
        }

        this.navSheet.hidden = false;
        this.navSheet.setAttribute('aria-hidden', 'false');
        this.navSheet.classList.add('is-open');
        const firstButton = this.navSheetActions.querySelector('button');
        if (firstButton instanceof HTMLButtonElement) firstButton.focus();
    },

    closeNavSheet(refocus = true) {
        if (!this.navSheet) return;
        this.navSheet.classList.remove('is-open');
        this.navSheet.setAttribute('aria-hidden', 'true');
        this.navSheetHideTimer = setTimeout(() => {
            if (this.navSheet && !this.navSheet.classList.contains('is-open')) {
                this.navSheet.hidden = true;
            }
            this.navSheetHideTimer = null;
        }, 190);
        // refocus=false quand un changement d'écran suit immédiatement (goHome/goBack) :
        // refocaliser un <button> d'un écran qui va disparaître casse la chaîne
        // d'activation utilisateur attendue par iOS Safari pour le clavier virtuel
        // du prochain input tapé (aucun souci sur Android).
        if (refocus && this.lastFocusedElement && typeof this.lastFocusedElement.focus === 'function') {
            this.lastFocusedElement.focus();
        }
        this.lastFocusedElement = null;
    },

    initNavSheet() {
        if (this._navInitialized) return;
        this._navInitialized = true;
        const backdrop = document.getElementById('nav-sheet-backdrop');
        const closeBtn = document.getElementById('nav-sheet-close');
        if (backdrop) backdrop.onclick = () => this.closeNavSheet();
        if (closeBtn) closeBtn.onclick = () => this.closeNavSheet();
        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape' && this.navSheet && !this.navSheet.hidden) {
                this.closeNavSheet();
            }
        });
    },

    updateHeader(text) {
        const title = document.getElementById('app-title');
        if (title) title.innerText = text || "Devoir Numérique";
    },

    renderHeaderAvatar(appearance) {
        const el = document.getElementById('header-avatar');
        if (!el) return;
        if (!appearance || !appearance.avatar) {
            el.classList.add('is-hidden');
            el.classList.remove('has-card-avatar');
            el.innerHTML = '';
            return;
        }
        el.classList.remove('is-hidden');
        el.classList.toggle('avatar-prestige-gold', appearance.prestigeTier?.id === 'gold');
        el.classList.toggle('avatar-prestige-stars', appearance.prestigeTier?.id === 'stars');
        el.classList.toggle('avatar-prestige-crown', appearance.prestigeTier?.id === 'crown');
        el.classList.toggle('has-card-avatar', !!appearance.cardImage);
        if (appearance.cardImage) {
            // Avatar-carte du Grimoire : l'illustration remplace l'emoji
            el.textContent = '';
            const img = document.createElement('img');
            img.className = 'header-avatar-img';
            img.src = appearance.cardImage;
            img.alt = '';
            el.appendChild(img);
        } else {
            el.textContent = appearance.avatar;
        }
        if (appearance.accessoryEmoji) {
            const badge = document.createElement('span');
            badge.className = 'header-avatar-accessory';
            badge.setAttribute('aria-hidden', 'true');
            badge.textContent = appearance.accessoryEmoji;
            el.appendChild(badge);
        }
    },

    safeIcon(value, fallback = '\u{1F4DD}') {
        const icon = (value || "").toString().trim();
        if (!icon) return fallback;
        if (/[\uFFFD]/.test(icon) || /ï¿|Ã|�/.test(icon)) return fallback;
        return icon;
    },

    resolveMenuIcon(item, menuVariant = '') {
        const provided = (item?.icon || '').toString().trim();
        const generic = new Set(['📘', '📗', '📕', '📙', '📚']);
        if (provided && !generic.has(provided) && !/[\uFFFD]/.test(provided)) {
            return provided;
        }

        const text = [
            item?.id,
            item?.title,
            item?.subtitle,
            item?.subjectTitle
        ].filter(Boolean).join(' ')
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '');

        if (menuVariant === 'grades') return '🎒';

        // Règles spécifiques aux mesures, testées AVANT la règle générale
        // "math" : sinon chiffres romains, durées, longueurs, masses et
        // contenances retombaient tous sur la même icône 🔢, peu lisible
        // dans une liste où plusieurs exercices de mesure se suivent.
        if (/romain/.test(text)) return '🏛️';
        if (/duree|heure|minute|seconde|horloge/.test(text)) return '⏱️';
        if (/longueur|metre|kilometre|centimetre|distance/.test(text)) return '📏';
        if (/masse|poids|kilogramme|gramme|balance/.test(text)) return '⚖️';
        if (/contenance|capacite|litre|volume/.test(text)) return '🧪';
        if (/monnaie|euro|argent|prix|achat|marche|caisse|piece|billet/.test(text)) return '💶';
        if (/aire|perimetre|surface/.test(text)) return '📐';
        if (/angle|triangle|cercle|quadrilatere|polygone|figure/.test(text)) return '📐';
        if (/\b(fraction|partage|demi|tiers|quarts?)\b/.test(text)) return '🍰';
        if (/pourcentage|proportionnalite|vitesse|echelle/.test(text)) return '📊';
        if (/tableau|graphique|diagramme|statistique/.test(text)) return '📊';
        if (/addition|complet.*jusqu|super addition/.test(text)) return '➕';
        if (/soustraction|retirer|enlever/.test(text)) return '➖';
        if (/multipli|table de/.test(text)) return '✖️';
        if (/division|quotient/.test(text)) return '➗';
        if (/decimal|virgule|dixieme|centieme/.test(text)) return '🔟';
        if (/comparer|plus grand|plus petit|egal/.test(text)) return '⚖️';
        if (/probleme/.test(text)) return '🧩';
        if (/carre magique|cible/.test(text)) return '🎯';

        if (/imparfait|present|futur|passe compose|conjug|2eme groupe|3eme groupe|1er groupe|verbe|etre et avoir/.test(text)) return '🔤';
        if (/article|determinant|un ou une|le.{0,3}la.{0,3}l|elision/.test(text)) return '🔡';
        if (/sujet|complement|nature.*mot|nom ou verbe|fonction.*mot|singulier|pluriel/.test(text)) return '🧠';
        if (/famille de mots|champ lexical|synonyme|antonyme|vocabulaire|ranger les mots/.test(text)) return '📖';
        if (/dictee|ecoute et ecris|audio/.test(text)) return '🎧';
        if (/lecture|comprehension|texte/.test(text)) return '📖';
        if (/orthographe|accord/.test(text)) return '🖊️';
        if (/mot outil|ponctuation|phrase/.test(text)) return '✍️';

        if (/math|calcul|nombre|geometr|mesure|operation|table/.test(text)) return '🔢';
        if (/francais|grammaire|conjug|homophone/.test(text)) return '✍️';
        if (/histoire|antiquite|moyen age|revolution|musee|passe/.test(text)) return '🏺';
        if (/geographie|geo|paysage|carte|continent|ville|espace|voyageur|transport/.test(text)) return '🗺️';
        if (/science|vivant|corps|matiere|energie|technologie|nature|animaux/.test(text)) return '🔬';
        if (/emc|citoyen|regle|respect|valeur|republique/.test(text)) return '🤝';
        if (item?.kind === 'lesson' || menuVariant === 'library') return '📘';
        if (menuVariant === 'exercises') return '✏️';
        return '📌';
    },

    buildCardContent(title, subtitle = "") {
        const safeTitle = this._escapeText(title || 'Exercice');
        const safeSubtitle = subtitle ? this._escapeText(subtitle) : '';
        return `
            <div class="card-content">
                <span class="card-title">${safeTitle}</span>
                ${safeSubtitle ? `<span class="card-subtitle">${safeSubtitle}</span>` : ''}
            </div>
        `;
    },

    // --- PROFILS & MENUS ---

    renderProfiles(profiles, onSelect, onDelete) {
        const container = document.getElementById('profiles-list');
        if (!container) return;
        container.innerHTML = "";

        (profiles || []).forEach(p => {
            const streak = (typeof Storage !== 'undefined' && Storage.getStreak) ? Storage.getStreak(p.name) : { current: 0 };
            const streakHtml = streak.current > 0
                ? `<div class="profile-card-streak" title="${streak.current} jour${streak.current > 1 ? 's' : ''} de suite">🔥 ${streak.current}</div>`
                : '';
            const profileName = p.name || 'Anonyme';

            // Aperçu de progression : étoiles cumulées + badges débloqués,
            // visibles d'un coup d'œil sans entrer dans le profil.
            let statsHtml = '';
            if (typeof Storage !== 'undefined' && Storage.getTotalStars) {
                const stars = Storage.getTotalStars(p.name);
                const badges = Storage.getBadges ? Storage.getBadges(p.name).filter(b => b.unlocked).length : 0;
                if (stars > 0 || badges > 0) {
                    statsHtml = `<span class="profile-card-stats">⭐ ${stars}${badges > 0 ? ` · 🏅 ${badges}` : ''}</span>`;
                }
            }

            const wrapper = document.createElement('div');
            wrapper.className = 'profile-card-wrapper';

            const card = document.createElement('button');
            card.type = 'button';
            card.className = 'card profile-card';
            if (p.accentColor) {
                card.style.setProperty('--profile-card-accent', p.accentColor);
                card.classList.add('has-accent');
            }
            card.setAttribute('aria-label', `Jouer avec le profil ${profileName}${streak.current > 0 ? `, ${streak.current} jours de suite` : ''}`);
            card.innerHTML = `
                ${streakHtml}
                <span class="card-icon${p.cardImage ? ' card-icon--card-avatar' : ''}" aria-hidden="true">${p.cardImage
                    ? `<img class="profile-card-avatar-img" src="${this._escapeText(p.cardImage)}" alt="">`
                    : this.safeIcon(p.avatar, '\u{1F464}')}</span>
                ${this.buildCardContent(profileName)}
                ${statsHtml}
                <span class="profile-card-helper">Entrer</span>
            `;
            card.onclick = () => onSelect(p);

            const deleteBtn = document.createElement('button');
            deleteBtn.type = 'button';
            deleteBtn.className = 'btn btn--icon btn--danger btn-delete-profile';
            deleteBtn.setAttribute('aria-label', `Supprimer le profil ${profileName}`);
            deleteBtn.title = 'Supprimer';
            deleteBtn.textContent = '🗑️';
            deleteBtn.onclick = () => {
                if (confirm(`Veux-tu vraiment supprimer le profil de ${profileName} ?`)) {
                    onDelete(p.id);
                }
            };

            const editBtn = document.createElement('button');
            editBtn.type = 'button';
            editBtn.className = 'btn btn--icon btn-edit-profile';
            editBtn.setAttribute('aria-label', `Personnaliser le profil ${profileName}`);
            editBtn.title = 'Personnaliser';
            editBtn.textContent = '✏️';
            editBtn.onclick = (event) => {
                event.stopPropagation();
                if (typeof p.onEdit === 'function') p.onEdit(p);
            };

            wrapper.appendChild(card);
            wrapper.appendChild(editBtn);
            wrapper.appendChild(deleteBtn);
            container.appendChild(wrapper);
        });
    },

    renderProfileCustomize({ profileName, totalStars, hasStarter, starters, evolution, accents, accessories, cardChoices, current }, handlers, onDone) {
        const { onChooseStarter, onEvolve, onChangeAccent, onChangeAccessory, onChangeCardAvatar } = handlers;
        const lead = document.getElementById('profile-customize-lead');
        if (lead) {
            lead.textContent = Number.isFinite(totalStars)
                ? `Profil de ${profileName} · ${totalStars} ★ cumulées`
                : `Profil de ${profileName}`;
        }

        let selectedAccent = current.accent;

        const starterContainer = document.getElementById('profile-customize-starter');
        const companionContainer = document.getElementById('profile-customize-companion');
        const accentContainer = document.getElementById('profile-customize-accents');
        if (!starterContainer || !companionContainer || !accentContainer) return;

        if (!hasStarter) {
            starterContainer.classList.remove('u-hidden');
            companionContainer.classList.add('u-hidden');
            starterContainer.innerHTML = `
                <p class="profile-customize-starter-intro">Choisis ton premier compagnon, il grandira avec tes étoiles !</p>
                <div class="profile-customize-starter-list">
                    ${starters.map((s) => `
                        <button type="button" class="profile-customize-starter-option" data-starter-id="${this._escapeText(s.id)}">
                            <span class="profile-customize-starter-emoji">${s.emoji}</span>
                            <span class="profile-customize-starter-label">${this._escapeText(s.label)}</span>
                        </button>
                    `).join('')}
                </div>`;
            starterContainer.querySelectorAll('[data-starter-id]').forEach((btn) => {
                btn.onclick = () => onChooseStarter(btn.dataset.starterId);
            });
        } else {
            starterContainer.classList.add('u-hidden');
            companionContainer.classList.remove('u-hidden');

            const nextOptions = evolution.nextOptions || [];
            const prestigeClass = evolution.prestigeTier ? ` ${evolution.prestigeTier.className}` : '';

            let nextHtml;
            if (nextOptions.length > 0) {
                nextHtml = `
                    <div class="profile-customize-evolve-title">
                        ${nextOptions.length > 1 ? 'Ton compagnon peut évoluer, choisis sa branche !' : 'Ton compagnon peut évoluer !'}
                    </div>
                    <div class="profile-customize-evolve-options">
                        ${nextOptions.map((opt) => `
                            <button type="button" class="profile-customize-evolve-option" data-evolve-id="${this._escapeText(opt.id)}">
                                <span class="profile-customize-evolve-emoji">${opt.emoji}</span>
                                <span class="profile-customize-evolve-label">${this._escapeText(opt.label)}</span>
                            </button>
                        `).join('')}
                    </div>`;
            } else if (evolution.isFinalStage) {
                const tierLabel = evolution.prestigeTier
                    ? `Niveau de prestige actuel : ${this._escapeText(evolution.prestigeTier.label)} !`
                    : "Ton compagnon a atteint son stade final.";
                const nextTierText = evolution.nextPrestigeTier
                    ? `Encore ${evolution.nextPrestigeTier.requires - evolution.totalStars} ★ pour débloquer « ${this._escapeText(evolution.nextPrestigeTier.label)} ».`
                    : "Il a atteint le plus haut niveau de prestige !";
                nextHtml = `<p class="profile-customize-evolve-locked">${tierLabel}<br>${nextTierText}</p>`;
            } else {
                nextHtml = `<p class="profile-customize-evolve-locked">Continue à gagner des étoiles pour faire évoluer ton compagnon !</p>`;
            }

            companionContainer.innerHTML = `
                <div class="profile-customize-companion-current${prestigeClass}">
                    <span class="profile-customize-companion-emoji">${evolution.emoji}</span>
                    <span class="profile-customize-companion-label">${this._escapeText(evolution.label)}</span>
                </div>
                ${nextHtml}
            `;
            companionContainer.querySelectorAll('[data-evolve-id]').forEach((btn) => {
                btn.onclick = () => onEvolve(btn.dataset.evolveId);
            });
        }

        const renderAccents = () => {
            accentContainer.innerHTML = '';
            accents.forEach((accent) => {
                const unlocked = accent.unlocked !== false;
                const btn = document.createElement('button');
                btn.type = 'button';
                btn.className = `profile-customize-accent${accent.id === selectedAccent ? ' is-selected' : ''}${unlocked ? '' : ' is-locked'}`;
                btn.style.backgroundColor = unlocked ? accent.color : '#cbd5e1';
                btn.setAttribute('aria-label', unlocked ? accent.label : `${accent.label} verrouillé, débloqué à ${accent.unlockAt} étoiles`);
                btn.setAttribute('aria-pressed', accent.id === selectedAccent ? 'true' : 'false');
                btn.setAttribute('aria-disabled', unlocked ? 'false' : 'true');
                btn.innerHTML = unlocked ? '' : `<span class="profile-customize-lock-icon">🔒</span>`;
                btn.onclick = () => {
                    if (!unlocked) return;
                    selectedAccent = accent.id;
                    onChangeAccent(selectedAccent);
                    renderAccents();
                };
                accentContainer.appendChild(btn);
            });
        };

        renderAccents();

        // Accessoires débloqués par des badges précis
        const accessoryContainer = document.getElementById('profile-customize-accessories');
        if (accessoryContainer && Array.isArray(accessories)) {
            let selectedAccessory = current.accessory || null;
            const renderAccessories = () => {
                accessoryContainer.innerHTML = '';
                const noneBtn = document.createElement('button');
                noneBtn.type = 'button';
                noneBtn.className = `profile-customize-accessory${selectedAccessory === null ? ' is-selected' : ''}`;
                noneBtn.textContent = '∅';
                noneBtn.setAttribute('aria-label', 'Aucun accessoire');
                noneBtn.setAttribute('aria-pressed', selectedAccessory === null ? 'true' : 'false');
                noneBtn.onclick = () => {
                    selectedAccessory = null;
                    if (typeof onChangeAccessory === 'function') onChangeAccessory(null);
                    renderAccessories();
                };
                accessoryContainer.appendChild(noneBtn);

                accessories.forEach((acc) => {
                    const btn = document.createElement('button');
                    btn.type = 'button';
                    btn.className = `profile-customize-accessory${acc.id === selectedAccessory ? ' is-selected' : ''}${acc.unlocked ? '' : ' is-locked'}`;
                    btn.textContent = acc.unlocked ? acc.emoji : '🔒';
                    btn.setAttribute('aria-label', acc.unlocked
                        ? acc.label
                        : `${acc.label} verrouillé — gagne le badge « ${acc.badgeLabel} »`);
                    btn.setAttribute('aria-pressed', acc.id === selectedAccessory ? 'true' : 'false');
                    btn.setAttribute('aria-disabled', acc.unlocked ? 'false' : 'true');
                    btn.title = acc.unlocked ? acc.label : `Débloqué par le badge « ${acc.badgeLabel} »`;
                    btn.onclick = () => {
                        if (!acc.unlocked) return;
                        selectedAccessory = acc.id;
                        if (typeof onChangeAccessory === 'function') onChangeAccessory(acc.id);
                        renderAccessories();
                    };
                    accessoryContainer.appendChild(btn);
                });
            };
            renderAccessories();
        }

        // Avatar-carte : une carte du Grimoire remplace le compagnon comme
        // avatar. Seules les cartes possédées sont proposées.
        const cardAvatarContainer = document.getElementById('profile-customize-card-avatar');
        if (cardAvatarContainer) {
            let selectedCard = current.cardAvatar || null;
            const choices = Array.isArray(cardChoices) ? cardChoices : [];
            const renderCardChoices = () => {
                cardAvatarContainer.innerHTML = '';
                if (!choices.length) {
                    const hint = document.createElement('p');
                    hint.className = 'profile-customize-card-hint';
                    hint.textContent = 'Ouvre des boosters dans le Grimoire pour débloquer des cartes à utiliser en avatar !';
                    cardAvatarContainer.appendChild(hint);
                    return;
                }
                const noneBtn = document.createElement('button');
                noneBtn.type = 'button';
                noneBtn.className = `profile-customize-card-choice profile-customize-card-choice--none${selectedCard === null ? ' is-selected' : ''}`;
                noneBtn.innerHTML = `<span class="profile-customize-card-none-emoji">${evolution?.emoji || '🐣'}</span>`;
                noneBtn.setAttribute('aria-label', 'Mon compagnon comme avatar');
                noneBtn.setAttribute('aria-pressed', selectedCard === null ? 'true' : 'false');
                noneBtn.title = 'Mon compagnon';
                noneBtn.onclick = () => {
                    selectedCard = null;
                    if (typeof onChangeCardAvatar === 'function') onChangeCardAvatar(null);
                    renderCardChoices();
                };
                cardAvatarContainer.appendChild(noneBtn);

                choices.forEach((card) => {
                    const btn = document.createElement('button');
                    btn.type = 'button';
                    btn.className = `profile-customize-card-choice rarity-${this._escapeText(card.rarity || 'commune')}${card.id === selectedCard ? ' is-selected' : ''}`;
                    btn.innerHTML = `<img class="profile-customize-card-img" src="${this._escapeText(card.image)}" alt="" loading="lazy">`;
                    btn.setAttribute('aria-label', `${card.name} comme avatar`);
                    btn.setAttribute('aria-pressed', card.id === selectedCard ? 'true' : 'false');
                    btn.title = card.name;
                    btn.onclick = () => {
                        selectedCard = card.id;
                        if (typeof onChangeCardAvatar === 'function') onChangeCardAvatar(card.id);
                        renderCardChoices();
                    };
                    cardAvatarContainer.appendChild(btn);
                });
            };
            renderCardChoices();
        }

        const doneBtn = document.getElementById('btn-profile-customize-done');
        if (doneBtn) doneBtn.onclick = () => onDone();
    },

    renderMenu(id, data, callback) {
        const container = document.getElementById(id);
        if (!container) return;
        container.innerHTML = "";
        const menuVariant = (id || '').replace('-list', '');
        const menuKicker = menuVariant === 'grades'
            ? 'Classe'
            : menuVariant === 'themes'
                ? 'Matière'
                : menuVariant === 'library'
                    ? 'Leçon'
                : menuVariant === 'levels'
                    ? 'Sous-thème'
                    : menuVariant === 'exercises'
                        ? 'À faire'
                        : '';

        (data || []).forEach(item => {
            if (item?.kind === 'section') {
                const section = document.createElement('div');
                section.className = 'menu-section';
                const safeSectionTitle = this._escapeText(item.title || 'Section');
                const safeSectionSubtitle = item.subtitle ? this._escapeText(item.subtitle) : '';
                section.innerHTML = `
                    <div class="menu-section-title">${safeSectionTitle}</div>
                    ${safeSectionSubtitle ? `<div class="menu-section-subtitle">${safeSectionSubtitle}</div>` : ''}
                `;
                container.appendChild(section);
                return;
            }

            // Accès sécurisé au Storage
            let stars = 0;
            let needsReview = false;
            try {
                if (typeof Storage !== 'undefined' && Storage.getRecord) {
                    const gradeId = window.App?.state?.currentGrade?.gradeId || null;
                    const record = Storage.getRecord(item.id, gradeId);
                    if (record) {
                        stars = record.stars || 0;
                        needsReview = typeof record.lastPercent === 'number' && record.lastPercent < 50;
                    }
                }
        } catch (e) { console.warn("UI: Erreur de lecture des étoiles", e); }

            const isLockedBonus = item.isBonus && !item.bonusUnlocked;
            const starsHtml = (stars > 0 && !isLockedBonus) ? `<div class="menu-stars">${'★'.repeat(stars)}</div>` : "";
            const reviewBadgeHtml = (menuVariant === 'exercises' && needsReview && !isLockedBonus)
                ? `<div class="menu-badge menu-badge--review">À revoir</div>`
                : "";
            const bonusBadgeHtml = item.isBonus
                ? `<div class="menu-badge ${isLockedBonus ? 'menu-badge--bonus-locked' : 'menu-badge--bonus'}">${isLockedBonus ? '🔒 Bonus' : '✨ Bonus'}</div>`
                : "";
            const badgeHtml = bonusBadgeHtml || (item.kind === 'lesson'
                ? `<div class="menu-badge menu-badge--lesson">Leçon</div>`
                : menuVariant === 'exercises'
                    ? `<div class="menu-badge menu-badge--exercise">Exercice</div>`
                    : "");

            const itemTitle = isLockedBonus ? 'Exercice bonus' : (item.title || item.nom || 'Exercice');
            const itemSubtitle = isLockedBonus ? 'Termine les autres exercices pour le débloquer' : item.subtitle;
            const ariaParts = [itemTitle];
            if (itemSubtitle) ariaParts.push(itemSubtitle);
            if (stars > 0 && !isLockedBonus) ariaParts.push(`${stars} étoile${stars > 1 ? 's' : ''} sur 3`);
            if (needsReview && !isLockedBonus) ariaParts.push('à revoir');
            if (isLockedBonus) ariaParts.push('verrouillé');

            const card = document.createElement('button');
            card.type = 'button';
            card.className = `card menu-card menu-card--${menuVariant}${isLockedBonus ? ' is-locked-bonus' : ''}${item.isBonus && !isLockedBonus ? ' is-bonus' : ''}`;
            card.setAttribute('aria-label', ariaParts.join(', '));
            if (isLockedBonus) card.setAttribute('aria-disabled', 'true');
            card.innerHTML = `
                <span class="card-icon" aria-hidden="true">${isLockedBonus ? '🔒' : this.safeIcon(this.resolveMenuIcon(item, menuVariant), '\u{1F4DD}')}</span>
                ${menuKicker && !isLockedBonus ? `<span class="menu-card-kicker">${menuKicker}</span>` : ''}
                ${this.buildCardContent(itemTitle, itemSubtitle)}
                <div class="menu-card-footer">
                    ${reviewBadgeHtml}
                    ${badgeHtml}
                    ${starsHtml}
                </div>`;
            card.onclick = () => { if (!isLockedBonus) callback(item); };
            container.appendChild(card);
        });
    },

    renderProgressScreen(stats, onSelectExercise) {
        const summary = document.getElementById('progress-summary');
        const list = document.getElementById('progress-list');
        if (!summary || !list) return;

        const totalPercent = stats.maxStars > 0 ? Math.round((stats.totalStars / stats.maxStars) * 100) : 0;
        const streakHtml = stats.streak && stats.streak.current > 0
            ? `<div class="progress-streak">🔥 <strong>${stats.streak.current}</strong> jour${stats.streak.current > 1 ? 's' : ''} de suite</div>`
            : '';
        const badgesHtml = Array.isArray(stats.badges) && stats.badges.length
            ? `<div class="progress-badges">${stats.badges.map((b) => `
                <div class="progress-badge ${b.unlocked ? 'is-unlocked' : 'is-locked'}" title="${this._escapeText(b.label)}">
                    <span class="progress-badge-icon">${b.icon}</span>
                </div>`).join('')}</div>`
            : '';
        // "Mes exploits" : records personnels, toutes classes confondues
        let featsHtml = '';
        const feats = stats.feats;
        if (feats) {
            const rows = [
                feats.bestStreak > 0 ? { icon: '🔥', label: 'Ma plus longue série', value: `${feats.bestStreak} jour${feats.bestStreak > 1 ? 's' : ''}` } : null,
                feats.totalStarsAllGrades > 0 ? { icon: '⭐', label: 'Mes étoiles', value: `${feats.totalStarsAllGrades}` } : null,
                feats.perfectCount > 0 ? { icon: '🏆', label: 'Mes sans-faute', value: `${feats.perfectCount}` } : null,
                feats.redemptions > 0 ? { icon: '🎯', label: 'Mes rattrapages', value: `${feats.redemptions}` } : null,
                feats.bestChampion > 0 ? { icon: '⚡', label: 'Record Champions', value: `${feats.bestChampion} pts` } : null,
                { icon: '🏅', label: 'Mes badges', value: `${feats.badgesUnlocked}/${feats.badgesTotal}` }
            ].filter(Boolean);
            featsHtml = `
                <div class="progress-feats">
                    <div class="progress-feats-title">Mes exploits</div>
                    <div class="progress-feats-grid">
                        ${rows.map((r) => `
                            <div class="progress-feat">
                                <span class="progress-feat-icon" aria-hidden="true">${r.icon}</span>
                                <span class="progress-feat-value">${this._escapeText(r.value)}</span>
                                <span class="progress-feat-label">${this._escapeText(r.label)}</span>
                            </div>
                        `).join('')}
                    </div>
                </div>`;
        }

        summary.innerHTML = `
            <div class="progress-summary-card">
                ${streakHtml}
                <div class="progress-summary-stars">${'★'.repeat(Math.round(totalPercent / 100 * 3))}${'☆'.repeat(3 - Math.round(totalPercent / 100 * 3))}</div>
                <div class="progress-summary-text">
                    <strong>${stats.totalDone}/${stats.totalExercises}</strong> exercices commencés
                </div>
                <div class="progress-bar-track">
                    <div class="progress-bar-fill" style="width: ${totalPercent}%"></div>
                </div>
                ${featsHtml}
                ${badgesHtml}
            </div>`;

        list.innerHTML = "";
        if (!stats.subjects.length) {
            list.innerHTML = `<p class="screen-lead">Pas encore d'exercice dans cette classe.</p>`;
            return;
        }

        if (Array.isArray(stats.toReview) && stats.toReview.length > 0) {
            const reviewSection = document.createElement('div');
            reviewSection.className = 'progress-review-section';
            reviewSection.innerHTML = `<div class="progress-review-title">À revoir en priorité</div>`;
            const reviewList = document.createElement('div');
            reviewList.className = 'progress-review-list';
            stats.toReview.forEach((entry) => {
                const item = document.createElement('button');
                item.type = 'button';
                item.className = 'progress-review-item';
                item.setAttribute('aria-label', `Revoir ${entry.title}, ${entry.percent}% de réussite`);
                item.innerHTML = `
                    <span class="progress-review-item-title">${this._escapeText(entry.title)}</span>
                    <span class="progress-review-item-meta">${this._escapeText(entry.subjectTitle)}${entry.subthemeTitle ? ' · ' + this._escapeText(entry.subthemeTitle) : ''}</span>
                    <span class="progress-review-item-score">${entry.percent}%</span>`;
                item.addEventListener('click', () => onSelectExercise && onSelectExercise(entry.exercise.id));
                reviewList.appendChild(item);
            });
            reviewSection.appendChild(reviewList);
            list.appendChild(reviewSection);
        }

        stats.subjects.forEach((subject) => {
            const percent = subject.maxStars > 0 ? Math.round((subject.stars / subject.maxStars) * 100) : 0;
            const row = document.createElement('div');
            row.className = 'progress-subject-row';

            const detailId = `progress-detail-${subject.id || Math.random().toString(36).slice(2)}`;
            const header = document.createElement('button');
            header.type = 'button';
            header.className = 'progress-subject-header';
            header.setAttribute('aria-expanded', 'false');
            header.setAttribute('aria-controls', detailId);
            header.setAttribute('aria-label', `${subject.title}, ${subject.done} sur ${subject.exercises} exercices, ${subject.stars} sur ${subject.maxStars} étoiles`);
            header.innerHTML = `
                <span class="progress-subject-icon" aria-hidden="true">${this.safeIcon(subject.icon, '📘')}</span>
                <span class="progress-subject-body">
                    <span class="progress-subject-title">${this._escapeText(subject.title)}</span>
                    <span class="progress-subject-detail">${subject.done}/${subject.exercises} exercices · ${subject.stars}/${subject.maxStars} ★</span>
                    <div class="progress-bar-track">
                        <div class="progress-bar-fill" style="width: ${percent}%"></div>
                    </div>
                </span>
                <span class="progress-subject-chevron" aria-hidden="true">▾</span>`;

            const detail = document.createElement('div');
            detail.id = detailId;
            detail.className = 'progress-subtheme-list is-collapsed';
            (subject.subthemes || []).forEach((subtheme) => {
                const subPercent = subtheme.maxStars > 0 ? Math.round((subtheme.stars / subtheme.maxStars) * 100) : 0;
                const subRow = document.createElement('div');
                subRow.className = 'progress-subtheme-row';
                subRow.innerHTML = `
                    <span class="progress-subtheme-title">${this._escapeText(subtheme.title)}</span>
                    <span class="progress-subtheme-detail">${subtheme.done}/${subtheme.exercises} · ${subtheme.stars}/${subtheme.maxStars} ★</span>
                    <div class="progress-bar-track progress-bar-track--small">
                        <div class="progress-bar-fill" style="width: ${subPercent}%"></div>
                    </div>`;
                detail.appendChild(subRow);
            });

            header.addEventListener('click', () => {
                const isExpanded = !detail.classList.toggle('is-collapsed');
                header.classList.toggle('is-expanded', isExpanded);
                header.setAttribute('aria-expanded', isExpanded ? 'true' : 'false');
            });

            row.appendChild(header);
            row.appendChild(detail);
            list.appendChild(row);
        });
    },

    _escapeText(value) {
        if (window.SecurityUtils?.escapeHtml) return window.SecurityUtils.escapeHtml(value);
        return (value ?? "").toString()
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    },

    renderBrowseModes(data, callback, containerId = 'mode-list') {
        const container = document.getElementById(containerId);
        if (!container) return;
        container.innerHTML = "";

        (data || []).forEach((item) => {
            const card = document.createElement('button');
            card.type = 'button';
            card.className = `mode-card mode-card--${item.mode || 'default'}`;
            const safeModeTitle = this._escapeText(item.title || 'Parcours');
            const safeModeSubtitle = item.subtitle ? this._escapeText(item.subtitle) : '';
            const safeModeHelper = item.helper ? this._escapeText(item.helper) : '';
            card.innerHTML = `
                <span class="mode-card-icon">${this.safeIcon(item.icon, '📘')}</span>
                <span class="mode-card-body">
                    <span class="mode-card-title">${safeModeTitle}</span>
                    ${safeModeSubtitle ? `<span class="mode-card-subtitle">${safeModeSubtitle}</span>` : ''}
                    ${safeModeHelper ? `<span class="mode-card-helper">${safeModeHelper}</span>` : ''}
                </span>
                <span class="mode-card-arrow">→</span>
            `;
            card.onclick = () => callback(item);
            container.appendChild(card);
        });
    },

    renderLesson(lesson, onContinue, context = {}) {
        const container = document.getElementById('lesson-view');
        const btn = document.getElementById('btn-lesson-exercises');
        const btnLabel = document.getElementById('btn-lesson-exercises-label');
        if (!container) return;

        const allBlocks = Array.isArray(lesson?.blocks) ? lesson.blocks : [];
        // Les blocs `check` sont extraits du corps : ils forment le quiz
        // d'ancrage rendu en fin de leçon, pas un repère de lecture.
        const safeBlocks = allBlocks.filter((block) => block?.type !== 'check');
        const checkBlocks = allBlocks.filter((block) => block?.type === 'check');
        const safeLessons = Array.isArray(context?.lessons) ? context.lessons : [];
        const blocksHtml = safeBlocks.map((block) => this.renderLessonBlock(block)).join('');
        const alreadyCompleted = context?.alreadyCompleted === true;
        const exerciseCount = Number.isFinite(context?.exerciseCount) ? context.exerciseCount : 0;
        const themeTitle = this._escapeText(context?.themeTitle || '');
        const subjectTitle = this._escapeText(context?.subjectTitle || '');
        const blockCount = safeBlocks.length;
        const chips = [
            themeTitle ? `<span class="lesson-chip">${themeTitle}</span>` : '',
            subjectTitle ? `<span class="lesson-chip">${subjectTitle}</span>` : '',
            blockCount > 0 ? `<span class="lesson-chip">${blockCount} repère${blockCount > 1 ? 's' : ''}</span>` : '',
            exerciseCount > 0 ? `<span class="lesson-chip lesson-chip--accent">${exerciseCount} exercice${exerciseCount > 1 ? 's' : ''}</span>` : ''
        ].filter(Boolean).join('');
        const summaryText = this._escapeText(context?.summaryText || (exerciseCount > 0
            ? `Lis la notion, observe les exemples, puis enchaîne sur ${exerciseCount} exercice${exerciseCount > 1 ? 's' : ''}.`
            : `Lis la notion puis reviens au sous-thème pour continuer.`));
        const outlineHtml = safeLessons.length > 1 ? `
            <section class="lesson-outline">
                <div class="lesson-outline-head">
                    <div class="lesson-block-label">Dans ce sous-thème</div>
                    <div class="lesson-outline-count">${safeLessons.length} leçons</div>
                </div>
                <div class="lesson-outline-list">
                    ${safeLessons.map((item, index) => `
                        <button
                            type="button"
                            class="lesson-outline-item${item.id === lesson?.id ? ' is-active' : ''}"
                            data-lesson-id="${this._escapeText(item.id)}"
                        >
                            <span class="lesson-outline-index">${index + 1}</span>
                            <span class="lesson-outline-content">
                                <span class="lesson-outline-title">${this._escapeText(item.title || 'Leçon')}</span>
                                ${item.subtitle ? `<span class="lesson-outline-subtitle">${this._escapeText(item.subtitle)}</span>` : ''}
                            </span>
                        </button>
                    `).join('')}
                </div>
            </section>
        ` : '';

        container.innerHTML = `
            <article class="lesson-card">
                <header class="lesson-card-header">
                    <div class="lesson-eyebrow">Leçon</div>
                    <h3 class="lesson-card-title">${this._escapeText(lesson?.title || 'Leçon')}</h3>
                    ${lesson?.subtitle ? `<p class="lesson-card-subtitle">${this._escapeText(lesson.subtitle)}</p>` : ''}
                    ${chips ? `<div class="lesson-chips">${chips}</div>` : ''}
                </header>
                ${outlineHtml}
                <section class="lesson-summary">
                    <div class="lesson-summary-icon">🧭</div>
                    <p class="lesson-summary-text">${summaryText}</p>
                </section>
                <div class="lesson-card-body">${blocksHtml}</div>
                ${this.renderLessonCheck(checkBlocks, alreadyCompleted)}
            </article>
        `;

        this._bindLessonCheck(container, checkBlocks, {
            alreadyCompleted,
            onCompleted: context?.onLessonCompleted,
            onReady: () => this._setLessonCtaState(btn, btnLabel, context, true, checkBlocks.length)
        });

        // Le CTA est verrouillé tant que le quiz d'ancrage n'est pas réussi.
        // Sans quiz (ou déjà comprise), il est actif d'emblée : les leçons
        // historiques ne doivent pas devenir des impasses.
        const ctaUnlocked = checkBlocks.length === 0 || alreadyCompleted;
        this._setLessonCtaState(btn, btnLabel, context, ctaUnlocked, checkBlocks.length);
        if (btn) {
            btn.onclick = () => {
                if (btn.disabled) return;
                onContinue?.();
            };
            btn.style.display = 'inline-flex';
        }

        if (typeof context?.onSelectLesson === 'function') {
            container.querySelectorAll('[data-lesson-id]').forEach((node) => {
                node.onclick = () => context.onSelectLesson(node.getAttribute('data-lesson-id'));
            });
        }
    },

    /**
     * État du bouton de fin de leçon. Il n'est JAMAIS un no-op : quand le
     * sous-thème n'a pas d'exercice (ou qu'on vient de la bibliothèque),
     * l'appelant fournit un repli de navigation et le libellé le dit.
     */
    _setLessonCtaState(btn, btnLabel, context, unlocked, checkCount = 0) {
        if (!btn) return;
        const exerciseCount = Number.isFinite(context?.exerciseCount) ? context.exerciseCount : 0;
        btn.disabled = !unlocked;
        btn.classList.toggle('is-locked', !unlocked);
        if (!btnLabel) return;

        if (!unlocked) {
            btnLabel.textContent = checkCount === 1
                ? 'RÉPONDS À LA QUESTION'
                : `RÉPONDS AUX ${checkCount} QUESTIONS`;
            return;
        }
        btnLabel.textContent = context?.ctaLabel
            || (exerciseCount > 0 ? "JE M'ENTRAÎNE" : 'CONTINUER');
    },

    /**
     * Quiz d'ancrage : QCM court en fin de leçon. Volontairement hors du
     * pipeline des moteurs — il ne crée aucun record, donc ne fausse ni les
     * étoiles ni les badges de maîtrise. Re-tentable sans pénalité : le but
     * est de comprendre, pas de sanctionner.
     */
    renderLessonCheck(checkBlocks, alreadyCompleted) {
        if (!Array.isArray(checkBlocks) || checkBlocks.length === 0) return '';
        const esc = (v) => SecurityUtils.escapeHtml(v);

        // Les `choices` sont écrits dans les JSON avec la bonne réponse en tête :
        // sans ce mélange, l'enfant apprend la position au lieu de la leçon.
        // La validation compare la VALEUR (`value === block.answer`), jamais
        // l'index : mélanger l'affichage est donc sans effet de bord.
        const shuffled = (list) => {
            const out = list.slice();
            for (let i = out.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [out[i], out[j]] = [out[j], out[i]];
            }
            return out;
        };

        const questionsHtml = checkBlocks.map((block, index) => {
            const choices = shuffled(Array.isArray(block.choices) ? block.choices : []);
            return `
                <div class="lesson-check-item" data-check-index="${index}">
                    <p class="lesson-check-question">
                        <span class="lesson-check-number">${index + 1}</span>
                        ${esc(block.question || '')}
                    </p>
                    <div class="lesson-check-choices" role="group">
                        ${choices.map((choice) => `
                            <button
                                type="button"
                                class="lesson-check-choice"
                                data-check-index="${index}"
                                data-choice="${SecurityUtils.escapeAttr(choice)}"
                            >${esc(choice)}</button>
                        `).join('')}
                    </div>
                    <p class="lesson-check-explanation" data-explanation-for="${index}" hidden>${esc(block.explanation || '')}</p>
                </div>
            `;
        }).join('');

        return `
            <section class="lesson-check${alreadyCompleted ? ' is-completed' : ''}" aria-label="Vérifie ta compréhension">
                <div class="lesson-check-head">
                    <div class="lesson-check-icon">${alreadyCompleted ? '🧠' : '✅'}</div>
                    <div>
                        <div class="lesson-block-label">${alreadyCompleted ? 'Leçon déjà comprise' : 'As-tu bien compris ?'}</div>
                        <p class="lesson-check-intro">${alreadyCompleted
                            ? 'Tu peux refaire le quiz pour réviser, autant de fois que tu veux.'
                            : `Réponds aux ${checkBlocks.length} questions pour valider la leçon.`}</p>
                    </div>
                </div>
                ${questionsHtml}
                <p class="lesson-check-feedback" data-check-feedback hidden></p>
            </section>
        `;
    },

    _bindLessonCheck(container, checkBlocks, options = {}) {
        if (!container || !Array.isArray(checkBlocks) || checkBlocks.length === 0) return;

        const answers = new Array(checkBlocks.length).fill(null);
        const feedback = container.querySelector('[data-check-feedback]');
        let settled = options.alreadyCompleted === true;

        const evaluate = () => {
            if (answers.some((value) => value === null)) return;

            const correctCount = answers.filter((value, index) => value === checkBlocks[index].answer).length;
            const allCorrect = correctCount === checkBlocks.length;

            if (feedback) {
                feedback.hidden = false;
                feedback.classList.toggle('is-success', allCorrect);
                feedback.classList.toggle('is-retry', !allCorrect);
                feedback.textContent = allCorrect
                    ? 'Bravo, tu as tout compris !'
                    : `${correctCount} bonne${correctCount > 1 ? 's' : ''} réponse${correctCount > 1 ? 's' : ''} sur ${checkBlocks.length}. Relis la leçon et réessaie : tu peux recommencer.`;
            }

            if (!allCorrect) return;
            options.onReady?.();
            // one-shot côté UI : la récompense est de toute façon protégée
            // côté Storage par completeLessonView (justCompleted).
            if (settled) return;
            settled = true;
            options.onCompleted?.({ score: correctCount, total: checkBlocks.length });
        };

        container.querySelectorAll('.lesson-check-choice').forEach((node) => {
            node.onclick = () => {
                const index = Number(node.getAttribute('data-check-index'));
                const block = checkBlocks[index];
                if (!block) return;

                const choice = node.getAttribute('data-choice');
                const isCorrect = choice === block.answer;
                answers[index] = choice;

                const group = node.parentElement;
                group?.querySelectorAll('.lesson-check-choice').forEach((sibling) => {
                    sibling.classList.remove('is-selected', 'is-correct', 'is-wrong');
                });
                node.classList.add('is-selected', isCorrect ? 'is-correct' : 'is-wrong');

                const explanation = container.querySelector(`[data-explanation-for="${index}"]`);
                if (explanation && explanation.textContent.trim()) explanation.hidden = false;

                // AudioFeedback gère lui-même la préférence 'sound_muted'.
                if (window.AudioFeedback) {
                    if (isCorrect) AudioFeedback.playCorrect();
                    else AudioFeedback.playIncorrect();
                }

                evaluate();
            };
        });
    },

    renderLessonBlock(block) {
        if (!block || typeof block !== 'object') return '';
        const esc = (v) => SecurityUtils.escapeHtml(v);

        if (block.type === 'paragraph') {
            return `<p class="lesson-block lesson-block--paragraph">${esc(block.text || '')}</p>`;
        }

        if (block.type === 'example') {
            return `
                <section class="lesson-block lesson-block--example">
                    <div class="lesson-block-label">${esc(block.label || 'Exemple')}</div>
                    <div class="lesson-block-content">${esc(block.content || '')}</div>
                </section>
            `;
        }

        if (block.type === 'tip') {
            return `
                <section class="lesson-block lesson-block--tip">
                    <div class="lesson-block-label">${esc(block.label || 'À retenir')}</div>
                    <div class="lesson-block-content">${esc(block.content || '')}</div>
                </section>
            `;
        }

        if (block.type === 'bullets') {
            const items = Array.isArray(block.items) ? block.items : [];
            return `
                <section class="lesson-block lesson-block--bullets">
                    ${block.label ? `<div class="lesson-block-label">${esc(block.label)}</div>` : ''}
                    <ul class="lesson-bullets">${items.map((item) => `<li>${esc(item)}</li>`).join('')}</ul>
                </section>
            `;
        }

        if (block.type === 'mini-table') {
            const headers = Array.isArray(block.headers) ? block.headers : [];
            const rows = Array.isArray(block.rows) ? block.rows : [];
            return `
                <section class="lesson-block lesson-block--mini-table">
                    ${block.label ? `<div class="lesson-block-label">${esc(block.label)}</div>` : ''}
                    <div class="lesson-table-wrap">
                        <table class="lesson-mini-table">
                            <thead>
                                <tr>${headers.map((header) => `<th>${esc(header)}</th>`).join('')}</tr>
                            </thead>
                            <tbody>
                                ${rows.map((row) => `<tr>${row.map((cell) => `<td>${esc(cell)}</td>`).join('')}</tr>`).join('')}
                            </tbody>
                        </table>
                    </div>
                </section>
            `;
        }

        return '';
    },

    // --- NAVIGATION & CLAVIERS ---

    initNavigation() {
        this.initNavSheet();
        if (this.btnHome) {
            this.btnHome.onclick = () => {
                if (window.App?.openNavMenu) window.App.openNavMenu();
                else if (window.App?.goHome) window.App.goHome();
                else this.showScreen('screen-profiles');
            };
        }
        
        if (this.btnBack) {
            this.btnBack.onclick = () => {
                if (window.App?.goBack) window.App.goBack();
                else this.showScreen('screen-profiles');
            };
        }
    },

    initKeyboard(...args) {
        return UIKeyboards.initKeyboard(...args);
    },

    updateKeyboardLayout(...args) {
        return UIKeyboards.updateKeyboardLayout(...args);
    },

    restoreNumericKeyboard(...args) {
        return UIKeyboards.restoreNumericKeyboard(...args);
    },

    renderAlphaKeyboard(...args) {
        return UIKeyboards.renderAlphaKeyboard(...args);
    },

    renderRomanKeyboard(...args) {
        return UIKeyboards.renderRomanKeyboard(...args);
    },

    renderQCM(...args) {
        return UIKeyboards.renderQCM(...args);
    },

    // --- MOTEUR D'AFFICHAGE (Le Cœur) ---

    getExerciseSurfaceClass(p, isQCM) {
        if (!p) return 'exercise-surface exercise-surface--formula';
        if (!p.isVisual) return 'exercise-surface exercise-surface--formula';
        if (p.visualType === 'factualCard') return 'exercise-surface exercise-surface--documentary';
        if (['spelling', 'audioSpelling', 'conjugation', 'reading', 'homophones'].includes(p.visualType)) {
            return 'exercise-surface exercise-surface--language';
        }
        if (p.visualType === 'matching' || p.visualType === 'wordOrder') return 'exercise-surface exercise-surface--choice';
        if (isQCM) return 'exercise-surface exercise-surface--choice';
        return 'exercise-surface exercise-surface--diagram';
    },

    wrapExerciseContent(content, surfaceClass) {
        const shellClasses = ['exercise-shell'];
        if ((surfaceClass || '').includes('exercise-surface--documentary')) shellClasses.push('exercise-shell--documentary');
        else if ((surfaceClass || '').includes('exercise-surface--language')) shellClasses.push('exercise-shell--language');
        else if ((surfaceClass || '').includes('exercise-surface--choice')) shellClasses.push('exercise-shell--choice');
        else if ((surfaceClass || '').includes('exercise-surface--diagram')) shellClasses.push('exercise-shell--diagram');
        else shellClasses.push('exercise-shell--formula');
        return `<div class="${shellClasses.join(' ')}"><div class="${surfaceClass}">${content}</div></div>`;
    },

	updateGameDisplay(p, rawInput, prog) {
	    const problemZone = document.getElementById('math-problem');
	    const answerZone = document.getElementById('user-answer');
	    const instructionZone = document.getElementById('game-instruction');
        const gameScreen = document.getElementById('screen-game');
	    
	    if (!problemZone || !answerZone) return;
        if (!p || typeof p !== 'object') {
            problemZone.innerHTML = this.wrapExerciseContent(
                `<div class="error-msg">Exercice indisponible.</div>`,
                'exercise-surface exercise-surface--formula'
            );
            answerZone.className = 'answer-display is-hidden';
            answerZone.innerHTML = "";
            if (instructionZone) {
                instructionZone.innerHTML = "";
                instructionZone.style.display = 'none';
            }
            return;
        }

	    // 1. Nettoyage et Consigne
	    const input = (rawInput === undefined || rawInput === null) ? "" : rawInput.toString();
	    problemZone.innerHTML = "";
	    answerZone.innerHTML = "";
        if (gameScreen) {
            gameScreen.classList.remove('compact-number-spelling-long', 'compact-number-spelling-huge');
        }
    
    // Détection du mode QCM (Boutons au lieu de saisie clavier)
    const isQCM = (p.inputType === 'qcm' || p.inputType === 'boolean');
    const rendersQuestionInProblemZone = !p.isVisual || ['homophones', 'timeMemo'].includes(p.visualType);

    if (instructionZone) {
        instructionZone.innerHTML = rendersQuestionInProblemZone ? "" : (p.question || "");
        instructionZone.style.display = (!rendersQuestionInProblemZone && p.question) ? 'block' : 'none';
    }

    // 2. VISUEL PRINCIPAL
    try {
        let renderedContent = "";
        if (p.isVisual) {
            // Cas particulier : Homophones (on garde ta logique de style)
            if (p.visualType === 'homophones') {
                renderedContent = `<div class="text-sentence prompt-card prompt-card--sentence">${p.question || ""}</div>`;
            } 
            // Dispatcher vers les moteurs de dessin
            else {
                    const drawMethods = { 
                    clock:'drawClockCard', spelling:'drawSpelling', audioSpelling:'drawAudioSpelling', conjugation:'drawConjugation', 
                    target:'drawSvgTarget', money:'drawMoneyCard', bird:'drawBird', division:'drawDivisionCard',
                    square:'drawSquare', reading: 'drawReading', counting: 'drawCountingCard', fraction: 'drawFraction',
                    conversionTable: 'drawConversionCard', timeMemo: 'drawTimeMemoCard', factualCard: 'drawFactualCard',
                    timelineOrder: 'drawTimelineOrder', timelinePlace: 'drawTimelinePlace', matching: 'drawMatching',
                    wordOrder: 'drawWordOrder', 'geometry-board': 'drawGeometryBoard', barChart: 'drawBarChart',
                    dataTable: 'drawDataTable', pieChart: 'drawPieChart'
                };
                const method = drawMethods[p.visualType];
                
                if (this[method]) {
                    // On envoie le flag isQCM pour que drawSpelling affiche le mot complet
                    renderedContent = this[method](p, input, isQCM);
                } else {
                    renderedContent = `<div class="error-msg">Moteur de rendu [${p.visualType}] introuvable.</div>`;
                }
            }

            problemZone.innerHTML = this.wrapExerciseContent(
                renderedContent,
                this.getExerciseSurfaceClass(p, isQCM)
            );

            // Ré-attachement des clics pour le Carré Magique (Square)
            if (p.visualType === 'square') {
                const cards = problemZone.querySelectorAll('.number-card');
                cards.forEach(card => {
                    card.onclick = () => {
                        if (window.App && window.App.handleInput) {
                            window.App.handleInput('card-click', card);
                        }
                    };
                });
            }

            // Pan tactile/souris sur les cartes interactives (map-locate) :
            // manipule le viewBox directement en DOM à chaque mouvement plutôt
            // que de repasser par refreshUI (qui re-génère tout le HTML) —
            // sinon un drag continu serait saccadé et très lent.
            if (p.visualType === 'geometry-board' && p.data?.boardKind === 'map-locate') {
                this.bindMapPan(problemZone, p);
            }
        } else {
            // Mode texte (Calculs simples, Dictée de nombres)
            // p.question contient soit le texte, soit le HTML du gros chiffre (Dictée CP)
            const formulaClasses = ['math-formula', 'prompt-card', 'prompt-card--formula'];
            const questionHtml = p.question || "";
            let compactMode = '';
            if (questionHtml.includes('number-spelling-prompt')) {
                const formulaClassIndex = formulaClasses.indexOf('prompt-card--formula');
                if (formulaClassIndex !== -1) formulaClasses.splice(formulaClassIndex, 1);
                formulaClasses.push('prompt-card--number-spelling');
                if (questionHtml.includes('number-spelling-prompt--huge')) {
                    formulaClasses.push('prompt-card--number-spelling-huge');
                    compactMode = 'compact-number-spelling-huge';
                } else if (questionHtml.includes('number-spelling-prompt--long')) {
                    formulaClasses.push('prompt-card--number-spelling-long');
                    compactMode = 'compact-number-spelling-long';
                }
            }
            if (gameScreen) {
                gameScreen.classList.remove('compact-number-spelling-long', 'compact-number-spelling-huge');
                if (compactMode) gameScreen.classList.add(compactMode);
            }
            renderedContent = `<div class="${formulaClasses.join(' ')}">${questionHtml}</div>`;
            problemZone.innerHTML = this.wrapExerciseContent(
                renderedContent,
                this.getExerciseSurfaceClass(p, isQCM)
            );
        }
    } catch (e) {
        console.error("UI: Erreur lors du rendu du problème", e);
        problemZone.innerHTML = this.wrapExerciseContent(
            `<div class="error-msg">Erreur d'affichage visuel.</div>`,
            'exercise-surface exercise-surface--formula'
        );
    }

	    // 3. ZONE DE RÉPONSE (Barre du bas)
	    // On masque la barre si c'est visuel ET textuel (Spelling/Conjugaison) OU si c'est un QCM
	    const hideBottomBar = (['spelling', 'audioSpelling', 'conjugation', 'matching', 'wordOrder', 'geometry-board', 'division'].includes(p.visualType)) || isQCM;
	    
	    answerZone.style.display = hideBottomBar ? 'none' : 'flex';
	    answerZone.className = `answer-display ${hideBottomBar ? 'is-hidden' : 'is-idle'}`;
    
	    if (!hideBottomBar) {
        try {
            if (p.visualType === 'clock') {
                let s = input.padEnd(4, "_");
                answerZone.innerHTML = `<div class="clock-digit-block">${s.slice(0, 2)}</div><span class="clock-separator">:</span><div class="clock-digit-block">${s.slice(2, 4)}</div>`;
            } else if (p.visualType === 'fraction') {
                answerZone.innerHTML = `
                    <div class="fraction-answer">
                        <span class="fraction-answer-current">${input || "?"}</span>
                        <span class="fraction-answer-separator">/</span>
                        <span>${p.data?.d || "?"}</span>
                    </div>`;
            } else if (p.visualType === 'timelineOrder') {
                const orderSize = (p.data?.currentOrder || []).length;
                answerZone.innerHTML = `Ordre prêt : <b class="selection-answer-value">${orderSize}</b> repères`;
            } else if (p.visualType === 'timelinePlace') {
                answerZone.innerHTML = `Date choisie : <b class="selection-answer-value">${input || "?"}</b>`;
            } else if (p.inputType === "selection") {
                // Cas spécifique pour le Carré Magique si on affiche la somme en bas
                answerZone.innerHTML = `Somme : <b class="selection-answer-value">${input || 0}</b> / ${p.data?.target || "?"}`;
            } else {
                answerZone.innerText = input || "\u00A0";
            }
        } catch (e) {
            answerZone.innerText = input;
        }
    }

	    // 4. BARRE DE PROGRESSION
		    const bar = document.getElementById('game-progress');
		    if (bar) bar.style.width = (prog || 0) + "%";

        if (p.visualType === 'audioSpelling') {
            const replayButton = problemZone.querySelector('[data-action="replay-audio-spelling"]');
            if (replayButton) {
                replayButton.onclick = () => window.App?.replayAudioSpelling?.();
            }
            problemZone.querySelectorAll('[data-action="set-speech-rate"]').forEach((btn) => {
                btn.onclick = () => window.App?.setSpeechRateLevel?.(btn.dataset.speechRateLevel);
            });
        }
		},

    /**
     * Glisser pour déplacer la carte (map-locate) une fois zoomée. Manipule
     * le viewBox du <svg> directement à chaque pointermove (pas de re-render
     * React-like via refreshUI ici : ce serait trop lent pour suivre le
     * doigt). L'état final est persisté dans p.data.computedViewBox à la fin
     * du geste pour que le prochain refreshUI (ex: après clic sur une zone)
     * garde le cadrage choisi par l'enfant.
     */
    bindMapPan(problemZone, p) {
        const svg = problemZone.querySelector('[data-board-map-svg]');
        const panel = problemZone.querySelector('.board-panel--map');
        if (!svg || !panel) return;

        const baseBox = (svg.dataset.baseViewbox || '').split(/\s+/).map(Number);
        if (baseBox.length !== 4 || !baseBox.every(Number.isFinite)) return;

        const getCurrentBox = () => (svg.getAttribute('viewBox') || '').split(/\s+/).map(Number);
        const getScale = (box, rect) => Math.min(rect.width / box[2], rect.height / box[3]);

        // Trois gestes à distinguer sur le même panneau : tap (choisir une
        // zone), glisser à un doigt (pan), pincer à deux doigts (zoom). On
        // suit tous les pointeurs actifs dans une Map ; le geste réel n'est
        // déterminé qu'après un déplacement dépassant un seuil, pour laisser
        // un simple tap déclencher le click natif sur le <path> ciblé (sans
        // ce délai, capturer le pointeur dès pointerdown bloquait tout clic).
        const DRAG_THRESHOLD_PX = 6;
        const activePointers = new Map(); // pointerId -> {x, y}
        let mode = 'idle'; // 'idle' | 'pan' | 'pinch'
        let startPoint = null;
        let lastPoint = null;
        let pinchStartDist = null;
        let pinchStartBox = null;
        let pinchFocus = null;

        const distanceBetween = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);
        const midpoint = (a, b) => ({ x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 });

        // La capture de pointeur n'est prise qu'une fois un vrai geste
        // confirmé (mouvement au-delà du seuil, ou 2e doigt posé) — jamais
        // dès le premier pointerdown. Certains navigateurs mobiles génèrent
        // un click de tap moins fiable une fois le pointeur capturé, même
        // sans mouvement : capturer trop tôt cassait le clic sur une région.
        const capturedPointerIds = new Set();
        const captureAll = () => {
            activePointers.forEach((_, id) => {
                if (!capturedPointerIds.has(id)) {
                    panel.setPointerCapture?.(id);
                    capturedPointerIds.add(id);
                }
            });
        };

        const enterPan = () => {
            mode = 'pan';
            panel.classList.add('is-panning');
            captureAll();
        };

        const enterPinch = () => {
            mode = 'pinch';
            panel.classList.remove('is-panning');
            captureAll();
            const [a, b] = [...activePointers.values()];
            pinchStartDist = distanceBetween(a, b);
            pinchStartBox = getCurrentBox();
            const rect = svg.getBoundingClientRect();
            const mid = midpoint(a, b);
            const scale = getScale(pinchStartBox, rect);
            if (scale) {
                pinchFocus = {
                    x: pinchStartBox[0] + (mid.x - rect.left - (rect.width - pinchStartBox[2] * scale) / 2) / scale,
                    y: pinchStartBox[1] + (mid.y - rect.top - (rect.height - pinchStartBox[3] * scale) / 2) / scale
                };
            } else {
                pinchFocus = null;
            }
        };

        const onPointerDown = (event) => {
            if (event.pointerType === 'mouse' && event.button !== 0) return;
            activePointers.set(event.pointerId, { x: event.clientX, y: event.clientY });

            if (activePointers.size === 1) {
                startPoint = { x: event.clientX, y: event.clientY };
                lastPoint = startPoint;
                mode = 'idle';
            } else if (activePointers.size === 2) {
                // Un 2e doigt qui se pose confirme d'emblée un pincement :
                // pas d'ambiguïté possible avec un simple tap ici.
                enterPinch();
            }
        };

        const onPointerMove = (event) => {
            if (!activePointers.has(event.pointerId)) return;
            activePointers.set(event.pointerId, { x: event.clientX, y: event.clientY });

            if (mode === 'pinch' && activePointers.size >= 2) {
                const [a, b] = [...activePointers.values()];
                const dist = distanceBetween(a, b);
                if (!pinchStartDist || !pinchFocus) return;
                const factor = dist / pinchStartDist;
                const next = UIBoard.zoomViewBox(pinchStartBox, baseBox, factor, pinchFocus.x, pinchFocus.y);
                svg.setAttribute('viewBox', next.join(' '));
                return;
            }

            if (activePointers.size !== 1) return;
            if (mode === 'idle') {
                const movedX = event.clientX - startPoint.x;
                const movedY = event.clientY - startPoint.y;
                if (Math.hypot(movedX, movedY) < DRAG_THRESHOLD_PX) return;
                enterPan();
            }
            if (mode !== 'pan') return;
            const box = getCurrentBox();
            if (box.length !== 4) return;
            const rect = svg.getBoundingClientRect();
            const scale = getScale(box, rect);
            if (!scale) return;
            const dxScreen = event.clientX - lastPoint.x;
            const dyScreen = event.clientY - lastPoint.y;
            lastPoint = { x: event.clientX, y: event.clientY };
            const dx = -dxScreen / scale;
            const dy = -dyScreen / scale;
            const next = UIBoard.panViewBox(box, baseBox, dx, dy);
            svg.setAttribute('viewBox', next.join(' '));
        };

        // Après un vrai drag ou pincement, le navigateur émet quand même un
        // "click" de relâchement sur l'élément sous le doigt : sans ce
        // garde-fou, terminer un geste sur une région la sélectionnerait par
        // erreur. On avale ce click une seule fois juste après.
        let suppressNextClick = false;
        const onClickCapture = (event) => {
            if (!suppressNextClick) return;
            suppressNextClick = false;
            event.stopPropagation();
            event.preventDefault();
        };

        const onPointerUp = (event) => {
            const wasGesture = mode === 'pan' || mode === 'pinch';
            activePointers.delete(event.pointerId);
            if (capturedPointerIds.has(event.pointerId)) {
                panel.releasePointerCapture?.(event.pointerId);
                capturedPointerIds.delete(event.pointerId);
            }

            if (mode === 'pinch' && activePointers.size < 2) {
                // Un doigt relevé pendant un pincement : si l'autre reste
                // posé, on repasse en pan simple au lieu de tout arrêter.
                if (activePointers.size === 1) {
                    const [remaining] = [...activePointers.values()];
                    startPoint = remaining;
                    lastPoint = remaining;
                    enterPan();
                } else {
                    mode = 'idle';
                }
            } else if (activePointers.size === 0) {
                mode = 'idle';
                panel.classList.remove('is-panning');
            }

            if (wasGesture && activePointers.size === 0) {
                p.data.computedViewBox = svg.getAttribute('viewBox');
                suppressNextClick = true;
            }
        };

        panel.onpointerdown = onPointerDown;
        panel.onpointermove = onPointerMove;
        panel.onpointerup = onPointerUp;
        panel.onpointercancel = onPointerUp;
        panel.addEventListener('click', onClickCapture, true);

        // Molette souris : zoom centré sur la position du curseur, comme un
        // clic sur les boutons +/- mais localisé au point survolé.
        panel.onwheel = (event) => {
            event.preventDefault();
            const box = getCurrentBox();
            if (box.length !== 4) return;
            const rect = svg.getBoundingClientRect();
            const scale = getScale(box, rect);
            if (!scale) return;
            const focusX = box[0] + (event.clientX - rect.left - (rect.width - box[2] * scale) / 2) / scale;
            const focusY = box[1] + (event.clientY - rect.top - (rect.height - box[3] * scale) / 2) / scale;
            const factor = event.deltaY < 0 ? 1.2 : 1 / 1.2;
            const next = UIBoard.zoomViewBox(box, baseBox, factor, focusX, focusY);
            svg.setAttribute('viewBox', next.join(' '));
            p.data.computedViewBox = next.join(' ');
        };

        // Les boutons +/- passent par le data-val standard (délégation de
        // clic déjà branchée sur #math-problem → App.handleInput), qui
        // appelle ensuite UI.zoomMap ci-dessous pour manipuler ce même <svg>
        // sans repasser par un refreshUI complet.
    },

    /** Appelé par App.handleInput sur clic des boutons +/- de la carte. */
    zoomMap(problemZone, p, factor) {
        const svg = problemZone?.querySelector('[data-board-map-svg]');
        if (!svg) return;
        const baseBox = (svg.dataset.baseViewbox || '').split(/\s+/).map(Number);
        const box = (svg.getAttribute('viewBox') || '').split(/\s+/).map(Number);
        if (baseBox.length !== 4 || box.length !== 4) return;
        const focusX = box[0] + box[2] / 2;
        const focusY = box[1] + box[3] / 2;
        const next = UIBoard.zoomViewBox(box, baseBox, factor, focusX, focusY);
        svg.setAttribute('viewBox', next.join(' '));
        p.data.computedViewBox = next.join(' ');
    },

    // --- FONCTIONS DE DESSIN (Toutes protégées par d = p.data || {}) ---

    drawGeometryBoard(problem) {
        return UIBoard.render(problem);
    },

    drawSvgTarget(...args) {
        return UIVisuals.drawSvgTarget(...args);
    },

    getDivisionSteps(...args) {
        return UIVisuals.getDivisionSteps(...args);
    },

    drawSquare(...args) {
        return UIVisuals.drawSquare(...args);
    },

    drawBird(...args) {
        return UIVisuals.drawBird(...args);
    },

    drawFraction(...args) {
        return UIVisuals.drawFraction(...args);
    },

    drawBarChart(...args) {
        return UIVisuals.drawBarChart(...args);
    },

    drawDataTable(...args) {
        return UIVisuals.drawDataTable(...args);
    },

    drawPieChart(...args) {
        return UIVisuals.drawPieChart(...args);
    },

    drawClockCard(...args) {
        return UIVisuals.drawClockCard(...args);
    },

    drawTimeMemoCard(...args) {
        return UIVisuals.drawTimeMemoCard(...args);
    },

    drawMoneyCard(...args) {
        return UIVisuals.drawMoneyCard(...args);
    },

    drawCountingCard(...args) {
        return UIVisuals.drawCountingCard(...args);
    },

    drawConversionCard(...args) {
        return UIVisuals.drawConversionCard(...args);
    },

    drawDivisionCard(...args) {
        return UIVisuals.drawDivisionCard(...args);
    },

    drawReading(p) {
        const d = p.data || {};
        let h = `<div class="reading-container">`, charIdx = 0;
        (d.syllables || []).forEach((syll, sIdx) => {
            if(d.text) {
                while (d.text[charIdx] === " ") { h += `<span class="reading-space"></span>`; charIdx++; }
            }
            h += `<span class="syll-${sIdx%2}">`;
            for (let char of syll) {
                const isSilent = d.silent && d.silent.includes(charIdx);
                h += `<span class="${isSilent ? 'char-silent' : ''}">${char}</span>`;
                charIdx++;
            }
            h += `</span>`;
        });
        return h + `</div>`;
    },

    drawAudioSpelling(p, input) {
        const d = p.data || {};
        const target = Array.from((d.targetText || '').toString());
        const typed = Array.from((input || '').toString().toUpperCase());
        const status = (d.audioStatus || 'ready').toString();
        const isUnsupported = status === 'unsupported';
        const isPlaying = status === 'playing';
        const helperText = isUnsupported
            ? "L'audio n'est pas disponible sur cet appareil."
            : isPlaying
                ? "Le mot est en train d'être lu."
                : "Écoute bien le mot, puis écris-le. Tu peux le réécouter.";
        const slots = target.map((char, idx) => {
            if (char === ' ') return `<span class="audio-spelling-separator">&nbsp;</span>`;
            if (char === '-' || char === "'") return `<span class="audio-spelling-separator">${char}</span>`;
            return `<span class="audio-spelling-slot">${typed[idx] || "&nbsp;"}</span>`;
        }).join('');

        const currentLevel = window.Storage?.getSpeechRateLevel ? Storage.getSpeechRateLevel() : 'normal';
        const speedOptions = [
            { level: 'slow', label: '🐢 Lent' },
            { level: 'normal', label: '🚶 Normal' },
            { level: 'fast', label: '🐇 Rapide' }
        ];
        const speedButtons = speedOptions.map((opt) => `
            <button type="button" class="audio-spelling-speed-btn${currentLevel === opt.level ? ' is-active' : ''}" data-action="set-speech-rate" data-speech-rate-level="${opt.level}" ${isUnsupported ? 'disabled' : ''}>${opt.label}</button>
        `).join('');

        return `
            <div class="audio-spelling-container">
                <button type="button" class="btn audio-spelling-replay${isUnsupported ? ' is-disabled' : ''}" data-action="replay-audio-spelling" ${isUnsupported || isPlaying ? 'disabled' : ''}>${isPlaying ? 'Lecture...' : 'Écouter à nouveau'}</button>
                <div class="audio-spelling-speed-row">${speedButtons}</div>
                <div class="audio-spelling-hint">${helperText}</div>
                <div class="audio-spelling-slots">${slots}</div>
            </div>
        `;
    },

/* --- uiv2.js : drawSpelling consolidé --- */

    drawSpelling(p, input, isQCM = false) {
        const d = p.data || {};
        const word = (d.word || "").toString();
        const icon = this.safeIcon(d.icon, "❓");
        const imgPath = d.img || "";
        const hasImage = !!imgPath;

        let slots;
        if (isQCM) {
            slots = `<div class="word-full">${word}</div>`;
        } else {
            slots = '<div class="spelling-slots">' + word.split("").map((_, idx) => {
                const char = input[idx] ? input[idx].toUpperCase() : "";
                return `<span class="letter-slot spelling-slot-fill">${char || "&nbsp;"}</span>`;
            }).join("") + '</div>';
        }

        const safeId = word.replace(/[^a-zA-Z0-9]/g, '');
        const fallbackText = hasImage ? "Illustration indisponible" : "Icône utilisée";

        return `
            <div class="spelling-container">
                <div class="spelling-visual">
                    <div class="spelling-fallback" id="fallback-${safeId}">
                        <div class="fallback-icon fallback-icon-large">${icon}</div>
                        <div class="spelling-fallback-text">${fallbackText}</div>
                    </div>
                    ${imgPath ? `
                    <img src="${imgPath}" 
                        alt=""
                        class="spelling-image spelling-image-hidden" 
                        onload="this.style.display='block'; document.getElementById('fallback-${safeId}').classList.add('is-hidden');"
                        onerror="this.style.display='none'; document.getElementById('fallback-${safeId}').classList.remove('is-hidden');">
                    ` : ''}
                </div>
                ${slots}
            </div>`;
    },

	    drawConjugation(p, input) {
	        const d = p.data || {};
	        const temps = d.tense || "TEMPS";
        const infinitif = d.infinitive || "VERBE";
        const pronom = d.pronoun || "?";
        const saisie = input || "";

        return `
            <div class="conjugation-container">
                <div class="tense-badge">${temps}</div>
                <div class="verb-machine">
                    <div class="verb-infinitive">${infinitif}</div>
                    <div class="verb-body">
                        <span class="pronoun-tag">${pronom}</span>
                        <span class="verb-input-zone">${saisie}</span>
                    </div>
	                    </div>
	                </div>`;
	    },

    drawTimelineOrder(...args) {
        return UIDocumentary.drawTimelineOrder(...args);
    },

    drawTimelinePlace(...args) {
        return UIDocumentary.drawTimelinePlace(...args);
    },

    drawMatching(...args) {
        return UIDocumentary.drawMatching(...args);
    },

    drawWordOrder(...args) {
        return UIDocumentary.drawWordOrder(...args);
    },

    drawFactualCard(...args) {
        return UIDocumentary.drawFactualCard(...args);
    },
	    
	    showFinalResults(score, total) {
        // 1. Mise à jour des étoiles
        this.renderStars(score, total);
        
        // 2. Mise à jour du texte du score
        const scoreEl = document.getElementById('result-score');
        if (scoreEl) scoreEl.innerText = `Score : ${score} / ${total}`;

        // 3. Affichage de l'écran
        this.showScreen('screen-results');
    },

    _mascotReactions: {
        // Contextes prioritaires (testés avant le score)
        record: [
            "Tu as battu ton record sur cet exercice, chapeau !",
            "Encore mieux que la dernière fois, quel progrès !",
            "Nouveau record personnel, tu montes en puissance !"
        ],
        redemption: [
            "Tu as transformé une difficulté en réussite, c'est ça un champion !",
            "Cet exercice te résistait… plus maintenant. Bravo !",
            "Mission rattrapage accomplie, je suis fier de toi !"
        ],
        // Par score
        perfect: [
            "Sans-faute ! Tu es un champion !",
            "Incroyable, pas une seule erreur !",
            "Parfait du début à la fin, bravo !",
            "Score parfait ! Tu m'impressionnes !",
            "Rien à redire, c'était magistral !"
        ],
        good: [
            "Très bien joué, continue comme ça !",
            "Belle réussite, tu progresses bien !",
            "Bravo, c'est du bon travail !",
            "Presque parfait, tu y es presque !",
            "Tu deviens de plus en plus fort !"
        ],
        average: [
            "Pas mal ! Encore un effort et ce sera parfait.",
            "C'est un bon début, tu vas y arriver.",
            "Tu avances, continue à t'entraîner !",
            "La moitié du chemin est faite, on continue ?",
            "Chaque essai te rend plus fort !"
        ],
        encourage: [
            "Ce n'est pas grave, on apprend en se trompant !",
            "Essaie encore, je suis sûr que tu peux mieux faire !",
            "Courage, relis la leçon et retente ta chance !",
            "Même les champions ratent parfois. On réessaie ?",
            "Respire un bon coup, tu vas y arriver !"
        ]
    },

    renderMascotReaction(percent, context = {}) {
        const container = document.getElementById('mascot-reaction');
        if (!container) return;

        let pool;
        if (context.isRedemption) {
            pool = this._mascotReactions.redemption;
        } else if (context.isRecord && percent >= 50) {
            pool = this._mascotReactions.record;
        } else {
            pool = percent === 100
                ? this._mascotReactions.perfect
                : percent >= 75
                    ? this._mascotReactions.good
                    : percent >= 50
                        ? this._mascotReactions.average
                        : this._mascotReactions.encourage;
        }

        const text = pool[Math.floor(Math.random() * pool.length)];
        // C'est le compagnon de l'enfant qui parle quand on le connaît —
        // le hibou reste le porte-parole par défaut.
        const icon = context.companionEmoji || '🦉';
        container.innerHTML = `
            <span class="mascot-reaction-icon" aria-hidden="true">${icon}</span>
            <span class="mascot-reaction-text">${this._escapeText(text)}</span>
        `;
    },

    renderStars(score, total) {
        const container = document.getElementById('stars-container');
        if (!container) return;
        
        // Division par zéro protection
        if(total === 0) total = 1;
        
        const p = (score/total)*100;
        const count = p===100?3:p>=75?2:p>=50?1:0;
        
        container.innerHTML = Array(3).fill(0).map((_, i) => `<span class="star ${i < count ? 'active' : ''}">★</span>`).join("");
    },

    // Thèmes de célébration par matière : couleurs + emojis mêlés aux confettis.
    _celebrationThemes: {
        maths: { colors: ['#2196f3', '#03a9f4', '#3f51b5', '#00bcd4', '#ffc107'], emojis: ['🔢', '✨', '➕'] },
        francais: { colors: ['#9c27b0', '#673ab7', '#e91e63', '#f06292', '#ba68c8'], emojis: ['📚', '✏️', '💜'] },
        histoire: { colors: ['#ff9800', '#ffb300', '#8d6e63', '#ffca28', '#d4a373'], emojis: ['🏛️', '⏳', '👑'] },
        geo: { colors: ['#4caf50', '#2196f3', '#00bcd4', '#8bc34a', '#26a69a'], emojis: ['🌍', '🗺️', '🧭'] },
        sciences: { colors: ['#4caf50', '#8bc34a', '#cddc39', '#00e676', '#26c6da'], emojis: ['🔬', '🌱', '⚗️'] },
        emc: { colors: ['#e91e63', '#ff7043', '#ffca28', '#f06292', '#ff8a65'], emojis: ['🤝', '❤️', '🕊️'] }
    },

    launchCelebration(subject = null) {
        const theme = this._celebrationThemes[subject] || null;
        const colors = theme?.colors
            || ['#f44336', '#e91e63', '#9c27b0', '#673ab7', '#3f51b5', '#2196f3', '#03a9f4', '#00bcd4', '#009688', '#4caf50', '#8bc34a', '#cddc39', '#ffeb3b', '#ffc107', '#ff9800', '#ff5722'];
        const container = document.body;
        if(!container) return;

        // Limite pour ne pas surcharger le navigateur
        for (let i = 0; i < 40; i++) {
            const div = document.createElement('div');
            // Environ 1 confetti sur 5 devient un emoji de la matière
            if (theme && i % 5 === 0) {
                div.className = 'confetti confetti--emoji';
                div.textContent = theme.emojis[Math.floor(Math.random() * theme.emojis.length)];
            } else {
                div.className = 'confetti';
                div.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            }
            div.style.left = Math.random() * 100 + 'vw';
            div.style.animationDuration = (Math.random() * 2 + 1) + 's';
            div.style.opacity = Math.random();
            container.appendChild(div);

            setTimeout(() => { if(div.parentNode) div.remove(); }, 3000);
        }

        const resScreen = document.getElementById('screen-results');
        if (resScreen) {
            resScreen.classList.remove('victory-bounce'); // Reset
            void resScreen.offsetWidth; // Force reflow
            resScreen.classList.add('victory-bounce');
        }
    },

    showStreakToast(days) {
        this.showSimpleToast('🔥', `${days} jours de suite !`);
    },

    /**
     * Bandeau de série sur l'écran des classes. La mécanique existait déjà en
     * storage mais n'était visible que 3,2 s en toast, et jamais le 1er jour :
     * un enfant à 6 jours de série ne la voyait littéralement jamais.
     * Masqué en mode sans distraction, comme les autres éléments de jeu.
     */
    renderStreakBanner(streak, quietMode = false) {
        const el = document.getElementById('streak-banner');
        if (!el) return;

        const current = Math.max(0, Number(streak?.current) || 0);
        if (quietMode || current < 1) {
            el.classList.add('is-hidden');
            el.innerHTML = '';
            return;
        }

        const esc = (v) => SecurityUtils.escapeHtml(v);
        const best = Math.max(0, Number(streak?.best) || 0);
        const activeToday = streak?.isActiveToday === true;

        // Le message change selon que la série est déjà assurée aujourd'hui ou
        // en jeu : c'est ce qui donne une raison de revenir.
        const message = activeToday
            ? (current > 1 ? 'Série assurée pour aujourd\'hui !' : 'Tu as commencé une série. À demain !')
            : 'Fais une activité aujourd\'hui pour ne pas la perdre.';

        el.innerHTML = `
            <span class="streak-banner-flame" aria-hidden="true">🔥</span>
            <span class="streak-banner-text">
                <strong class="streak-banner-count">${current} jour${current > 1 ? 's' : ''} de suite</strong>
                <span class="streak-banner-hint">${esc(message)}</span>
            </span>
            ${best > current ? `<span class="streak-banner-best" title="Ton record">Record : ${best}</span>` : ''}
        `;
        el.classList.toggle('is-at-risk', !activeToday);
        el.classList.remove('is-hidden');
    },

    renderDailyChallenge(challenge) {
        const card = document.getElementById('daily-challenge-card');
        if (!card) return;

        if (!challenge) {
            card.classList.add('is-hidden');
            card.innerHTML = "";
            return;
        }

        const percent = challenge.target > 0 ? Math.round((challenge.progress / challenge.target) * 100) : 0;
        card.classList.remove('is-hidden');
        card.classList.toggle('is-completed', !!challenge.completed);
        card.innerHTML = `
            <span class="daily-challenge-icon" aria-hidden="true">${challenge.completed ? '✅' : this._escapeText(challenge.icon)}</span>
            <span class="daily-challenge-body">
                <span class="daily-challenge-title">Défi du jour</span>
                <span class="daily-challenge-text">${this._escapeText(challenge.label)}</span>
                <div class="progress-bar-track progress-bar-track--small">
                    <div class="progress-bar-fill" style="width: ${Math.min(100, percent)}%"></div>
                </div>
            </span>
            <span class="daily-challenge-count">${Math.min(challenge.progress, challenge.target)}/${challenge.target}</span>
        `;
    },

    showSimpleToast(icon, text) {
        const existing = document.querySelector('.streak-toast');
        if (existing) existing.remove();

        const toast = document.createElement('div');
        toast.className = 'streak-toast';
        toast.setAttribute('role', 'status');
        toast.innerHTML = `<span class="streak-toast-icon">${this._escapeText(icon)}</span><span class="streak-toast-text">${this._escapeText(text)}</span>`;
        document.body.appendChild(toast);

        setTimeout(() => toast.classList.add('is-visible'), 10);
        setTimeout(() => {
            toast.classList.remove('is-visible');
            setTimeout(() => { if (toast.parentNode) toast.remove(); }, 400);
        }, 3200);
    },

    renderChampionScores(scoresByDuration) {
        const container = document.getElementById('champion-scores-list');
        if (!container) return;
        const medals = ['🥇', '🥈', '🥉'];
        container.innerHTML = (scoresByDuration || []).map((entry) => {
            const top3 = (entry.scores || []).slice(0, 3);
            const label = `${entry.duration} s`;
            const scoresHtml = top3.length
                ? top3.map((s, i) => `
                    <span class="champion-score-medal">${medals[i]} ${s.score} pt${s.score > 1 ? 's' : ''}</span>
                `).join('')
                : '<span class="champion-score-empty">Pas encore joué</span>';
            return `
                <div class="champion-score-row">
                    <span class="champion-score-duration">${this._escapeText(label)}</span>
                    <span class="champion-score-value">${scoresHtml}</span>
                </div>`;
        }).join('');
    },

    renderChampionResults({ score, duration, isNewBest }) {
        const title = document.getElementById('champion-result-title');
        const lead = document.getElementById('champion-result-lead');
        const scoreEl = document.getElementById('champion-result-score');
        const bestEl = document.getElementById('champion-result-best');

        if (title) title.textContent = isNewBest ? 'Nouveau record !' : 'Temps écoulé !';
        if (lead) lead.textContent = `Défi de ${duration} secondes terminé.`;
        if (scoreEl) scoreEl.textContent = `${score} bonne${score > 1 ? 's' : ''} réponse${score > 1 ? 's' : ''}`;
        if (bestEl) bestEl.textContent = isNewBest ? '🏆 Tu bats ton record !' : '';
    },

    // --- Le Grand Quiz (culture générale) ---

    // Tableau des records de l'appareil : une ligne par niveau, top 3 avec
    // le prénom du joueur (classement partagé entre tous les profils).
    renderQuizScores(levels) {
        const container = document.getElementById('quiz-scores-list');
        if (!container) return;
        const medals = ['🥇', '🥈', '🥉'];
        container.innerHTML = (levels || []).map((level) => {
            const top3 = (level.scores || []).slice(0, 3);
            const scoresHtml = top3.length
                ? top3.map((s, i) => `
                    <span class="quiz-score-medal">${medals[i]} ${this._escapeText(s.name)} — ${s.score}/${s.total}</span>
                `).join('')
                : '<span class="quiz-score-empty">Pas encore joué</span>';
            return `
                <div class="quiz-score-row">
                    <span class="quiz-score-level">${this.safeIcon(level.icon, '🧠')} ${this._escapeText(level.label)}</span>
                    <span class="quiz-score-value">${scoresHtml}</span>
                </div>`;
        }).join('');
    },

    renderQuizQuestion({ index, total, score, theme, question, choices }, onAnswer) {
        const progressLabel = document.getElementById('quiz-progress-label');
        const scoreLabel = document.getElementById('quiz-score-label');
        const bar = document.getElementById('quiz-progress-bar');
        const themeEl = document.getElementById('quiz-theme');
        const questionEl = document.getElementById('quiz-question');
        const choicesEl = document.getElementById('quiz-choices');
        const feedback = document.getElementById('quiz-feedback');
        const nextBtn = document.getElementById('btn-quiz-next');
        if (!questionEl || !choicesEl) return;

        if (progressLabel) progressLabel.textContent = `Question ${index + 1} / ${total}`;
        if (scoreLabel) scoreLabel.textContent = `⭐ ${score}`;
        if (bar) bar.style.width = `${Math.round((index / total) * 100)}%`;
        if (themeEl) themeEl.textContent = theme || '';
        questionEl.textContent = question;
        if (feedback) {
            feedback.classList.add('is-hidden');
            feedback.innerHTML = '';
        }
        if (nextBtn) nextBtn.classList.add('is-hidden');

        choicesEl.innerHTML = '';
        (choices || []).forEach((choice, i) => {
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'quiz-choice';
            btn.textContent = choice;
            btn.dataset.choiceIndex = String(i);
            btn.onclick = () => onAnswer(i);
            choicesEl.appendChild(btn);
        });
    },

    // Après réponse : fige les choix, colore la bonne (et la mauvaise si
    // l'enfant s'est trompé), montre l'anecdote et le bouton suivant.
    showQuizFeedback({ selectedIndex, correctIndex, info, isLast }, onNext) {
        const choicesEl = document.getElementById('quiz-choices');
        const feedback = document.getElementById('quiz-feedback');
        const nextBtn = document.getElementById('btn-quiz-next');
        const nextLabel = document.getElementById('btn-quiz-next-label');
        const correct = selectedIndex === correctIndex;

        if (choicesEl) {
            choicesEl.querySelectorAll('.quiz-choice').forEach((btn) => {
                const i = Number(btn.dataset.choiceIndex);
                btn.disabled = true;
                if (i === correctIndex) btn.classList.add('is-correct');
                else if (i === selectedIndex) btn.classList.add('is-wrong');
                else btn.classList.add('is-faded');
            });
        }
        if (feedback) {
            feedback.classList.remove('is-hidden');
            feedback.classList.toggle('is-good', correct);
            feedback.classList.toggle('is-bad', !correct);
            feedback.innerHTML = `
                <div class="quiz-feedback-verdict">${correct ? '✅ Bien joué !' : '❌ Pas cette fois…'}</div>
                ${info ? `<div class="quiz-feedback-info">💡 ${this._escapeText(info)}</div>` : ''}
            `;
        }
        if (nextBtn) {
            nextBtn.classList.remove('is-hidden');
            if (nextLabel) nextLabel.textContent = isLast ? 'VOIR MON SCORE' : 'QUESTION SUIVANTE';
            nextBtn.onclick = () => onNext();
        }
    },

    renderQuizResults({ score, total, coins, levelLabel, rank, podium }, onRetry, onMenu) {
        const title = document.getElementById('quiz-result-title');
        const lead = document.getElementById('quiz-result-lead');
        const scoreEl = document.getElementById('quiz-result-score');
        const bestEl = document.getElementById('quiz-result-best');
        const retryBtn = document.getElementById('btn-quiz-retry');
        const menuBtn = document.getElementById('btn-quiz-menu');

        const perfect = score === total;
        if (title) title.textContent = perfect ? 'Incollable !' : (rank === 1 ? 'Record de la maison !' : 'Quiz terminé !');
        if (lead) lead.textContent = `Grand Quiz ${levelLabel || ''}`.trim();
        if (scoreEl) scoreEl.textContent = `${score} / ${total}${coins > 0 ? `  ·  +${coins} 🪙` : ''}`;
        if (bestEl) {
            const medals = ['🥇', '🥈', '🥉'];
            const podiumHtml = (podium || []).slice(0, 3).map((s, i) => `
                <span class="quiz-score-medal">${medals[i]} ${this._escapeText(s.name)} — ${s.score}/${s.total}</span>
            `).join('');
            const rankHtml = rank && rank <= 3
                ? `<div class="quiz-result-rank">${medals[rank - 1]} Tu entres dans le top 3 de l'appareil !</div>`
                : '';
            bestEl.innerHTML = `${rankHtml}${podiumHtml ? `<div class="quiz-result-podium">${podiumHtml}</div>` : ''}`;
        }
        if (retryBtn) retryBtn.onclick = () => onRetry();
        if (menuBtn) menuBtn.onclick = () => onMenu();
    },

    renderCollectionBadges(badges) {
        const container = document.getElementById('collection-badges-list');
        if (!container) return;
        container.innerHTML = (badges || []).map((b) => `
            <div class="collection-badge ${b.unlocked ? 'is-unlocked' : 'is-locked'}">
                <span class="collection-badge-icon" aria-hidden="true">${b.unlocked ? b.icon : '🔒'}</span>
                <span class="collection-badge-label">${this._escapeText(b.label)}</span>
            </div>
        `).join('');
    },

    renderCollectionMaps(maps) {
        const container = document.getElementById('collection-maps-list');
        if (!container) return;
        container.innerHTML = (maps || []).map((m) => `
            <div class="collection-map ${m.unlocked ? 'is-unlocked' : 'is-locked'}">
                <span class="collection-map-icon" aria-hidden="true">${m.unlocked ? m.icon : '🔒'}</span>
                <span class="collection-map-label">${this._escapeText(m.label)}</span>
            </div>
        `).join('');
    },

    renderCollectionSubjects(subjects) {
        const container = document.getElementById('collection-subjects-list');
        if (!container) return;
        container.innerHTML = (subjects || []).map((s) => `
            <div class="collection-map ${s.unlocked ? 'is-unlocked' : 'is-locked'}">
                <span class="collection-map-icon" aria-hidden="true">${s.unlocked ? s.icon : '🔒'}</span>
                <span class="collection-map-label">${this._escapeText(s.label)}</span>
            </div>
        `).join('');
    },

    // Petit bandeau "ton aventure du jour" : valorise ce qui est déjà fait
    // aujourd'hui (on peut s'arrêter fier), sans pousser à continuer.
    renderTodayRecap(activity, companionEmoji) {
        const banner = document.getElementById('today-recap');
        if (!banner) return;
        if (!activity || activity.attempts === 0) {
            banner.classList.add('is-hidden');
            banner.innerHTML = '';
            return;
        }
        const ex = `${activity.attempts} exercice${activity.attempts > 1 ? 's' : ''}`;
        const stars = activity.stars > 0 ? ` et gagné ${activity.stars} ⭐` : '';
        banner.innerHTML = `
            <span class="today-recap-icon" aria-hidden="true">${this.safeIcon(companionEmoji, '🦉')}</span>
            <span class="today-recap-text">Aujourd'hui, tu as déjà fait ${this._escapeText(ex)}${this._escapeText(stars)}. Bravo !</span>
        `;
        banner.classList.remove('is-hidden');
    },

    renderCollectionThemes(seriesList) {
        const container = document.getElementById('collection-themes-list');
        if (!container) return;
        container.innerHTML = (seriesList || []).map((series) => `
            <div class="collection-theme">
                <div class="collection-theme-head">
                    <span class="collection-theme-title">${this._escapeText(series.title)}</span>
                    <span class="collection-theme-progress">${series.unlockedCount}/${series.totalCount}</span>
                </div>
                <div class="collection-maps-list">
                    ${series.cards.map((c) => c.unlocked ? `
                        <button type="button" class="collection-map is-unlocked collection-map--fact"
                            data-fact="${this._escapeText(c.fact || '')}"
                            aria-label="${this._escapeText(c.label)} — toucher pour découvrir une anecdote">
                            <span class="collection-map-icon" aria-hidden="true">${c.icon}</span>
                            <span class="collection-map-label">${this._escapeText(c.label)}</span>
                        </button>
                    ` : `
                        <div class="collection-map is-locked" title="Réussis ${c.requires} exercices à 75 % ou plus">
                            <span class="collection-map-icon" aria-hidden="true">🔒</span>
                            <span class="collection-map-label">???</span>
                        </div>
                    `).join('')}
                </div>
                <div class="collection-theme-fact is-hidden" aria-live="polite"></div>
            </div>
        `).join('');

        // Tap sur une carte débloquée → affiche l'anecdote sous sa série.
        container.onclick = (event) => {
            const card = event.target.closest('.collection-map--fact');
            if (!card) return;
            const factBox = card.closest('.collection-theme')?.querySelector('.collection-theme-fact');
            if (!factBox) return;
            const fact = card.getAttribute('data-fact') || '';
            const alreadyShown = !factBox.classList.contains('is-hidden') && factBox.dataset.for === card.getAttribute('aria-label');
            if (alreadyShown || !fact) {
                factBox.classList.add('is-hidden');
                factBox.dataset.for = '';
                return;
            }
            factBox.textContent = `💡 Le savais-tu ? ${fact}`;
            factBox.dataset.for = card.getAttribute('aria-label');
            factBox.classList.remove('is-hidden');
        };
    },

    // ---------- GRIMOIRE ----------

    // Logo maison du Grimoire : livre de sorts ouvert + étincelle.
    // SVG inline (net à toutes les tailles, aucun asset à charger).
    grimoireLogoSvg(size = 48) {
        return `
        <svg class="grimoire-logo" width="${size}" height="${size}" viewBox="0 0 64 64" aria-hidden="true" focusable="false">
            <defs>
                <linearGradient id="grimoire-gold" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0" stop-color="#ffe9a8"/>
                    <stop offset="1" stop-color="#f3b13c"/>
                </linearGradient>
            </defs>
            <!-- livre ouvert -->
            <path d="M8 46 C16 40 26 40 32 44 C38 40 48 40 56 46 L56 24 C48 18 38 18 32 22 C26 18 16 18 8 24 Z"
                fill="url(#grimoire-gold)" stroke="#8a5b00" stroke-width="2" stroke-linejoin="round"/>
            <path d="M32 22 L32 44" stroke="#8a5b00" stroke-width="2"/>
            <path d="M13 27 C19 24 25 24 29 26 M13 33 C19 30 25 30 29 32 M35 26 C39 24 45 24 51 27 M35 32 C39 30 45 30 51 33"
                stroke="#b8862f" stroke-width="1.6" fill="none" stroke-linecap="round"/>
            <!-- grande étincelle -->
            <path d="M32 2 L35 10 L43 13 L35 16 L32 24 L29 16 L21 13 L29 10 Z" fill="#fff"/>
            <path d="M32 5 L34.2 10.8 L40 13 L34.2 15.2 L32 21 L29.8 15.2 L24 13 L29.8 10.8 Z" fill="url(#grimoire-gold)"/>
            <!-- petites étoiles -->
            <path d="M14 8 l1.4 3 3 1.4 -3 1.4 -1.4 3 -1.4 -3 -3 -1.4 3 -1.4 Z" fill="#ffe9a8"/>
            <path d="M50 6 l1.2 2.6 2.6 1.2 -2.6 1.2 -1.2 2.6 -1.2 -2.6 -2.6 -1.2 2.6 -1.2 Z" fill="#ffe9a8"/>
        </svg>`;
    },

    updateGrimoireCoins(coins) {
        const el = document.getElementById('grimoire-coins');
        if (el) el.innerHTML = `🪙 <strong>${Math.max(0, Number(coins) || 0)}</strong> pièce${coins > 1 ? 's' : ''}`;
        this.updateGrimoireBundles(coins);
    },

    /**
     * Les trois choix d'ouverture (×1, ×5, ×10) : même structure, même typo,
     * mêmes trois lignes (quantité / cartes / prix). Seule l'INTENSITÉ visuelle
     * monte avec la quantité (tier1 → tier3), pour que l'œil aille vers le ×10.
     *
     * Le doré était sur le ×1 : ça cassait l'harmonie (un bouton plein face à
     * deux cartes vides) et ça mettait l'emphase sur l'offre la MOINS
     * intéressante. Il est désormais réservé au palier le plus fort.
     *
     * Prix et ristournes viennent de Storage.getBoosterBundles() : jamais
     * codés en dur ici, sinon l'UI et l'économie divergent.
     */
    updateGrimoireBundles(coins) {
        const wrap = document.getElementById('grimoire-bundles');
        if (!wrap || typeof Storage === 'undefined' || !Storage.getBoosterBundles) return;

        const bundles = Storage.getBoosterBundles();
        if (!bundles.length) { wrap.innerHTML = ''; return; }
        const safeCoins = Math.max(0, Number(coins) || 0);
        const cardsEach = Storage.cardsPerBooster || 3;

        wrap.innerHTML = bundles.map((b, i) => {
            const locked = safeCoins < b.price;
            const cards = b.size * cardsEach;
            // Le palier suit le RANG dans la liste, pas la taille : si les lots
            // changent un jour (×3 / ×8…), la montée en intensité reste juste.
            const tier = Math.min(3, i + 1);
            return `
            <button
                type="button"
                class="btn grimoire-bundle-btn grimoire-bundle-btn--tier${tier}"
                data-bundle-size="${b.size}"
                ${locked ? 'disabled' : ''}
                aria-label="Ouvrir ${b.size} booster${b.size > 1 ? 's' : ''}, ${cards} cartes, ${b.price} pièces${b.discount > 0 ? `, ${b.discount} pièces d'économie` : ''}"
            >
                ${b.discount > 0 ? `<span class="grimoire-bundle-save" aria-hidden="true">−${b.discount}</span>` : ''}
                <span class="grimoire-bundle-size">×${b.size}</span>
                <span class="grimoire-bundle-cards">${cards} cartes</span>
                <span class="grimoire-bundle-price">${b.price} 🪙</span>
            </button>
        `;
        }).join('');

        if (typeof this._onOpenBundle === 'function') {
            wrap.querySelectorAll('[data-bundle-size]').forEach((node) => {
                node.onclick = () => {
                    if (node.disabled) return;
                    this._onOpenBundle(Number(node.getAttribute('data-bundle-size')));
                };
            });
        }
    },

    _cardRarityClass(rarity) {
        return `grimoire-card--${['commune', 'rare', 'epique', 'legendaire', 'brillante'].includes(rarity) ? rarity : 'commune'}`;
    },

    // onOpenBundle(size) gère les trois quantités, ×1 compris : les boutons
    // sont générés à partir de Storage.getBoosterBundles().
    renderGrimoire(catalog, ownedIds, coins, onOpenBundle) {
        const grid = document.getElementById('grimoire-grid');
        const progress = document.getElementById('grimoire-progress');
        const reveal = document.getElementById('booster-reveal');
        if (!grid) return;

        if (reveal) { reveal.classList.add('is-hidden'); reveal.innerHTML = ''; }
        // Mémorisé avant updateGrimoireCoins : c'est lui qui (re)crée les
        // boutons et leur rebranche ce callback.
        if (typeof onOpenBundle === 'function') this._onOpenBundle = onOpenBundle;
        this.updateGrimoireCoins(coins);

        const cards = Array.isArray(catalog?.cards) ? catalog.cards : [];
        const ownedCount = cards.filter((c) => ownedIds[c.id]).length;
        if (progress) {
            progress.innerHTML = `<strong>${ownedCount}</strong> / ${cards.length} créatures découvertes`;
        }

        const rarities = catalog?.rarities || {};
        const cardHtml = (card) => {
            const count = ownedIds[card.id] || 0;
            if (!count) {
                // Les emplacements prismatiques non découverts sont marqués ✨ :
                // ce sont des variantes bonus, pas des cartes manquantes de la
                // série de base.
                if (card.rarity === 'brillante') {
                    return `
                        <div class="grimoire-card grimoire-card--locked grimoire-card--locked-prisme" aria-label="Variante prismatique non découverte">
                            <div class="grimoire-card-back grimoire-card-back--prisme">✨</div>
                            <div class="grimoire-card-name grimoire-card-name--muted">Prismatique</div>
                        </div>`;
                }
                return `
                    <div class="grimoire-card grimoire-card--locked" aria-label="Créature mystérieuse non découverte">
                        <div class="grimoire-card-back">?</div>
                    </div>`;
            }
            const mythique = card.family === 'mythologie' ? ' grimoire-card--mythique' : '';
            return `
                <button type="button" class="grimoire-card ${this._cardRarityClass(card.rarity)}${mythique}" data-card-id="${this._escapeText(card.id)}"
                    aria-label="${this._escapeText(card.name)}, carte ${this._escapeText(rarities[card.rarity]?.label || card.rarity)}${card.family === 'mythologie' ? ', Mythique' : ''}">
                    <img class="grimoire-card-img" src="${this._escapeText(card.image)}" alt="" loading="lazy">
                    <div class="grimoire-card-name">${this._escapeText(card.name)}</div>
                    ${count > 1 ? `<div class="grimoire-card-count">×${count}</div>` : ''}
                </button>`;
        };

        // Groupement par famille (ordre d'apparition dans le catalogue),
        // avec en-tête de progression et état doré quand la série est
        // complète (cartes de base — les ✨ prismatiques visent la perfection).
        const familyOrder = [];
        const byFamily = {};
        cards.forEach((card) => {
            if (!byFamily[card.family]) {
                byFamily[card.family] = [];
                familyOrder.push(card.family);
            }
            byFamily[card.family].push(card);
        });
        // Tri dans chaque famille : rareté croissante puis stade d'évolution —
        // la progression se lit de gauche à droite, prismatiques en dernier.
        Object.values(byFamily).forEach((familyCards) => {
            familyCards.sort((a, b) =>
                (this._rarityRank[a.rarity] || 0) - (this._rarityRank[b.rarity] || 0)
                || (a.stage || 0) - (b.stage || 0));
        });
        const seriesStatus = (typeof Storage !== 'undefined' && Storage.getSeriesStatus)
            ? Storage.getSeriesStatus(catalog)
            : {};

        grid.innerHTML = familyOrder.map((familyId) => {
            const familyCards = byFamily[familyId];
            const meta = catalog?.families?.[familyId] || { label: familyId, icon: '🃏' };
            const status = seriesStatus[familyId] || { baseOwned: 0, base: familyCards.length, total: familyCards.length, totalOwned: 0, complete: false, perfect: false };
            let badge = '';
            if (status.perfect) badge = '<span class="grimoire-serie-state grimoire-serie-state--perfect">✨ Parfaite !</span>';
            else if (status.complete) badge = '<span class="grimoire-serie-state grimoire-serie-state--complete">🏆 Complète !</span>';
            // Compteur séparé pour les variantes prismatiques (hors série de base)
            const prismeTotal = status.total - status.base;
            const prismeOwned = status.totalOwned - status.baseOwned;
            const prismeHtml = prismeTotal > 0
                ? `<span class="grimoire-serie-prismes" title="Variantes prismatiques">✨ ${prismeOwned}/${prismeTotal}</span>`
                : '';
            return `
                <div class="grimoire-serie${status.complete ? ' is-complete' : ''}${status.perfect ? ' is-perfect' : ''}">
                    <div class="grimoire-serie-head">
                        <span class="grimoire-serie-icon" aria-hidden="true">${meta.icon}</span>
                        <span class="grimoire-serie-title">${this._escapeText(meta.label)}</span>
                        <span class="grimoire-serie-progress">${status.baseOwned}/${status.base}</span>
                        ${prismeHtml}
                        ${badge}
                    </div>
                    <div class="grimoire-serie-cards">
                        ${familyCards.map(cardHtml).join('')}
                    </div>
                </div>`;
        }).join('');

        grid.onclick = (event) => {
            const cardBtn = event.target.closest('[data-card-id]');
            if (!cardBtn) return;
            const card = cards.find((c) => c.id === cardBtn.dataset.cardId);
            if (card) this.showCardDetail(card, catalog, cards);
        };
    },

    showCardDetail(card, catalog, allCards) {
        const overlay = document.getElementById('card-detail-overlay');
        const box = document.getElementById('card-detail');
        if (!overlay || !box) return;
        const rarity = catalog?.rarities?.[card.rarity] || { label: card.rarity, color: '#8d99ae' };
        const from = card.evolvesFrom ? allCards.find((c) => c.id === card.evolvesFrom) : null;
        const evolvesTo = allCards.filter((c) => c.evolvesFrom === card.id);
        const chainParts = [];
        if (from) chainParts.push(`Évolue depuis <strong>${this._escapeText(from.name)}</strong>`);
        if (evolvesTo.length) chainParts.push(`Peut évoluer en <strong>${evolvesTo.map((c) => this._escapeText(c.name)).join(', ')}</strong>`);
        if (card.variantOf) {
            const original = allCards.find((c) => c.id === card.variantOf);
            if (original) chainParts.push(`Version prismatique de <strong>${this._escapeText(original.name)}</strong>`);
        }

        const mythique = card.family === 'mythologie';
        box.className = `card-detail ${this._cardRarityClass(card.rarity)}${mythique ? ' grimoire-card--mythique' : ''}`;
        box.innerHTML = `
            <div class="card-detail-rarity" style="color: ${this._escapeText(rarity.color)}">${this._escapeText(rarity.label)}${mythique ? ' <span class="card-detail-mythique-tag">✦ Mythique</span>' : ''}</div>
            <img class="card-detail-img" src="${this._escapeText(card.image)}" alt="${this._escapeText(card.name)}">
            <div class="card-detail-name">${this._escapeText(card.name)}</div>
            <p class="card-detail-lore">${this._escapeText(card.lore || '')}</p>
            ${chainParts.length ? `<p class="card-detail-evolution">${chainParts.join('<br>')}</p>` : ''}
            <button type="button" class="btn card-detail-close">FERMER</button>
        `;
        overlay.classList.remove('is-hidden');
        const close = () => overlay.classList.add('is-hidden');
        overlay.onclick = (event) => { if (event.target === overlay) close(); };
        box.querySelector('.card-detail-close').onclick = close;
    },

    _rarityRank: { commune: 0, rare: 1, epique: 2, legendaire: 3, brillante: 4 },
    _rarityGlowColors: { epique: '#9c6bd6', legendaire: '#f3b13c', brillante: '#e05ce0' },

    // Meilleure rareté contenue dans le booster : pilote l'intensité de
    // toute la mise en scène (charge du paquet, éclatement, secousse).
    _bestRarity(result) {
        return result.cards.reduce((best, { card }) =>
            (this._rarityRank[card.rarity] || 0) > (this._rarityRank[best] || 0) ? card.rarity : best, 'commune');
    },

    /**
     * Révélation d'un LOT (x5 / x10). On ne rejoue pas la déchirure paquet par
     * paquet — 10 fois le même geste serait pénible : un seul paquet à ouvrir,
     * puis toutes les cartes en grille, retournables. Le reste (aura par rareté,
     * étiquette nouveau/doublon, confettis) est le rendu unitaire réutilisé tel
     * quel via _renderBoosterCards, dont le contrat est déjà `result.cards`.
     */
    renderBoosterBundleReveal(result, catalog, onDone) {
        const reveal = document.getElementById('booster-reveal');
        if (!reveal) return;
        const rarities = catalog?.rarities || {};
        const count = result?.packs?.length || 0;
        reveal.classList.remove('is-hidden');

        const best = this._bestRarity(result);
        const bestRank = this._rarityRank[best] || 0;
        const glowColor = this._rarityGlowColors[best] || null;

        reveal.innerHTML = `
            <div class="booster-stage">
                <button type="button" class="booster-pack booster-pack--bundle" aria-label="Ouvrir le lot de ${count} boosters">
                    <div class="booster-pack-tear"><span class="booster-pack-tear-strip"></span></div>
                    <div class="booster-pack-shine"></div>
                    <div class="booster-pack-logo">${this.grimoireLogoSvg(64)}</div>
                    <div class="booster-pack-title">LOT ×${count}</div>
                    <div class="booster-pack-sub">${result.cards.length} cartes magiques</div>
                    <span class="booster-pack-stack" aria-hidden="true"></span>
                    <span class="booster-pack-stack booster-pack-stack--2" aria-hidden="true"></span>
                </button>
                <div class="booster-hint">✂️ Glisse ton doigt pour ouvrir tout le lot !</div>
            </div>
        `;
        reveal.scrollIntoView({ behavior: 'smooth', block: 'start' });

        const pack = reveal.querySelector('.booster-pack');
        if (glowColor) {
            pack.classList.add('booster-pack--charged');
            pack.style.setProperty('--charge-color', glowColor);
        }
        this._bindBoosterPackOpen(pack, reveal, bestRank, glowColor, () => {
            this._renderBoosterCards(reveal, result, rarities, onDone, {
                summary: `${count} boosters ouverts · ${result.newCount} nouvelle${result.newCount > 1 ? 's' : ''} carte${result.newCount > 1 ? 's' : ''}${result.refundTotal > 0 ? ` · +${result.refundTotal} 🪙 de doublons` : ''}`
            });
        });
    },

    /**
     * Geste d'ouverture d'un paquet (déchirure au glisser, tap ou clavier),
     * partagé par le booster unitaire et les lots.
     */
    _bindBoosterPackOpen(pack, reveal, bestRank, glowColor, onOpened) {
        let opened = false;
        const open = () => {
            if (opened) return;
            opened = true;
            pack.classList.add('is-bursting');
            this._spawnBoosterSparks(pack, bestRank);
            this._spawnShockwave(pack, glowColor);
            if (bestRank >= 3) {
                const stage = reveal.querySelector('.booster-stage');
                if (stage) stage.classList.add('is-quaking');
            }
            const hint = reveal.querySelector('.booster-hint');
            if (hint) hint.textContent = '';
            setTimeout(onOpened, bestRank >= 3 ? 750 : 550);
        };

        let tearStart = null;
        pack.onpointerdown = (event) => {
            tearStart = event.clientX;
            // setPointerCapture lève si le pointerId n'est plus actif (pointeur
            // déjà relâché, événement synthétique) : l'optional chaining teste
            // la méthode, pas la validité de l'id. La capture n'est qu'un confort
            // de suivi du geste, son échec ne doit pas casser l'ouverture.
            try { pack.setPointerCapture?.(event.pointerId); } catch (e) {}
        };
        pack.onpointermove = (event) => {
            if (tearStart === null || opened) return;
            const progress = Math.min(1, Math.max(0, (event.clientX - tearStart) / (pack.offsetWidth * 0.7)));
            pack.style.setProperty('--tear', progress);
            if (progress >= 1) open();
        };
        pack.onpointerup = () => {
            if (opened) return;
            const progress = Number(pack.style.getPropertyValue('--tear')) || 0;
            if (progress < 0.3) open();
            else pack.style.setProperty('--tear', 0);
            tearStart = null;
        };
        pack.onclick = (event) => event.preventDefault();
        pack.onkeydown = (event) => {
            if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); open(); }
        };
    },

    renderBoosterReveal(result, catalog, onDone) {
        const reveal = document.getElementById('booster-reveal');
        if (!reveal) return;
        const rarities = catalog?.rarities || {};
        reveal.classList.remove('is-hidden');

        // --- Étape 1 : le paquet scellé, à déchirer d'un glissement de doigt ---
        reveal.innerHTML = `
            <div class="booster-stage">
                <button type="button" class="booster-pack" aria-label="Glisse ton doigt sur le paquet pour le déchirer, ou touche-le">
                    <div class="booster-pack-tear">
                        <span class="booster-pack-tear-strip"></span>
                    </div>
                    <div class="booster-pack-shine"></div>
                    <div class="booster-pack-logo">${this.grimoireLogoSvg(64)}</div>
                    <div class="booster-pack-title">GRIMOIRE</div>
                    <div class="booster-pack-sub">${result.cards.length} cartes magiques</div>
                </button>
                <div class="booster-hint">✂️ Glisse ton doigt pour déchirer le paquet !</div>
            </div>
        `;
        reveal.scrollIntoView({ behavior: 'smooth', block: 'start' });

        const pack = reveal.querySelector('.booster-pack');

        // Le paquet se "charge" de la couleur de sa meilleure carte : une
        // énergie s'échappe de la déchirure sans révéler laquelle c'est.
        const best = this._bestRarity(result);
        const bestRank = this._rarityRank[best] || 0;
        const glowColor = this._rarityGlowColors[best] || null;
        if (glowColor) {
            pack.classList.add('booster-pack--charged');
            pack.style.setProperty('--charge-color', glowColor);
        }

        // Déchirure au glisser (tap et clavier acceptés) : geste partagé avec
        // les lots — voir _bindBoosterPackOpen.
        this._bindBoosterPackOpen(pack, reveal, bestRank, glowColor, () => {
            this._renderBoosterCards(reveal, result, rarities, onDone);
        });
    },

    // Gerbe d'étincelles à l'éclatement — d'autant plus fournie que le
    // booster contient une belle carte.
    _spawnBoosterSparks(pack, bestRank = 0) {
        const stage = pack.closest('.booster-stage');
        if (!stage) return;
        const emojis = bestRank >= 3 ? ['✨', '⭐', '💫', '🌟'] : ['✨', '⭐', '💫'];
        const count = 12 + bestRank * 5;
        for (let i = 0; i < count; i++) {
            const spark = document.createElement('span');
            spark.className = 'booster-spark';
            spark.textContent = emojis[i % emojis.length];
            const angle = (Math.PI * 2 * i) / count + Math.random() * 0.5;
            const dist = (90 + Math.random() * 110) * (1 + bestRank * 0.15);
            spark.style.setProperty('--dx', `${Math.cos(angle) * dist}px`);
            spark.style.setProperty('--dy', `${Math.sin(angle) * dist - 40}px`);
            spark.style.animationDelay = `${Math.random() * 0.15}s`;
            stage.appendChild(spark);
            setTimeout(() => spark.remove(), 1500);
        }
    },

    // Onde de choc colorée selon la meilleure rareté du paquet
    _spawnShockwave(pack, color) {
        const stage = pack.closest('.booster-stage');
        if (!stage) return;
        const wave = document.createElement('span');
        wave.className = 'booster-shockwave';
        if (color) wave.style.setProperty('--wave-color', color);
        stage.appendChild(wave);
        setTimeout(() => wave.remove(), 900);
    },

    // --- Étape 2 : les cartes face cachée, à retourner une par une ---
    // options.summary : ligne de récap affichée au-dessus (lots x5/x10).
    _renderBoosterCards(reveal, result, rarities, onDone, options = {}) {
        reveal.innerHTML = `
            ${options.summary ? `<div class="booster-bundle-summary">${this._escapeText(options.summary)}</div>` : ''}
            ${options.summary ? `<button type="button" class="btn booster-flip-all" data-flip-all>RETOURNER TOUTES LES CARTES</button>` : ''}
            <div class="booster-cards">
                ${result.cards.map(({ card, isNew, refund }, i) => {
                    // Aura d'anticipation : les hautes raretés brillent AVANT
                    // d'être retournées — le suspense monte d'un cran.
                    const aura = ['epique', 'legendaire', 'brillante'].includes(card.rarity)
                        ? ` booster-flip--aura-${card.rarity}` : '';
                    const mythique = card.family === 'mythologie' ? ' grimoire-card--mythique' : '';
                    return `
                    <button type="button" class="booster-flip${aura}" style="animation-delay: ${i * 0.15}s"
                        data-index="${i}" aria-label="Carte ${i + 1}, toucher pour retourner">
                        <div class="booster-flip-inner">
                            <div class="booster-flip-back">
                                <span class="booster-flip-back-logo">${this.grimoireLogoSvg(44)}</span>
                            </div>
                            <div class="booster-flip-front booster-card ${this._cardRarityClass(card.rarity)}${mythique}">
                                <img class="grimoire-card-img" src="${this._escapeText(card.image)}" alt="">
                                <div class="grimoire-card-name">${this._escapeText(card.name)}</div>
                                <div class="booster-card-tag">${isNew
                                    ? `<span class="booster-new">NOUVEAU !</span>`
                                    : `<span class="booster-dupe">doublon +${refund} 🪙</span>`}</div>
                                <div class="booster-card-rarity" style="color: ${this._escapeText(rarities[card.rarity]?.color || '#8d99ae')}">${this._escapeText(rarities[card.rarity]?.label || '')}</div>
                            </div>
                        </div>
                    </button>
                `;
                }).join('')}
            </div>
            <div class="booster-hint">Retourne tes cartes !</div>
            <button type="button" class="btn card card--action booster-done-btn is-hidden">
                <span class="card-title">SUPER !</span>
            </button>
        `;

        let flipped = 0;
        const total = result.cards.length;
        const buttons = Array.from(reveal.querySelectorAll('.booster-flip'));
        // Lots : retourner 30 cartes une par une serait punitif. Le bouton
        // rejoue les mêmes clics (donc mêmes effets/sons), légèrement décalés
        // pour garder la mise en scène plutôt que tout révéler d'un bloc.
        const flipAllBtn = reveal.querySelector('[data-flip-all]');
        if (flipAllBtn) {
            flipAllBtn.onclick = () => {
                flipAllBtn.disabled = true;
                buttons.forEach((b, i) => {
                    if (b.classList.contains('is-flipped')) return;
                    setTimeout(() => b.click(), i * 90);
                });
            };
        }

        // Roulement de tambour : quand il ne reste qu'une carte à retourner
        // et qu'elle contient une haute rareté, elle tremble d'impatience.
        const updateDrumroll = () => {
            const remaining = buttons.filter((b) => !b.classList.contains('is-flipped'));
            if (remaining.length === 1) {
                const rarity = result.cards[Number(remaining[0].dataset.index)]?.card?.rarity;
                if (['epique', 'legendaire', 'brillante'].includes(rarity)) {
                    remaining[0].classList.add('is-drumroll');
                }
            }
        };

        buttons.forEach((btn) => {
            btn.onclick = () => {
                if (btn.classList.contains('is-flipped')) return;
                btn.classList.add('is-flipped');
                btn.classList.remove('is-drumroll');
                const rarity = result.cards[Number(btn.dataset.index)]?.card?.rarity;

                if (['epique', 'legendaire', 'brillante'].includes(rarity)) {
                    btn.classList.add('is-high-rarity');
                    if (window.AudioFeedback?.playPerfect) AudioFeedback.playPerfect();
                    // Rayons de lumière rotatifs derrière la carte, aux
                    // couleurs de sa rareté
                    const rays = document.createElement('span');
                    rays.className = 'flip-rays';
                    rays.style.setProperty('--ray-color', this._rarityGlowColors[rarity] || '#f3b13c');
                    btn.appendChild(rays);
                    setTimeout(() => rays.remove(), 2600);
                }
                // Légendaire et Prismatique : pluie de confettis en plus
                if (['legendaire', 'brillante'].includes(rarity)) {
                    this.launchCelebration();
                }

                flipped++;
                updateDrumroll();
                if (flipped === total) {
                    const hint = reveal.querySelector('.booster-hint');
                    if (hint) hint.textContent = '';
                    const done = reveal.querySelector('.booster-done-btn');
                    if (done) {
                        done.classList.remove('is-hidden');
                        done.onclick = onDone;
                    }
                }
            };
        });
        updateDrumroll();
    },

    renderParentsPinPad(onDigit, onBackspace) {
        const container = document.getElementById('parents-pin-keypad');
        if (!container) return;
        const keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '⌫', '0'];
        container.innerHTML = "";
        keys.forEach((key) => {
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'parents-pin-key';
            if (key === '⌫') {
                btn.classList.add('parents-pin-key--back');
                btn.setAttribute('aria-label', 'Effacer');
                btn.textContent = '⌫';
                btn.onclick = () => onBackspace();
            } else {
                btn.textContent = key;
                btn.onclick = () => onDigit(key);
            }
            container.appendChild(btn);
        });
    },

    renderParentsDashboard(profiles) {
        const container = document.getElementById('parents-dashboard-list');
        if (!container) return;

        if (!profiles || profiles.length === 0) {
            container.innerHTML = `<p class="screen-lead">Aucun profil enfant pour le moment.</p>`;
            return;
        }

        container.innerHTML = profiles.map((profile) => {
            const percent = profile.maxStars > 0 ? Math.round((profile.totalStars / profile.maxStars) * 100) : 0;
            const unlockedBadges = (profile.badges || []).filter((b) => b.unlocked).length;
            const lastActivityText = profile.lastTimestamp
                ? new Date(profile.lastTimestamp).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })
                : 'Jamais';
            const streakText = profile.streak?.current > 0
                ? `🔥 ${profile.streak.current} jour${profile.streak.current > 1 ? 's' : ''}`
                : 'Pas de série en cours';

            const weekly = profile.weekly || { attempts: 0, stars: 0, activeDays: 0 };
            const weeklyText = weekly.attempts > 0
                ? `Cette semaine : ${weekly.attempts} exercice${weekly.attempts > 1 ? 's' : ''} fait${weekly.attempts > 1 ? 's' : ''} sur ${weekly.activeDays} jour${weekly.activeDays > 1 ? 's' : ''}, ${weekly.stars} ★ gagnées.`
                : "Cette semaine : pas encore d'activité.";

            const toReview = Array.isArray(profile.toReview) ? profile.toReview : [];
            const toReviewHtml = toReview.length > 0 ? `
                <div class="parents-profile-review">
                    <div class="parents-profile-review-title">À réviser en priorité</div>
                    ${toReview.map((entry) => `
                        <div class="parents-profile-review-item">
                            <span>${this._escapeText(entry.title)}</span>
                            <span class="parents-profile-review-meta">${this._escapeText(entry.subjectTitle)} · ${this._escapeText(entry.gradeTitle)} · ${entry.percent}%</span>
                        </div>
                    `).join('')}
                </div>` : '';

            return `
                <div class="parents-profile-card">
                    <div class="parents-profile-head">
                        <span class="parents-profile-avatar" aria-hidden="true">${this._escapeText(profile.appearance?.avatar || '🐣')}</span>
                        <span class="parents-profile-name">${this._escapeText(profile.name)}</span>
                    </div>
                    <div class="progress-bar-track">
                        <div class="progress-bar-fill" style="width: ${percent}%"></div>
                    </div>
                    <div class="parents-profile-stats">
                        <span>${profile.totalDone}/${profile.totalExercises} exercices</span>
                        <span>${profile.totalStars}/${profile.maxStars} ★</span>
                        <span>${unlockedBadges} badge${unlockedBadges > 1 ? 's' : ''}</span>
                    </div>
                    <div class="parents-profile-footer">
                        <span>${streakText}</span>
                        <span>Dernière activité : ${lastActivityText}</span>
                    </div>
                    <div class="parents-profile-weekly">${this._escapeText(weeklyText)}</div>
                    ${toReviewHtml}
                </div>`;
        }).join('');
    },

    renderProgramOverview(grades, gradeDataById) {
        const container = document.getElementById('parents-program-content');
        if (!container) return;

        if (!grades || grades.length === 0) {
            container.innerHTML = `<p class="screen-lead">Programme non disponible (données non chargées).</p>`;
            return;
        }

        // Canonical subject order for display
        const SUBJECT_ORDER = ['maths', 'francais', 'histoire', 'geo', 'sciences', 'emc'];
        const subjectSortKey = (subjectId) => {
            const idx = SUBJECT_ORDER.findIndex((key) => subjectId.includes(key));
            return idx === -1 ? 99 : idx;
        };

        container.innerHTML = grades.map((grade) => {
            const gradeData = gradeDataById[grade.id];
            if (!gradeData) return '';
            const subjects = Array.isArray(gradeData.subjects) ? [...gradeData.subjects] : [];

            // Sort subjects in canonical curriculum order
            subjects.sort((a, b) => subjectSortKey(a.id) - subjectSortKey(b.id));

            const totalExercises = subjects.reduce((sum, s) =>
                sum + (s.subthemes || []).reduce((ss, t) => ss + (t.exercises || []).length, 0), 0);

            const subjectsHtml = subjects.map((subject) => {
                const subthemes = subject.subthemes || [];
                const subExCount = subthemes.reduce((sum, t) => sum + (t.exercises || []).length, 0);

                const subthemesHtml = subthemes.map((subtheme) => {
                    const exCount = (subtheme.exercises || []).length;
                    return `<li class="program-subtheme">
                        <span class="program-subtheme-title">${this._escapeText(subtheme.title)}</span>
                        <span class="program-subtheme-count">${exCount} ex.</span>
                    </li>`;
                }).join('');

                return `<div class="program-subject">
                    <div class="program-subject-head">
                        <span class="program-subject-icon" aria-hidden="true">${this._escapeText(subject.icon || '')}</span>
                        <span class="program-subject-title">${this._escapeText(subject.title)}</span>
                        <span class="program-subject-count">${subExCount} exercices</span>
                    </div>
                    <ul class="program-subtheme-list">${subthemesHtml}</ul>
                </div>`;
            }).join('');

            return `<div class="program-grade">
                <div class="program-grade-head">
                    <span class="program-grade-icon" aria-hidden="true">${this._escapeText(grade.icon || '')}</span>
                    <span class="program-grade-title">${this._escapeText(grade.title)}</span>
                    <span class="program-grade-count">${totalExercises} exercices au total</span>
                </div>
                ${subjectsHtml}
            </div>`;
        }).join('');
    }
};

window.UI = UI;
window.addEventListener('DOMContentLoaded', () => UI.initNavigation());



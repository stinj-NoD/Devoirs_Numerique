const UIVisuals = {
    drawSvgTarget(p) {
        const d = p.data || {};
        const s = 200;
        const c = s / 2;
        const sortedZones = [...(d.zonesDefinitions || [])].sort((a, b) => b - a);
        const colors = ['#4A90E2', '#FF6B6B', '#FFD700', '#48bb78', '#9F7AEA'];

        let svg = `<svg viewBox="0 0 ${s} ${s}" width="180" height="180">`;

        if (sortedZones.length === 0) return svg + `<text x="100" y="100">Erreur Zone</text></svg>`;

        sortedZones.forEach((val, i) => {
            const r = 90 - (i * (90 / sortedZones.length));
            svg += `<circle cx="${c}" cy="${c}" r="${r}" fill="${colors[i % colors.length]}" stroke="white" stroke-width="2"/>`;
            svg += `<text x="${c}" y="${c - r + 15}" text-anchor="middle" font-size="12" font-weight="bold" fill="white" style="text-shadow: 1px 1px 2px rgba(0,0,0,0.5)">${val}</text>`;
        });

        (d.hits || []).forEach(h => {
            const zoneIdx = sortedZones.indexOf(h.val);
            if (zoneIdx === -1) return;

            const rHit = 90 - (zoneIdx * (90 / sortedZones.length)) - 10;
            const tx = c + rHit * Math.cos(h.angle);
            const ty = c + rHit * Math.sin(h.angle);
            svg += `<circle cx="${tx}" cy="${ty}" r="6" fill="black" stroke="white" stroke-width="2"/>`;
        });

        return `<div class="visual-card visual-card--target">${svg}</svg></div>`;
    },

    getDivisionSteps(dividend, divisor) {
        const dividendStr = dividend.toString();
        const steps = [];
        let currentPart = "";

        for (let i = 0; i < dividendStr.length; i++) {
            currentPart += dividendStr[i];
            const currentVal = parseInt(currentPart, 10);
            const q = Math.floor(currentVal / divisor);

            if (q > 0 || i === dividendStr.length - 1) {
                const sub = q * divisor;
                const remainder = currentVal - sub;

                steps.push({
                    sub: sub,
                    rem: remainder,
                    nextDigit: dividendStr[i + 1] || "",
                    endIndex: i,
                    partLength: currentPart.length
                });

                currentPart = remainder.toString();
                if (remainder === 0) currentPart = "";
            }
        }

        return steps;
    },

    drawSquare(p) {
        const d = p.data || {};
        const nums = d.numbers || [];
        const gridSize = Math.sqrt(nums.length || 9);
        const selected = d.selectedIndices || [];

        return `<div class="square-container">
            <div class="target-badge">CIBLE : ${d.target || "?"}</div>
            <div class="square-grid" style="--square-cols:${gridSize}">
                ${nums.map((n, idx) => {
                    const isSelected = selected.includes(idx);
                    return `<div class="number-card ${isSelected ? 'selected' : ''}" data-idx="${idx}">${n}</div>`;
                }).join('')}
            </div>
        </div>`;
    },

    drawBird(p) {
        const d = p.data || {};
        return `<div class="sky-container visual-card visual-card--bird">
            <div class="bird-container" style="--bird-duration:${d.duration || 8}s;">
                <div class="bird-bubble">${d.question || "?"}</div>
                <div class="bird-sprite">\u{1F426}</div>
            </div>
        </div>`;
    },

    drawFraction(p) {
        const d = p.data || {};
        const denom = d.d || 1;
        const num = d.n || 0;

        const radius = 60;
        const center = 80;
        let paths = "";

        for (let i = 0; i < denom; i++) {
            const a1 = (i * 2 * Math.PI) / denom - Math.PI / 2;
            const a2 = ((i + 1) * 2 * Math.PI) / denom - Math.PI / 2;
            const x1 = center + radius * Math.cos(a1);
            const y1 = center + radius * Math.sin(a1);
            const x2 = center + radius * Math.cos(a2);
            const y2 = center + radius * Math.sin(a2);
            const color = i < num ? 'var(--primary)' : 'white';
            paths += `<path d="M ${center} ${center} L ${x1} ${y1} A ${radius} ${radius} 0 0 1 ${x2} ${y2} Z" fill="${color}" stroke="var(--dark)" stroke-width="2" />`;
        }

        return `<div class="fraction-display visual-card visual-card--fraction"><svg viewBox="0 0 160 160" width="140" height="140">${paths}</svg></div>`;
    },

    drawClockCard(p) {
        const d = p.data || {};
        const mins = d.minutes || 0;
        const hours = d.hours || 0;
        const s = 160;
        const c = s / 2;
        const r = 70;
        const ma = (mins / 60) * 360;
        const ha = ((hours % 12) / 12) * 360 + (mins / 60) * 30;

        const periodInfo = `<div class="period-badge">${d.periodIcon || '\u{1F550}'} ${d.periodText || ''}</div>`;

        let svg = `<svg width="${s}" height="${s}" viewBox="0 0 ${s} ${s}"><circle cx="${c}" cy="${c}" r="${r}" fill="white" stroke="var(--dark)" stroke-width="3"/>`;

        for (let i = 1; i <= 12; i++) {
            const a = (i * 30) * (Math.PI / 180);
            const x = c + (r - 16) * Math.sin(a);
            const y = c - (r - 16) * Math.cos(a);
            svg += `<text x="${x}" y="${y}" text-anchor="middle" dominant-baseline="middle" font-size="12px" font-weight="bold" fill="var(--dark)">${i}</text>`;
        }

        svg += `<line x1="${c}" y1="${c}" x2="${c + 35 * Math.sin(ha * Math.PI / 180)}" y2="${c - 35 * Math.cos(ha * Math.PI / 180)}" stroke="var(--dark)" stroke-width="6" stroke-linecap="round"/>`;
        svg += `<line x1="${c}" y1="${c}" x2="${c + 52 * Math.sin(ma * Math.PI / 180)}" y2="${c - 52 * Math.cos(ma * Math.PI / 180)}" stroke="var(--secondary)" stroke-width="4" stroke-linecap="round"/>`;
        svg += `<circle cx="${c}" cy="${c}" r="4" fill="var(--dark)"/>`;
        svg += `</svg>`;

        return `<div class="visual-card visual-card--clock clock-card">${periodInfo}${svg}</div>`;
    },

    drawTimeMemoCard(p) {
        const d = p.data || {};
        const text = d.memoText || "1 h = 60 min";

        const memoHtml = d.showMemo ? `
            <div class="time-memo-badge">
                RAPPEL : ${text}
            </div>` : '';

        return `
            <div class="time-memo-card visual-card visual-card--time">
                ${memoHtml}
                <div class="time-memo-question">${p.question}</div>
                <div class="time-memo-spacer"></div>
            </div>`;
    },

    drawMoneyCard(p) {
        const d = p.data || {};
        const specs = { 1: { kind: 'coin', tone: 'bronze' }, 2: { kind: 'coin', tone: 'silver' }, 5: { kind: 'bill', tone: 'green' }, 10: { kind: 'bill', tone: 'red' }, 20: { kind: 'bill', tone: 'blue' }, 50: { kind: 'bill', tone: 'gold' } };
        const hits = d.hits || [];

        const items = hits.map((item) => {
            const val = (typeof item === 'object') ? item.val : item;
            const spec = specs[val] || specs[1];
            return `
                <div class="money-token money-token--${spec.kind} money-token--${spec.tone}">
                    <span class="money-token-value">${val}</span>
                    <span class="money-token-currency">EUR</span>
                </div>`;
        }).join('');

        return `
            <div class="money-card visual-card visual-card--money">
                <div class="money-stage">
                    ${items || '<div class="money-empty-state">Aucune piece a afficher</div>'}
                </div>
            </div>`;
    },

    drawCountingCard(p) {
        const d = p.data || {};
        const tens = d.tens || 0;
        const units = d.units || 0;

        const tensHtml = Array.from({ length: tens }, () => `
            <div class="ten-stack">
                ${Array.from({ length: 10 }, () => '<div class="ten-stack-cube"></div>').join('')}
            </div>
        `).join('');

        const unitsHtml = Array.from({ length: units }, () => '<div class="unit-cube"></div>').join('');

        return `
            <div class="counting-card visual-card visual-card--counting">
                <div class="counting-stage">
                    ${tensHtml}
                    ${units > 0 ? `<div class="units-grid">${unitsHtml}</div>` : ''}
                </div>
            </div>`;
    },

    drawConversionCard(p) {
        const d = p.data || {};
        let cols = ['km', 'hm', 'dam', 'm', 'dm', 'cm', 'mm'];
        if (d.type === 'masse') cols = ['kg', 'hg', 'dag', 'g', 'dg', 'cg', 'mg'];
        if (d.type === 'capacite') cols = ['kL', 'hL', 'daL', 'L', 'dL', 'cL', 'mL'];

        const headerHtml = cols.map((unit) => {
            const isHighlight = unit === d.u1 || unit === d.u2;
            return `<div class="conversion-unit ${isHighlight ? 'conversion-unit--active' : ''}">${unit}</div>`;
        }).join('');

        return `
            <div class="conversion-card visual-card visual-card--conversion">
                <div class="conversion-prompt">
                    <span class="conversion-value">${d.val}</span>
                    <span class="conversion-source">${d.u1}</span>
                    <span class="conversion-arrow">-&gt;</span>
                    <span class="conversion-target-value">?</span>
                    <span class="conversion-target">${d.u2}</span>
                </div>
                <div class="conversion-grid">
                    ${headerHtml}
                </div>
                <div class="conversion-hint">Utilise le tableau pour t'aider.</div>
            </div>`;
    },

    drawDivisionCard(p, input) {
        const d = p.data || {};
        const dividend = d.dividend || 0;
        const divisor = d.divisor || 1;
        const divStr = dividend.toString();
        const width = divStr.length;
        const steps = this.getDivisionSteps(dividend, divisor);
        const buildDigits = (value, startIndex, colorLast = false) => {
            const str = value.toString();
            const cells = Array.from({ length: width }, () => '&nbsp;');
            str.split('').forEach((char, offset) => {
                const targetIndex = startIndex + offset;
                if (targetIndex >= 0 && targetIndex < width) cells[targetIndex] = char;
            });

            return cells.map((char, idx) => {
                const filledChars = str.length;
                const isLast = colorLast && idx === (startIndex + filledChars - 1) && char.trim() !== '';
                const cls = isLast ? 'division-cell division-cell-next' : 'division-cell';
                return `<span class="${cls}">${char}</span>`;
            }).join('');
        };
        const buildRow = (sign, value, startIndex, variant = '', underlineLength = 0, colorLast = false) => {
            const rowClass = variant ? ` division-row--${variant}` : '';
            const lineStart = underlineLength > 0 ? 2 + startIndex : 0;
            const lineEnd = underlineLength > 0 ? lineStart + underlineLength : 0;
            const lineHtml = underlineLength > 0
                ? `<span class="division-row-line" style="grid-column:${lineStart} / ${lineEnd};"></span>`
                : '';
            return `
                <div class="division-row${rowClass}">
                    <span class="division-sign">${sign || '&nbsp;'}</span>
                    ${buildDigits(value, startIndex, colorLast)}
                    ${lineHtml}
                </div>`;
        };

        let workRows = buildRow('', divStr, 0);
        steps.forEach((step) => {
            const subStr = step.sub.toString();
            const subStart = step.endIndex - subStr.length + 1;
            const fullRemStr = `${step.rem}${step.nextDigit || ''}`;
            const remEnd = step.nextDigit ? step.endIndex + 1 : step.endIndex;
            const remStart = remEnd - fullRemStr.length + 1;
            workRows += buildRow('-', subStr, subStart, 'sub', subStr.length);
            workRows += buildRow('', fullRemStr, remStart, 'result', 0, !!step.nextDigit);
        });

        return `
            <div class="division-card visual-card visual-card--division">
                <div class="division-layout">
                    <div class="division-work" style="--division-width:${width};">
                        ${workRows}
                    </div>
                    <div class="division-side">
                        <div class="division-divisor">${divisor}</div>
                        <div class="division-quotient-panel">
                            <div class="division-quotient-value">${input || '?'}</div>
                            <div class="division-quotient-label">Quotient</div>
                        </div>
                    </div>
                </div>
            </div>`;
    }
};

/*
 * Devoir Numerique - Security Helpers
 * Hardening utilitaires runtime (XSS/DOM injection)
 */
(function () {
    const MAX_TEXT_LENGTH = 5000;

    function asString(value) {
        if (value === null || value === undefined) return '';
        return String(value);
    }

    function clampText(value) {
        const text = asString(value);
        if (text.length <= MAX_TEXT_LENGTH) return text;
        return text.slice(0, MAX_TEXT_LENGTH);
    }

    function escapeHtml(value) {
        const text = clampText(value);
        return text
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }

    function escapeAttr(value) {
        return escapeHtml(value).replace(/`/g, '&#96;');
    }

    function sanitizeId(value) {
        return asString(value).replace(/[^a-zA-Z0-9_-]/g, '').slice(0, 80);
    }

    function safeImagePath(path) {
        const raw = asString(path).trim();
        if (!raw) return '';
        if (/^data:image\/(?:png|jpeg|jpg|webp|gif|svg\+xml);base64,[a-z0-9+/=]+$/i.test(raw)) return raw;
        if (/^(?:\.\/)?(?:data\/|img\/|images\/|assets\/)[a-zA-Z0-9/_-]+\.(?:png|jpe?g|webp|gif|svg)$/i.test(raw)) return raw;
        return '';
    }

    function clampNumber(value, min = 0, max = Number.MAX_SAFE_INTEGER, fallback = 0) {
        const num = Number(value);
        if (!Number.isFinite(num)) return fallback;
        if (num < min) return min;
        if (num > max) return max;
        return num;
    }

    const SecurityUtils = Object.freeze({
        escapeHtml,
        escapeAttr,
        sanitizeId,
        safeImagePath,
        clampNumber
    });

    window.SecurityUtils = SecurityUtils;
})();

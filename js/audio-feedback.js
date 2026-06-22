/*
 * Devoir Numérique
 * Sons de feedback synthétiques (Web Audio API, sans fichier audio)
 */

const AudioFeedback = {
    _ctx: null,

    _getContext() {
        if (this._ctx) return this._ctx;
        const Ctor = window.AudioContext || window.webkitAudioContext;
        if (!Ctor) return null;
        this._ctx = new Ctor();
        return this._ctx;
    },

    _isEnabled() {
        return typeof Storage !== 'undefined' && Storage.getPreference
            ? !Storage.getPreference('sound_muted')
            : true;
    },

    _playTone(frequencies, duration = 0.16, type = 'sine', gainValue = 0.12) {
        if (!this._isEnabled()) return;
        const ctx = this._getContext();
        if (!ctx) return;
        if (ctx.state === 'suspended') ctx.resume().catch(() => {});

        const now = ctx.currentTime;
        frequencies.forEach((freq, index) => {
            const startAt = now + index * (duration * 0.55);
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = type;
            osc.frequency.setValueAtTime(freq, startAt);
            gain.gain.setValueAtTime(0, startAt);
            gain.gain.linearRampToValueAtTime(gainValue, startAt + 0.012);
            gain.gain.exponentialRampToValueAtTime(0.001, startAt + duration);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(startAt);
            osc.stop(startAt + duration + 0.02);
        });
    },

    playCorrect() {
        this._playTone([523.25, 659.25, 783.99], 0.15, 'sine', 0.1);
    },

    playIncorrect() {
        this._playTone([220, 196], 0.22, 'sine', 0.09);
    },

    playPerfect() {
        this._playTone([523.25, 659.25, 783.99, 1046.5], 0.18, 'sine', 0.11);
    },

    playClick() {
        this._playTone([440], 0.05, 'square', 0.04);
    }
};

window.AudioFeedback = AudioFeedback;

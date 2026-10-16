// Procedural Web Audio API Sound Engine (zero external audio files needed)

class SpaceAudioEngine {
  constructor() {
    this.ctx = null;
    this.isMuted = true;
    this.droneGain = null;
    this.osc1 = null;
    this.osc2 = null;
    this.filter = null;
    this.initialized = false;
  }

  init() {
    if (this.initialized) return;
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      this.ctx = new AudioCtx();

      // Master drone
      this.droneGain = this.ctx.createGain();
      this.droneGain.gain.setValueAtTime(0, this.ctx.currentTime);

      this.filter = this.ctx.createBiquadFilter();
      this.filter.type = 'lowpass';
      this.filter.frequency.setValueAtTime(160, this.ctx.currentTime);
      this.filter.Q.setValueAtTime(3, this.ctx.currentTime);

      // Low cosmic drone oscillators
      this.osc1 = this.ctx.createOscillator();
      this.osc1.type = 'sawtooth';
      this.osc1.frequency.setValueAtTime(55, this.ctx.currentTime); // A1 note

      this.osc2 = this.ctx.createOscillator();
      this.osc2.type = 'sine';
      this.osc2.frequency.setValueAtTime(55.4, this.ctx.currentTime); // gentle beating

      this.osc1.connect(this.filter);
      this.osc2.connect(this.filter);
      this.filter.connect(this.droneGain);
      this.droneGain.connect(this.ctx.destination);

      this.osc1.start();
      this.osc2.start();

      this.initialized = true;
    } catch (e) {
      console.warn('Web Audio API unavailable:', e);
    }
  }

  toggleMute() {
    if (!this.initialized) {
      this.init();
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }

    this.isMuted = !this.isMuted;

    if (this.droneGain && this.ctx) {
      const targetGain = this.isMuted ? 0 : 0.05;
      this.droneGain.gain.cancelScheduledValues(this.ctx.currentTime);
      this.droneGain.gain.linearRampToValueAtTime(targetGain, this.ctx.currentTime + 1.2);
    }

    if (!this.isMuted) {
      this.playChime(440, 'sine', 0.1, 0.05);
    }

    return !this.isMuted;
  }

  playChime(freq = 523.25, type = 'sine', duration = 0.3, vol = 0.04) {
    if (this.isMuted || !this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
      
      gain.gain.setValueAtTime(vol, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch (e) {
      // Audio fallback silent
    }
  }

  playWarp() {
    if (this.isMuted || !this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(120, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, this.ctx.currentTime + 0.5);
      
      gain.gain.setValueAtTime(0.03, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.6);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.6);
    } catch (e) {
      // fallback
    }
  }
}

export const spaceAudio = new SpaceAudioEngine();

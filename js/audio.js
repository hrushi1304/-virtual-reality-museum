/**
 * audio.js – Web Audio API Sound Synthesizer
 *
 * Generates all audio procedurally in the browser using the Web Audio API.
 * This guarantees ZERO external audio file dependencies, ZERO 404 errors,
 * and ZERO CORS issues when running locally.
 *
 * Includes:
 *  - Ambient museum room drone (soft atmospheric resonance)
 *  - Subtle footstep sounds when the player walks
 *  - UI interaction chimes (open/close panel, hover)
 */

class SoundManager {
  constructor() {
    this.ctx = null;
    this.isMuted = false;
    this.ambientGain = null;
    this.ambientOsc1 = null;
    this.ambientOsc2 = null;
    this.lastStepTime = 0;
    this.stepInterval = 0.42; // seconds between footsteps
  }

  // Initialize on first user gesture (browser requirement)
  init() {
    if (this.ctx) return;
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioCtx();
      this.setupAmbience();
    } catch (e) {
      console.warn('Web Audio API not supported in this browser.', e);
    }
  }

  // Soft atmospheric museum ambience
  setupAmbience() {
    if (!this.ctx) return;

    // Master ambient gain
    this.ambientGain = this.ctx.createGain();
    this.ambientGain.gain.setValueAtTime(this.isMuted ? 0 : 0.04, this.ctx.currentTime);
    this.ambientGain.connect(this.ctx.destination);

    // Warm low-frequency drone (55Hz / A1)
    this.ambientOsc1 = this.ctx.createOscillator();
    this.ambientOsc1.type = 'sine';
    this.ambientOsc1.frequency.setValueAtTime(55, this.ctx.currentTime);

    // Harmonic overtone (110Hz / A2) with soft filter
    this.ambientOsc2 = this.ctx.createOscillator();
    this.ambientOsc2.type = 'triangle';
    this.ambientOsc2.frequency.setValueAtTime(110, this.ctx.currentTime);

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(220, this.ctx.currentTime);

    this.ambientOsc1.connect(this.ambientGain);
    this.ambientOsc2.connect(filter);
    filter.connect(this.ambientGain);

    this.ambientOsc1.start();
    this.ambientOsc2.start();
  }

  // Synthesized footstep sound
  playFootstep() {
    if (!this.ctx || this.isMuted) return;
    const now = this.ctx.currentTime;
    if (now - this.lastStepTime < this.stepInterval) return;
    this.lastStepTime = now;

    try {
      // Noise buffer for heel-strike
      const bufferSize = this.ctx.sampleRate * 0.06; // 60ms
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const output = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.3));
      }

      const whiteNoise = this.ctx.createBufferSource();
      whiteNoise.buffer = buffer;

      // Filter to simulate marble floor reflection
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(800 + Math.random() * 200, now);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);

      whiteNoise.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      whiteNoise.start(now);
    } catch (e) {
      // Ignore audio glitches
    }
  }

  // Chime when opening an exhibit
  playExhibitOpen() {
    if (!this.ctx || this.isMuted) return;
    const now = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    // Arpeggiated two-tone chime (E5 -> B5)
    osc.frequency.setValueAtTime(659.25, now);
    osc.frequency.exponentialRampToValueAtTime(987.77, now + 0.12);

    gain.gain.setValueAtTime(0.12, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.5);
  }

  // Chime when closing
  playExhibitClose() {
    if (!this.ctx || this.isMuted) return;
    const now = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(587.33, now); // D5 down to A4
    osc.frequency.exponentialRampToValueAtTime(440.0, now + 0.15);

    gain.gain.setValueAtTime(0.08, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.3);
  }

  // Toggle Mute
  toggleMute() {
    this.isMuted = !this.isMuted;
    if (this.ambientGain && this.ctx) {
      this.ambientGain.gain.setValueAtTime(this.isMuted ? 0 : 0.04, this.ctx.currentTime);
    }
    return this.isMuted;
  }
}

export const soundManager = new SoundManager();

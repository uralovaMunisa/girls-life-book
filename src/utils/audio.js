// Web Audio API ambient sound generator & UI sound effects

class AmbientSoundEngine {
  constructor() {
    this.ctx = null;
    this.activeTrack = null;
    this.nodes = [];
    this.isMuted = false;
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  stopAll() {
    this.nodes.forEach(node => {
      try {
        if (node.stop) node.stop();
        if (node.disconnect) node.disconnect();
      } catch (e) {
        // ignore
      }
    });
    this.nodes = [];
    this.activeTrack = null;
  }

  // Play ambient track: 'rain', 'meditation', 'night'
  playTrack(trackName) {
    this.init();
    if (!this.ctx) return;
    this.stopAll();

    if (trackName === 'rain') {
      this._playRain();
      this.activeTrack = 'rain';
    } else if (trackName === 'meditation') {
      this._playMeditation();
      this.activeTrack = 'meditation';
    } else if (trackName === 'night') {
      this._playNightSky();
      this.activeTrack = 'night';
    }
  }

  _playRain() {
    const bufferSize = this.ctx.sampleRate * 2;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;

    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      output[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.04;
      b6 = white * 0.115926;
    }

    const whiteNoise = this.ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 800;

    const gain = this.ctx.createGain();
    gain.gain.value = 0.12;

    whiteNoise.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    whiteNoise.start();
    this.nodes.push(whiteNoise, filter, gain);
  }

  _playMeditation() {
    // 432Hz root note + 648Hz gentle fifth
    const freqs = [216, 432, 648];
    freqs.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.value = freq;

      gain.gain.value = 0.03 / (idx + 1);

      // Gentle LFO tremolo
      const lfo = this.ctx.createOscillator();
      const lfoGain = this.ctx.createGain();
      lfo.frequency.value = 0.1 + idx * 0.05;
      lfoGain.gain.value = 0.01;
      lfo.connect(lfoGain);
      lfoGain.connect(gain.gain);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      lfo.start();
      this.nodes.push(osc, gain, lfo, lfoGain);
    });
  }

  _playNightSky() {
    // Ethereal subtle resonance
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    osc.type = 'triangle';
    osc.frequency.value = 174; // Solfeggio soothing frequency

    filter.type = 'lowpass';
    filter.frequency.value = 400;

    gain.gain.value = 0.05;

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    this.nodes.push(osc, filter, gain);
  }

  // Play a short pleasant chime when an action completes
  playChime(type = 'success') {
    try {
      this.init();
      if (!this.ctx) return;
      const notes = type === 'success' ? [523.25, 659.25, 783.99, 1046.50] : [440, 554.37];
      notes.forEach((freq, i) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.value = freq;

        const startTime = this.ctx.currentTime + i * 0.07;
        gain.gain.setValueAtTime(0, startTime);
        gain.gain.linearRampToValueAtTime(0.08, startTime + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.4);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(startTime);
        osc.stop(startTime + 0.45);
      });
    } catch (e) {
      // ignore
    }
  }
}

export const soundEngine = new AmbientSoundEngine();


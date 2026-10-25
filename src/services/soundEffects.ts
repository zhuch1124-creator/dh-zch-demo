// Procedural Web Audio API sound generator for authentic Dunhuang ambiance
class SoundEffectsService {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private ambientGain: GainNode | null = null;
  private bgmAudio: HTMLAudioElement | null = null;
  private bgmVolume: number = 0.55;
  private isBgmPlaying: boolean = false;
  private customBgmName: string = '莫高窟 · 丝路冥想禅乐';

  private listeners: Set<() => void> = new Set();

  public subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify() {
    this.listeners.forEach((fn) => {
      try {
        fn();
      } catch {
        // Silent catch to prevent test harness noise
      }
    });
  }

  private initContext() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  // Initialize or start continuous background music
  public startBgm(src: string = '/audio_assets/dunhuang_bgm.mp3', title?: string) {
    if (typeof window === 'undefined') return;
    if (title) this.customBgmName = title;

    if (!this.bgmAudio) {
      this.bgmAudio = new Audio(src);
      this.bgmAudio.loop = true;
      this.bgmAudio.preload = 'auto';
      this.bgmAudio.addEventListener('play', () => {
        this.isBgmPlaying = true;
        this.notify();
      });
      this.bgmAudio.addEventListener('pause', () => {
        this.isBgmPlaying = false;
        this.notify();
      });
    } else if (this.bgmAudio.src !== src && !this.bgmAudio.src.endsWith(src)) {
      this.bgmAudio.src = src;
    }

    this.bgmAudio.volume = this.isMuted ? 0 : this.bgmVolume;
    const playPromise = this.bgmAudio.play();
    if (playPromise !== undefined) {
      playPromise.then(() => {
        this.isBgmPlaying = true;
        this.notify();
      }).catch(() => {
        // Autoplay policy waiting for user gesture
        this.isBgmPlaying = false;
        this.notify();
      });
    }
  }

  public setCustomAudio(url: string, title: string) {
    this.customBgmName = title;
    if (this.bgmAudio) {
      this.bgmAudio.pause();
      this.bgmAudio.src = url;
      this.bgmAudio.load();
      this.bgmAudio.play().then(() => {
        this.isBgmPlaying = true;
        this.notify();
      }).catch(() => {
        this.notify();
      });
    } else {
      this.startBgm(url, title);
    }
  }

  public pauseBgm() {
    if (this.bgmAudio) {
      this.bgmAudio.pause();
      this.isBgmPlaying = false;
      this.notify();
    }
  }

  public resumeBgm() {
    if (this.bgmAudio) {
      this.bgmAudio.volume = this.isMuted ? 0 : this.bgmVolume;
      this.bgmAudio.play().then(() => {
        this.isBgmPlaying = true;
        this.notify();
      }).catch(() => {
        this.notify();
      });
    } else {
      this.startBgm();
    }
  }

  public toggleBgm() {
    if (this.isBgmPlaying) {
      this.pauseBgm();
    } else {
      this.resumeBgm();
    }
    return this.isBgmPlaying;
  }

  public setBgmVolume(volume: number) {
    this.bgmVolume = Math.max(0, Math.min(1, volume));
    if (this.bgmAudio) {
      this.bgmAudio.volume = this.isMuted ? 0 : this.bgmVolume;
    }
    this.notify();
  }

  public getBgmVolume() {
    return this.bgmVolume;
  }

  public getIsBgmPlaying() {
    return this.isBgmPlaying;
  }

  public getBgmTitle() {
    return this.customBgmName;
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (this.bgmAudio) {
      this.bgmAudio.volume = muted ? 0 : this.bgmVolume;
    }
    if (this.ambientGain) {
      this.ambientGain.gain.setValueAtTime(muted ? 0 : 0.08, this.ctx ? this.ctx.currentTime : 0);
    }
    this.notify();
  }

  public getMuted() {
    return this.isMuted;
  }

  // Play a traditional meditative bronze chime (Singing Bowl / Dunhuang Temple Chime)
  public playTempleBell() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const freqs = [216, 432, 648, 864, 1296];
    const decay = 3.5;

    freqs.forEach((freq, idx) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq * (1 + (Math.random() - 0.5) * 0.01), t);

      const amp = (0.2 / (idx + 1)) * (idx === 0 ? 1 : 0.6);
      gain.gain.setValueAtTime(0.0001, t);
      gain.gain.exponentialRampToValueAtTime(amp, t + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.00001, t + decay / (idx * 0.5 + 1));

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(t);
      osc.stop(t + decay);
    });
  }

  // Guqin Pentatonic note (Gong, Shang, Jiao, Zhi, Yu: 宮商角徵羽)
  public playGuqinPluck(noteIndex: number = 0) {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    // Pentatonic scale starting at D3: D3, E3, G3, A3, C4, D4, E4
    const pentatonic = [146.83, 164.81, 196.00, 220.00, 261.63, 293.66, 329.63, 392.00];
    const freq = pentatonic[noteIndex % pentatonic.length];

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(freq, t);

    // Warm pluck filter
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(freq * 6, t);
    filter.frequency.exponentialRampToValueAtTime(freq * 1.5, t + 1.2);

    gain.gain.setValueAtTime(0.0001, t);
    gain.gain.linearRampToValueAtTime(0.18, t + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 1.4);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(t);
    osc.stop(t + 1.5);
  }

  // Torch crackle / flame ignite sound
  public playTorchIgnite() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const bufferSize = this.ctx.sampleRate * 0.4;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (this.ctx.sampleRate * 0.12));
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(320, t);
    filter.frequency.exponentialRampToValueAtTime(140, t + 0.4);
    filter.Q.value = 3.0;

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.25, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.4);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    noise.start(t);
  }

  // Brush stroke sound when painting
  public playBrushStroke() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const bufferSize = this.ctx.sampleRate * 0.15;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * 0.4;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1200 + Math.random() * 400, t);
    filter.Q.value = 4.0;

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.08, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.14);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    noise.start(t);
  }

  // Ancient treasure chest discovered and opened
  public playTreasureUnlock() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const notes = [440, 554.37, 659.25, 880, 1108.73, 1318.51]; // A maj arpeggio
    notes.forEach((freq, idx) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const noteTime = t + idx * 0.08;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, noteTime);

      gain.gain.setValueAtTime(0.0001, noteTime);
      gain.gain.linearRampToValueAtTime(0.15, noteTime + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, noteTime + 1.2);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(noteTime);
      osc.stop(noteTime + 1.3);
    });
  }

  // Quiz correct answer chime
  public playCorrectChime() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    [523.25, 659.25, 783.99, 1046.5].forEach((freq, idx) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const noteTime = t + idx * 0.07;

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, noteTime);

      gain.gain.setValueAtTime(0.001, noteTime);
      gain.gain.linearRampToValueAtTime(0.14, noteTime + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, noteTime + 0.8);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(noteTime);
      osc.stop(noteTime + 0.9);
    });
  }

  // Quiz wrong answer sound
  public playWrongChime() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    [240, 220].forEach((freq, idx) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const noteTime = t + idx * 0.15;

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, noteTime);

      gain.gain.setValueAtTime(0.001, noteTime);
      gain.gain.linearRampToValueAtTime(0.1, noteTime + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, noteTime + 0.3);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(noteTime);
      osc.stop(noteTime + 0.35);
    });
  }

  // Grand celebration / Flying Apsaras awakening
  public playAwakeningFanfare() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    this.playTempleBell();
    const chords = [
      [261.63, 329.63, 392.00, 523.25],
      [293.66, 369.99, 440.00, 587.33],
      [329.63, 415.30, 493.88, 659.25],
      [392.00, 493.88, 587.33, 783.99],
      [523.25, 659.25, 783.99, 1046.50]
    ];

    chords.forEach((chord, step) => {
      chord.forEach((freq) => {
        if (!this.ctx) return;
        const t = this.ctx.currentTime + step * 0.22;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, t);

        gain.gain.setValueAtTime(0.0001, t);
        gain.gain.linearRampToValueAtTime(0.08, t + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.0001, t + 1.2);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(t);
        osc.stop(t + 1.3);
      });
    });
  }

  // Voice narration using speech synthesis if supported
  public speakText(text: string) {
    if (this.isMuted) return;
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'zh-CN';
      utterance.rate = 0.92;
      utterance.pitch = 0.95;
      window.speechSynthesis.speak(utterance);
    }
  }

  public stopSpeaking() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }
}

export const soundManager = new SoundEffectsService();

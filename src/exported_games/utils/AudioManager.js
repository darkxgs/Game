export class AudioManager {
    constructor() {
        // Initialize lazily to avoid auto-play policy issues
        this.ctx = null;
        this.enabled = true;
        this.lastTickTime = 0;
        this.masterGain = null;
        this.compressor = null;
        this.noiseBuffer = null;
    }

    _init() {
        if (!this.ctx) {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            this.ctx = new AudioContext();

            // Set up a compressor to prevent clipping and glue sounds together
            this.compressor = this.ctx.createDynamicsCompressor();
            this.compressor.threshold.setValueAtTime(-24, this.ctx.currentTime);
            this.compressor.knee.setValueAtTime(30, this.ctx.currentTime);
            this.compressor.ratio.setValueAtTime(12, this.ctx.currentTime);
            this.compressor.attack.setValueAtTime(0.003, this.ctx.currentTime);
            this.compressor.release.setValueAtTime(0.25, this.ctx.currentTime);

            this.masterGain = this.ctx.createGain();
            this.masterGain.gain.setValueAtTime(0.8, this.ctx.currentTime);

            this.compressor.connect(this.masterGain);
            this.masterGain.connect(this.ctx.destination);

            // Create noise buffer for percussion/ticks
            const bufferSize = this.ctx.sampleRate * 2; // 2 seconds
            this.noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
            const output = this.noiseBuffer.getChannelData(0);
            for (let i = 0; i < bufferSize; i++) {
                output[i] = Math.random() * 2 - 1;
            }
        }
        if (this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
    }

    resume() {
        this._init();
    }

    // --- PLINKO ---
    
    playTick() {
        if (!this.enabled) return;
        this._init();
        if (this.ctx.state === 'suspended') return;

        const now = this.ctx.currentTime;
        if (now - this.lastTickTime < 0.03) return; // Prevent machine-gun effect
        this.lastTickTime = now;

        // Wood/plastic click sound: short burst of filtered noise
        const noise = this.ctx.createBufferSource();
        noise.buffer = this.noiseBuffer;
        
        const filter = this.ctx.createBiquadFilter();
        filter.type = 'bandpass';
        // Randomize pitch slightly for organic feel
        filter.frequency.setValueAtTime(1000 + Math.random() * 500, now); 
        filter.Q.setValueAtTime(1.5, now);

        const gain = this.ctx.createGain();
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.03); // Very short decay

        noise.connect(filter);
        filter.connect(gain);
        gain.connect(this.compressor);

        noise.start(now);
        noise.stop(now + 0.03);
    }

    playWin(multiplier) {
        if (!this.enabled) return;
        this._init();
        if (this.ctx.state === 'suspended') return;

        const now = this.ctx.currentTime;
        
        // Pleasant major chord (C Major or similar depending on multiplier)
        let root = 261.63; // C4
        if (multiplier >= 2) root = 329.63; // E4
        if (multiplier >= 10) root = 392.00; // G4
        if (multiplier >= 50) root = 523.25; // C5

        const playNote = (freq, type, delay, duration) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            
            osc.type = type;
            osc.frequency.setValueAtTime(freq, now + delay);
            
            gain.gain.setValueAtTime(0, now + delay);
            gain.gain.linearRampToValueAtTime(0.08, now + delay + 0.05); // smooth attack
            gain.gain.exponentialRampToValueAtTime(0.001, now + delay + duration);
            
            osc.connect(gain);
            gain.connect(this.compressor);
            
            osc.start(now + delay);
            osc.stop(now + delay + duration);
        };

        // Chime: Root, Major 3rd, Perfect 5th (arpeggio)
        playNote(root, 'sine', 0, 0.4);
        playNote(root * 1.25, 'sine', 0.05, 0.4);
        playNote(root * 1.5, 'sine', 0.1, 0.5);
    }

    // --- CRASH ---

    playCrashTick(multiplier) {
        if (!this.enabled) return;
        this._init();
        if (this.ctx.state === 'suspended') return;

        const now = this.ctx.currentTime;
        if (now - this.lastTickTime < 0.1) return;
        this.lastTickTime = now;

        // Soft, futuristic blip
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        // Base freq is 400Hz, climbs very slowly logarithmically
        const freq = 400 + (Math.log10(Math.max(1, multiplier)) * 300);
        osc.frequency.setValueAtTime(freq, now);

        gain.gain.setValueAtTime(0.04, now); // Quiet blip
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);

        osc.connect(gain);
        gain.connect(this.compressor);

        osc.start(now);
        osc.stop(now + 0.1);
    }

    playCrashEnd() {
        if (!this.enabled) return;
        this._init();
        if (this.ctx.state === 'suspended') return;

        const now = this.ctx.currentTime;
        
        // Deep explosion impact: Low sine punch + filtered noise
        
        // 1. Sine Punch (808 kick style)
        const osc = this.ctx.createOscillator();
        const oscGain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(150, now);
        osc.frequency.exponentialRampToValueAtTime(20, now + 0.3); // rapid pitch drop
        
        oscGain.gain.setValueAtTime(0.5, now);
        oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.8);
        
        osc.connect(oscGain);
        oscGain.connect(this.compressor);
        osc.start(now);
        osc.stop(now + 0.8);

        // 2. Filtered noise explosion
        const noise = this.ctx.createBufferSource();
        noise.buffer = this.noiseBuffer;
        
        const filter = this.ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(1000, now);
        filter.frequency.exponentialRampToValueAtTime(100, now + 0.5);

        const noiseGain = this.ctx.createGain();
        noiseGain.gain.setValueAtTime(0.4, now);
        noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.8);

        noise.connect(filter);
        filter.connect(noiseGain);
        noiseGain.connect(this.compressor);
        noise.start(now);
        noise.stop(now + 0.8);
    }

    playCashout() {
        if (!this.enabled) return;
        this._init();
        if (this.ctx.state === 'suspended') return;

        const now = this.ctx.currentTime;
        
        // Golden "bling" sound
        const playNote = (freq, delay) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            
            // Triangle has a bell-like quality when filtered/enveloped
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(freq, now + delay);
            
            gain.gain.setValueAtTime(0.12, now + delay);
            gain.gain.exponentialRampToValueAtTime(0.001, now + delay + 0.4);
            
            osc.connect(gain);
            gain.connect(this.compressor);
            
            osc.start(now + delay);
            osc.stop(now + delay + 0.4);
        };

        // B major 6th interval for a pleasant "success" ring
        playNote(987.77, 0);       // B5
        playNote(1244.51, 0.08);   // D#6
    }
}

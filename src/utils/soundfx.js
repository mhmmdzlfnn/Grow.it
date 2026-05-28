const getAudioContext = () => {
  if (typeof window === 'undefined') return null;
  window.audioCtx = window.audioCtx || new (window.AudioContext || window.webkitAudioContext)();
  return window.audioCtx;
};

export const playBloop = () => {
  const ctx = getAudioContext();
  if (!ctx) return;
  if (ctx.state === 'suspended') ctx.resume();
  
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  
  osc.type = 'sine';
  osc.connect(gain);
  gain.connect(ctx.destination);
  
  osc.frequency.setValueAtTime(400, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 0.1);
  
  gain.gain.setValueAtTime(0, ctx.currentTime);
  gain.gain.linearRampToValueAtTime(0.5, ctx.currentTime + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);
  
  osc.start(ctx.currentTime);
  osc.stop(ctx.currentTime + 0.15);
};

export const playSwoosh = () => {
  const ctx = getAudioContext();
  if (!ctx) return;
  if (ctx.state === 'suspended') ctx.resume();
  
  const bufferSize = ctx.sampleRate * 0.5; // 0.5 seconds
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    data[i] = Math.random() * 2 - 1;
  }
  
  const noise = ctx.createBufferSource();
  noise.buffer = buffer;
  
  const filter = ctx.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.setValueAtTime(100, ctx.currentTime);
  filter.frequency.exponentialRampToValueAtTime(3000, ctx.currentTime + 0.2);
  filter.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.5);
  
  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0, ctx.currentTime);
  gain.gain.linearRampToValueAtTime(0.3, ctx.currentTime + 0.2);
  gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
  
  noise.connect(filter);
  filter.connect(gain);
  gain.connect(ctx.destination);
  
  noise.start();
};

let wateringAudioNodes = null;

export const startWateringSound = () => {
  const ctx = getAudioContext();
  if (!ctx) return;
  if (ctx.state === 'suspended') ctx.resume();

  if (wateringAudioNodes) return;

  // Create white noise for water splash sound
  const bufferSize = ctx.sampleRate * 2;
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    data[i] = Math.random() * 2 - 1;
  }

  const noise = ctx.createBufferSource();
  noise.buffer = buffer;
  noise.loop = true;

  // Bandpass filter to sculpt noise into water splash
  const filter = ctx.createBiquadFilter();
  filter.type = 'bandpass';
  filter.frequency.setValueAtTime(1200, ctx.currentTime);
  filter.Q.setValueAtTime(1.5, ctx.currentTime);

  // LFO to modulate filter frequency (creates wave/splashing animation feel)
  const lfo = ctx.createOscillator();
  lfo.type = 'sine';
  lfo.frequency.setValueAtTime(6, ctx.currentTime); // 6 Hz modulation
  
  const lfoGain = ctx.createGain();
  lfoGain.gain.setValueAtTime(400, ctx.currentTime); // modulate by +/- 400Hz

  lfo.connect(lfoGain);
  lfoGain.connect(filter.frequency);

  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0, ctx.currentTime);
  gain.gain.linearRampToValueAtTime(0.12, ctx.currentTime + 0.15); // smooth fade in

  noise.connect(filter);
  filter.connect(gain);
  gain.connect(ctx.destination);

  lfo.start();
  noise.start();

  wateringAudioNodes = { noise, lfo, gain, ctx };
};

export const stopWateringSound = () => {
  if (!wateringAudioNodes) return;
  const { noise, lfo, gain, ctx } = wateringAudioNodes;
  try {
    gain.gain.cancelScheduledValues(ctx.currentTime);
    gain.gain.setValueAtTime(gain.gain.value, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15); // smooth fade out
    setTimeout(() => {
      try {
        noise.stop();
        lfo.stop();
        noise.disconnect();
        lfo.disconnect();
      } catch (e) {}
    }, 200);
  } catch (err) {
    console.warn('Failed to stop watering sound gracefully:', err);
  }
  wateringAudioNodes = null;
};

export const playChime = () => {
  const ctx = getAudioContext();
  if (!ctx) return;
  if (ctx.state === 'suspended') ctx.resume();

  const now = ctx.currentTime;
  
  // Bright bell chime notes (harmonic intervals)
  const freqs = [659.25, 987.77, 1318.51, 1975.53]; 
  const gains = [0.12, 0.06, 0.04, 0.02];
  const decay = 1.2;

  freqs.forEach((f, idx) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(f, now);
    
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(gains[idx], now + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.001, now + decay);
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    osc.start(now);
    osc.stop(now + decay);
  });
};

export const playShutter = () => {
  const ctx = getAudioContext();
  if (!ctx) return;
  if (ctx.state === 'suspended') ctx.resume();

  const now = ctx.currentTime;

  // 1. Shutter Click (burst of highpass filtered noise)
  const clickBuffer = ctx.createBuffer(1, ctx.sampleRate * 0.05, ctx.sampleRate);
  const clickData = clickBuffer.getChannelData(0);
  for (let i = 0; i < clickData.length; i++) {
    clickData[i] = Math.random() * 2 - 1;
  }
  const clickSource = ctx.createBufferSource();
  clickSource.buffer = clickBuffer;

  const clickFilter = ctx.createBiquadFilter();
  clickFilter.type = 'highpass';
  clickFilter.frequency.setValueAtTime(3000, now);

  const clickGain = ctx.createGain();
  clickGain.gain.setValueAtTime(0.25, now);
  clickGain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

  clickSource.connect(clickFilter);
  clickFilter.connect(clickGain);
  clickGain.connect(ctx.destination);
  clickSource.start(now);

  // 2. Polaroid Motor "bzzzt" (short delay after click)
  const motorStart = now + 0.08;
  const motorDuration = 0.45;
  
  const osc = ctx.createOscillator();
  osc.type = 'sawtooth';
  osc.frequency.setValueAtTime(85, motorStart);
  
  const lowpass = ctx.createBiquadFilter();
  lowpass.type = 'lowpass';
  lowpass.frequency.setValueAtTime(250, motorStart);

  const motorGain = ctx.createGain();
  motorGain.gain.setValueAtTime(0, now);
  motorGain.gain.setValueAtTime(0, motorStart);
  motorGain.gain.linearRampToValueAtTime(0.06, motorStart + 0.05);
  motorGain.gain.exponentialRampToValueAtTime(0.001, motorStart + motorDuration);

  osc.connect(lowpass);
  lowpass.connect(motorGain);
  motorGain.connect(ctx.destination);

  osc.start(motorStart);
  osc.stop(motorStart + motorDuration);
};

import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, Sparkles } from 'lucide-react';

export const AudioAmbience: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const noiseNodeRef = useRef<AudioNode | null>(null);
  const oscillatorsRef = useRef<OscillatorNode[]>([]);

  const startAmbience = () => {
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AudioCtx();
      audioCtxRef.current = ctx;

      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(0.01, ctx.currentTime);
      masterGain.gain.exponentialRampToValueAtTime(0.08, ctx.currentTime + 3);
      masterGain.connect(ctx.destination);
      gainNodeRef.current = masterGain;

      // 1. Procedural Gentle Wind Noise Buffer
      const bufferSize = ctx.sampleRate * 4;
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      let lastOut = 0.0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        // Pink/Brown noise filter
        output[i] = (lastOut + 0.02 * white) / 1.02;
        lastOut = output[i];
        output[i] *= 2.5;
      }

      const whiteNoise = ctx.createBufferSource();
      whiteNoise.buffer = noiseBuffer;
      whiteNoise.loop = true;

      // Lowpass filter for deep soft wind howl
      const windFilter = ctx.createBiquadFilter();
      windFilter.type = 'lowpass';
      windFilter.frequency.setValueAtTime(320, ctx.currentTime);

      // Slow wind modulation LFO
      const lfo = ctx.createOscillator();
      lfo.frequency.setValueAtTime(0.15, ctx.currentTime);
      const lfoGain = ctx.createGain();
      lfoGain.gain.setValueAtTime(140, ctx.currentTime);
      lfo.connect(lfoGain);
      lfoGain.connect(windFilter.frequency);
      lfo.start();

      whiteNoise.connect(windFilter);
      windFilter.connect(masterGain);
      whiteNoise.start();
      noiseNodeRef.current = whiteNoise;

      // 2. Meditative Ice Crystal Pad (Chords: Eb Major / C Minor Ambient)
      const chordFreqs = [155.56, 196.00, 233.08, 311.13]; // Eb3, G3, Bb3, Eb4
      const oscs: OscillatorNode[] = [];
      chordFreqs.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime);

        const oscGain = ctx.createGain();
        oscGain.gain.setValueAtTime(0.012 / (idx + 1), ctx.currentTime);

        // Subtle detune for shimmer
        osc.detune.setValueAtTime((Math.random() - 0.5) * 8, ctx.currentTime);

        osc.connect(oscGain);
        oscGain.connect(masterGain);
        osc.start();
        oscs.push(osc);
      });
      oscillatorsRef.current = oscs;

      setIsPlaying(true);
    } catch (e) {
      console.warn('Web Audio API not allowed yet:', e);
    }
  };

  const stopAmbience = () => {
    if (audioCtxRef.current && gainNodeRef.current) {
      gainNodeRef.current.gain.exponentialRampToValueAtTime(0.0001, audioCtxRef.current.currentTime + 1.2);
      setTimeout(() => {
        audioCtxRef.current?.close();
        audioCtxRef.current = null;
        setIsPlaying(false);
      }, 1200);
    } else {
      setIsPlaying(false);
    }
  };

  const toggleAudio = () => {
    if (isPlaying) {
      stopAmbience();
    } else {
      startAmbience();
    }
  };

  useEffect(() => {
    return () => {
      if (audioCtxRef.current) {
        audioCtxRef.current.close();
      }
    };
  }, []);

  return (
    <button
      id="ambience-sound-toggle-btn"
      onClick={toggleAudio}
      title={isPlaying ? 'Mute Mountain Ambience' : 'Play Mountain Winter Soundscape'}
      className="group relative flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 hover:bg-white/10 backdrop-blur-md border border-white/15 text-xs text-slate-200 transition-all duration-300 hover:border-cyan-400/40 hover:shadow-[0_0_15px_rgba(56,189,248,0.25)]"
    >
      {isPlaying ? (
        <>
          <Volume2 className="w-4 h-4 text-cyan-400 animate-pulse" />
          <span className="hidden sm:inline font-mono-tech text-[11px] text-cyan-300">Winter Breeze On</span>
          {/* Animated sound wave bars */}
          <div className="flex items-center gap-0.5 h-3">
            <span className="w-0.5 bg-cyan-400 rounded-full animate-bounce [animation-delay:-0.3s] h-full" />
            <span className="w-0.5 bg-sky-400 rounded-full animate-bounce [animation-delay:-0.15s] h-2" />
            <span className="w-0.5 bg-indigo-400 rounded-full animate-bounce h-2.5" />
          </div>
        </>
      ) : (
        <>
          <VolumeX className="w-4 h-4 text-slate-400 group-hover:text-cyan-300 transition-colors" />
          <span className="hidden sm:inline font-mono-tech text-[11px] text-slate-300 group-hover:text-cyan-200">Soundscape</span>
        </>
      )}
    </button>
  );
};

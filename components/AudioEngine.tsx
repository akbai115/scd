
import React, { useEffect, useRef } from 'react';

interface AudioEngineProps {
  mouseVelocity: number;
  isStarted: boolean;
  activeView: string;
  stems: {
    foundation: boolean;
    spirit: boolean;
    ambience: boolean;
  };
  transmissionTrigger?: number;
  clickTrigger?: number;
  isTransmissionActive?: boolean;
  isSpamming?: boolean;
}

export const AudioEngine: React.FC<AudioEngineProps> = ({ 
  mouseVelocity, 
  isStarted, 
  activeView, 
  stems,
  transmissionTrigger,
  clickTrigger,
  isTransmissionActive,
  isSpamming
}) => {
  const audioCtxRef = useRef<AudioContext | null>(null);
  const masterGainRef = useRef<GainNode | null>(null);
  const backgroundGainRef = useRef<GainNode | null>(null);
  const filterRef = useRef<BiquadFilterNode | null>(null);
  const organGainRef = useRef<GainNode | null>(null);
  
  const foundationGainRef = useRef<GainNode | null>(null);
  const spiritGainRef = useRef<GainNode | null>(null);
  const ambienceGainRef = useRef<GainNode | null>(null);

  useEffect(() => {
    if (!isStarted) return;

    const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    audioCtxRef.current = audioCtx;

    const masterGain = audioCtx.createGain();
    masterGain.gain.setValueAtTime(0, audioCtx.currentTime);
    masterGain.gain.linearRampToValueAtTime(0.5, audioCtx.currentTime + 1);
    masterGainRef.current = masterGain;

    const backgroundGain = audioCtx.createGain();
    backgroundGain.gain.setValueAtTime(1, audioCtx.currentTime);
    backgroundGainRef.current = backgroundGain;
    backgroundGain.connect(masterGain);

    const mainFilter = audioCtx.createBiquadFilter();
    mainFilter.type = 'lowpass';
    mainFilter.frequency.setValueAtTime(900, audioCtx.currentTime); 
    filterRef.current = mainFilter;
    
    const compressor = audioCtx.createDynamicsCompressor();
    compressor.threshold.setValueAtTime(-24, audioCtx.currentTime);
    compressor.ratio.setValueAtTime(12, audioCtx.currentTime);

    backgroundGain.connect(mainFilter);
    mainFilter.connect(compressor);
    compressor.connect(audioCtx.destination);

    // --- 1. THE FOUNDATION ---
    const fGain = audioCtx.createGain();
    fGain.gain.setValueAtTime(stems.foundation ? 0.12 : 0, audioCtx.currentTime);
    foundationGainRef.current = fGain;
    fGain.connect(backgroundGain);

    const frequencies = [77.78, 155.56, 196.00, 233.08, 311.13, 392.00]; // Eb Major
    frequencies.forEach((freq) => {
      const osc = audioCtx.createOscillator();
      const g = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
      osc.detune.setValueAtTime(Math.random() * 10 - 5, audioCtx.currentTime);
      g.gain.setValueAtTime(0.08, audioCtx.currentTime);
      osc.connect(g);
      g.connect(fGain);
      osc.start();
    });

    // --- 2. INDUSTRIAL ORGAN ---
    const organGain = audioCtx.createGain();
    organGain.gain.setValueAtTime(0.02, audioCtx.currentTime); 
    organGainRef.current = organGain;
    organGain.connect(backgroundGain);

    const organOsc = audioCtx.createOscillator();
    organOsc.type = 'sawtooth';
    organOsc.frequency.setValueAtTime(38.89, audioCtx.currentTime);
    
    const organFilter = audioCtx.createBiquadFilter();
    organFilter.type = 'lowpass';
    organFilter.frequency.setValueAtTime(150, audioCtx.currentTime);
    organFilter.Q.setValueAtTime(10, audioCtx.currentTime);

    organOsc.connect(organFilter);
    organFilter.connect(organGain);
    organOsc.start();

    // --- 3. THE SPIRIT ---
    const sGain = audioCtx.createGain();
    sGain.gain.setValueAtTime(stems.spirit ? 0.22 : 0, audioCtx.currentTime);
    spiritGainRef.current = sGain;
    sGain.connect(backgroundGain);

    const subBass = audioCtx.createOscillator();
    subBass.type = 'sine';
    subBass.frequency.setValueAtTime(38.89, audioCtx.currentTime);
    subBass.connect(sGain);
    subBass.start();

    // --- 4. AMBIENCE ---
    const aGain = audioCtx.createGain();
    aGain.gain.setValueAtTime(stems.ambience ? 0.02 : 0, audioCtx.currentTime);
    ambienceGainRef.current = aGain;
    aGain.connect(backgroundGain);

    return () => {
      audioCtx.close();
    };
  }, [isStarted]);

  useEffect(() => {
    if (!masterGainRef.current || !audioCtxRef.current) return;
    const now = audioCtxRef.current.currentTime;
    if (activeView === 'STILL') {
      masterGainRef.current.gain.setTargetAtTime(0.1, now, 2.0);
    } else if (isSpamming) {
      masterGainRef.current.gain.setTargetAtTime(0.001, now, 0.05);
    } else {
      masterGainRef.current.gain.setTargetAtTime(0.5, now, 1.0);
    }
  }, [isSpamming, activeView]);

  useEffect(() => {
    if (!backgroundGainRef.current || !audioCtxRef.current) return;
    const ctx = audioCtxRef.current;
    const now = ctx.currentTime;
    const targetVolume = (isTransmissionActive || activeView === 'STILL') ? 0.1 : 1.0;
    backgroundGainRef.current.gain.setTargetAtTime(targetVolume, now, 0.1);
  }, [isTransmissionActive, activeView]);

  useEffect(() => {
    if (!audioCtxRef.current || !filterRef.current || !organGainRef.current || !spiritGainRef.current || !foundationGainRef.current) return;
    const now = audioCtxRef.current.currentTime;
    
    if (activeView === 'STILL') {
       organGainRef.current.gain.setTargetAtTime(0.001, now, 2.0);
       filterRef.current.frequency.setTargetAtTime(40, now, 3.0);
       spiritGainRef.current.gain.setTargetAtTime(0.5, now, 3.0);
       foundationGainRef.current.gain.setTargetAtTime(0.01, now, 3.0);
       return;
    }

    const organVol = activeView === 'THE_ARK' ? 0.24 : activeView === 'ADMIN' ? 0.32 : 0.02;
    organGainRef.current.gain.setTargetAtTime(organVol, now, 1.0);
    spiritGainRef.current.gain.setTargetAtTime(stems.spirit ? 0.22 : 0, now, 1.0);
    foundationGainRef.current.gain.setTargetAtTime(stems.foundation ? 0.12 : 0, now, 1.0);

    if (activeView === 'YZY' || activeView === 'EVENTS' || activeView === 'ADMIN') {
      filterRef.current.frequency.setTargetAtTime(activeView === 'ADMIN' ? 1200 : 900, now, 1.0);
    } else {
      filterRef.current.frequency.setTargetAtTime(150, now, 1.0);
    }
  }, [activeView, stems]);

  useEffect(() => {
    if (!transmissionTrigger || !audioCtxRef.current || !masterGainRef.current || activeView === 'STILL') return;
    const ctx = audioCtxRef.current;
    const now = ctx.currentTime;
    
    const impactOsc = ctx.createOscillator();
    const impactGain = ctx.createGain();
    impactOsc.type = 'sawtooth';
    impactOsc.frequency.setValueAtTime(100, now);
    impactOsc.frequency.exponentialRampToValueAtTime(10, now + 1.5);
    impactGain.gain.setValueAtTime(0, now);
    impactGain.gain.linearRampToValueAtTime(0.8, now + 0.02);
    impactGain.gain.exponentialRampToValueAtTime(0.001, now + 3.0);
    impactOsc.connect(impactGain);
    impactGain.connect(masterGainRef.current);
    impactOsc.start(now);
    impactOsc.stop(now + 3.1);
  }, [transmissionTrigger, activeView]);

  useEffect(() => {
    if (!clickTrigger || !audioCtxRef.current || !masterGainRef.current || activeView === 'STILL') return;
    const ctx = audioCtxRef.current;
    const now = ctx.currentTime;
    
    const clickOsc = ctx.createOscillator();
    const clickGain = ctx.createGain();
    clickOsc.type = 'sine';
    clickOsc.frequency.setValueAtTime(60, now);
    clickGain.gain.setValueAtTime(0, now);
    clickGain.gain.linearRampToValueAtTime(0.05, now + 0.005);
    clickGain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
    clickOsc.connect(clickGain);
    clickGain.connect(masterGainRef.current);
    clickOsc.start(now);
    clickOsc.stop(now + 0.06);
  }, [clickTrigger, activeView]);

  return null;
};

import React, { useEffect, useRef, useState } from 'react';
import arkSound from '../ark.wav';
import { OilWater } from './OilWater';

export const Sovereignty: React.FC = () => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [showMessage, setShowMessage] = useState(false);

  useEffect(() => {
    const audio = new Audio(arkSound);
    audio.volume = 0.5;
    audio.play().catch(e => console.error("Audio playback interrupted", e));
    audioRef.current = audio;

    return () => {
      const fadeOut = setInterval(() => {
        if (audio.volume > 0.05) {
          audio.volume -= 0.05;
        } else {
          audio.pause();
          clearInterval(fadeOut);
        }
      }, 50);
    };
  }, []);

  return (
    <div className="fixed inset-0 bg-black z-[200] flex flex-col items-center justify-center animate-in fade-in duration-1000">

      {/* CENTER CONTENT */}
      <div
        className="relative z-20 flex flex-col items-center gap-12 cursor-default group"
        onMouseEnter={() => setShowMessage(true)}
      >
        <h1 className="times-bold text-6xl md:text-8xl text-white tracking-widest uppercase selection:bg-white selection:text-black">
          YZY ARK
        </h1>

        <div className="h-24 flex flex-col items-center justify-center text-center">
          <p
            className={`font-mono text-xs md:text-sm tracking-[0.3em] text-white/60 transition-all duration-1000 absolute ${showMessage ? 'opacity-0 translate-y-4 blur-[2px]' : 'opacity-100 translate-y-0 blur-0'}`}
          >
            the water hasn’t reached you yet
          </p>

          <div
            className={`flex flex-col gap-2 transition-all duration-1000 absolute ${showMessage ? 'opacity-100 translate-y-0 blur-0' : 'opacity-0 -translate-y-4 blur-[4px]'}`}
          >
            <p className="font-mono text-xs md:text-sm tracking-[0.3em] text-white/80">
              some things open
            </p>
            <p className="font-mono text-xs md:text-sm tracking-[0.3em] text-white/80">
              only when you’re present
            </p>
          </div>
        </div>
      </div>

      {/* BOTTOM WATER TEXTURE */}
      <OilWater />

    </div>
  );
};

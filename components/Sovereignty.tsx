import React, { useEffect, useRef } from 'react';
import arkSound from '../ark.wav';

export const Sovereignty: React.FC = () => {
  const audioRef = useRef<HTMLAudioElement | null>(null);

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
    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-auto transition-all duration-1000 animate-in fade-in zoom-in-95">
      {/* Geometric Logo: Hull + Diamond */}
      <div className="relative group flex flex-col items-center justify-center gap-10 hover:gap-12 transition-all duration-700">
        {/* Diamond Star */}
        <div className="w-12 h-12 bg-white rotate-45 transition-transform duration-700 group-hover:rotate-[225deg] group-hover:scale-110 shadow-2xl" />

        {/* Brutalist Hull (Semi-Circle) */}
        <div className="w-56 h-28 md:w-80 md:h-40 bg-white rounded-b-full transition-all duration-700 group-hover:scale-[1.02] shadow-2xl relative overflow-hidden">
          {/* Subtle reflection shine */}
          <div className="absolute -top-[50%] -left-[50%] w-[200%] h-[200%] bg-gradient-to-tr from-transparent via-white/5 to-transparent rotate-45 translate-y-[100%] group-hover:translate-y-[-100%] transition-transform duration-1000" />
        </div>

        {/* Ambient Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-white/5 blur-[100px] -z-10 rounded-full" />
      </div>

      <div className="mt-20 text-center max-w-2xl px-12">
        <div className="flex flex-col gap-6">
          <h3 className="times-bold text-4xl md:text-6xl tracking-tightest text-white opacity-90 leading-none uppercase">
            SECURE THE FUTURE.
          </h3>
          <p className="text-[11px] font-bold tracking-[0.8em] uppercase text-white/60 leading-relaxed max-w-lg mx-auto">
            THE ARK IS NOT FOR EVERYONE. IT IS FOR THE BELIEVERS. THE CLOSED-LOOP ECONOMY. ACCESS TO THE VISION IS EARNED THROUGH VIBRATION.
          </p>
        </div>
      </div>

      <style>{`
        .tracking-tightest { letter-spacing: -0.08em; }
      `}</style>
    </div>
  );
};

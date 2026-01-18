
import React from 'react';

interface TransmissionOverlayProps {
  message: string | null;
  imageUrl?: string | null;
  isSubliminal?: boolean;
  isDissolving: boolean;
}

const COLOR_MAP: Record<string, string> = {
  '0': '#000000', // Vantablack
  '1': '#C41E3A', // Industrial Red
  '2': '#2E5A27', // Moss Green
  '3': '#D4AF37', // Gold/Ochre
  '4': '#002366', // Royal Blue
  '5': '#4682B4', // Steel Blue
  '6': '#4B0082', // Indigo
  '7': '#EBE9E4', // Bone White
  '8': '#808080', // Slate Grey
  '9': '#8B4513', // Rust
};

export const TransmissionOverlay: React.FC<TransmissionOverlayProps> = ({ message, imageUrl, isSubliminal, isDissolving }) => {
  // Parsing function for ^ codes
  const renderColoredText = (text: string) => {
    const parts = text.split(/(\^\d)/);
    let currentColor = '#000000';

    return parts.map((part, index) => {
      if (part.startsWith('^') && part.length === 2) {
        const code = part[1];
        currentColor = COLOR_MAP[code] || '#000000';
        return null;
      }
      if (!part) return null;

      return (
        <span
          key={index}
          style={{
            color: currentColor,
            opacity: 0.8,
            textShadow: `0 0 2px ${currentColor}33`,
          }}
        >
          {part}
        </span>
      );
    });
  };

  return (
    <div className="absolute inset-0 z-[1200] pointer-events-none flex items-center justify-center overflow-hidden">
      {/* Background Darkening Overlay */}
      <div className={`absolute inset-0 bg-black/2 transition-opacity duration-1000 ${isDissolving ? 'opacity-0' : 'opacity-100'}`} />

      {/* Softened Alert Labels */}
      <div className={`absolute top-20 left-0 right-0 flex justify-center transition-opacity duration-1000 ${isDissolving ? 'opacity-0' : 'opacity-50'}`}>
        <span className="text-[10px] font-bold tracking-[2.5em] uppercase text-black">BROADCAST_SYSTEM</span>
      </div>

      {/* Main Content Area */}
      <div
        className={`relative transition-all duration-[3000ms] ease-in-out px-12 text-center w-full max-w-[80vw] flex items-center justify-center ${isDissolving ? 'opacity-0 scale-105 blur-[60px]' : 'opacity-100 scale-100 blur-0'
          }`}
      >
        {imageUrl ? (
          <div className={`relative ${isSubliminal ? 'animate-pulse duration-75' : ''}`}>
            <img
              src={imageUrl}
              alt="VISION"
              className="max-h-[80vh] max-w-full drop-shadow-2xl opacity-90 border-2 border-black/5"
              style={{ mixBlendMode: 'normal' }}
            />
            {isSubliminal && <div className="absolute inset-0 bg-white/10 mix-blend-overlay animate-pulse" />}
          </div>
        ) : (
          <h2 className="times-bold text-5xl md:text-[8rem] tracking-tightest leading-tight uppercase inline-block">
            {message && renderColoredText(message)}
          </h2>
        )}

        {/* Smoke Particle simulation - slowed down */}
        {isDissolving && (
          <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="absolute bg-black/5 rounded-full blur-3xl animate-pulse"
                style={{
                  width: `${200 + Math.random() * 300}px`,
                  height: `${200 + Math.random() * 300}px`,
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDuration: `${3 + Math.random() * 3}s`
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Lateral Indicators - further faded */}
      <div className={`absolute left-12 top-1/2 -translate-y-1/2 flex flex-col gap-32 opacity-40 transition-opacity duration-1000 ${isDissolving ? 'opacity-0' : ''}`}>
        <div className="w-[1px] h-24 bg-black" />
        <span className="times-bold text-lg uppercase [writing-mode:vertical-lr] rotate-180">OS_0.1</span>
      </div>
      <div className={`absolute right-12 top-1/2 -translate-y-1/2 flex flex-col gap-32 opacity-40 transition-opacity duration-1000 ${isDissolving ? 'opacity-0' : ''}`}>
        <span className="times-bold text-lg uppercase [writing-mode:vertical-lr]">OS_0.1</span>
        <div className="w-[1px] h-24 bg-black" />
      </div>
    </div>
  );
};

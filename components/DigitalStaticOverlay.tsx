import React from 'react';

export const DigitalStaticOverlay: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-[30] overflow-hidden">
      {/* 1. SOFT MONOCHROME STATIC */}
      <div className="absolute inset-0 opacity-[0.08] mix-blend-overlay">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] animate-noise" />
      </div>

      {/* 2. FAINT CROSS-PATTERN GRID */}
      <div
        className="absolute inset-0 opacity-[0.15]"
        style={{
          backgroundImage: `
            radial-gradient(circle, #000 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
          backgroundPosition: '0 0'
        }}
      />

      {/* CROSSES TEXTURE */}
      <div
        className="absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage: `linear-gradient(to right, #000 1px, transparent 1px), linear-gradient(to bottom, #000 1px, transparent 1px)`,
          backgroundSize: '80px 80px'
        }}
      />


      {/* 3. GENTLE IRREGULAR FLICKER */}
      <div className="absolute inset-0 bg-white/20 animate-flicker mix-blend-overlay pointer-events-none" />

      <style>{`
        @keyframes noise {
          0%, 100% { transform: translate(0, 0); }
          10% { transform: translate(-5%, -5%); }
          20% { transform: translate(-10%, 5%); }
          30% { transform: translate(5%, -10%); }
          40% { transform: translate(-5%, 15%); }
          50% { transform: translate(-10%, 5%); }
          60% { transform: translate(15%, 0); }
          70% { transform: translate(0, 10%); }
          80% { transform: translate(-15%, 0); }
          90% { transform: translate(10%, 5%); }
        }
        .animate-noise {
          animation: noise 0.5s steps(5) infinite;
        }
        
        @keyframes flicker {
          0% { opacity: 0.02; }
          5% { opacity: 0.05; }
          10% { opacity: 0.02; }
          15% { opacity: 0.06; }
          20% { opacity: 0.02; }
          40% { opacity: 0.02; }
          45% { opacity: 0.05; }
          50% { opacity: 0.02; }
          90% { opacity: 0.02; }
          95% { opacity: 0.07; }
          100% { opacity: 0.02; }
        }
        .animate-flicker {
          animation: flicker 4s infinite;
        }
      `}</style>
    </div>
  );
};

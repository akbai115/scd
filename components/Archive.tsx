
import React from 'react';

const BLUEPRINTS = [
  { id: 'RED_HAT', title: 'SUPERMAN_CAPE', desc: 'THE RED HAT MANIFESTO' },
  { id: 'FLOAT_01', title: 'SAINT_PABLO_STAGE', desc: 'GRAVITY_DEFYING_MONOLITH' },
  { id: 'FOAM_01', title: 'FOAM_ARCHITECTURE', desc: 'SKELETAL_SILHOUETTE' },
  { id: 'ARCH_BONE', title: 'YZY_STRUCTURE_01', desc: 'CONCRETE_MONUMENT' },
  { id: 'STEM_01', title: 'STEM_PLAYER_V1', desc: 'SOVEREIGN_HARDWARE_UNIT' },
  { id: 'BLAKE_01', title: 'ALWAYS_SESSION', desc: 'JAMES_BLAKE_BLUEPRINT' },
];

export const Archive: React.FC = () => {
  return (
    <div className="absolute inset-0 flex items-center overflow-x-auto overflow-y-hidden px-24 pointer-events-auto transition-all duration-1000 animate-in fade-in slide-in-from-bottom-10">
      <div className="flex gap-24 h-[60vh]">
        {BLUEPRINTS.map((bp, i) => (
          <div key={bp.id} className="w-[30vw] h-full flex flex-col group cursor-crosshair">
            <div className="flex-1 border border-white/10 bg-white/5 flex items-center justify-center p-12 transition-all duration-500 group-hover:bg-white/10 group-hover:border-white/30">
              {/* Procedural Geometric Placeholder for Architectural Study */}
              <div className="w-full h-full border border-white/5 relative overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className={`w-32 h-32 border-2 border-white/20 ${i % 2 === 0 ? 'rounded-full' : 'rotate-45'}`} />
                  <div className="absolute inset-12 border border-white/10" />
                  <div className="absolute h-full w-[1px] bg-white/5 left-1/2" />
                  <div className="absolute w-full h-[1px] bg-white/5 top-1/2" />
                </div>
                <div className="absolute bottom-4 left-4 text-[8px] font-bold opacity-50 uppercase text-white">REF_{bp.id}</div>
              </div>
            </div>
            <div className="mt-6 flex flex-col gap-1 text-white">
              <span className="text-[10px] font-bold tracking-[0.4em] opacity-60 uppercase">BLUEPRINT_FILE_{i + 1}</span>
              <span className="times-bold text-xl tracking-tighter uppercase">{bp.title}</span>
              <span className="text-[9px] font-bold tracking-[0.2em] opacity-70 uppercase">{bp.desc}</span>
            </div>
          </div>
        ))}
        <div className="w-[10vw] flex items-center justify-center opacity-40">
          <span className="text-4xl times-bold tracking-tighter uppercase">END_OF_PLAN</span>
        </div>
      </div>
    </div>
  );
};

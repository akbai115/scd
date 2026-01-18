
import React from 'react';

export const Infrastructure: React.FC = () => {
  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none transition-all duration-1000 animate-in zoom-in-95 fade-in">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-16 md:gap-32 text-black opacity-80 max-w-6xl p-12">
        <div className="flex flex-col gap-3 border-l border-black/10 pl-8">
          <span className="text-[10px] font-bold tracking-[0.8em] opacity-40 mb-2">SYSTEM_CORE</span>
          <p className="text-[11px] font-bold leading-relaxed uppercase tracking-widest opacity-60">
            ARCHITECTURE IN EVERY LAYER. THE FABRIC IS ALIVE. PROCEDURAL RESONANCE BASED ON EB MAJOR. 2.0.25 STABLE.
          </p>
        </div>
        
        <div className="flex flex-col gap-3 border-l border-black/10 pl-8">
          <span className="text-[10px] font-bold tracking-[0.8em] opacity-40 mb-2">PHILOSOPHY</span>
          <p className="text-[11px] font-bold leading-relaxed uppercase tracking-widest opacity-60">
            MINIMAL WORD COUNT. MAXIMUM IMPACT. EVERYTHING IS A FREESTYLE FIRST. CORRECT THE FAKES. BUILD IN SILENCE.
          </p>
        </div>

        <div className="flex flex-col gap-3 border-l border-black/10 pl-8">
          <span className="text-[10px] font-bold tracking-[0.8em] opacity-40 mb-2">YZY_DESIGN</span>
          <p className="text-[11px] font-bold leading-relaxed uppercase tracking-widest opacity-60">
            YEEZY IS ARCHITECTURE. CLOTHING SHOULD BE STRUCTURAL, TONAL, MINIMAL PALETTE. SILHOUETTE IS THE SOUL.
          </p>
        </div>

        <div className="flex flex-col gap-4 col-span-full border-t border-black/10 pt-12 mt-8">
          <div className="flex justify-between items-center mb-4">
            <span className="text-[10px] font-bold tracking-[1em] opacity-40">ACTIVE_CREATIVE_PILLARS_2025</span>
            <span className="text-[8px] font-bold tracking-widest opacity-20">BUILDING_SILENT_TOKYO</span>
          </div>
          <div className="flex flex-wrap gap-x-12 gap-y-6 text-[18px] md:text-[24px] times-bold tracking-tighter uppercase opacity-50">
            <span>CHIPMUNK_SOUL_CORE</span>
            <span>GOSPEL_RESONANCE</span>
            <span>INDUSTRIAL_MINIMALISM</span>
            <span>ARCHITECTURAL_SILHOUETTE</span>
            <span>AUTHENTICITY_VERIFICATION</span>
            <span>JAMES_BLAKE_FREESTYLE</span>
            <span>STEM_SEPARATION</span>
          </div>
        </div>
      </div>
    </div>
  );
};

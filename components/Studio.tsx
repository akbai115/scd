
import React from 'react';

interface StudioProps {
  stems: {
    foundation: boolean;
    spirit: boolean;
    ambience: boolean;
  };
  onToggleStem: (stem: 'foundation' | 'spirit' | 'ambience') => void;
  audioVolume: number;
  onAction: () => void;
}

export const Studio: React.FC<StudioProps> = ({ stems, onToggleStem, audioVolume, onAction }) => {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-auto transition-all duration-1000 animate-in fade-in zoom-in-95 px-16">
      <div className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-4 gap-12 lg:gap-20 items-center">
        
        {/* PANEL 1: RAW INPUT MONITOR */}
        <div className="hidden lg:flex flex-col gap-10 border border-black/5 bg-black/[0.01] p-10">
            <header className="flex flex-col gap-2">
                <span className="text-[10px] font-bold tracking-[1em] opacity-40 uppercase">SAMPLING_RAW</span>
                <div className="w-full h-[1px] bg-black/10" />
            </header>
            <div className="relative h-72 border border-black/20 flex items-center justify-center overflow-hidden bg-black/[0.03]">
                <div className="flex items-end gap-[1px] h-full w-full p-2">
                    {[...Array(24)].map((_, i) => (
                        <div 
                            key={i} 
                            className="flex-1 bg-black/60 transition-all duration-75"
                            style={{ height: `${Math.max(2, (Math.random() * 20 + audioVolume * 150) * (1 - Math.abs(i - 12) / 12))}%` }}
                        />
                    ))}
                </div>
                <div className="absolute top-4 right-4 flex gap-2">
                    <div className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
                    <span className="text-[8px] font-mono opacity-40">REC</span>
                </div>
            </div>
            <div className="flex flex-col gap-2">
                <span className="text-[9px] font-bold tracking-widest opacity-20 uppercase">ENGINE_OUTPUT</span>
                <span className="times-bold text-2xl tracking-tighter uppercase opacity-80">EB_MAJOR_DISTORT</span>
            </div>
        </div>

        {/* PANEL 2 & 3: THE MAIN CONSOLE */}
        <div className="lg:col-span-2 flex gap-8 md:gap-12 items-end justify-center">
            {Object.entries(stems).map(([key, active]) => (
            <div 
                key={key} 
                className="flex flex-col items-center group cursor-crosshair flex-1 max-w-[200px]"
                onClick={() => { onToggleStem(key as any); onAction(); }}
            >
                <div className={`w-full aspect-[1/3.5] border border-black/20 relative transition-all duration-1000 shadow-2xl flex flex-col justify-between p-8
                ${active ? 'bg-black/[0.1] -translate-y-12 shadow-[40px_40px_100px_rgba(0,0,0,0.15)]' : 'bg-transparent opacity-15 translate-y-6 scale-95'}
                `}>
                <div className="w-full h-[2px] bg-black/20 mb-12" />
                
                <div className="flex flex-col gap-4 [writing-mode:vertical-lr] rotate-180 items-center justify-center flex-1">
                    <span className="text-[18px] font-bold tracking-[1.2em] uppercase opacity-60 font-mono">
                    {key}
                    </span>
                    <div className={`w-[2.5px] h-48 transition-all duration-1000 ${active ? 'bg-black/60 h-64' : 'bg-black/5'}`} />
                </div>

                <div className="w-full flex justify-center mt-12">
                    <div className={`w-14 h-14 border-2 border-black/20 flex items-center justify-center transition-all duration-1000
                    ${active ? 'bg-black rotate-45 scale-110' : 'bg-transparent'}
                    `}>
                    {active && <div className="w-4 h-4 bg-white/40 rounded-full blur-[2px] animate-pulse" />}
                    </div>
                </div>
                </div>
                
                <div className="mt-16 flex flex-col items-center gap-2 opacity-30 group-hover:opacity-100 transition-opacity">
                    <span className="text-[10px] font-bold tracking-[0.8em] uppercase">MODULE_{key.toUpperCase()}</span>
                </div>
            </div>
            ))}
        </div>

        {/* PANEL 4: HARDWARE DATA */}
        <div className="hidden lg:flex flex-col gap-12 border-l border-black/10 pl-16">
            <header className="flex flex-col gap-2">
                <span className="text-[10px] font-bold tracking-[1em] opacity-40 uppercase">WAR_ENGINE_V1</span>
                <div className="w-12 h-[2px] bg-black" />
            </header>

            <div className="flex flex-col gap-10">
                <div className="flex flex-col gap-1">
                    <span className="text-[9px] font-bold tracking-widest opacity-30 uppercase">DRIVE_SATURATION</span>
                    <div className="times-bold text-4xl tracking-tighter uppercase">{Math.floor(audioVolume * 100)}%</div>
                </div>
                <div className="flex flex-col gap-1">
                    <span className="text-[9px] font-bold tracking-widest opacity-30 uppercase">SOVEREIGN_FREQ</span>
                    <div className="times-bold text-4xl tracking-tighter uppercase">432Hz</div>
                </div>
                <div className="flex flex-col gap-1">
                    <span className="text-[9px] font-bold tracking-widest opacity-30 uppercase">SYSTEM_STATE</span>
                    <div className="times-bold text-4xl tracking-tighter uppercase">BULLY</div>
                </div>
            </div>

            <div className="flex flex-col gap-4 mt-8">
                <button 
                    onClick={() => { onAction(); }}
                    className="w-full py-10 border-2 border-black flex items-center justify-center group relative overflow-hidden transition-all hover:bg-black hover:text-[#EBE9E4] active:scale-95"
                >
                    <span className="text-[11px] font-bold tracking-[1.5em] uppercase z-10">EXECUTE_CHOP</span>
                    <div className="absolute inset-0 bg-red-600/20 -translate-x-full group-hover:translate-x-0 transition-transform duration-500" />
                </button>
                <div className="flex justify-between items-center px-2 opacity-20">
                    <span className="text-[8px] font-mono">ENCRYPTED_LINE_77</span>
                    <div className="w-1.5 h-1.5 bg-black rounded-full" />
                </div>
            </div>
        </div>
      </div>
      
      <div className="mt-48 text-center max-w-4xl opacity-15">
        <div className="w-48 h-[1px] bg-black/20 mx-auto mb-16" />
        <div className="text-[11px] font-bold tracking-[2.5em] uppercase font-mono animate-pulse">
          YZY_MONUMENT_STUDIO_STABLE_02_01_2026
        </div>
      </div>

      <style>{`
        .tracking-tightest { letter-spacing: -0.1em; }
      `}</style>
    </div>
  );
};

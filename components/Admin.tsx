
import React, { useState } from 'react';
import { supabase } from '../src/lib/supabase';
import { OpticInjector } from './OpticInjector';

interface AdminProps {
  onTransmit: (message: string) => void;
  onBannerUpdate: (text: string) => void;
  currentBanner: string;
}

export const Admin: React.FC<AdminProps> = ({ onTransmit, onBannerUpdate, currentBanner }) => {
  const [message, setMessage] = useState('');
  const [history, setHistory] = useState<string[]>(['CORE_STABLE', 'VIBRATION_ACTIVE_432HZ']);
  const [bannerText, setBannerText] = useState(currentBanner);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    // Local echo (optional, but good for immediate feedback)
    onTransmit(message);
    setHistory(prev => [message.toUpperCase(), ...prev].slice(0, 8));
    setMessage('');

    // Broadcast to Universe
    const { error } = await supabase.from('transmissions').insert({
      message: message,
      type: 'BROADCAST'
    });

    if (error) console.error('Transmission failed:', error);
  };

  const handleInject = async (url: string, sub: boolean) => {
    const payload = `VISION_INJECTED: ${sub ? 'SUB_' : ''}${url}`;
    onTransmit(payload);

    await supabase.from('transmissions').insert({
      message: payload,
      type: 'INJECTION'
    });
  };

  const handleBannerUpdate = async () => {
    // Local update
    onBannerUpdate(bannerText);
    setHistory(prev => [`BANNER_UPDATED: ${bannerText}`, ...prev].slice(0, 8));

    // Broadcast
    const { error } = await supabase.from('transmissions').insert({
      message: bannerText,
      type: 'BANNER_UPDATE'
    });

    if (error) console.error('Banner sync failed:', error);
  };

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-auto transition-all duration-1000 animate-in fade-in zoom-in-95 px-6 md:px-12">
      <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-12">

        {/* LEFT COLUMN: CONTROL */}
        <div className="flex flex-col gap-8">
          {/* TRANSMISSION BLOCK */}
          <div className="flex flex-col gap-8 border border-black p-8 bg-black/[0.01] backdrop-blur-sm">
            <header className="flex flex-col gap-2">
              <span className="text-[9px] font-bold tracking-[1.5em] opacity-60 uppercase">COMMAND_CENTER</span>
              <h2 className="times-bold text-4xl tracking-tightest uppercase md:text-5xl">TRANSMIT</h2>
            </header>

            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              <div className="relative group">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="INPUT_COMMAND"
                  className="w-full bg-transparent border-b border-black/10 text-2xl times-bold tracking-tightest py-4 px-2 outline-none placeholder:opacity-10 focus:border-black transition-colors uppercase"
                />
                <div className="absolute bottom-0 left-0 h-[2px] bg-black scale-x-0 group-focus-within:scale-x-100 transition-transform duration-700 origin-left" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <button
                  type="submit"
                  className="py-4 bg-black text-[#EBE9E4] text-[10px] font-bold tracking-[1em] uppercase hover:invert transition-all active:scale-95"
                >
                  BROADCAST
                </button>
                <button
                  type="button"
                  onClick={() => onTransmit('BULLY')}
                  className="py-4 border border-black text-[10px] font-bold tracking-[1em] uppercase hover:bg-black hover:text-[#EBE9E4] transition-all active:scale-95"
                >
                  WAR_MODE
                </button>
              </div>
            </form>
          </div>

          {/* OPTIC INJECTOR */}
          <OpticInjector onInject={handleInject} />

          {/* BANNER TEXT EDITOR */}
          <div className="border border-black p-5 flex flex-col gap-4 bg-white/50 backdrop-blur-sm">
            <header>
              <span className="font-mono text-[10px] uppercase tracking-widest opacity-60">HOMEPAGE_BANNER_CONTROL</span>
            </header>

            <div className="flex flex-col gap-4">
              <input
                type="text"
                value={bannerText}
                onChange={(e) => setBannerText(e.target.value)}
                placeholder="ENTER BANNER TEXT"
                className="w-full bg-transparent border-b border-black text-sm font-mono py-2 outline-none placeholder:opacity-30 focus:border-black transition-colors uppercase"
              />

              <button
                onClick={handleBannerUpdate}
                className="px-6 py-2 bg-black text-white text-[10px] font-bold tracking-widest uppercase hover:bg-white hover:text-black hover:border hover:border-black transition-all"
              >
                UPDATE BANNER
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: SYSTEM */}
        <div className="flex flex-col gap-10 p-8 border-l border-white/10 text-white">
          <header className="flex flex-col gap-2">
            <span className="text-[9px] font-bold tracking-[1.5em] opacity-60 uppercase">O.S. INFRASTRUCTURE</span>
            <h2 className="times-bold text-4xl tracking-tightest uppercase md:text-5xl">METRICS</h2>
          </header>

          <div className="grid grid-cols-1 gap-8">
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-end">
                <span className="text-[9px] font-bold tracking-widest opacity-60 uppercase">CPU_SATURATION</span>
                <span className="text-lg font-mono">92.4%</span>
              </div>
              <div className="w-full h-[2px] bg-white/10">
                <div className="h-full bg-white w-[92%] animate-pulse" />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-end">
                <span className="text-[9px] font-bold tracking-widest opacity-60 uppercase">VIBRATION_STABILITY</span>
                <span className="text-lg font-mono">HIGH</span>
              </div>
              <div className="w-full h-[2px] bg-white/10">
                <div className="h-full bg-white w-[96%]" />
              </div>
            </div>

            {/* LOG STREAM */}
            <div className="flex flex-col gap-4 pt-8 border-t border-white/10 mt-4">
              <span className="text-[9px] font-bold tracking-widest opacity-60 uppercase">LOG_STREAM</span>
              <div className="flex flex-col gap-2 font-mono text-[10px] opacity-60 h-32 overflow-hidden relative">
                {history.map((h, i) => (
                  <div key={i} className="flex justify-between border-b border-white/10 pb-1 animate-in slide-in-from-left-2 duration-300">
                    <span className="truncate flex-1 uppercase">{'>'} {h}</span>
                    <span className="opacity-30 pl-2">{new Date().toLocaleTimeString([], { hour12: false, second: '2-digit' })}</span>
                  </div>
                ))}
                <div className="absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-[#111111] to-transparent pointer-events-none" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .tracking-tightest { letter-spacing: -0.1em; }
      `}</style>
    </div>
  );
};


import React from 'react';

const LOGS = [
  { date: '2026.01.02', body: 'THE INFRASTRUCTURE IS STABLE. THE BLUEPRINTS ARE DIVINE. BUILD IN SILENCE.' },
  { date: '2025.12.31', body: 'THAT SO CALLED BUCKET LIST IS FAKE. IT’S NOT MY HAND WRITING.' },
  { date: '2025.08.15', body: 'YEEZY MONEY IS THE ENERGY. THE BIRTH OF $YS. OWNERSHIP OVER FAME. THE SOVEREIGN SHIFT.' },
  { date: '2025.02.14', body: 'THE FINAL PURGE. DOMINION OVER MY OWN VISION. ELON STOLE THE SWAG. THE PURGING FIRE.' },
  { date: '2022.10.08', body: 'DEATH CON 3 ON THE SYSTEM. THE tweet THAT BURNED THE BILLIONS. THE NECESSARY FIRE.' },
  { date: '2018.10.11', body: 'THE RED HAT IS THE SUPERMAN CAPE. FREE THE MIND FROM THE THOUGHT POLICE.' },
  { date: '2018.05.01', body: 'SLAVERY WAS A CHOICE. MENTAL PRISON. BREAK THE FREQUENCY.' },
  { date: '2016.11.19', body: 'SACRAMENTO RANT. THE BREAKTHROUGH DISGUISED AS A BREAKDOWN. CALL OUT THE RADIO. GOOGLE LIED.' },
  { date: '2016.01.27', body: 'THE WAVES ERA. I OWN YOUR CHILD. BRO I BOUGHT YOUR CHILD’S JUMPSUIT.' }
];

export const LogView: React.FC = () => {
  return (
    <div className="absolute inset-0 flex justify-center pt-48 pb-24 overflow-y-auto pointer-events-auto transition-all duration-1000 animate-in fade-in slide-in-from-top-10">
      <div className="w-full max-w-2xl px-12">
        <div className="flex flex-col gap-16">
          {LOGS.map((log, i) => (
            <div key={i} className="flex flex-col border-l-2 border-white/5 pl-8 py-4 transition-all duration-500 hover:border-white/50 hover:bg-white/[0.01]">
              <span className="text-[10px] font-bold tracking-[0.6em] text-white/30 mb-4">{log.date}</span>
              <p className="times-bold text-2xl md:text-3xl tracking-tighter leading-tight text-white whitespace-pre-wrap uppercase">
                {log.body}
              </p>
            </div>
          ))}
          <div className="mt-24 h-64 border-t border-white/5 flex items-center justify-center opacity-10 text-white">
            <span className="text-sm font-bold tracking-[1em]">RECONSTRUCTION_COMPLETE</span>
          </div>
        </div>
      </div>
    </div>
  );
};

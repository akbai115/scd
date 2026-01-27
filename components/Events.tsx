
import React from 'react';

interface EventData {
  id: string;
  date: string;
  location: string;
  venue: string;
  status: 'SOLD OUT' | 'LAST TICKETS' | 'AVAILABLE';
  time: string;
}

const LIVE_DATES: EventData[] = [
  {
    id: 'CDMX_01',
    date: 'JAN 30, 2026',
    location: 'CDMX, MEXICO',
    venue: 'PLAZA DE TOROS',
    status: 'SOLD OUT',
    time: '21:00 CST'
  },
  {
    id: 'CDMX_02',
    date: 'JAN 31, 2026',
    location: 'CDMX, MEXICO',
    venue: 'PLAZA DE TOROS',
    status: 'LAST TICKETS',
    time: '21:00 CST'
  }
];

interface EventsProps {
  onNavigateToCheckout: () => void;
  onImpact: () => void;
}

export const Events: React.FC<EventsProps> = ({ onNavigateToCheckout, onImpact }) => {
  const handleEventClick = (event: EventData) => {
    if (event.status === 'SOLD OUT') {
      onImpact();
      if (navigator.vibrate) navigator.vibrate([50, 20, 50]);
    } else {
      onNavigateToCheckout();
    }
  };

  return (
    <div className="absolute inset-0 flex pointer-events-none transition-all duration-1000 animate-in fade-in">
      {/* LEFT PANEL: ATMOSPHERE */}
      <div className="hidden md:flex w-1/2 h-full flex-col justify-end p-24 opacity-20">
        <div className="flex flex-col gap-4">
          <span className="text-[10px] font-bold tracking-[1em] uppercase text-white/50">LIVE_FEED_01</span>
          <div className="w-full aspect-video border border-white/10 relative overflow-hidden">
            <div className="absolute inset-0 bg-white/5 animate-pulse" />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="times-bold text-sm tracking-widest opacity-30 text-white">SIGNAL_LOST</span>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT PANEL: LISTING */}
      <div className="w-full md:w-1/2 h-full flex flex-col justify-center px-12 md:px-24 pointer-events-auto bg-white/5 backdrop-blur-[2px]">
        <div className="max-w-xl">
          <header className="mb-20">
            <h1 className="times-bold text-4xl md:text-5xl tracking-[0.4em] mb-4 text-white uppercase opacity-40">
              SCHEDULE
            </h1>
            <div className="w-full h-[1px] bg-white/10 mb-8" />
            <p className="text-[14px] font-bold tracking-[0.8em] uppercase opacity-40 leading-relaxed text-white">
              PLAZA DE TOROS<br />CDMX, MEXICO.<br />RESURRECTION_LOOP
            </p>
          </header>

          <div className="flex flex-col gap-4">
            {LIVE_DATES.map((event) => (
              <div
                key={event.id}
                onClick={() => handleEventClick(event)}
                className="group relative py-12 border-b border-white/10 cursor-crosshair transition-all duration-500 hover:pl-8 text-white"
              >
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                  <div className="flex flex-col">
                    <div className="flex items-center gap-4 opacity-50 mb-2">
                      <span className="text-[9px] font-bold tracking-[0.4em] uppercase">{event.venue}</span>
                      <div className="w-1 h-1 bg-white rounded-full" />
                      <span className="text-[9px] font-mono tracking-widest">{event.time}</span>
                    </div>
                    <span className="times-bold text-5xl md:text-6xl tracking-tighter uppercase group-hover:scale-105 transition-transform origin-left text-white">
                      {event.date}
                    </span>
                  </div>

                  <div className="flex flex-col items-start md:items-end">
                    <span
                      className={`text-[11px] font-bold tracking-[0.5em] uppercase transition-all px-4 py-1 border border-transparent ${event.status === 'SOLD OUT'
                          ? 'opacity-20 line-through border-white/10'
                          : 'text-white border-white/40 animate-pulse'
                        }`}
                    >
                      {event.status}
                    </span>
                  </div>
                </div>
                <div className="absolute inset-0 bg-white/[0.02] opacity-0 group-hover:opacity-100 transition-opacity -z-10" />
              </div>
            ))}
          </div>

          <footer className="mt-32 flex justify-between items-center opacity-30 text-white">
            <span className="text-[9px] font-bold uppercase tracking-[1em]">YZY_CDMX_INFRASTRUCTURE</span>
            <div className="flex gap-4">
              <div className="w-2 h-2 bg-white rounded-full" />
              <div className="w-2 h-2 border border-white rounded-full" />
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
};

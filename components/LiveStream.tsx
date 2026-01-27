import React, { useState } from 'react';

export const LiveStream: React.FC = () => {
    const [activeTab, setActiveTab] = useState('HOME');

    const VIDEO_FEED = [
        { id: 1, title: 'VULTURES_LISTENING_EXP_01', views: '2.4M', time: 'LIVE NOW' },
        { id: 2, title: 'YZY_SEASON_10_BTS', views: '888K', time: '2 HOURS AGO' },
        { id: 3, title: 'SUNDAY_SERVICE_REHEARSAL', views: '1.2M', time: '1 DAY AGO' },
    ];

    return (
        <div className="absolute inset-0 flex flex-col items-center overflow-hidden font-sans text-white animate-in fade-in duration-700 pointer-events-auto">

            <div className="flex w-full h-full pt-56 px-6 md:px-12 gap-8">
                {/* SIDEBAR */}
                <div className="hidden md:flex flex-col w-64 h-full border-r border-white/10 pr-8 gap-8 opacity-60 hover:opacity-100 transition-opacity duration-500">
                    <h1 className="times-bold text-2xl tracking-tighter uppercase mb-4">YEEZYSTREAM</h1>

                    <nav className="flex flex-col gap-6">
                        <button
                            onClick={() => setActiveTab('HOME')}
                            className={`flex items-center gap-4 text-[10px] font-bold tracking-[0.2em] uppercase transition-all ${activeTab === 'HOME' ? 'opacity-100 decoration-white underline underline-offset-4' : 'opacity-40 hover:opacity-100'}`}
                        >
                            HOME
                        </button>
                    </nav>

                    <div className="w-full h-[1px] bg-white/10 my-2" />

                    <div className="flex flex-col gap-4">
                        <span className="text-[9px] font-bold tracking-[0.2em] uppercase opacity-40">SUBSCRIPTIONS</span>
                        <div className="flex items-center gap-3 opacity-60 hover:opacity-100 cursor-pointer">
                            <div className="w-4 h-4 rounded-full border border-white/20" />
                            <span className="text-[9px] uppercase font-bold tracking-widest">YZY TV</span>
                        </div>
                        <div className="flex items-center gap-3 opacity-60 hover:opacity-100 cursor-pointer">
                            <div className="w-4 h-4 rounded-full border border-white/20" />
                            <span className="text-[9px] uppercase font-bold tracking-widest">SUNDAY SERVICE</span>
                        </div>
                    </div>
                </div>

                {/* MAIN FEED */}
                <div className="flex-1 h-full overflow-y-auto pb-32 no-scrollbar">

                    {/* FEATURED VIDEO */}
                    <div className="w-full aspect-video bg-white/5 border border-white/10 relative mb-12 group cursor-pointer overflow-hidden backdrop-blur-sm">
                        <div className="absolute inset-0 flex items-center justify-center">
                            <span className="times-bold text-xl tracking-[0.5em] uppercase opacity-20 animate-pulse">OFFLINE_FEED</span>
                        </div>
                        <div className="absolute top-4 right-4 flex items-center gap-2">
                            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                            <span className="text-[9px] font-bold tracking-widest uppercase text-red-500/80">LIVE</span>
                        </div>
                        <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {VIDEO_FEED.map((video) => (
                            <div key={video.id} className="flex flex-col gap-3 group cursor-not-allowed opacity-50">
                                <div className="w-full aspect-video bg-white/5 border border-white/5 relative overflow-hidden backdrop-blur-[2px] grayscale">
                                    <div className="absolute inset-0 flex items-center justify-center z-10">
                                        <div className="bg-white/10 text-white border border-white/20 text-[8px] font-bold px-2 py-1 tracking-widest uppercase">LOCKED</div>
                                    </div>
                                </div>
                                <div className="flex gap-3">
                                    <div className="w-6 h-6 rounded-full border border-white/10 flex-shrink-0 grayscale" />
                                    <div className="flex flex-col">
                                        <span className="text-[10px] font-bold uppercase tracking-widest leading-tight">{video.title}</span>
                                        <span className="text-[8px] font-mono opacity-50 uppercase tracking-widest mt-1">LOCKED CONTENT</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

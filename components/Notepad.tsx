import React, { useState, useEffect, useRef } from 'react';

export const Notepad: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        if (isOpen && audioRef.current) {
            audioRef.current.currentTime = 0;
            audioRef.current.play().catch(e => console.log("Audio play failed", e));
        }
    }, [isOpen]);

    const [copied, setCopied] = useState(false);
    const ca = "54F9DbbQqZJKQdweH8WnwBEa8MWVNhUUdP3NJFREpump";

    const handleCopy = (e: React.MouseEvent) => {
        e.stopPropagation();
        navigator.clipboard.writeText(ca);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div
            onClick={() => setIsOpen(!isOpen)}
            className={`fixed left-4 md:left-[calc(50%-15rem)] bottom-24 md:top-1/2 md:bottom-auto md:-translate-y-1/2 z-[5000] cursor-pointer transition-all duration-700 ease-in-out shadow-xl hover:scale-105 ${isOpen
                ? 'w-56 md:w-64 h-72 md:h-80 bg-[#1a1a1a] rotate-1'
                : 'w-14 h-14 md:w-12 md:h-12 bg-[#222222] -rotate-3 hover:rotate-0'
                }`}
            style={{
                // "Organic" border radius for a crumpled paper look
                borderRadius: isOpen
                    ? '2px 3px 2px 4px / 4px 2px 3px 2px'
                    : '30% 20% 40% 25% / 25% 35% 20% 30%',
                boxShadow: isOpen
                    ? '1px 2px 25px rgba(0,0,0,0.5), 0 0 2px rgba(0,0,0,0.3), inset 0 0 40px rgba(0,0,0,0.2)'
                    : '2px 3px 8px rgba(0,0,0,0.4), inset 0 0 8px rgba(0,0,0,0.1)'
            }}
        >
            {/* Texture / Fold lines overlay */}
            <div className="absolute inset-0 pointer-events-none mix-blend-overlay opacity-30"
                style={{
                    backgroundImage: `
                        url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.5'/%3E%3C/svg%3E"),
                        linear-gradient(175deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.03) 30%, rgba(255,255,255,0) 31%, rgba(255,255,255,0) 100%),
                        linear-gradient(5deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.04) 40%, rgba(255,255,255,0) 41%, rgba(255,255,255,0) 100%),
                        radial-gradient(circle at 20% 80%, rgba(255,255,255,0.05) 0%, transparent 40%)
                    `,
                    backgroundSize: '200px 200px, 100% 100%, 100% 100%, 100% 100%'
                }}
            />
            {/* Edge highlighting for 3D feel */}
            <div className="absolute inset-0 pointer-events-none border border-black/5"
                style={{ borderRadius: 'inherit' }}
            />

            {/* Content Container */}
            <div className={`relative w-full h-full flex flex-col items-center justify-center overflow-hidden transition-all duration-500 delay-100 ${isOpen ? 'opacity-100' : 'opacity-0'}`}>

                {/* Handwritten manifesto text */}
                <div className="flex flex-col space-y-4 px-6 text-center rotate-1 opacity-90"
                    style={{
                        fontFamily: '"Courier Prime", "Courier New", monospace',
                        color: '#EBE9E4',
                        mixBlendMode: 'normal',
                        filter: 'blur(0.3px) contrast(1.1)',
                        textShadow: '0 0 1px rgba(255,255,255,0.1)'
                    }}
                >
                    <p className="text-[10px] uppercase font-bold tracking-widest leading-relaxed">
                        In a perfect world<br />
                        we wouldn’t need the ark
                    </p>
                    <p className="text-[10px] uppercase font-bold tracking-widest leading-relaxed">
                        But this world floods ideas before they float<br />
                        Drowns truth in noise
                    </p>
                    <p className="text-[10px] uppercase font-bold tracking-widest leading-relaxed">
                        So we built anyway
                    </p>
                    <p className="text-[10px] uppercase font-bold tracking-widest leading-relaxed">
                        The ark is what you make<br />
                        When perfection isn’t coming<br />
                        And survival still matters
                    </p>
                </div>

                <div className="absolute bottom-4 left-0 right-0 text-center px-4">
                    <p
                        onClick={handleCopy}
                        className={`text-[9px] tracking-wider font-mono text-[#EBE9E4] cursor-pointer hover:font-bold transition-all break-all ${copied ? 'font-bold text-white' : 'opacity-60 hover:opacity-100'}`}
                        title="Click to copy"
                    >
                        {copied ? "COPIED TO CLIPBOARD" : ca}
                    </p>
                </div>

            </div>

            {/* Closed State Hint */}
            {!isOpen && (
                <div className="absolute inset-0 flex items-center justify-center opacity-40">
                    <div className="w-1 h-1 bg-white rounded-full" />
                </div>
            )}

            {/* Hidden Audio Element */}
            <audio ref={audioRef} src="/papers.mp3" preload="auto" />

        </div>
    );
};

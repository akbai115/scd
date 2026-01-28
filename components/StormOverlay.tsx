import React, { useEffect, useState, useRef } from 'react';

const THUNDER_SOUNDS = [
    '/thunder/thunder1.mp3',
    '/thunder/thunder2.mp3',
    '/thunder/thunder3.mp3'
];

export const StormOverlay: React.FC = () => {
    const [isFlashing, setIsFlashing] = useState(false);
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const rainRef = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        // Rain Background Loop
        const rainAudio = new Audio('/rain.mp3');
        rainAudio.loop = true;
        rainAudio.volume = 0.4;
        rainAudio.play().catch(e => console.error("Rain play failed:", e));
        rainRef.current = rainAudio;

        const playThunder = () => {
            // Select random thunder sound
            const randomSound = THUNDER_SOUNDS[Math.floor(Math.random() * THUNDER_SOUNDS.length)];

            // Create audio instance
            const audio = new Audio(randomSound);
            audio.volume = 0.8; // Louder thunder
            audioRef.current = audio;

            // Trigger flash synchronized with soundstart
            setIsFlashing(true);
            setTimeout(() => setIsFlashing(false), 150); // Faster, sharper flash

            // Play sound
            audio.play().catch(e => console.error("Audio play failed:", e));

            // Schedule next thunder - CONSTANT (2-6 seconds)
            const nextInterval = Math.random() * 4000 + 2000;
            timeoutRef.current = window.setTimeout(playThunder, nextInterval);
        };

        // Initial start delay
        const timeoutRef = { current: window.setTimeout(playThunder, 1000) };

        return () => {
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current = null;
            }
            if (rainRef.current) {
                rainRef.current.pause();
                rainRef.current = null;
            }
        };
    }, []);

    return (
        <div className="fixed inset-0 pointer-events-none z-[500] overflow-hidden">
            {/* RAIN EFFECT */}
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-overlay"></div>

            {/* CSS Rain - HIGH VISIBILITY */}
            <style>
                {`
                    @keyframes rain {
                        0% { background-position: 0% 0%; }
                        100% { background-position: 5% 100%; }
                    }
                    .rain-layer {
                        background-image: linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(50,50,50,0.8) 50%, rgba(0,0,0,0) 100%);
                        background-size: 2px 40px;
                        animation: rain 0.6s linear infinite;
                    }
                `}
            </style>
            {/* Multiple layers for density */}
            <div className="absolute inset-0 rain-layer opacity-60"></div>
            <div className="absolute inset-0 rain-layer opacity-50" style={{ backgroundSize: '2px 30px', animationDuration: '0.4s', animationDirection: 'normal', animationDelay: '-0.2s' }}></div>
            <div className="absolute inset-0 rain-layer opacity-40" style={{ backgroundSize: '3px 50px', animationDuration: '0.5s', animationDirection: 'reverse' }}></div>

            {/* LIGHTNING FLASH - STRONGER */}
            <div
                className={`first-line:absolute inset-0 bg-white mix-blend-hard-light transition-opacity duration-75 ${isFlashing ? 'opacity-90' : 'opacity-0'}`}
                style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
            />

            {/* FLASHING TEXT */}
            <div
                className={`absolute inset-0 flex items-center justify-center transition-opacity duration-75 ${isFlashing ? 'opacity-100' : 'opacity-0'}`}
            >
                <h1 className="times-bold text-4xl md:text-8xl tracking-[0.5em] text-black font-black uppercase text-center mix-blend-difference">
                    THE CALM BEFORE THE STORM
                </h1>
            </div>
        </div>
    );
};

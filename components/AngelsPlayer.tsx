import React, { useState, useRef, useEffect } from 'react';

export const AngelsPlayer: React.FC = () => {
    const [isPlaying, setIsPlaying] = useState(false);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        audioRef.current = new Audio('/ANGELS.mp3');
        audioRef.current.loop = true;
        audioRef.current.volume = 0.5;

        return () => {
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current = null;
            }
        };
    }, []);

    const togglePlay = () => {
        if (!audioRef.current) return;

        if (isPlaying) {
            audioRef.current.pause();
        } else {
            audioRef.current.play().catch(e => console.error("Playback failed", e));
        }
        setIsPlaying(!isPlaying);
    };

    return (
        <button
            onClick={togglePlay}
            className="fixed left-8 bottom-24 md:bottom-32 z-[5000] flex items-center gap-4 group pointer-events-auto hover:scale-105 transition-all backdrop-blur-md bg-black/40 border border-white/10 rounded-full pr-6 py-2"
        >
            <div className={`w-8 h-8 flex items-center justify-center border border-white/20 rounded-full group-hover:border-red-600 transition-colors ${isPlaying ? 'bg-red-600/10' : 'bg-black/20'}`}>
                {isPlaying ? (
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3 text-red-600">
                        <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                    </svg>
                ) : (
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3 text-white">
                        <path d="M8 5v14l11-7z" />
                    </svg>
                )}
            </div>
            <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-white drop-shadow-md group-hover:text-red-600 transition-colors">
                {isPlaying ? 'PAUSE ANGELS' : 'PLAY ANGELS'}
            </span>
        </button>
    );
};

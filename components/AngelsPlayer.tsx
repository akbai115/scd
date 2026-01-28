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
            className="absolute top-1/2 left-1/2 -translate-x-1/2 mt-48 md:mt-72 z-[2000] flex items-center gap-3 group pointer-events-auto"
        >
            <div className={`w-2 h-2 rounded-full ${isPlaying ? 'bg-red-600 animate-pulse' : 'bg-black/50'}`} />
            <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-white drop-shadow-md group-hover:text-red-600 transition-colors">
                {isPlaying ? 'PAUSE_ANGELS' : 'PLAY_ANGELS'}
            </span>
        </button>
    );
};

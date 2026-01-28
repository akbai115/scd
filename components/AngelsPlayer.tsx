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
            className="fixed bottom-8 right-8 z-[200] flex items-center gap-3 group mix-blend-difference"
        >
            <div className={`w-2 h-2 rounded-full ${isPlaying ? 'bg-red-600 animate-pulse' : 'bg-black/50'}`} />
            <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-black group-hover:text-red-600 transition-colors">
                {isPlaying ? 'PAUSE_ANGELS' : 'PLAY_ANGELS'}
            </span>
        </button>
    );
};

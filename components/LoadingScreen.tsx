import React, { useEffect, useState } from 'react';

interface LoadingScreenProps {
    onComplete: () => void;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ onComplete }) => {
    const [progress, setProgress] = useState(0);
    const [isComplete, setIsComplete] = useState(false);

    useEffect(() => {
        const preloadAssets = async () => {
            try {
                // Start loading
                const response = await fetch('/ark.wav');
                const reader = response.body?.getReader();
                const contentLength = +response.headers.get('Content-Length')!;
                let receivedLength = 0;

                if (reader) {
                    while (true) {
                        const { done, value } = await reader.read();
                        if (done) break;
                        receivedLength += value.length;
                        setProgress((receivedLength / contentLength) * 100);
                    }
                } else {
                    // Fallback if no reader
                    setProgress(100);
                }

                setIsComplete(true);
                setTimeout(() => onComplete(), 800);

            } catch (err) {
                console.error("Asset load failed", err);
                // Fallback completion
                setProgress(100);
                setIsComplete(true);
                setTimeout(() => onComplete(), 800);
            }
        };

        preloadAssets();
    }, [onComplete]);

    return (
        <div className={`fixed inset-0 z-[9999] bg-[#111111] flex items-center justify-center transition-opacity duration-1000 ${isComplete ? 'opacity-0' : 'opacity-100'}`}>
            <div className="flex flex-col items-center gap-12">
                {/* Ark Logo with Animation */}
                <div className="relative flex flex-col items-center gap-6 animate-pulse">
                    {/* Diamond Star - Rotating */}
                    <div
                        className="w-16 h-16 bg-white rotate-45 shadow-2xl transition-transform duration-700"
                        style={{
                            transform: `rotate(${45 + (progress * 3.6)}deg) scale(${1 + (progress / 200)})`
                        }}
                    />

                    {/* Brutalist Hull */}
                    <div className="w-32 h-16 bg-white rounded-b-full shadow-2xl relative overflow-hidden">
                        {/* Shine effect */}
                        <div
                            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                            style={{
                                transform: `translateX(${-100 + progress}%)`
                            }}
                        />
                    </div>
                </div>

                {/* Loading Text */}
                <div className="flex flex-col items-center gap-4 text-white">
                    <span className="text-[10px] font-bold tracking-[2em] uppercase opacity-60">
                        INITIALIZING
                    </span>

                    {/* Progress Bar */}
                    <div className="w-64 h-[2px] bg-white/10 relative overflow-hidden">
                        <div
                            className="absolute inset-y-0 left-0 bg-white transition-all duration-300 ease-out"
                            style={{ width: `${progress}%` }}
                        />
                    </div>

                    {/* Percentage */}
                    <span className="text-2xl font-mono font-bold opacity-80">
                        {Math.floor(progress)}%
                    </span>
                </div>

                {/* Bottom Text */}
                <div className="flex flex-col items-center gap-2 opacity-40 text-white">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-[1px] bg-white" />
                        <div className="w-2 h-2 bg-white rotate-45" />
                        <div className="w-12 h-[1px] bg-white" />
                    </div>
                    <span className="text-[8px] font-bold tracking-[1.5em] uppercase">
                        YZY_OS_V1
                    </span>
                </div>
            </div>
        </div>
    );
};

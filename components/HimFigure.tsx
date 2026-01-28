import React, { useState, useEffect } from 'react';

export const HimFigure: React.FC = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Trigger slide up on mount
        const timer = setTimeout(() => setIsVisible(true), 500);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div className={`fixed bottom-0 right-0 z-[100] transition-transform duration-[3000ms] ease-out pointer-events-auto ${isVisible ? 'translate-y-0' : 'translate-y-full'}`}>
            <style>
                {`
                    @keyframes breathe {
                        0%, 100% { transform: translateY(0); }
                        50% { transform: translateY(-8px); }
                    }
                    .animate-breathe {
                        animation: breathe 6s ease-in-out infinite;
                    }
                `}
            </style>

            <div className="relative group animate-breathe flex flex-col items-end">

                {/* Text Box - Appearing on hover - Positioned to the left of the image */}
                <div className="absolute bottom-32 right-12 md:right-32 w-72 md:w-96 p-6 bg-white/90 text-black text-[10px] md:text-xs font-mono border border-black/10 shadow-2xl opacity-0 group-hover:opacity-100 transition-all duration-500 translate-x-4 group-hover:translate-x-0 pointer-events-none backdrop-blur-md">
                    <div className="flex flex-col gap-4">
                        <p className="uppercase leading-relaxed font-bold tracking-widest text-center">
                            Only those who crossed the water can hear me.
                        </p>
                    </div>

                    {/* Decorative corner */}
                    <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-black" />
                    <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-black" />
                </div>

                {/* Image */}
                <img
                    src="/t2.png"
                    alt="Him"
                    className="w-32 md:w-80 h-auto drop-shadow-[0_10px_30px_rgba(0,0,0,0.2)]"
                />
            </div>
        </div>
    );
};

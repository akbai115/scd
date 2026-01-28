import React from 'react';

export const ArrivalBackground: React.FC = () => {
    // High density of small text
    const repeats = Array(100).fill('THE ARRIVAL   THE ARRIVAL   THE ARRIVAL   THE ARRIVAL   THE ARRIVAL');

    return (
        <div className="absolute inset-0 pointer-events-none z-[5] overflow-hidden flex justify-center opacity-[0.15]">
            <div className="animate-scroll-down flex flex-col items-center gap-4">
                {repeats.map((text, i) => (
                    <h1 key={i} className="text-[10px] md:text-xs font-bold font-mono tracking-[0.5em] uppercase whitespace-nowrap text-black">
                        {text}
                    </h1>
                ))}
            </div>

            <style>{`
                @keyframes scroll-down {
                    0% { transform: translateY(-50%); }
                    100% { transform: translateY(0%); }
                }
                .animate-scroll-down {
                    animation: scroll-down 60s linear infinite;
                }
            `}</style>
        </div>
    );
};

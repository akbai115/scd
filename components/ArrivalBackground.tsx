import React from 'react';

export const ArrivalBackground: React.FC = () => {
    // Generate an array of text to ensure we fill the screen height + buffer for scrolling
    const repeats = Array(20).fill('THE ARRIVAL');

    return (
        <div className="absolute inset-0 pointer-events-none z-[5] overflow-hidden flex justify-center opacity-[0.03]">
            <div className="animate-scroll-down flex flex-col items-center gap-32">
                {repeats.map((text, i) => (
                    <h1 key={i} className="text-4xl md:text-9xl font-black font-mono tracking-[1em] uppercase whitespace-nowrap text-black">
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

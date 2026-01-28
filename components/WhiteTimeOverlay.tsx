import React, { useEffect, useState } from 'react';

export const WhiteTimeOverlay: React.FC = () => {
    const [time, setTime] = useState(new Date());

    useEffect(() => {
        const timer = requestAnimationFrame(function animate() {
            setTime(new Date());
            requestAnimationFrame(animate);
        });
        return () => cancelAnimationFrame(timer);
    }, []);

    const seconds = time.getSeconds() + time.getMilliseconds() / 1000;
    const minutes = time.getMinutes() + seconds / 60;
    const hours = time.getHours() % 12 + minutes / 60;

    return (
        <div className="fixed inset-0 z-[9999] bg-white flex justify-center overflow-hidden pointer-events-none">

            {/* SWING CONTAINER */}
            <div className="origin-top animate-hypnotic flex flex-col items-center absolute -top-[10vh] h-[90vh]">

                {/* CHAIN */}
                <div className="w-[2px] bg-black h-full" />

                {/* WATCH BODY */}
                <div className="relative w-64 h-64 md:w-96 md:h-96 rounded-full bg-white border-4 border-black flex items-center justify-center shadow-2xl">

                    {/* RIM DETAIL */}
                    <div className="absolute inset-2 rounded-full border border-black/20" />

                    {/* CLOCK FACE */}
                    <div className="relative w-full h-full">
                        {/* TICKS */}
                        {[...Array(12)].map((_, i) => (
                            <div
                                key={i}
                                className="absolute top-0 left-1/2 w-1 h-full -ml-0.5"
                                style={{ transform: `rotate(${i * 30}deg)` }}
                            >
                                <div className="w-full h-4 bg-black" />
                            </div>
                        ))}

                        {/* HANDS */}
                        {/* Hour */}
                        <div
                            className="absolute top-1/2 left-1/2 w-2 h-24 bg-black -translate-x-1/2 -translate-y-full origin-bottom rounded-full"
                            style={{ transform: `translate(-50%, -100%) rotate(${hours * 30}deg)` }}
                        />

                        {/* Minute */}
                        <div
                            className="absolute top-1/2 left-1/2 w-1.5 h-32 bg-black -translate-x-1/2 -translate-y-full origin-bottom rounded-full"
                            style={{ transform: `translate(-50%, -100%) rotate(${minutes * 6}deg)` }}
                        />

                        {/* Second (Red Sweep) */}
                        <div
                            className="absolute top-1/2 left-1/2 w-0.5 h-36 bg-red-600 -translate-x-1/2 -translate-y-[80%] origin-[50%_80%]"
                            style={{ transform: `translate(-50%, -80%) rotate(${seconds * 6}deg)` }}
                        />

                        {/* CENTER HUB */}
                        <div className="absolute top-1/2 left-1/2 w-4 h-4 bg-black rounded-full -translate-x-1/2 -translate-y-1/2" />
                        <div className="absolute top-1/2 left-1/2 w-2 h-2 bg-red-600 rounded-full -translate-x-1/2 -translate-y-1/2" />
                    </div>

                    {/* TOP LOOP */}
                    <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-8 h-8 border-4 border-black rounded-full bg-white z-[-1]" />
                </div>
            </div>

            <style>{`
        @keyframes hypnotic {
          0% { transform: rotate(25deg); animation-timing-function: ease-in-out; }
          50% { transform: rotate(-25deg); animation-timing-function: ease-in-out; }
          100% { transform: rotate(25deg); animation-timing-function: ease-in-out; }
        }
        .animate-hypnotic {
          animation: hypnotic 3s infinite;
        }
      `}</style>
        </div>
    );
};

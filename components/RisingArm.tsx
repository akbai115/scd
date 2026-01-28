import React, { useState, useEffect } from 'react';

export const RisingArm: React.FC = () => {
    const [showCloseArm, setShowCloseArm] = useState(false);
    const [hasRisen, setHasRisen] = useState(false);

    useEffect(() => {
        // After the rise-up animation completes (12s), start cycling
        const riseTimer = setTimeout(() => {
            setHasRisen(true);
            setShowCloseArm(true);
        }, 12000);

        return () => clearTimeout(riseTimer);
    }, []);

    useEffect(() => {
        if (!hasRisen) return;

        // Toggle every 3 seconds after rising
        const interval = setInterval(() => {
            setShowCloseArm(prev => !prev);
        }, 3000);

        return () => clearInterval(interval);
    }, [hasRisen]);

    return (
        <>
            <div className="fixed bottom-0 left-0 right-0 z-[48] pointer-events-none animate-rise-up flex justify-center">
                {/* ARM IMAGE - instant switch */}
                <img
                    src={showCloseArm ? "/closearm.png" : "/arm.png"}
                    alt=""
                    className="w-full h-auto object-contain max-w-[100vw] blur-[3px] drop-shadow-[0_0_30px_rgba(0,0,0,0.9)]"
                />
            </div>
            <style>{`
                @keyframes rise-up {
                    0% { 
                        transform: translateY(95%);
                        opacity: 0;
                    }
                    5% {
                        opacity: 1;
                    }
                    100% { 
                        transform: translateY(20%);
                        opacity: 1;
                    }
                }
                .animate-rise-up {
                    animation: rise-up 12s ease-out forwards;
                }
            `}</style>
        </>
    );
};

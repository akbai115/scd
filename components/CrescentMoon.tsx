import React from 'react';

export const CrescentMoon: React.FC = () => {
    // Generate organic particles
    const particles = Array.from({ length: 15 }, (_, i) => ({
        x: Math.random() * 100, // percentage
        y: Math.random() * 100, // percentage
        size: 1 + Math.random() * 2,
        delay: Math.random() * 5,
        duration: 4 + Math.random() * 4,
        opacity: 0.3 + Math.random() * 0.4,
    }));

    return (
        <div className="fixed top-8 left-8 z-[55] pointer-events-none group">
            <div className="relative w-32 md:w-48 h-32 md:h-48 animate-moon-hover">

                {/* MOON IMAGE - High Fidelity */}
                <img
                    src="/moon.png"
                    alt="Red Moon"
                    className="w-full h-full object-contain relative z-10 animate-slow-spin drop-shadow-[0_0_30px_rgba(255,60,20,0.4)]"
                />

                {/* ATMOSPHERIC GLOW BEHIND */}
                <div className="absolute inset-0 bg-red-600/20 blur-[40px] rounded-full z-0 animate-pulse-glow" />

                {/* FLOATING PARTICLES */}
                <div className="absolute inset-[-50%] pointer-events-none overflow-hidden">
                    {particles.map((p, i) => (
                        <div
                            key={i}
                            className="absolute rounded-full bg-orange-500/60 blur-[1px] animate-particle-float"
                            style={{
                                left: `${p.x}%`,
                                top: `${p.y}%`,
                                width: `${p.size}px`,
                                height: `${p.size}px`,
                                opacity: p.opacity,
                                animationDelay: `${p.delay}s`,
                                animationDuration: `${p.duration}s`,
                            }}
                        />
                    ))}
                </div>
            </div>

            <style>{`
                @keyframes slow-spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                .animate-slow-spin {
                    animation: slow-spin 240s linear infinite;
                }

                @keyframes pulse-glow {
                    0%, 100% { opacity: 0.5; transform: scale(1); }
                    50% { opacity: 0.8; transform: scale(1.1); }
                }
                .animate-pulse-glow {
                    animation: pulse-glow 8s ease-in-out infinite;
                }
                
                @keyframes moon-hover {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-10px); }
                }
                .animate-moon-hover {
                    animation: moon-hover 10s ease-in-out infinite;
                }

                @keyframes particle-float {
                    0% { transform: translate(0, 0); opacity: 0; }
                    20% { opacity: 1; }
                    80% { opacity: 1; }
                    100% { transform: translate(-20px, -20px); opacity: 0; }
                }
                .animate-particle-float {
                    animation: particle-float 5s linear infinite;
                }
            `}</style>
        </div>
    );
};

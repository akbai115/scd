import React, { useMemo, useState, useEffect } from 'react';

interface CymaticsBackgroundProps {
    audioVolume?: number; // 0-1, syncs with AudioEngine
}

export const CymaticsBackground: React.FC<CymaticsBackgroundProps> = ({ audioVolume = 0 }) => {
    // TIME-BASED INTENSITY - increases the longer you stay
    const [timeIntensity, setTimeIntensity] = useState(0);

    useEffect(() => {
        const startTime = Date.now();
        const maxTime = 5 * 60 * 1000; // 5 minutes to reach full intensity

        const interval = setInterval(() => {
            const elapsed = Date.now() - startTime;
            const intensity = Math.min(elapsed / maxTime, 1); // 0 to 1 over 5 minutes
            setTimeIntensity(intensity);
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    // Combined intensity from audio + time
    const combinedIntensity = Math.min(audioVolume + timeIntensity * 0.5, 1);

    // Scale factor based on combined intensity
    const breathScale = 1 + (combinedIntensity * 0.25);
    const glowIntensity = 0.02 + (combinedIntensity * 0.15);
    const ringOpacityBoost = 1 + (timeIntensity * 0.8);
    const animationSpeedMultiplier = 1 - (timeIntensity * 0.4); // Gets faster over time

    // Generate concentric ring data
    const rings = useMemo(() => {
        const count = 8 + Math.floor(timeIntensity * 4); // More rings over time
        return Array.from({ length: count }, (_, i) => ({
            radius: 80 + i * 40,
            strokeWidth: 0.3 + (count - i) * 0.08,
            delay: i * 0.6,
            opacity: 0.12 - i * 0.008,
        }));
    }, [timeIntensity]);

    // Generate sacred geometry petals (flower of life inspired)
    const petals = useMemo(() => {
        const count = 12;
        return Array.from({ length: count }, (_, i) => ({
            rotation: (360 / count) * i,
            delay: i * 0.3,
        }));
    }, []);

    return (
        <div className="fixed inset-0 z-[45] pointer-events-none overflow-hidden flex items-center justify-center bg-black">
            {/* SVG CYMATICS */}
            <svg
                viewBox="0 0 800 800"
                className="w-[150vmin] h-[150vmin] max-w-none"
                style={{
                    transform: `scale(${breathScale})`,
                    transition: 'transform 0.3s ease-out',
                }}
            >
                <defs>
                    {/* RADIAL GLOW */}
                    <radialGradient id="coreGlow" cx="50%" cy="50%" r="50%">
                        <stop offset="0%" stopColor={`rgba(212, 175, 55, ${glowIntensity})`} />
                        <stop offset="40%" stopColor="rgba(212, 175, 55, 0)" />
                    </radialGradient>

                    {/* PEARL STROKE GRADIENT */}
                    <linearGradient id="pearlStroke" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="rgba(245, 245, 240, 0.6)" />
                        <stop offset="50%" stopColor="rgba(245, 245, 240, 0.2)" />
                        <stop offset="100%" stopColor="rgba(245, 245, 240, 0.6)" />
                    </linearGradient>

                    {/* GOLD ACCENT */}
                    <linearGradient id="goldAccent" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="rgba(212, 175, 55, 0)" />
                        <stop offset="50%" stopColor="rgba(212, 175, 55, 0.15)" />
                        <stop offset="100%" stopColor="rgba(212, 175, 55, 0)" />
                    </linearGradient>
                </defs>

                {/* CENTRAL GLOW */}
                <circle cx="400" cy="400" r="300" fill="url(#coreGlow)" className="animate-core-pulse" />

                {/* CONCENTRIC RINGS */}
                <g className="origin-center" style={{ transformOrigin: '400px 400px' }}>
                    {rings.map((ring, i) => (
                        <circle
                            key={`ring-${i}`}
                            cx="400"
                            cy="400"
                            r={ring.radius}
                            fill="none"
                            stroke="url(#pearlStroke)"
                            strokeWidth={ring.strokeWidth}
                            opacity={ring.opacity * ringOpacityBoost}
                            className="animate-ring-breathe"
                            style={{
                                animationDelay: `${ring.delay}s`,
                                animationDuration: `${8 * animationSpeedMultiplier}s`,
                                transformOrigin: '400px 400px',
                            }}
                        />
                    ))}
                </g>

                {/* SACRED GEOMETRY PETALS */}
                <g style={{ transformOrigin: '400px 400px' }}>
                    {petals.map((petal, i) => (
                        <ellipse
                            key={`petal-${i}`}
                            cx="400"
                            cy="260"
                            rx="35"
                            ry="100"
                            fill="none"
                            stroke="url(#goldAccent)"
                            strokeWidth="0.5"
                            opacity={0.25 + timeIntensity * 0.3}
                            className="animate-petal-breathe"
                            style={{
                                transform: `rotate(${petal.rotation}deg)`,
                                transformOrigin: '400px 400px',
                                animationDelay: `${petal.delay}s`,
                                animationDuration: `${12 * animationSpeedMultiplier}s`,
                            }}
                        />
                    ))}
                </g>

                {/* INNER HEXAGONAL SEAL */}
                <polygon
                    points="400,320 469,360 469,440 400,480 331,440 331,360"
                    fill="none"
                    stroke="rgba(245, 245, 240, 0.08)"
                    strokeWidth="0.5"
                    className="animate-seal-rotate"
                    style={{ transformOrigin: '400px 400px' }}
                />

                {/* OUTER HEXAGONAL SEAL */}
                <polygon
                    points="400,240 538,320 538,480 400,560 262,480 262,320"
                    fill="none"
                    stroke="rgba(212, 175, 55, 0.04)"
                    strokeWidth="0.3"
                    className="animate-seal-rotate-reverse"
                    style={{ transformOrigin: '400px 400px' }}
                />

                {/* CENTER DOT - The Signal */}
                <circle
                    cx="400"
                    cy="400"
                    r={3 + timeIntensity * 5}
                    fill={`rgba(245, 245, 240, ${0.6 + timeIntensity * 0.4})`}
                    className="animate-center-pulse"
                    style={{ animationDuration: `${4 * animationSpeedMultiplier}s` }}
                />
            </svg>

            {/* CSS ANIMATIONS */}
            <style>{`
                @keyframes ring-breathe {
                    0%, 100% { 
                        transform: scale(1); 
                        opacity: inherit;
                    }
                    50% { 
                        transform: scale(1.02); 
                        opacity: calc(inherit * 1.3);
                    }
                }
                .animate-ring-breathe {
                    animation: ring-breathe 8s ease-in-out infinite;
                }

                @keyframes petal-breathe {
                    0%, 100% { 
                        transform: rotate(var(--rotation, 0deg)) scale(1);
                        opacity: 0.25;
                    }
                    50% { 
                        transform: rotate(var(--rotation, 0deg)) scale(1.05);
                        opacity: 0.4;
                    }
                }
                .animate-petal-breathe {
                    animation: petal-breathe 12s ease-in-out infinite;
                }

                @keyframes core-pulse {
                    0%, 100% { 
                        transform: scale(1);
                        opacity: 1;
                    }
                    50% { 
                        transform: scale(1.1);
                        opacity: 0.8;
                    }
                }
                .animate-core-pulse {
                    animation: core-pulse 10s ease-in-out infinite;
                }

                @keyframes seal-rotate {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                .animate-seal-rotate {
                    animation: seal-rotate 120s linear infinite;
                }

                @keyframes seal-rotate-reverse {
                    from { transform: rotate(360deg); }
                    to { transform: rotate(0deg); }
                }
                .animate-seal-rotate-reverse {
                    animation: seal-rotate-reverse 180s linear infinite;
                }

                @keyframes center-pulse {
                    0%, 100% { 
                        transform: scale(1);
                        opacity: 0.6;
                    }
                    50% { 
                        transform: scale(1.5);
                        opacity: 1;
                    }
                }
                .animate-center-pulse {
                    animation: center-pulse 4s ease-in-out infinite;
                    transform-origin: 400px 400px;
                }
            `}</style>
        </div>
    );
};

import React, { useEffect, useRef, useState } from 'react';

interface WatcherEyeProps {
    mousePos?: { x: number; y: number };
}

export const WatcherEye: React.FC<WatcherEyeProps> = ({ mousePos }) => {
    const eyeRef = useRef<HTMLDivElement>(null);
    const [pupilPos, setPupilPos] = useState({ x: 0, y: 0 });
    const [isBlinking, setIsBlinking] = useState(false);

    // BLINK LOGIC
    useEffect(() => {
        const blinkLoop = () => {
            setIsBlinking(true);
            setTimeout(() => {
                setIsBlinking(false);
                // Random blink interval between 2s and 6s
                const nextBlink = Math.random() * 4000 + 2000;
                setTimeout(blinkLoop, nextBlink);
            }, 100); // 100ms blink duration (fast)
        };

        const timeout = setTimeout(blinkLoop, 3000);
        return () => clearTimeout(timeout);
    }, []);

    // TRACKING LOGIC
    useEffect(() => {
        if (!mousePos || !eyeRef.current) return;

        const eyeRect = eyeRef.current.getBoundingClientRect();
        const eyeCenterX = eyeRect.left + eyeRect.width / 2;
        const eyeCenterY = eyeRect.top + eyeRect.height / 2;

        const deltaX = mousePos.x - eyeCenterX;
        const deltaY = mousePos.y - eyeCenterY;

        // Calculate angle and distance
        const angle = Math.atan2(deltaY, deltaX);
        const distance = Math.min(Math.sqrt(deltaX * deltaX + deltaY * deltaY), 2500); // reduced clamp range
        const maxRadius = 8; // Max movement radius in pixels

        // Map distance to radius (logarithmic-ish for smoother fell close up?)
        // Just linear clamp for simplicity:
        // We limit pupil movement to maxRadius

        // Actually, we want pupil to look AT the cursor, but constrained.
        // Normalize distance?
        const r = Math.min(maxRadius, distance / 40); // Scaling factor

        const pupilX = Math.cos(angle) * r;
        const pupilY = Math.sin(angle) * r;

        setPupilPos({ x: pupilX, y: pupilY });

    }, [mousePos]);

    return (
        <div
            ref={eyeRef}
            className="relative w-16 h-10 flex items-center justify-center pointer-events-none z-[120]"
        >
            {/* EYE CONTAINER / SHAPE */}
            <svg
                viewBox="0 0 100 60"
                className={`w-full h-full text-black transition-[transform] duration-75 ${isBlinking ? 'scale-y-[0.1]' : 'scale-y-100'}`}
                style={{ transformOrigin: 'center' }}
            >
                {/* SHELL */}
                <path
                    d="M 5 30 Q 50 -10 95 30 Q 50 70 5 30"
                    fill="white"
                    stroke="currentColor"
                    strokeWidth="4"
                    strokeLinejoin="round"
                    strokeLinecap="round"
                />

                {/* PUPIL */}
                <circle
                    cx={50 + pupilPos.x * 2.5}  // Scaling up for SVG coordinate space (100x60 is ~2.5x bigger than 40x24px rendered?) - simplified: map pixel offset X to SVG units
                    cy={30 + pupilPos.y * 2.5}
                    r="9"
                    fill="currentColor"
                />
            </svg>
        </div>
    );
};

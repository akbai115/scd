
import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';


export const IntroAnimation: React.FC = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const logoRef = useRef<HTMLImageElement>(null);
    const audioRef = useRef<HTMLAudioElement>(null);
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const ctx = gsap.context(() => {
            const tl = gsap.timeline({
                onComplete: () => {
                    setIsVisible(false);
                }
            });

            // 0s: Start Audio + Animation
            if (audioRef.current) {
                audioRef.current.volume = 1.0;
                audioRef.current.play().catch((err) => {
                    console.warn("Audio play failed:", err);
                });
            }

            // 0s - 1.0s: The Drop
            tl.fromTo(logoRef.current,
                { y: '-100vh', opacity: 1, scale: 0.8 },
                {
                    y: '0%',
                    scale: 1,
                    opacity: 0.85,
                    duration: 1.0,
                    ease: 'power4.in'
                }
            );

            // 1.0s: The Impact
            tl.add(() => {
                // Screen Shake Logic (targeting body for global effect)
                gsap.to(document.body, {
                    x: "random(-10, 10)",
                    y: "random(-10, 10)",
                    duration: 0.05,
                    repeat: 5,
                    yoyo: true,
                    clearProps: "x,y"
                });
            }, 1.0);

            // 1.0s: Impact Glow
            // We animate the drop-shadow to simulate the electric flash
            tl.to(logoRef.current, {
                filter: "drop-shadow(0px 0px 15px #C5A059) drop-shadow(0px 0px 30px rgba(255,255,255,0.4))",
                duration: 0.1,
                yoyo: true,
                repeat: 1,
                ease: "power2.out"
            }, 1.0);

            // 2.5s: Cleanup
            tl.to(containerRef.current, {
                opacity: 0,
                duration: 0.5,
                ease: "power1.out"
            }, 2.5);
        }, containerRef);

        return () => ctx.revert();
    }, []);

    if (!isVisible) return null;

    return (
        <div
            ref={containerRef}
            className="fixed inset-0 z-[9999] pointer-events-none flex items-center justify-center top-0 left-0"
        >
            <audio ref={audioRef} src="/arrive.wav" preload="auto" />

            {/* We use a container internal to the fixed overlay to center the image perfectly */}
            <img
                ref={logoRef}
                src="/ark2.png"
                alt="Ark Logo"
                className="w-32 md:w-48 object-contain will-change-transform" // Adjust size as needed
            />
        </div>
    );
};

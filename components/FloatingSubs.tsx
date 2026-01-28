import React from 'react';

export const FloatingSubs: React.FC = () => {
    const subs = [
        { src: '/subs/sub2.png', left: '85%', top: '40%', delay: '0.5s', size: 'w-56 md:w-80' },
        { src: '/subs/sub3.png', left: '75%', top: '70%', delay: '1s', size: 'w-40 md:w-64' },
    ];

    return (
        <>
            {subs.map((sub, i) => (
                <div
                    key={i}
                    className="fixed z-[60] pointer-events-auto animate-float-up"
                    style={{
                        left: sub.left,
                        top: sub.top,
                        animationDelay: sub.delay,
                    }}
                >
                    <img
                        src={sub.src}
                        alt=""
                        className={`${sub.size} h-auto object-contain cursor-pointer transition-all duration-300 hover:scale-110 hover:-translate-y-2 drop-shadow-[0_0_25px_rgba(220,38,38,0.6)] hover:drop-shadow-[0_0_40px_rgba(220,38,38,0.9)]`}
                    />
                </div>
            ))}

            <style>{`
                @keyframes float-up {
                    0% {
                        transform: translateY(50vh);
                        opacity: 0;
                    }
                    60% {
                        opacity: 1;
                    }
                    100% {
                        transform: translateY(0);
                        opacity: 1;
                    }
                }
                .animate-float-up {
                    animation: float-up 4s ease-out forwards;
                }
            `}</style>
        </>
    );
};

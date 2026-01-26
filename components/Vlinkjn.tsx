import React, { useState } from 'react';
import point1 from '../point1.png';
import point2 from '../point2.png';

export const Vlinkjn: React.FC = () => {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[500] pointer-events-auto cursor-pointer"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <style>
                {`
                    @keyframes rapid-flicker {
                        0% { opacity: 1; }
                        25% { opacity: 0.8; }
                        50% { opacity: 1; }
                        55% { opacity: 0.3; }
                        60% { opacity: 1; }
                        75% { opacity: 0.9; }
                        85% { opacity: 0.2; }
                        90% { opacity: 1; }
                        100% { opacity: 0.95; }
                    }
                    .flicker-active {
                        animation: rapid-flicker 0.15s infinite;
                    }
                `}
            </style>
            <img
                src={isHovered ? point2 : point1}
                alt="Vlinkjn Face"
                className={`w-64 h-auto md:w-96 drop-shadow-2xl transition-all duration-300 mix-blend-hard-light ${isHovered ? 'flicker-active' : 'opacity-90'}`}
            />
        </div>
    );
};

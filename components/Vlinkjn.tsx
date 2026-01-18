import React, { useState } from 'react';
import openEye from '../open.png';
import closedEye from '../closed.png';

export const Vlinkjn: React.FC = () => {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[500] pointer-events-auto cursor-pointer"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <img
                src={isHovered ? closedEye : openEye}
                alt="Vlinkjn Face"
                className="w-64 h-auto md:w-96 drop-shadow-2xl transition-all duration-300 opacity-90 hover:opacity-100 mix-blend-hard-light"
            />
        </div>
    );
};

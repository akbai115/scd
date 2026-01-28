import React, { useState } from 'react';

export const ArkLogo: React.FC = () => {
    return (
        <div className="fixed top-8 left-8 z-[150] pointer-events-none flex flex-col items-center gap-2 opacity-80 hover:opacity-100 transition-opacity">
            <img
                src="/bly5.png"
                alt="Ark Logo"
                className="w-16 h-auto drop-shadow-lg"
            />
        </div>
    );
};

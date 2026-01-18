import React, { useState } from 'react';

export const ArkLogo: React.FC = () => {
    return (
        <div className="fixed top-8 left-8 z-[150] pointer-events-none flex flex-col items-center gap-2 opacity-80 hover:opacity-100 transition-opacity">
            {/* Diamond Star */}
            <div className="w-6 h-6 bg-black rotate-45 shadow-lg" />

            {/* Brutalist Hull (Semi-Circle) */}
            <div className="w-16 h-8 bg-black rounded-b-full shadow-lg" />
        </div>
    );
};

import React, { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { Stadium } from './Stadium';

export const StadiumWidget: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            {/* TRIGGER BUTTON */}
            <button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-8 right-8 z-[100] text-[10px] font-mono font-bold tracking-[0.2em] uppercase text-black/50 hover:text-black hover:tracking-[0.3em] transition-all duration-300 mix-blend-difference"
            >
                stadium.
            </button>

            {/* MODAL OVERLAY */}
            {isOpen && (
                <div className="fixed inset-0 z-[5000] flex items-center justify-center bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">

                    {/* CLOSE AREA (Click outside) */}
                    <div className="absolute inset-0" onClick={() => setIsOpen(false)} />

                    {/* CONTENT BOX */}
                    <div className="relative w-[500px] h-[500px] bg-black/90 border border-white/20 shadow-2xl flex flex-col items-center justify-center overflow-hidden">

                        {/* CLOSE BUTTON */}
                        <button
                            onClick={() => setIsOpen(false)}
                            className="absolute top-4 right-4 text-[10px] text-white/50 hover:text-white font-mono tracking-widest z-10"
                        >
                            CLOSE_VIEW
                        </button>

                        {/* 3D CANVAS */}
                        <div className="w-full h-full cursor-move">
                            <Canvas camera={{ position: [0, 2, 6], fov: 45 }}>
                                <ambientLight intensity={0.5} />
                                <pointLight position={[10, 10, 10]} intensity={2.0} />
                                <pointLight position={[-10, 5, 5]} intensity={1.0} color="#ccccff" />

                                {/* Re-using Stadium component */}
                                {/* Adjusting position/scale specifically for this view */}
                                <group position={[0, -1, 0]} scale={[0.8, 0.8, 0.8]}>
                                    <Stadium />
                                </group>

                            </Canvas>
                        </div>

                        {/* CAPTION */}
                        <div className="absolute bottom-4 left-0 right-0 text-center pointer-events-none">
                            <span className="text-[9px] font-mono tracking-[0.5em] text-white/30 uppercase">ARCH_01 // PROTOTYPE</span>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

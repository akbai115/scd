import React, { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment, ContactShadows } from '@react-three/drei';
import { EffectComposer, Bloom, Noise } from '@react-three/postprocessing';
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
                <div className="fixed inset-0 z-[5000] flex items-center justify-center bg-black/90 backdrop-blur-md animate-in fade-in duration-500">

                    {/* CLOSE AREA (Click outside) */}
                    <div className="absolute inset-0" onClick={() => setIsOpen(false)} />

                    {/* CONTENT BOX */}
                    <div className="relative w-[500px] h-[500px] flex flex-col items-center justify-center">

                        {/* CLOSE BUTTON */}
                        <button
                            onClick={() => setIsOpen(false)}
                            className="absolute top-0 right-0 p-4 text-[10px] text-white/30 hover:text-white font-mono tracking-widest z-10 transition-colors"
                        >
                            CLOSE_VIEW
                        </button>

                        {/* 3D CANVAS */}
                        <div className="w-full h-full cursor-move">
                            <Canvas camera={{ position: [0, 2, 7], fov: 35 }} gl={{ toneMappingExposure: 1.2 }}>
                                {/* Lighting & Environment */}
                                <ambientLight intensity={0.5} />
                                <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
                                <Environment preset="studio" />

                                {/* Post Processing */}
                                <EffectComposer>
                                    <Bloom luminanceThreshold={0.9} intensity={1.2} radius={0.6} />
                                    <Noise opacity={0.05} />
                                </EffectComposer>

                                {/* Content */}
                                <group position={[0, -0.5, 0]} scale={[0.8, 0.8, 0.8]}>
                                    <Stadium />
                                </group>

                                {/* Shadows */}
                                <ContactShadows resolution={512} scale={10} blur={2} opacity={0.5} far={10} color="#000000" />

                            </Canvas>
                        </div>

                        {/* CAPTION */}
                        <div className="absolute bottom-0 left-0 right-0 text-center pointer-events-none pb-4">
                            <span className="text-[9px] font-mono tracking-[0.5em] text-white/20 uppercase">ARCH_01 // PROTOTYPE</span>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

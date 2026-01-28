import React, { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Group } from 'three';
import { Sparkles, Float } from '@react-three/drei';

export const GoldenKey: React.FC = () => {
    const groupRef = useRef<Group>(null);
    const { viewport } = useThree();

    useFrame((state) => {
        if (!groupRef.current) return;

        const t = state.clock.elapsedTime;

        // Floating across screen logic
        // Move from left to right, resetting when off screen
        // Range: -width/2 - buffer to +width/2 + buffer
        const width = viewport.width;
        const speed = 0.5; // slow float
        const xPos = ((t * speed) % (width + 4)) - (width / 2 + 2);

        // Actually, let's make it float back and forth smoothly
        // groupRef.current.position.x = Math.sin(t * 0.2) * (width / 3);

        // Or float linearly across as requested "float across the screen"
        // Let's go with linear wrapping for "across"
        const cycle = (t * 0.8) % (width + 6); // Total distance
        groupRef.current.position.x = cycle - (width / 2 + 3);

        // Gentle floating animation (Y-axis) handled by <Float> wrapper or manual
        // Manual allows synchronization with move
        groupRef.current.position.y = Math.sin(t * 1.5) * 0.3;

        // Continuous delicate rotation
        groupRef.current.rotation.x = Math.sin(t * 0.5) * 0.2; // Slight tilt
        groupRef.current.rotation.y += 0.02; // Spin
        groupRef.current.rotation.z = Math.sin(t * 0.3) * 0.1; // Slight wobble
    });

    const goldMaterial = (
        <meshStandardMaterial
            color="#FFD700"
            metalness={1}
            roughness={0.15}
            emissive="#B8860B"
            emissiveIntensity={0.1}
            envMapIntensity={1}
        />
    );

    return (
        <group ref={groupRef} scale={1.2}>
            {/* WRAPPER GROUP FOR CENTRAL ROTATION */}
            <group rotation={[0, 0, Math.PI / 4]}>

                {/* --- HANDLE --- */}
                {/* Main Ring */}
                <mesh position={[-1.6, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
                    <torusGeometry args={[0.6, 0.12, 32, 64]} />
                    {goldMaterial}
                </mesh>

                {/* Inner Decoration Ring */}
                <mesh position={[-1.6, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
                    <torusGeometry args={[0.4, 0.05, 16, 32]} />
                    {goldMaterial}
                </mesh>

                {/* Connecting Sphere */}
                <mesh position={[-1.0, 0, 0]}>
                    <sphereGeometry args={[0.25, 32, 32]} />
                    {goldMaterial}
                </mesh>

                {/* --- SHAFT --- */}
                {/* Main Shaft (Cylinder) */}
                <mesh position={[0.5, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
                    <cylinderGeometry args={[0.12, 0.15, 3.5, 32]} />
                    {goldMaterial}
                </mesh>

                {/* Shaft Details (Ridges) */}
                <mesh position={[1.8, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
                    <cylinderGeometry args={[0.16, 0.16, 0.1, 32]} />
                    {goldMaterial}
                </mesh>
                <mesh position={[-0.5, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
                    <cylinderGeometry args={[0.16, 0.16, 0.1, 32]} />
                    {goldMaterial}
                </mesh>

                {/* Tip Sphere */}
                <mesh position={[2.25, 0, 0]}>
                    <sphereGeometry args={[0.15, 32, 32]} />
                    {goldMaterial}
                </mesh>

                {/* --- TEETH --- */}
                {/* Complex Key Bit */}
                <group position={[1.8, -0.35, 0]}>
                    {/* Main Stem for Teeth */}
                    <mesh position={[0, 0.15, 0]}>
                        <boxGeometry args={[0.6, 0.4, 0.12]} />
                        {goldMaterial}
                    </mesh>

                    {/* Tooth 1 */}
                    <mesh position={[-0.2, -0.15, 0]}>
                        <boxGeometry args={[0.15, 0.4, 0.12]} />
                        {goldMaterial}
                    </mesh>

                    {/* Tooth 2 (Smaller) */}
                    <mesh position={[0, -0.05, 0]}>
                        <boxGeometry args={[0.15, 0.2, 0.12]} />
                        {goldMaterial}
                    </mesh>

                    {/* Tooth 3 */}
                    <mesh position={[0.2, -0.25, 0]}>
                        <boxGeometry args={[0.15, 0.6, 0.12]} />
                        {goldMaterial}
                    </mesh>
                </group>
            </group>

            {/* SPARKLES / GLOW */}
            <Sparkles
                count={40}
                scale={5}
                size={4}
                speed={0.4}
                opacity={0.7}
                color="#FFF8E7"
                position={[0, 0, 0]}
            />
            {/* Additional point light following the key for localized glow */}
            <pointLight distance={3} intensity={2} color="#ffaa00" decay={2} />
        </group>
    );
};

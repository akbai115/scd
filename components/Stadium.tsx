import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export const Stadium: React.FC<React.ComponentProps<'group'>> = (props) => {
    const group = useRef<THREE.Group>(null);

    // Slow rotation animation
    useFrame((state) => {
        if (group.current) {
            group.current.rotation.y += 0.001;
        }
    });

    // High quality "瓷" (Porcelain) look
    const whiteMaterial = new THREE.MeshPhysicalMaterial({
        color: '#ffffff',
        roughness: 0.15,
        metalness: 0.1,
        clearcoat: 1.0,
        clearcoatRoughness: 0.1,
        side: THREE.DoubleSide
    });

    // Emissive material for lights (subtle glow)
    const lightMaterial = new THREE.MeshStandardMaterial({
        color: '#ffffff',
        emissive: '#ffffff',
        emissiveIntensity: 2.0,
        toneMapped: false
    });

    return (
        <group ref={group} {...props}>
            {/* ARENA FLOOR */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} material={whiteMaterial}>
                <circleGeometry args={[2.5, 64]} />
            </mesh>

            {/* TIER 1 (LOWER STANDS) */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.2, 0]} material={whiteMaterial}>
                <torusGeometry args={[3.2, 0.8, 4, 64]} />
            </mesh>

            {/* TIER 2 (UPPER STANDS) */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.6, 0]} material={whiteMaterial}>
                <torusGeometry args={[4.5, 0.8, 4, 64]} />
            </mesh>

            {/* OUTER WALL */}
            <mesh position={[0, 1, 0]} material={whiteMaterial}>
                <cylinderGeometry args={[5.5, 5.2, 2.5, 64, 1, true]} />
            </mesh>

            {/* LIGHTS / COLUMNS (Optional Detail for Scale) */}
            {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
                <mesh
                    key={i}
                    position={[Math.sin(i * Math.PI / 4) * 5.2, 1.5, Math.cos(i * Math.PI / 4) * 5.2]}
                    material={lightMaterial}
                >
                    <boxGeometry args={[0.05, 0.8, 0.05]} />
                </mesh>
            ))}
        </group>
    );
};

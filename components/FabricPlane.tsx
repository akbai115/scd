
import React, { useRef, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { vertexShader, fragmentShader } from '../shaders/fabricShaders';

interface FabricPlaneProps {
  onVelocityChange: (v: number) => void;
  audioVolume: number;
  activeView: string;
  isHolyHour: boolean;
  isSpamming: boolean;
  onClick: () => void;
}

export const FabricPlane: React.FC<FabricPlaneProps> = ({
  onVelocityChange,
  audioVolume,
  activeView,
  isHolyHour,
  isSpamming,
  onClick
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const { mouse, size, viewport } = useThree();

  const lastMousePos = useRef<[number, number]>([0, 0]);
  const impulseRef = useRef(0);

  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uMouse: { value: new THREE.Vector2(0, 0) },
    uGhostPos: { value: new THREE.Vector3(0, 0, -1) },
    uResolution: { value: new THREE.Vector2(size.width, size.height) },
    uClickImpulse: { value: 0 },
    uAudio: { value: 0 },
    uViewFactor: { value: 0 },
    uStillness: { value: 0 },
    uIsHolyHour: { value: false },
    uIsSpamming: { value: false },
    uIsAdmin: { value: false }
  }), []);

  useFrame((state) => {
    const { clock } = state;
    uniforms.uTime.value = clock.getElapsedTime();
    uniforms.uAudio.value = THREE.MathUtils.lerp(uniforms.uAudio.value, audioVolume, 0.05);
    uniforms.uIsHolyHour.value = isHolyHour;
    uniforms.uIsSpamming.value = isSpamming;
    uniforms.uIsAdmin.value = activeView === 'ADMIN';

    const targetStillness = activeView === 'STILL' ? 1.0 : 0.0;
    uniforms.uStillness.value = THREE.MathUtils.lerp(uniforms.uStillness.value, targetStillness, 0.05);

    const targetViewFactor = (activeView === 'YZY' || activeView === 'ADMIN' || activeView === 'STILL') ? 1.0 : 0.2;
    uniforms.uViewFactor.value = THREE.MathUtils.lerp(uniforms.uViewFactor.value, targetViewFactor, 0.02);

    // FIGURE AI: Dampen completely if still
    if (activeView === 'STILL') {
      uniforms.uGhostPos.value.x = THREE.MathUtils.lerp(uniforms.uGhostPos.value.x, 0, 0.01);
      uniforms.uGhostPos.value.y = THREE.MathUtils.lerp(uniforms.uGhostPos.value.y, 0, 0.01);
      uniforms.uGhostPos.value.z = -5.0; // Hide it deep
    } else if (isSpamming) {
      uniforms.uGhostPos.value.x = THREE.MathUtils.lerp(uniforms.uGhostPos.value.x, 0, 0.05);
      uniforms.uGhostPos.value.y = THREE.MathUtils.lerp(uniforms.uGhostPos.value.y, 0, 0.05);
      uniforms.uGhostPos.value.z = 1.5;
    } else if (activeView === 'ADMIN') {
      const targetX = viewport.width * 0.35;
      uniforms.uGhostPos.value.x = THREE.MathUtils.lerp(uniforms.uGhostPos.value.x, targetX, 0.02);
      uniforms.uGhostPos.value.y = THREE.MathUtils.lerp(uniforms.uGhostPos.value.y, 0, 0.02);
      uniforms.uGhostPos.value.z = 0.5;
    } else {
      uniforms.uGhostPos.value.x = Math.sin(clock.getElapsedTime() * 0.15) * 2.5;
      uniforms.uGhostPos.value.y = Math.cos(clock.getElapsedTime() * 0.1) * 1.5;
      uniforms.uGhostPos.value.z = -1.5;
    }

    const targetX = (mouse.x * viewport.width) / 2.5;
    const targetY = (mouse.y * viewport.height) / 2.5;

    uniforms.uMouse.value.x = THREE.MathUtils.lerp(uniforms.uMouse.value.x, targetX, 0.03);
    uniforms.uMouse.value.y = THREE.MathUtils.lerp(uniforms.uMouse.value.y, targetY, 0.03);

    const dx = targetX - lastMousePos.current[0];
    const dy = targetY - lastMousePos.current[1];
    const vel = Math.sqrt(dx * dx + dy * dy);
    onVelocityChange(vel);
    lastMousePos.current = [targetX, targetY];

    impulseRef.current *= 0.98;
    uniforms.uClickImpulse.value = impulseRef.current;
  });

  const handleClick = (e: any) => {
    e.stopPropagation();
    if (activeView === 'STILL') return;
    impulseRef.current = 0.8;
    onClick();
  };

  return (
    <mesh
      ref={meshRef}
      onPointerDown={handleClick}
      scale={[1, 1, 1]}
      position={[0, 0, 0]}
    >
      <planeGeometry args={[22, 12, 128, 128]} />
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        side={THREE.DoubleSide}
        transparent={true}
      />
    </mesh>
  );
};

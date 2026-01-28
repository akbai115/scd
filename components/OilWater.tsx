import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const OilMesh = () => {
    const mesh = useRef<THREE.Mesh>(null);

    // Create a custom shader material for that "oil" look
    // Dark, heavy, undulating, with specular highlights
    const uniforms = useMemo(() => ({
        uTime: { value: 0 },
        uColor: { value: new THREE.Color('#050505') }, // Very dark grey, not pure black
        uHighlight: { value: new THREE.Color('#AAAAAA') }, // Bright silvery highlight
    }), []);

    const vertexShader = `
    varying vec2 vUv;
    varying float vElevation;
    uniform float uTime;

    // Simplex noise function (simplified)
    vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
    vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
    vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }

    float snoise(vec2 v) {
      const vec4 C = vec4(0.211324865405187,  // (3.0-sqrt(3.0))/6.0
                          0.366025403784439,  // 0.5*(sqrt(3.0)-1.0)
                         -0.577350269189626,  // -1.0 + 2.0 * C.x
                          0.024390243902439); // 1.0 / 41.0
      vec2 i  = floor(v + dot(v, C.yy) );
      vec2 x0 = v -   i + dot(i, C.xx);
      vec2 i1;
      i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
      vec4 x12 = x0.xyxy + C.xxzz;
      x12.xy -= i1;
      i = mod289(i); // Avoid truncation effects in permutation
      vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
            + i.x + vec3(0.0, i1.x, 1.0 ));
      vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
      m = m*m ;
      m = m*m ;
      vec3 x = 2.0 * fract(p * C.www) - 1.0;
      vec3 h = abs(x) - 0.5;
      vec3 ox = floor(x + 0.5);
      vec3 a0 = x - ox;
      m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
      vec3 g;
      g.x  = a0.x  * x0.x  + h.x  * x0.y;
      g.yz = a0.yz * x12.xz + h.yz * x12.yw;
      return 130.0 * dot(m, g);
    }

    void main() {
      vUv = uv;
      
      // Slow, heavy movement
      float noise = snoise(vec2(uv.x * 2.0 + uTime * 0.1, uv.y * 2.0 + uTime * 0.15)); // Higher scale, slower time
      
      // Secondary layer for detail
      noise += snoise(vec2(uv.x * 6.0 - uTime * 0.1, uv.y * 4.0 + uTime * 0.05)) * 0.2;

      vElevation = noise;

      vec3 newPosition = position;
      newPosition.z += noise * 0.8; // Height displacement

      gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
    }
  `;

    const fragmentShader = `
    varying vec2 vUv;
    varying float vElevation;
    uniform vec3 uColor;
    uniform vec3 uHighlight;

    void main() {
      // Base dark color
      vec3 color = uColor;

      // Shininess / Reflection based on elevation (fake lighting)
      // High elevation = catch light
      // We create a sharp band for "oil" look
      float shine = smoothstep(0.3, 0.35, vElevation) - smoothstep(0.35, 0.6, vElevation);
      
      // Add moving highlights
      color = mix(color, uHighlight, shine * 0.8); // Stronger highlight
      
      // subtle gradient for depth
      color = mix(color, vec3(0.02), vElevation * 0.1);

      gl_FragColor = vec4(color, 1.0);
    }
  `;

    useFrame((state) => {
        if (mesh.current) {
            // @ts-ignore
            mesh.current.material.uniforms.uTime.value = state.clock.getElapsedTime();
        }
    });

    return (
        <mesh ref={mesh} rotation={[-Math.PI / 2.2, 0, 0]} position={[0, -1, 0]}> {/* Tilted up slightly more */}
            <planeGeometry args={[20, 10, 128, 128]} />
            <shaderMaterial
                vertexShader={vertexShader}
                fragmentShader={fragmentShader}
                uniforms={uniforms}
                transparent={true}
            />
        </mesh>
    );
};

export const OilWater: React.FC = () => {
    return (
        <div className="absolute bottom-0 left-0 right-0 h-[40vh] w-full z-0 opacity-100 pointer-events-none fade-in duration-2000">
            <Canvas camera={{ position: [0, 2, 4], fov: 45 }}>
                <ambientLight intensity={0.5} />
                <pointLight position={[0, 5, 5]} intensity={3.0} color="#ffffff" />
                <pointLight position={[-5, 2, 5]} intensity={2.0} color="#ccccff" /> {/* Side cooler light */}
                <OilMesh />
            </Canvas>
            {/* Vignette fade to black at top of water */}
            <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-black to-transparent" />
        </div>
    );
};

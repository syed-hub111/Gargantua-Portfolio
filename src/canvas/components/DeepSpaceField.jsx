import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Custom shader for starfield with relativistic gravitational lensing deflection
const LensedStarfieldShader = {
  vertexShader: `
    uniform vec3 uBlackHolePos;
    uniform float uEinsteinRadius;
    attribute vec3 aColor;
    attribute float aSize;
    varying vec3 vColor;

    void main() {
      vColor = aColor;

      // Project world position
      vec4 worldPos = modelMatrix * vec4(position, 1.0);
      vec3 pos = worldPos.xyz;

      // Gravitational deflection approximation around black hole
      vec3 toStar = pos - uBlackHolePos;
      float dist = length(toStar);
      
      // Calculate perpendicular impact parameter to line of sight
      if (dist > 3.0 && dist < 180.0) {
        vec3 dir = normalize(toStar);
        // Einstein deflection: angle ~ 4GM / (c^2 * r) -> pushes stars radially outward from shadow
        float deflection = uEinsteinRadius / (dist * 0.4 + 1.0);
        pos += dir * deflection * 2.2;
      }

      vec4 mvPosition = viewMatrix * vec4(pos, 1.0);
      gl_PointSize = aSize * (160.0 / -mvPosition.z);
      gl_Position = projectionMatrix * mvPosition;
    }
  `,
  fragmentShader: `
    varying vec3 vColor;

    void main() {
      // Crisp circular star point with soft Gaussian core
      float distToCenter = length(gl_PointCoord - vec2(0.5));
      if (distToCenter > 0.5) discard;
      
      float intensity = 1.0 - smoothstep(0.0, 0.5, distToCenter);
      float core = 1.0 - smoothstep(0.0, 0.15, distToCenter);
      
      vec3 finalColor = vColor * (intensity * 0.7 + core * 0.8);
      gl_FragColor = vec4(finalColor, intensity);
    }
  `
};

export function DeepSpaceField() {
  const pointsRef = useRef();
  const shaderMatRef = useRef();

  // Generate sparse, realistic stellar distribution (restrained count: 1800 stars)
  const { positions, colors, sizes } = useMemo(() => {
    const count = 1800;
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const sz = new Float32Array(count);

    // Natural stellar color temperatures (Kelvin blackbody approximation)
    const stellarPalette = [
      new THREE.Color('#ffffff'), // Pure white (A-type)
      new THREE.Color('#fef3c7'), // Soft straw yellow (G-type, Solar)
      new THREE.Color('#e0f2fe'), // Crisp pale blue-white (B-type)
      new THREE.Color('#fed7aa'), // Warm amber dwarf (K-type)
      new THREE.Color('#f8fafc'), // Soft white
    ];

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      // Spherical galactic distribution at deep scale
      const radius = 60 + Math.random() * 280;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);

      pos[i3] = radius * Math.sin(phi) * Math.cos(theta);
      pos[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      pos[i3 + 2] = -radius * Math.cos(phi) - 40; // Deep along spaceflight axis

      const c = stellarPalette[Math.floor(Math.random() * stellarPalette.length)];
      col[i3] = c.r;
      col[i3 + 1] = c.g;
      col[i3 + 2] = c.b;

      // Realistic, subtle point sizes (no oversized glowing orbs)
      sz[i] = Math.random() * 1.4 + 0.6;
    }

    return { positions: pos, colors: col, sizes: sz };
  }, []);

  const uniforms = useMemo(
    () => ({
      uBlackHolePos: { value: new THREE.Vector3(0, 0, 0) },
      uEinsteinRadius: { value: 6.5 },
    }),
    []
  );

  useFrame((state, delta) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y += delta * 0.004; // Extremely slow galactic drift
    }
  });

  return (
    <group>
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={positions.length / 3}
            array={positions}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-aColor"
            count={colors.length / 3}
            array={colors}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-aSize"
            count={sizes.length}
            array={sizes}
            itemSize={1}
          />
        </bufferGeometry>
        <shaderMaterial
          ref={shaderMatRef}
          vertexShader={LensedStarfieldShader.vertexShader}
          fragmentShader={LensedStarfieldShader.fragmentShader}
          uniforms={uniforms}
          transparent={true}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>

      {/* Faint, cold absorptive cosmic dust lanes (Deep silhouette contrast) */}
      <mesh position={[-45, -15, -90]} rotation={[0.2, 0.4, 0]}>
        <planeGeometry args={[140, 70]} />
        <meshBasicMaterial
          color="#010308"
          transparent
          opacity={0.35}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}

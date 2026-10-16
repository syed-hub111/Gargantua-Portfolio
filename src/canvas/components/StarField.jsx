import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export function StarField({ warpActive = false }) {
  const pointsRef = useRef();
  const nebulaeRef = useRef();

  // Generate 3500 stars with diverse spatial distribution and color temperatures
  const { positions, colors, sizes, originalZ } = useMemo(() => {
    const count = 3500;
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const sz = new Float32Array(count);
    const origZ = new Float32Array(count);

    const palette = [
      new THREE.Color('#ffffff'), // White
      new THREE.Color('#38bdf8'), // Cyan / O-type
      new THREE.Color('#f59e0b'), // Warm Solar Gold
      new THREE.Color('#a855f7'), // Deep Violet
      new THREE.Color('#e0f2fe'), // Soft Ice Blue
    ];

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      // Wide galactic distribution
      const radius = 25 + Math.random() * 220;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);

      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = (radius * Math.sin(phi) * Math.sin(theta)) * 0.6; // Slightly flattened disk
      const z = -radius * Math.cos(phi) - 60; // Spread along journey axis

      pos[i3] = x;
      pos[i3 + 1] = y;
      pos[i3 + 2] = z;
      origZ[i] = z;

      // Color selection
      const chosenColor = palette[Math.floor(Math.random() * palette.length)];
      col[i3] = chosenColor.r;
      col[i3 + 1] = chosenColor.g;
      col[i3 + 2] = chosenColor.b;

      // Size variation
      sz[i] = Math.random() * 2.2 + 0.6;
    }

    return { positions: pos, colors: col, sizes: sz, originalZ: origZ };
  }, []);

  // Subtle rotation and warp streak animation
  useFrame((state, delta) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y += delta * 0.015;
      pointsRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.05) * 0.02;

      // When warping or rapid scrolling, scale points along Z
      const currentScaleZ = pointsRef.current.scale.z;
      const targetScaleZ = warpActive ? 3.5 : 1.0;
      pointsRef.current.scale.z = THREE.MathUtils.damp(currentScaleZ, targetScaleZ, 4, delta);
    }

    if (nebulaeRef.current) {
      nebulaeRef.current.rotation.z += delta * 0.01;
      nebulaeRef.current.rotation.y -= delta * 0.008;
    }
  });

  return (
    <group>
      {/* Dynamic Starfield Points */}
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={positions.length / 3}
            array={positions}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-color"
            count={colors.length / 3}
            array={colors}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={1.4}
          vertexColors
          transparent
          opacity={0.88}
          sizeAttenuation
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>

      {/* Volumetric Nebulae / Cosmic Dust Clusters */}
      <group ref={nebulaeRef} position={[0, -10, -80]}>
        {/* Soft atmospheric glowing dust clouds */}
        <mesh position={[-30, 20, -20]} scale={[60, 40, 1]}>
          <planeGeometry args={[1, 1]} />
          <meshBasicMaterial
            color="#1e1b4b"
            transparent
            opacity={0.25}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
            side={THREE.DoubleSide}
          />
        </mesh>
        <mesh position={[40, -15, -40]} scale={[70, 50, 1]}>
          <planeGeometry args={[1, 1]} />
          <meshBasicMaterial
            color="#083344"
            transparent
            opacity={0.28}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
            side={THREE.DoubleSide}
          />
        </mesh>
        <mesh position={[0, -25, -90]} scale={[90, 60, 1]}>
          <planeGeometry args={[1, 1]} />
          <meshBasicMaterial
            color="#3b0764"
            transparent
            opacity={0.22}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
            side={THREE.DoubleSide}
          />
        </mesh>
      </group>
    </group>
  );
}

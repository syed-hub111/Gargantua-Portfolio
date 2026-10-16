import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export function SolarCore({ scrollProgress = 0, isHovered = false }) {
  const sunMeshRef = useRef();
  const coronaRef = useRef();
  const outerHaloRef = useRef();
  const flareRingRef = useRef();
  const lightRef = useRef();

  // Expansion transition during initial scroll (0.0 to 0.22)
  // When scrolling from Gateway to Home, the sun flares and expands toward viewport
  useFrame((state, delta) => {
    const time = state.clock.elapsedTime;

    // Base rotational dynamics
    if (sunMeshRef.current) {
      sunMeshRef.current.rotation.y += delta * 0.12;
      sunMeshRef.current.rotation.x = Math.sin(time * 0.2) * 0.05;
    }

    if (coronaRef.current) {
      coronaRef.current.rotation.y -= delta * 0.08;
      coronaRef.current.rotation.z += delta * 0.05;
    }

    if (flareRingRef.current) {
      flareRingRef.current.rotation.z += delta * 0.15;
    }

    if (outerHaloRef.current) {
      const pulse = Math.sin(time * 2.5) * 0.05 + 1.0;
      outerHaloRef.current.scale.setScalar(pulse);
    }

    // Scroll-driven sun expansion effect
    // Progress between 0.02 and 0.20 triggers massive solar flare expansion
    let expansionFactor = 1.0;
    if (scrollProgress >= 0.02 && scrollProgress <= 0.22) {
      const t = (scrollProgress - 0.02) / 0.16; // 0 to 1
      expansionFactor = 1.0 + Math.sin(t * Math.PI) * 2.8; // Expands dramatically then settles
    }

    const targetScale = expansionFactor * (isHovered ? 1.08 : 1.0);
    if (sunMeshRef.current) {
      sunMeshRef.current.scale.setScalar(THREE.MathUtils.damp(sunMeshRef.current.scale.x, targetScale, 4, delta));
    }
    if (coronaRef.current) {
      coronaRef.current.scale.setScalar(THREE.MathUtils.damp(coronaRef.current.scale.x, targetScale * 1.25, 4, delta));
    }
    if (lightRef.current) {
      const baseIntensity = 5.0 + Math.sin(time * 3.0) * 0.4;
      const flareBoost = expansionFactor > 1.2 ? (expansionFactor - 1.0) * 6.0 : 0;
      lightRef.current.intensity = baseIntensity + flareBoost;
    }
  });

  return (
    <group position={[0, 0, 0]}>
      {/* Primary Radiant Point Light */}
      <pointLight
        ref={lightRef}
        color="#ffaa33"
        intensity={5.0}
        distance={280}
        decay={1.2}
      />
      {/* Secondary Soft Fill Light */}
      <pointLight color="#ffe082" intensity={2.5} distance={120} decay={2.0} />

      {/* 3D Physical Sun Mesh */}
      <mesh ref={sunMeshRef}>
        <sphereGeometry args={[3.6, 48, 48]} />
        <meshStandardMaterial
          color="#f59e0b"
          emissive="#ff7700"
          emissiveIntensity={2.8}
          roughness={0.2}
          metalness={0.1}
        />
      </mesh>

      {/* Inner Coronal Glow Atmosphere */}
      <mesh ref={coronaRef}>
        <sphereGeometry args={[4.2, 32, 32]} />
        <meshBasicMaterial
          color="#ffb703"
          transparent
          opacity={0.38}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          side={THREE.BackSide}
        />
      </mesh>

      {/* Outer Solar Flare Halo */}
      <group ref={outerHaloRef}>
        <mesh>
          <sphereGeometry args={[4.8, 32, 32]} />
          <meshBasicMaterial
            color="#fb8500"
            transparent
            opacity={0.18}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
            side={THREE.BackSide}
          />
        </mesh>
      </group>

      {/* Rotating Solar Flare Disk / Prominence Ring */}
      <mesh ref={flareRingRef} rotation={[Math.PI / 3, 0, 0]}>
        <ringGeometry args={[3.8, 6.2, 64]} />
        <meshBasicMaterial
          color="#ffaa00"
          transparent
          opacity={0.3}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Secondary Inclined Corona Ribbon */}
      <mesh rotation={[-Math.PI / 4, Math.PI / 6, 0]}>
        <ringGeometry args={[4.2, 5.8, 48]} />
        <meshBasicMaterial
          color="#ff6b00"
          transparent
          opacity={0.22}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
}

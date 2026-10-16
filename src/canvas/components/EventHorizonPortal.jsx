import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export function EventHorizonPortal({ position = [0, -32, -185] }) {
  const ring1Ref = useRef();
  const ring2Ref = useRef();
  const diskRef = useRef();

  useFrame((state, delta) => {
    if (ring1Ref.current) ring1Ref.current.rotation.z += delta * 0.2;
    if (ring2Ref.current) ring2Ref.current.rotation.z -= delta * 0.15;
    if (diskRef.current) diskRef.current.rotation.z += delta * 0.08;
  });

  return (
    <group position={position}>
      {/* Event Horizon Void Sphere */}
      <mesh>
        <sphereGeometry args={[3.2, 32, 32]} />
        <meshBasicMaterial color="#000000" />
      </mesh>

      {/* Swirling Accretion Disk */}
      <mesh ref={diskRef} rotation={[-Math.PI / 2.5, 0, 0]}>
        <ringGeometry args={[3.4, 7.5, 64]} />
        <meshBasicMaterial
          color="#38bdf8"
          transparent
          opacity={0.35}
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Concentric Quantum Portal Rings */}
      <mesh ref={ring1Ref}>
        <torusGeometry args={[4.2, 0.04, 16, 64]} />
        <meshStandardMaterial
          color="#38bdf8"
          emissive="#38bdf8"
          emissiveIntensity={1.2}
        />
      </mesh>

      <mesh ref={ring2Ref} rotation={[0, 0, Math.PI / 4]}>
        <torusGeometry args={[5.2, 0.04, 16, 64]} />
        <meshStandardMaterial
          color="#a855f7"
          emissive="#a855f7"
          emissiveIntensity={1.2}
        />
      </mesh>

      {/* Event Horizon Radiant Glow */}
      <pointLight color="#38bdf8" intensity={3.5} distance={30} decay={2} />
    </group>
  );
}

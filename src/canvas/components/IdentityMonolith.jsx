import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import * as THREE from 'three';

export function IdentityMonolith({ position = [-18, 0, -22] }) {
  const coreRef = useRef();
  const ring1Ref = useRef();
  const ring2Ref = useRef();
  const laserRef = useRef();

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;

    if (coreRef.current) {
      coreRef.current.rotation.y += delta * 0.15;
      coreRef.current.rotation.x = Math.sin(t * 0.3) * 0.08;
    }

    if (ring1Ref.current) {
      ring1Ref.current.rotation.x += delta * 0.18;
      ring1Ref.current.rotation.y += delta * 0.22;
    }

    if (ring2Ref.current) {
      ring2Ref.current.rotation.y -= delta * 0.24;
      ring2Ref.current.rotation.z += delta * 0.14;
    }

    // Precise vertical telemetry scan laser
    if (laserRef.current) {
      laserRef.current.position.y = Math.sin(t * 1.5) * 1.6;
    }
  });

  return (
    <group position={position}>
      {/* Restrained directional telemetry spotlight */}
      <pointLight color="#f59e0b" intensity={2.0} distance={20} decay={2} />
      <pointLight position={[0, -2, 2]} color="#38bdf8" intensity={1.5} distance={15} decay={2} />

      <Float speed={1.0} rotationIntensity={0.08} floatIntensity={0.2}>
        {/* Core Observation Station Pod */}
        <group position={[0, 1.2, 0]}>
          {/* Crystalline Aerospace Core */}
          <mesh ref={coreRef}>
            <octahedronGeometry args={[1.5, 0]} />
            <meshPhysicalMaterial
              color="#0f172a"
              emissive="#1e293b"
              emissiveIntensity={0.2}
              roughness={0.2}
              metalness={0.9}
              clearcoat={0.8}
            />
          </mesh>

          {/* Hairline Outer Wireframe Frame */}
          <mesh scale={1.08}>
            <octahedronGeometry args={[1.5, 0]} />
            <meshBasicMaterial color="#38bdf8" wireframe transparent opacity={0.3} />
          </mesh>

          {/* Precision Laser Telemetry Disc */}
          <mesh ref={laserRef} rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[0.2, 2.0, 32]} />
            <meshBasicMaterial
              color="#38bdf8"
              transparent
              opacity={0.25}
              side={THREE.DoubleSide}
              blending={THREE.AdditiveBlending}
            />
          </mesh>

          {/* Precision Gyroscope Gimbal Rings */}
          <mesh ref={ring1Ref}>
            <torusGeometry args={[2.3, 0.02, 16, 64]} />
            <meshStandardMaterial
              color="#64748b"
              metalness={0.9}
              roughness={0.2}
            />
          </mesh>

          <mesh ref={ring2Ref} rotation={[Math.PI / 3, 0, 0]}>
            <torusGeometry args={[2.6, 0.02, 16, 64]} />
            <meshStandardMaterial
              color="#475569"
              metalness={0.9}
              roughness={0.2}
            />
          </mesh>
        </group>
      </Float>

      {/* Floating Titanium Pedestal Platform */}
      <group position={[0, -2.5, 0]}>
        <mesh>
          <cylinderGeometry args={[2.5, 2.9, 0.35, 32]} />
          <meshStandardMaterial
            color="#080e1a"
            metalness={0.9}
            roughness={0.3}
          />
        </mesh>
        <mesh position={[0, 0.2, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[2.4, 2.55, 32]} />
          <meshBasicMaterial color="#334155" side={THREE.DoubleSide} />
        </mesh>
      </group>
    </group>
  );
}

import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Procedural single planet with rotation, orbital motion, and atmosphere
function Planet({
  distance,
  radius,
  speed,
  color,
  emissive = '#000000',
  roughness = 0.4,
  metalness = 0.2,
  tilt = 0.1,
  hasRings = false,
  ringInner = 0,
  ringOuter = 0,
  ringColor = '#f59e0b',
  hasMoon = false,
  name,
  onSelectPlanet,
}) {
  const orbitGroupRef = useRef();
  const planetBodyRef = useRef();
  const moonGroupRef = useRef();
  const [hovered, setHovered] = useState(false);

  useFrame((state, delta) => {
    // Orbital revolution around the sun
    if (orbitGroupRef.current) {
      orbitGroupRef.current.rotation.y += delta * speed * (hovered ? 0.3 : 1.0);
    }
    // Axial rotation of the planet itself
    if (planetBodyRef.current) {
      planetBodyRef.current.rotation.y += delta * 0.45;
    }
    // Moon revolution
    if (moonGroupRef.current) {
      moonGroupRef.current.rotation.y += delta * 1.5;
    }
  });

  return (
    <group>
      {/* 3D Orbital Guide Ring */}
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[distance - 0.04, distance + 0.04, 96]} />
        <meshBasicMaterial
          color="#38bdf8"
          transparent
          opacity={0.12}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Orbiting Group */}
      <group ref={orbitGroupRef}>
        <group
          position={[distance, 0, 0]}
          rotation={[tilt, 0, 0]}
          onPointerOver={(e) => {
            e.stopPropagation();
            setHovered(true);
            document.body.style.cursor = 'pointer';
          }}
          onPointerOut={() => {
            setHovered(false);
            document.body.style.cursor = 'auto';
          }}
          onClick={(e) => {
            e.stopPropagation();
            if (onSelectPlanet) onSelectPlanet(name);
          }}
        >
          {/* Planet Physical Sphere */}
          <mesh ref={planetBodyRef} scale={hovered ? 1.15 : 1.0}>
            <sphereGeometry args={[radius, 36, 36]} />
            <meshStandardMaterial
              color={color}
              emissive={hovered ? color : emissive}
              emissiveIntensity={hovered ? 0.6 : 0.15}
              roughness={roughness}
              metalness={metalness}
            />
          </mesh>

          {/* Atmospheric Glow Shell */}
          <mesh scale={hovered ? 1.25 : 1.12}>
            <sphereGeometry args={[radius, 24, 24]} />
            <meshBasicMaterial
              color={color}
              transparent
              opacity={hovered ? 0.35 : 0.18}
              blending={THREE.AdditiveBlending}
              side={THREE.BackSide}
            />
          </mesh>

          {/* Planetary Ring System (Gas Giant) */}
          {hasRings && (
            <mesh rotation={[-Math.PI / 2.3, 0.2, 0]}>
              <ringGeometry args={[ringInner, ringOuter, 64]} />
              <meshStandardMaterial
                color={ringColor}
                transparent
                opacity={0.7}
                side={THREE.DoubleSide}
                roughness={0.5}
              />
            </mesh>
          )}

          {/* Orbiting Moon */}
          {hasMoon && (
            <group ref={moonGroupRef}>
              <mesh position={[radius * 2.3, 0, 0]}>
                <sphereGeometry args={[radius * 0.22, 16, 16]} />
                <meshStandardMaterial color="#94a3b8" roughness={0.8} />
              </mesh>
            </group>
          )}
        </group>
      </group>
    </group>
  );
}

export function PlanetarySystem({ onSelectPlanet }) {
  return (
    <group position={[0, 0, 0]}>
      {/* Planet 1: Aethelgard (Cyan Terrestrial World with Moon) */}
      <Planet
        name="Aethelgard"
        distance={13.5}
        radius={1.15}
        speed={0.28}
        color="#38bdf8"
        emissive="#0284c7"
        tilt={0.15}
        hasMoon={true}
        onSelectPlanet={onSelectPlanet}
      />

      {/* Planet 2: Solara Prime (Majestic Ringed Gas Giant) */}
      <Planet
        name="Solara Prime"
        distance={23.0}
        radius={2.1}
        speed={0.18}
        color="#f59e0b"
        emissive="#b45309"
        tilt={0.35}
        hasRings={true}
        ringInner={2.7}
        ringOuter={4.4}
        ringColor="#fbbf24"
        onSelectPlanet={onSelectPlanet}
      />

      {/* Planet 3: Chronos (Deep Violet Exoplanet) */}
      <Planet
        name="Chronos"
        distance={34.0}
        radius={1.5}
        speed={0.12}
        color="#8b5cf6"
        emissive="#6d28d9"
        tilt={-0.2}
        roughness={0.3}
        onSelectPlanet={onSelectPlanet}
      />

      {/* Planet 4: Zephyrus (Emerald / Ice Giant) */}
      <Planet
        name="Zephyrus"
        distance={45.0}
        radius={1.8}
        speed={0.07}
        color="#059669"
        emissive="#047857"
        tilt={0.25}
        hasRings={true}
        ringInner={2.2}
        ringOuter={2.8}
        ringColor="#34d399"
        onSelectPlanet={onSelectPlanet}
      />
    </group>
  );
}

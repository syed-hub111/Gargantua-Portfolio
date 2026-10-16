import React, { useMemo, useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { JOURNEY_MILESTONES } from '../../data/portfolioData';
import { spaceAudio } from '../../audio/spaceAudio';

// 5 Chronogates positioned along the forward hyperspace flight corridor
const WARP_CHRONOGATES = [
  // 0. 2023 - 2027: Academic Launch & Foundation
  { pos: [0.0, -18.0, -84], year: '2023 – 2027', code: '01', color: '#38bdf8' },
  // 1. 2025: Competitive AI Breakthrough
  { pos: [0.0, -18.0, -100], year: '2025', code: '02', color: '#a855f7' },
  // 2. Jan – Feb 2026: IBM Enterprise Platform
  { pos: [0.0, -18.0, -116], year: 'JAN – FEB 2026', code: '03', color: '#10b981' },
  // 3. 2026: Enterprise Systems ERP Architecture
  { pos: [0.0, -18.0, -132], year: '2026', code: '04', color: '#f59e0b' },
  // 4. Present: Full Stack & WebGL Frontiers
  { pos: [0.0, -18.0, -148], year: 'PRESENT', code: '05', color: '#06b6d4' },
];

// Individual 3D Stargate Gate along the flight path
function WarpGateNode({
  milestone,
  config,
  index,
  isActive,
  onSelect,
}) {
  const gateRef = useRef();
  const ring1Ref = useRef();
  const ring2Ref = useRef();
  const coreRef = useRef();
  const [distToCam, setDistToCam] = useState(100);
  const [isPassed, setIsPassed] = useState(false);

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    const camPos = state.camera.position;

    // Measure distance from camera to this gate
    const gateZ = config.pos[2];
    const dist = Math.hypot(camPos.x - config.pos[0], camPos.y - config.pos[1], camPos.z - gateZ);
    setDistToCam(dist);
    setIsPassed(camPos.z < gateZ + 2.0); // Has camera passed through this gate?

    const proximityBoost = Math.max(0, 1.0 - dist / 28.0);

    if (ring1Ref.current) {
      ring1Ref.current.rotation.z += delta * (0.6 + proximityBoost * 2.5);
    }
    if (ring2Ref.current) {
      ring2Ref.current.rotation.z -= delta * (0.5 + proximityBoost * 2.0);
    }
    if (coreRef.current) {
      coreRef.current.rotation.y += delta * 1.5;
      coreRef.current.position.y = Math.sin(t * 2.5 + index) * 0.12;
    }
  });

  const handleInteract = (e) => {
    e?.stopPropagation?.();
    spaceAudio.playChime(520 + index * 50, 'sine', 0.18, 0.04);
    onSelect?.(index);
  };

  const gateColor = isActive ? config.color : '#38bdf8';
  const emissiveIntensity = isActive ? 2.5 : 0.6;

  // Fade out label when camera is passing right through (< 3.5m) or has already passed
  const isLabelVisible = !isPassed && distToCam > 3.5 && distToCam < 50;

  return (
    <group position={config.pos} ref={gateRef}>
      {/* 
        3D Hitbox for interacting with the gate in 3D space
      */}
      <mesh
        onPointerOver={(e) => {
          e.stopPropagation();
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={() => {
          document.body.style.cursor = 'auto';
        }}
        onClick={handleInteract}
      >
        <sphereGeometry args={[3.2, 12, 12]} />
        <meshBasicMaterial visible={false} />
      </mesh>

      {/* Outer Hyperspace Stargate Ring 1 (Concentric Titanium Ring) */}
      <mesh ref={ring1Ref}>
        <torusGeometry args={[2.7, 0.06, 16, 64]} />
        <meshStandardMaterial
          color={gateColor}
          emissive={gateColor}
          emissiveIntensity={emissiveIntensity}
          roughness={0.2}
          metalness={0.9}
        />
      </mesh>

      {/* Inner Rotating Energy Stargate Ring 2 */}
      <mesh ref={ring2Ref} scale={0.84}>
        <torusGeometry args={[2.7, 0.04, 16, 64]} />
        <meshBasicMaterial
          color={config.color}
          transparent
          opacity={isActive ? 0.95 : 0.45}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Relativistic Event Horizon Rim Disk */}
      <mesh rotation={[0, 0, 0]}>
        <ringGeometry args={[2.1, 2.65, 32]} />
        <meshBasicMaterial
          color={config.color}
          transparent
          opacity={isActive ? 0.4 : 0.15}
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Floating Diamond Chronocore at top beacon */}
      <mesh ref={coreRef} position={[0, 2.8, 0]}>
        <octahedronGeometry args={[0.32, 0]} />
        <meshStandardMaterial
          color="#ffffff"
          emissive={config.color}
          emissiveIntensity={isActive ? 2.8 : 0.8}
          roughness={0.1}
          metalness={0.9}
        />
      </mesh>

      {/* Radial Laser Flare on active gate */}
      {isActive && (
        <pointLight
          color={config.color}
          intensity={3.2}
          distance={15}
          decay={2}
        />
      )}

      {/* Spatial Billboard Label: Oriented above the gate, smoothly fading on approach */}
      {isLabelVisible && (
        <Html
          center
          distanceFactor={18}
          position={[0, 3.6, 0]}
          style={{
            userSelect: 'none',
            whiteSpace: 'nowrap',
            transition: 'opacity 0.2s ease',
            opacity: distToCam < 8 ? (distToCam - 3.5) / 4.5 : 1,
            pointerEvents: 'auto',
          }}
        >
          <div
            onClick={handleInteract}
            style={{
              cursor: 'pointer',
              background: isActive
                ? 'rgba(6, 11, 20, 0.95)'
                : 'rgba(5, 9, 18, 0.85)',
              border: `1px solid ${isActive ? config.color : 'rgba(56, 189, 248, 0.3)'}`,
              borderRadius: '8px',
              padding: isActive ? '6px 14px' : '4px 10px',
              boxShadow: isActive
                ? `0 0 24px ${config.color}66, 0 4px 14px rgba(0,0,0,0.6)`
                : '0 2px 10px rgba(0,0,0,0.5)',
              transform: isActive ? 'scale(1.1)' : 'scale(1.0)',
              transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
              textAlign: 'center',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                color: config.color,
                fontFamily: 'var(--font-mono)',
                fontSize: '10px',
                fontWeight: 700,
                letterSpacing: '0.08em',
              }}
            >
              <span>GATE {config.code}</span>
              <span>•</span>
              <span>{config.year}</span>
            </div>

            <div
              style={{
                color: isActive ? '#ffffff' : '#cbd5e1',
                fontSize: isActive ? '12px' : '11px',
                fontWeight: 600,
                fontFamily: 'var(--font-display)',
                letterSpacing: '0.02em',
                marginTop: '2px',
              }}
            >
              {milestone.badge}
            </div>
          </div>
        </Html>
      )}
    </group>
  );
}

export function JourneyOrbit({
  scrollProgress = 0,
  activeMilestoneIndex = 0,
  onSelectMilestone,
}) {
  // Laser flight corridor guide line connecting the gates along Z
  const { lineGeometry } = useMemo(() => {
    const points = [
      new THREE.Vector3(0, -18, -70),
      ...WARP_CHRONOGATES.map(g => new THREE.Vector3(...g.pos)),
      new THREE.Vector3(0, -18, -160),
    ];
    return {
      lineGeometry: new THREE.BufferGeometry().setFromPoints(points),
    };
  }, []);

  return (
    <group>
      {/* Central Laser Trajectory Flight Path */}
      <line geometry={lineGeometry}>
        <lineBasicMaterial
          color="#38bdf8"
          transparent
          opacity={0.35}
          linewidth={2}
        />
      </line>

      {/* 5 Chronogates along the forward flight corridor */}
      {JOURNEY_MILESTONES.map((milestone, idx) => (
        <WarpGateNode
          key={milestone.title}
          milestone={milestone}
          config={WARP_CHRONOGATES[idx]}
          index={idx}
          isActive={activeMilestoneIndex === idx}
          onSelect={onSelectMilestone}
        />
      ))}
    </group>
  );
}

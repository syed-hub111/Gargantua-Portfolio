import React, { useRef, useState, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { SKILL_CATEGORIES } from '../../data/portfolioData';
import { spaceAudio } from '../../audio/spaceAudio';

// High-precision telemetry hub for each skill domain on the tree
function SkillTelemetryNode({
  category,
  offset,
  labelPos = [0, 0.95, 0],
  idx,
  isCategoryActive,
  onHoverCategory,
}) {
  const nodeRef = useRef();
  const ringRef = useRef();
  const satellitesGroupRef = useRef();
  const [internalHover, setInternalHover] = useState(false);

  const isActive = isCategoryActive || internalHover;

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;

    if (nodeRef.current) {
      const targetScale = isActive ? 1.25 : 1.0;
      nodeRef.current.scale.setScalar(
        THREE.MathUtils.damp(nodeRef.current.scale.x, targetScale, 6, delta)
      );
    }

    if (ringRef.current) {
      ringRef.current.rotation.z -= delta * (isActive ? 1.2 : 0.4);
    }

    if (satellitesGroupRef.current) {
      satellitesGroupRef.current.rotation.y += delta * (isActive ? 0.9 : 0.3);
      satellitesGroupRef.current.rotation.x = Math.sin(t * 0.5 + idx) * 0.15;
    }
  });

  const handlePointerEnter = (e) => {
    e?.stopPropagation?.();
    setInternalHover(true);
    onHoverCategory?.(category.name);
    spaceAudio.playChime(640 + idx * 40, 'sine', 0.1, 0.02);
    document.body.style.cursor = 'pointer';
  };

  const handlePointerLeave = (e) => {
    e?.stopPropagation?.();
    setInternalHover(false);
    onHoverCategory?.(null);
    document.body.style.cursor = 'auto';
  };

  return (
    <group position={offset}>
      {/* 
        Generous Static Hitbox Sphere:
        Placed at offset without rotating or damping scale, guaranteeing 100% stable,
        immediate raycast detection when hovering over this node or its satellites!
      */}
      <mesh
        onPointerOver={handlePointerEnter}
        onPointerOut={handlePointerLeave}
        onClick={(e) => {
          e.stopPropagation();
          onHoverCategory?.(category.name);
          spaceAudio.playChime(740, 'sine', 0.15, 0.03);
        }}
      >
        <sphereGeometry args={[1.65, 12, 12]} />
        <meshBasicMaterial visible={false} />
      </mesh>

      {/* Visual Rotating Node Mesh */}
      <group ref={nodeRef}>
        {/* Dark Titanium Node Chassis */}
        <mesh>
          <octahedronGeometry args={[0.62, 0]} />
          <meshStandardMaterial
            color="#090e17"
            emissive={isActive ? category.color : '#030712'}
            emissiveIntensity={isActive ? 0.75 : 0.12}
            roughness={0.25}
            metalness={0.9}
          />
        </mesh>

        {/* Outer Hairline Wireframe Cage */}
        <mesh scale={1.14}>
          <octahedronGeometry args={[0.62, 0]} />
          <meshBasicMaterial
            color={isActive ? category.color : '#475569'}
            wireframe
            transparent
            opacity={isActive ? 0.9 : 0.35}
          />
        </mesh>

        {/* Holographic Equatorial Data Ring */}
        <mesh ref={ringRef} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.72, 0.86, 24]} />
          <meshBasicMaterial
            color={category.color}
            transparent
            opacity={isActive ? 0.7 : 0.25}
            side={THREE.DoubleSide}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      </group>

      {/* Spatial Telemetry HUD Badge */}
      <Html
        center
        distanceFactor={18}
        position={labelPos}
        style={{
          userSelect: 'none',
          whiteSpace: 'nowrap',
          transition: 'all 0.3s ease',
        }}
      >
        <div
          onMouseEnter={handlePointerEnter}
          onMouseLeave={handlePointerLeave}
          onClick={(e) => {
            e.stopPropagation();
            onHoverCategory?.(category.name);
          }}
          style={{
            pointerEvents: 'auto',
            cursor: 'pointer',
            background: isActive
              ? 'rgba(8, 14, 26, 0.95)'
              : 'rgba(5, 9, 18, 0.82)',
            border: `1px solid ${isActive ? category.color : 'rgba(56, 189, 248, 0.2)'}`,
            borderRadius: '6px',
            padding: '3px 8px',
            boxShadow: isActive
              ? `0 0 16px ${category.color}45, 0 4px 12px rgba(0,0,0,0.6)`
              : '0 2px 8px rgba(0,0,0,0.5)',
            transform: isActive ? 'scale(1.08)' : 'scale(1.0)',
            transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              color: '#ffffff',
              fontWeight: 700,
              fontSize: '11px',
              fontFamily: 'var(--font-display)',
              letterSpacing: '0.04em',
            }}
          >
            <span
              style={{
                color: category.color,
                fontFamily: 'var(--font-mono)',
                fontSize: '9px',
              }}
            >
              0{idx + 1}
            </span>
            <span>{category.name}</span>
          </div>
          <div
            style={{
              color: category.color,
              fontSize: '9px',
              fontFamily: 'var(--font-mono)',
              letterSpacing: '0.03em',
            }}
          >
            {category.tag}
          </div>
        </div>
      </Html>

      {/* Orbiting Satellite Skill Nodes (Sub-branches of the tree) */}
      <group ref={satellitesGroupRef}>
        {category.skills.slice(0, 5).map((skillName, sIdx) => {
          const totalSatellites = Math.min(5, category.skills.length);
          const angle = (sIdx / totalSatellites) * Math.PI * 2;
          const radius = 1.35;
          const x = Math.cos(angle) * radius;
          const z = Math.sin(angle) * radius;
          const y = Math.sin(angle * 2) * 0.2;

          return (
            <group key={skillName} position={[x, y, z]}>
              <mesh>
                <sphereGeometry args={[0.07, 10, 10]} />
                <meshStandardMaterial
                  color={isActive ? category.color : '#64748b'}
                  emissive={isActive ? category.color : '#0f172a'}
                  emissiveIntensity={isActive ? 0.9 : 0.15}
                  roughness={0.3}
                  metalness={0.8}
                />
              </mesh>
            </group>
          );
        })}
      </group>

      {/* Dynamic Point Light */}
      {isActive && (
        <pointLight
          color={category.color}
          intensity={1.8}
          distance={7}
          decay={2}
        />
      )}
    </group>
  );
}

// Energy pulse that travels along a branch line from central core to a node
function BranchEnergyPulse({ targetOffset, color, speed = 0.5, delay = 0 }) {
  const pulseRef = useRef();

  useFrame((state) => {
    if (pulseRef.current) {
      const t = (state.clock.elapsedTime * speed + delay) % 1.0;
      pulseRef.current.position.set(
        targetOffset[0] * t,
        targetOffset[1] * t,
        targetOffset[2] * t
      );
      // Fade out near extremities
      const alpha = Math.sin(t * Math.PI);
      pulseRef.current.scale.setScalar(0.7 + alpha * 0.5);
    }
  });

  return (
    <mesh ref={pulseRef}>
      <sphereGeometry args={[0.08, 8, 8]} />
      <meshBasicMaterial color={color} transparent opacity={0.85} />
    </mesh>
  );
}

export function SkillsGalaxy({
  position = [-18, -11.5, -75],
  activeCategory = null,
  onHoverCategory,
}) {
  const [internalActiveCategory, setInternalActiveCategory] = useState(null);
  const currentActive = activeCategory || internalActiveCategory;

  const coreRef = useRef();
  const coreOuterRef = useRef();
  const ringRef = useRef();

  const { viewport, size } = useThree();

  // Responsive scale factor ensuring the entire 3D skill tree fits perfectly on any screen
  const responsiveScale = useMemo(() => {
    const aspect = size.width / Math.max(1, size.height);
    // Target frustum dimensions at camera distance ~19
    const fitW = viewport.width / 13.5;
    const fitH = viewport.height / 11.5;
    let scale = Math.min(1.0, Math.min(fitW, fitH));

    if (aspect < 0.75) {
      // Mobile portrait mode: pull branches tighter to fit screen width
      scale = Math.min(0.68, fitW * 0.92);
    } else if (aspect < 1.2) {
      // Tablet / narrow window mode
      scale = Math.min(0.85, fitW * 0.90);
    }

    return Math.max(0.48, scale);
  }, [viewport.width, viewport.height, size.width, size.height]);

  useFrame((state, delta) => {
    if (coreRef.current) {
      coreRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.4) * 0.1;
    }
    if (coreOuterRef.current) {
      coreOuterRef.current.rotation.z += delta * 0.1;
    }
    if (ringRef.current) {
      ringRef.current.rotation.z += delta * 0.25;
    }
  });

  // Balanced 5-branch neural tree offsets (symmetric around core, comfortably within frustum)
  const NODE_CONFIGS = [
    // 0. Programming Languages (Top-Left)
    { offset: [-3.0, 1.85, 0.2], labelPos: [0, 0.95, 0] },
    // 1. Frameworks & Technologies (Top-Right)
    { offset: [3.0, 1.85, -0.2], labelPos: [0, 0.95, 0] },
    // 2. Databases & APIs (Mid-Left)
    { offset: [-3.8, -0.5, 0.3], labelPos: [0, 0.95, 0] },
    // 3. Developer Tools (Mid-Right)
    { offset: [3.8, -0.5, -0.3], labelPos: [0, 0.95, 0] },
    // 4. Core Skills (Bottom-Center)
    { offset: [0.0, -2.6, 0.5], labelPos: [0, -0.95, 0] },
  ];

  const handleHover = (catName) => {
    setInternalActiveCategory(catName);
    onHoverCategory?.(catName);
  };

  return (
    <group position={position}>
      {/* Responsively scaled skill tree container */}
      <group scale={responsiveScale}>
        {/* Central Systems Core (Root of the Skill Tree) */}
        <group position={[0, 0, 0]}>
          {/* Inner Titanium Matrix Core */}
          <mesh ref={coreRef}>
            <icosahedronGeometry args={[0.92, 1]} />
            <meshStandardMaterial
              color="#0f172a"
              emissive="#38bdf8"
              emissiveIntensity={0.25}
              roughness={0.25}
              metalness={0.9}
            />
          </mesh>

          {/* Outer Cyan Wireframe Geodesic Shell */}
          <mesh ref={coreOuterRef} scale={1.12}>
            <icosahedronGeometry args={[0.92, 1]} />
            <meshBasicMaterial
              color="#38bdf8"
              wireframe
              transparent
              opacity={0.35}
            />
          </mesh>

          {/* Orbiting Gyro Ring */}
          <mesh ref={ringRef} rotation={[Math.PI / 3, 0, 0]}>
            <torusGeometry args={[1.4, 0.015, 16, 64]} />
            <meshBasicMaterial
              color="#38bdf8"
              transparent
              opacity={0.35}
            />
          </mesh>

          {/* Core Telemetry Root Label */}
          <Html
            center
            distanceFactor={20}
            position={[0, 1.5, 0]}
            style={{
              pointerEvents: 'none',
              userSelect: 'none',
              whiteSpace: 'nowrap',
            }}
          >
            <div
              style={{
                background: 'rgba(6, 11, 20, 0.85)',
                border: '1px solid rgba(56, 189, 248, 0.3)',
                borderRadius: '9999px',
                padding: '3px 10px',
                fontSize: '9px',
                fontFamily: 'var(--font-mono)',
                color: 'var(--accent-cyan)',
                letterSpacing: '0.12em',
                boxShadow: '0 0 12px rgba(56, 189, 248, 0.25)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
              }}
            >
              <span
                style={{
                  width: '5px',
                  height: '5px',
                  borderRadius: '50%',
                  background: 'var(--accent-cyan)',
                  boxShadow: '0 0 6px var(--accent-cyan)',
                }}
              />
              <span>SYSTEMS MATRIX ROOT</span>
            </div>
          </Html>
        </group>

        {/* 5 Tree Branches, Data Conduits, and Category Nodes */}
        {SKILL_CATEGORIES.map((cat, idx) => {
          const config = NODE_CONFIGS[idx];
          const isCategoryActive = currentActive === cat.name;

          return (
            <React.Fragment key={cat.name}>
              {/* Category Telemetry Node with robust raycast hitbox */}
              <SkillTelemetryNode
                category={cat}
                offset={config.offset}
                labelPos={config.labelPos}
                idx={idx}
                isCategoryActive={isCategoryActive}
                onHoverCategory={handleHover}
              />

              {/* Laser Conduit Trunk Line from Core [0,0,0] to Node */}
              <line>
                <bufferGeometry>
                  <bufferAttribute
                    attach="attributes-position"
                    count={2}
                    array={new Float32Array([0, 0, 0, ...config.offset])}
                    itemSize={3}
                  />
                </bufferGeometry>
                <lineBasicMaterial
                  color={isCategoryActive ? cat.color : '#334155'}
                  transparent
                  opacity={isCategoryActive ? 0.9 : 0.35}
                />
              </line>

              {/* Data Energy Pulses Traveling along Conduit */}
              <BranchEnergyPulse
                targetOffset={config.offset}
                color={cat.color}
                speed={0.45}
                delay={idx * 0.2}
              />
              <BranchEnergyPulse
                targetOffset={config.offset}
                color="#ffffff"
                speed={0.45}
                delay={idx * 0.2 + 0.5}
              />
            </React.Fragment>
          );
        })}
      </group>
    </group>
  );
}

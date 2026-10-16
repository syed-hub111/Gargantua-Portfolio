import React, { useMemo, useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { PROJECTS } from '../../data/portfolioData';
import { spaceAudio } from '../../audio/spaceAudio';

// Procedural Atmospheric Glow Shader for Central Planetary Globe
const GlobeAtmosphereShader = {
  vertexShader: `
    varying vec3 vNormal;
    varying vec3 vWorldPosition;
    void main() {
      vNormal = normalize(normalMatrix * normal);
      vec4 worldPos = modelMatrix * vec4(position, 1.0);
      vWorldPosition = worldPos.xyz;
      gl_Position = projectionMatrix * viewMatrix * worldPos;
    }
  `,
  fragmentShader: `
    uniform vec3 uCameraPos;
    varying vec3 vNormal;
    varying vec3 vWorldPosition;

    void main() {
      vec3 viewDir = normalize(uCameraPos - vWorldPosition);
      float rim = 1.0 - max(dot(viewDir, vNormal), 0.0);
      float intensity = pow(rim, 2.6);

      vec3 atmosColor = mix(vec3(0.22, 0.74, 0.97), vec3(0.96, 0.62, 0.14), rim * 0.45);
      gl_FragColor = vec4(atmosColor, clamp(intensity * 0.85, 0.0, 1.0));
    }
  `
};

// Generates an aerospace planetary surface texture with high-tech coordinates, continents, and glowing telemetry nodes
function createPlanetaryCanvasTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');

  // Deep obsidian void base
  ctx.fillStyle = '#020617';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // High-precision graticule grid lines (Latitude & Longitude)
  ctx.strokeStyle = 'rgba(56, 189, 248, 0.16)';
  ctx.lineWidth = 1;
  for (let lat = 0; lat <= canvas.height; lat += 32) {
    ctx.beginPath();
    ctx.moveTo(0, lat);
    ctx.lineTo(canvas.width, lat);
    ctx.stroke();
  }
  for (let lon = 0; lon <= canvas.width; lon += 32) {
    ctx.beginPath();
    ctx.moveTo(lon, 0);
    ctx.lineTo(lon, canvas.height);
    ctx.stroke();
  }

  // Equator & Prime Meridian highlight lines
  ctx.strokeStyle = 'rgba(56, 189, 248, 0.42)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(0, canvas.height / 2);
  ctx.lineTo(canvas.width, canvas.height / 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(canvas.width / 2, 0);
  ctx.lineTo(canvas.width / 2, canvas.height);
  ctx.stroke();

  // Procedural continental landmass contours
  ctx.fillStyle = 'rgba(14, 116, 144, 0.22)';
  ctx.strokeStyle = 'rgba(56, 189, 248, 0.45)';
  ctx.lineWidth = 1.5;

  const continentPolys = [
    // North quadrant
    [[180, 80], [330, 95], [315, 190], [240, 230], [210, 160], [170, 110]],
    // South quadrant
    [[260, 260], [340, 290], [310, 420], [275, 440], [245, 330]],
    // Eastern continent
    [[480, 70], [760, 80], [840, 165], [720, 255], [590, 220], [520, 140]],
    // Central meridian landmass
    [[470, 220], [580, 230], [590, 360], [530, 420], [460, 310]],
    // Oceanic archipelagos
    [[760, 320], [870, 330], [860, 420], [770, 410]],
    [[720, 180], [800, 200], [780, 270], [710, 240]]
  ];

  continentPolys.forEach((poly) => {
    ctx.beginPath();
    ctx.moveTo(poly[0][0], poly[0][1]);
    for (let i = 1; i < poly.length; i++) {
      ctx.lineTo(poly[i][0], poly[i][1]);
    }
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  });

  // Glowing planetary telemetry nodes (city / communications hubs)
  const dataNodes = [
    [260, 140], [210, 160], [300, 330], [530, 150], [600, 180],
    [710, 220], [790, 190], [540, 290], [820, 370], [380, 180],
    [640, 150], [750, 260], [490, 260], [270, 390], [840, 240]
  ];

  dataNodes.forEach(([nx, ny]) => {
    const radGlow = ctx.createRadialGradient(nx, ny, 1, nx, ny, 10);
    radGlow.addColorStop(0, '#38bdf8');
    radGlow.addColorStop(0.35, 'rgba(56, 189, 248, 0.75)');
    radGlow.addColorStop(1, 'rgba(56, 189, 248, 0)');
    ctx.fillStyle = radGlow;
    ctx.beginPath();
    ctx.arc(nx, ny, 10, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(nx, ny, 2, 0, Math.PI * 2);
    ctx.fill();
  });

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  return texture;
}

// Orbiting 3D Satellite for each Project
function ProjectSatellite({
  project,
  angle,
  orbitRadius,
  onSelectProject,
}) {
  const satelliteRef = useRef();
  const dataPulseRef = useRef();
  const [hovered, setHovered] = useState(false);

  // Calculate 3D position along the orbital ring
  const x = Math.cos(angle) * orbitRadius;
  const z = Math.sin(angle) * orbitRadius;
  const y = Math.sin(angle * 2.0) * 0.75; // Gentle sinusoidal inclination wave

  useFrame((state, delta) => {
    if (!satelliteRef.current) return;

    // Smooth hover scale damping
    const targetScale = hovered ? 1.25 : 1.0;
    satelliteRef.current.scale.setScalar(
      THREE.MathUtils.damp(satelliteRef.current.scale.x, targetScale, 7, delta)
    );

    // Subtle axial wobble
    satelliteRef.current.rotation.y += delta * 0.35;

    // Data packet pulse traveling between center globe and satellite
    if (dataPulseRef.current) {
      const t = (state.clock.elapsedTime * 0.75 + angle) % 1.0;
      dataPulseRef.current.position.set(-x * (1 - t), -y * (1 - t), -z * (1 - t));
    }
  });

  const handleTriggerSelect = (e) => {
    if (e && e.stopPropagation) e.stopPropagation();
    spaceAudio.playWarp();
    onSelectProject(project);
  };

  return (
    <group position={[x, y, z]}>
      {/* Laser Telemetry Line connecting Central Globe to this Satellite */}
      <line>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={2}
            array={new Float32Array([0, 0, 0, -x, -y, -z])}
            itemSize={3}
          />
        </bufferGeometry>
        <lineBasicMaterial
          color={project.color}
          transparent
          opacity={hovered ? 0.85 : 0.28}
        />
      </line>

      {/* Glowing Data Pulse traveling along the laser line */}
      <mesh ref={dataPulseRef}>
        <sphereGeometry args={[0.08, 12, 12]} />
        <meshBasicMaterial color={project.color} />
      </mesh>

      {/* Satellite 3D Physical Craft Assembly */}
      <group
        ref={satelliteRef}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
          spaceAudio.playChime(640, 'sine', 0.12, 0.03);
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={() => {
          setHovered(false);
          document.body.style.cursor = 'auto';
        }}
        onClick={handleTriggerSelect}
      >
        {/* Central Satellite Body (Aerospace Titanium Chassis) */}
        <mesh castShadow receiveShadow>
          <cylinderGeometry args={[0.42, 0.42, 0.88, 16]} />
          <meshStandardMaterial
            color="#080e1a"
            roughness={0.2}
            metalness={0.92}
            emissive={hovered ? project.color : '#000000'}
            emissiveIntensity={hovered ? 0.45 : 0.05}
          />
        </mesh>

        {/* Glowing Reactor Core / Forward Sensor Orb */}
        <mesh position={[0, 0, 0.45]}>
          <sphereGeometry args={[0.22, 16, 16]} />
          <meshStandardMaterial
            color={project.color}
            emissive={project.color}
            emissiveIntensity={hovered ? 2.5 : 1.2}
            roughness={0.1}
          />
        </mesh>

        {/* High-Gain Antenna Pointed toward Central Globe */}
        <mesh position={[0, 0, -0.48]} rotation={[Math.PI / 2, 0, 0]}>
          <coneGeometry args={[0.25, 0.35, 16, 1, true]} />
          <meshStandardMaterial
            color="#38bdf8"
            metalness={0.9}
            roughness={0.3}
            side={THREE.DoubleSide}
          />
        </mesh>

        {/* Solar Array Wings (Left & Right Photovoltaic Panels) */}
        <mesh position={[-0.98, 0, 0]}>
          <boxGeometry args={[0.96, 0.44, 0.03]} />
          <meshStandardMaterial
            color="#0f172a"
            roughness={0.3}
            metalness={0.8}
            emissive={project.color}
            emissiveIntensity={0.15}
          />
        </mesh>
        <mesh position={[0.98, 0, 0]}>
          <boxGeometry args={[0.96, 0.44, 0.03]} />
          <meshStandardMaterial
            color="#0f172a"
            roughness={0.3}
            metalness={0.8}
            emissive={project.color}
            emissiveIntensity={0.15}
          />
        </mesh>

        {/* High-Resolution Spatial Telemetry HUD Badge in 3D */}
        <Html
          center
          distanceFactor={14}
          position={[0, 1.2, 0]}
          style={{
            pointerEvents: 'auto',
            userSelect: 'none',
            whiteSpace: 'nowrap',
            cursor: 'pointer',
          }}
          onClick={handleTriggerSelect}
          onMouseEnter={() => {
            setHovered(true);
            spaceAudio.playChime(640, 'sine', 0.12, 0.03);
          }}
          onMouseLeave={() => setHovered(false)}
        >
          <div
            style={{
              padding: '7px 14px',
              borderRadius: '9px',
              background: 'rgba(5, 10, 20, 0.94)',
              border: `1px solid ${hovered ? project.color : 'rgba(56, 189, 248, 0.35)'}`,
              boxShadow: hovered
                ? `0 0 24px ${project.color}60, 0 8px 24px rgba(0,0,0,0.6)`
                : '0 4px 16px rgba(0,0,0,0.5)',
              transform: hovered ? 'scale(1.08)' : 'scale(1.0)',
              transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
          >
            <div
              style={{
                color: project.color,
                fontFamily: 'var(--font-mono)',
                fontSize: '10px',
                fontWeight: 700,
                letterSpacing: '0.12em',
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
              }}
            >
              <span
                style={{
                  display: 'inline-block',
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  background: project.color,
                  boxShadow: `0 0 8px ${project.color}`,
                }}
              />
              MISSION // {project.number}
            </div>

            <div
              style={{
                color: '#ffffff',
                fontFamily: 'var(--font-display)',
                fontSize: '13.5px',
                fontWeight: 700,
                lineHeight: 1.3,
                marginTop: '1px',
              }}
            >
              {project.name}
            </div>

            <div
              style={{
                color: '#94a3b8',
                fontFamily: 'var(--font-mono)',
                fontSize: '9.5px',
                marginTop: '2px',
              }}
            >
              {project.category.includes('•')
                ? project.category.split('•')[0].trim()
                : project.category.split('|')[0].trim()}
            </div>

            {hovered && (
              <div
                style={{
                  marginTop: '5px',
                  paddingTop: '4px',
                  borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                  color: project.color,
                  fontFamily: 'var(--font-mono)',
                  fontSize: '9px',
                  fontWeight: 600,
                  letterSpacing: '0.08em',
                  textAlign: 'center',
                }}
              >
                [CLICK TO DOCK / INSPECT]
              </div>
            )}
          </div>
        </Html>

        {/* Radiant Point Light on hover */}
        {hovered && (
          <pointLight
            color={project.color}
            intensity={3.0}
            distance={9}
            decay={2}
          />
        )}
      </group>
    </group>
  );
}

export function ProjectConstellation({ onSelectProject, position = [26, 0, -48] }) {
  const globeMeshRef = useRef();
  const globeGridRef = useRef();
  const orbitGroupRef = useRef();
  const ringsRef = useRef();
  const [anyHovered, setAnyHovered] = useState(false);

  const orbitRadius = 6.2;

  // Procedural planetary texture generated on mount
  const planetaryTexture = useMemo(() => createPlanetaryCanvasTexture(), []);

  useFrame((state, delta) => {
    // Horizontal spinning of the central sphere removed as requested
    if (globeGridRef.current) {
      globeGridRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.25) * 0.04;
    }

    // Slow orbital rotation of planetary coordinate rings
    if (ringsRef.current) {
      ringsRef.current.rotation.z += delta * 0.03;
    }

    // Majestic orbital revolution of the satellite fleet around the globe
    if (orbitGroupRef.current) {
      const orbitSpeed = anyHovered ? 0.015 : 0.065;
      orbitGroupRef.current.rotation.y += delta * orbitSpeed;
    }
  });

  return (
    <group position={position}>
      {/* Central Blue Illumination Radiating from Core */}
      <pointLight color="#38bdf8" intensity={2.8} distance={20} decay={1.8} />

      {/* ======================================================== */}
      {/* 1. CENTRAL HOLOGRAPHIC PLANETARY DATA GLOBE              */}
      {/* ======================================================== */}
      <group>
        {/* Core Planetary Sphere with High-Tech Oceanic Crust & Graticule */}
        <mesh ref={globeMeshRef}>
          <sphereGeometry args={[2.4, 64, 64]} />
          <meshStandardMaterial
            map={planetaryTexture}
            color="#ffffff"
            emissive="#0284c7"
            emissiveMap={planetaryTexture}
            emissiveIntensity={0.45}
            roughness={0.25}
            metalness={0.8}
          />
        </mesh>

        {/* Holographic Wireframe Coordinate Lattice */}
        <mesh ref={globeGridRef} scale={1.03}>
          <sphereGeometry args={[2.4, 28, 28]} />
          <meshBasicMaterial
            color="#38bdf8"
            wireframe
            transparent
            opacity={0.18}
          />
        </mesh>

        {/* Atmospheric Rayleigh Limb Scattering Halo */}
        <mesh scale={1.09}>
          <sphereGeometry args={[2.4, 32, 32]} />
          <shaderMaterial
            vertexShader={GlobeAtmosphereShader.vertexShader}
            fragmentShader={GlobeAtmosphereShader.fragmentShader}
            uniforms={{
              uCameraPos: { value: new THREE.Vector3() },
            }}
            transparent={true}
            blending={THREE.AdditiveBlending}
            side={THREE.BackSide}
            depthWrite={false}
          />
        </mesh>

        {/* Planetary Orbital Rings & Celestial Coordinate Guides */}
        <group ref={ringsRef}>
          {/* Main Equatorial Orbital Ring */}
          <mesh rotation={[-Math.PI / 2.3, 0.1, 0]}>
            <ringGeometry args={[orbitRadius - 0.03, orbitRadius + 0.03, 128]} />
            <meshBasicMaterial
              color="#38bdf8"
              transparent
              opacity={0.32}
              side={THREE.DoubleSide}
            />
          </mesh>

          {/* Secondary Inner Telemetry Ring */}
          <mesh rotation={[-Math.PI / 2.6, -0.15, 0]}>
            <ringGeometry args={[3.4, 3.44, 96]} />
            <meshBasicMaterial
              color="#f59e0b"
              transparent
              opacity={0.22}
              side={THREE.DoubleSide}
            />
          </mesh>

          {/* Tertiary Polar Orbit Ring */}
          <mesh rotation={[0.4, 0.2, 0]}>
            <ringGeometry args={[4.4, 4.43, 96]} />
            <meshBasicMaterial
              color="#818cf8"
              transparent
              opacity={0.16}
              side={THREE.DoubleSide}
            />
          </mesh>
        </group>
      </group>

      {/* ======================================================== */}
      {/* 2. SURROUNDING ORBITAL PROJECT SATELLITES                */}
      {/* ======================================================== */}
      <group
        ref={orbitGroupRef}
        rotation={[-0.15, 0, 0.08]}
        onPointerOver={() => setAnyHovered(true)}
        onPointerOut={() => setAnyHovered(false)}
      >
        {PROJECTS.map((project, idx) => {
          const angle = (idx / PROJECTS.length) * Math.PI * 2;
          return (
            <ProjectSatellite
              key={project.id}
              project={project}
              angle={angle}
              orbitRadius={orbitRadius}
              onSelectProject={onSelectProject}
            />
          );
        })}
      </group>
    </group>
  );
}

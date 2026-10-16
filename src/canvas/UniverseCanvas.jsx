import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import * as THREE from 'three';

import { DeepSpaceField } from './components/DeepSpaceField';
import { BlackHole } from './components/BlackHole';
import { CelestialHorizon } from './components/CelestialHorizon';
import { IdentityMonolith } from './components/IdentityMonolith';
import { ProjectConstellation } from './components/ProjectConstellation';
import { SkillsGalaxy } from './components/SkillsGalaxy';
import { JourneyOrbit } from './components/JourneyOrbit';
import { WarpSpeedTunnel } from './components/WarpSpeedTunnel';
import { EventHorizonPortal } from './components/EventHorizonPortal';
import { CameraController } from './components/CameraController';

export function UniverseCanvas({
  scrollProgress = 0,
  onSelectProject,
  activeSkillCategory,
  onHoverSkillCategory,
  activeMilestoneIndex = 0,
  onSelectMilestone,
}) {
  return (
    <div className="canvas-wrapper">
      <Canvas
        camera={{ position: [0, 4.2, 36], fov: 48, near: 0.1, far: 900 }}
        gl={{
          alpha: false,
          antialias: true,
          powerPreference: 'high-performance',
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.05,
        }}
        dpr={[1, 1.3]}
      >
        <color attach="background" args={['#010206']} />
        <fog attach="fog" args={['#010206', 120, 500]} />

        {/* Minimalist physical fill lighting (dark cosmos, not washed out) */}
        <ambientLight intensity={0.12} color="#f8fafc" />

        <Suspense fallback={null}>
          {/* Sparse stars with gravitational lensing deflection */}
          <DeepSpaceField />

          {/* Primary Cinematic Landmark: Relativistic Black Hole */}
          <BlackHole position={[0, 0, 0]} />

          {/* Distant dark exoplanet horizon positioned at Contact horizon */}
          <CelestialHorizon position={[-38, -20, -190]} />

          {/* Portfolio Sector Monoliths - Mounted gracefully as camera approaches each sector */}
          {scrollProgress > 0.14 && scrollProgress < 0.55 && (
            <IdentityMonolith position={[-18, 0, -22]} />
          )}
          {scrollProgress > 0.32 && scrollProgress < 0.75 && (
            <ProjectConstellation onSelectProject={onSelectProject} />
          )}
          {scrollProgress > 0.55 && scrollProgress < 0.76 && (
            <SkillsGalaxy
              position={[-18, -11.5, -75]}
              activeCategory={activeSkillCategory}
              onHoverCategory={onHoverSkillCategory}
            />
          )}
          {/* Relativistic Hyperspace Warp Drive Tunnel */}
          <WarpSpeedTunnel scrollProgress={scrollProgress} />

          {/* Chronological Stargates along the warp travel corridor */}
          {scrollProgress > 0.70 && scrollProgress < 0.96 && (
            <JourneyOrbit
              scrollProgress={scrollProgress}
              activeMilestoneIndex={activeMilestoneIndex}
              onSelectMilestone={onSelectMilestone}
            />
          )}
          {scrollProgress > 0.88 && (
            <EventHorizonPortal position={[0, -22, -195]} />
          )}

          {/* Cinematic Orbital Camera Coordinator */}
          <CameraController scrollProgress={scrollProgress} />
        </Suspense>
      </Canvas>
    </div>
  );
}

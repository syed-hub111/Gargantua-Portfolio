import { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

// Cinematic orbital flight path waypoints (Gargantua Slingshot Trajectory)
const WAYPOINTS = [
  // 0. Gateway / The Singularity: Wide cinematic composition of the massive Black Hole
  { p: 0.0, pos: [0, 4.2, 36], target: [0, 0, 0] },
  // 1. Home / Slingshot Trajectory: Perspective shift revealing accretion disk depth
  { p: 0.17, pos: [7.5, 2.0, 22], target: [0, 0, 0] },
  // 2. About / Identity Nexus: Orbit around the Observation Station Monolith
  { p: 0.33, pos: [-14, 3.2, -14], target: [-18, 0, -22] },
  // 3. Projects / Mission Artifacts: Approach the Constellation Telemetry Array
  { p: 0.50, pos: [20, 1.8, -36], target: [26, 0, -48] },
  // 4. Skills / Systems Matrix: Centered cinematic framing of the Systems Architecture Tree
  { p: 0.66, pos: [-18, -10.5, -56], target: [-18, -11.5, -75] },

  // 5. JOURNEY / HYPERSPACE WARP FLIGHT:
  // 5a. Warp Alignment & Acceleration:
  { p: 0.73, pos: [0, -18.0, -70], target: [0, -18.0, -170] },
  // 5b. Gate 01 Flythrough (2023 - 2027):
  { p: 0.77, pos: [0, -18.0, -84], target: [0, -18.0, -170] },
  // 5c. Gate 02 Flythrough (2025):
  { p: 0.81, pos: [0, -18.0, -100], target: [0, -18.0, -170] },
  // 5d. Gate 03 Flythrough (Jan-Feb 2026):
  { p: 0.85, pos: [0, -18.0, -116], target: [0, -18.0, -170] },
  // 5e. Gate 04 Flythrough (2026):
  { p: 0.89, pos: [0, -18.0, -132], target: [0, -18.0, -170] },
  // 5f. Gate 05 Flythrough (Present):
  { p: 0.93, pos: [0, -18.0, -148], target: [0, -18.0, -170] },
  // 5g. Warp Exit & Transition into Contact:
  { p: 0.95, pos: [0, -20.0, -158], target: [0, -22.0, -190] },

  // 6. CONTACT / CELESTIAL HORIZON & SIGNAL ARRAY:
  { p: 1.0, pos: [0, -22.0, -165], target: [0, -22.0, -205] }
];

export function CameraController({ scrollProgress = 0 }) {
  const { camera } = useThree();
  const currentPos = useRef(new THREE.Vector3(0, 4.2, 36));
  const currentTarget = useRef(new THREE.Vector3(0, 0, 0));

  useFrame((state, delta) => {
    const p = Math.max(0, Math.min(1, scrollProgress));

    // Find bounding keyframe waypoints
    let p0 = WAYPOINTS[0];
    let p1 = WAYPOINTS[WAYPOINTS.length - 1];

    for (let i = 0; i < WAYPOINTS.length - 1; i++) {
      if (p >= WAYPOINTS[i].p && p <= WAYPOINTS[i + 1].p) {
        p0 = WAYPOINTS[i];
        p1 = WAYPOINTS[i + 1];
        break;
      }
    }

    // Smooth cubic interpolation between waypoints
    const segmentRange = p1.p - p0.p || 0.001;
    const t = Math.max(0, Math.min(1, (p - p0.p) / segmentRange));
    const smoothT = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;

    const targetX = THREE.MathUtils.lerp(p0.pos[0], p1.pos[0], smoothT);
    const targetY = THREE.MathUtils.lerp(p0.pos[1], p1.pos[1], smoothT);
    const targetZ = THREE.MathUtils.lerp(p0.pos[2], p1.pos[2], smoothT);

    const lookX = THREE.MathUtils.lerp(p0.target[0], p1.target[0], smoothT);
    const lookY = THREE.MathUtils.lerp(p0.target[1], p1.target[1], smoothT);
    const lookZ = THREE.MathUtils.lerp(p0.target[2], p1.target[2], smoothT);

    // Pointer parallax (damped during warp flight to keep vanishing point centered)
    const isWarpingFlight = p >= 0.72 && p <= 0.94;
    const parallaxFactor = isWarpingFlight ? 0.25 : 1.0;
    const parallaxX = state.pointer.x * 0.9 * parallaxFactor;
    const parallaxY = state.pointer.y * 0.6 * parallaxFactor;

    // Smooth inertial damping for 60fps cinematic fluidity
    currentPos.current.x = THREE.MathUtils.damp(currentPos.current.x, targetX + parallaxX, 4, delta);
    currentPos.current.y = THREE.MathUtils.damp(currentPos.current.y, targetY + parallaxY, 4, delta);
    currentPos.current.z = THREE.MathUtils.damp(currentPos.current.z, targetZ, 4, delta);

    currentTarget.current.x = THREE.MathUtils.damp(currentTarget.current.x, lookX + parallaxX * 0.3, 4, delta);
    currentTarget.current.y = THREE.MathUtils.damp(currentTarget.current.y, lookY + parallaxY * 0.3, 4, delta);
    currentTarget.current.z = THREE.MathUtils.damp(currentTarget.current.z, lookZ, 4, delta);

    camera.position.copy(currentPos.current);
    camera.lookAt(currentTarget.current);
  });

  return null;
}

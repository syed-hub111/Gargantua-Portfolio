import React, { useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

// Custom GLSL Shader for Relativistic Hyperspace Warp Drive Streaks
// Recreates the electric blue, cyan, and brilliant white radial streaks from the reference image
const WarpStreaksShader = {
  vertexShader: `
    attribute float aSpeed;
    attribute float aLength;
    attribute vec3 aHeadColor;
    attribute vec3 aTailColor;
    attribute float aIsHead; // 1.0 = head, 0.0 = tail
    attribute float aRadius;
    attribute float aAngle;

    varying vec3 vColor;
    varying float vAlpha;

    uniform float uTime;
    uniform float uWarpIntensity;
    uniform float uScrollDelta;
    uniform float uScrollProgress;

    void main() {
      vColor = mix(aTailColor, aHeadColor, aIsHead);

      // Continuous flight speed forward along -Z (in camera space)
      // Combined from continuous time and direct scroll position travel
      float flightSpeed = aSpeed * (1.2 + uWarpIntensity * 2.2);
      float travelOffset = uTime * flightSpeed * 22.0 + uScrollProgress * 160.0;

      // Base Z in range [-120.0, -3.0]
      float zRange = 117.0;
      float baseZ = position.z;
      float wrappedZ = mod((baseZ + travelOffset) - (-120.0), zRange) + (-120.0);

      // Dynamic streak stretching based on scroll speed / warp acceleration
      float stretch = 1.0 + uScrollDelta * 3.5 + uWarpIntensity * 1.4;
      if (aIsHead < 0.5) {
        wrappedZ -= aLength * stretch;
      }

      // Radial perspective expansion from center vanishing point:
      // Streaks expand outward toward screen edges as they approach the camera
      float distRatio = clamp((-wrappedZ) / 120.0, 0.02, 1.0);
      float radialExpansion = 1.0 / (distRatio * 0.85 + 0.15);
      
      float currentR = aRadius * (0.35 + radialExpansion * 0.65);
      vec3 currentPos = vec3(
        cos(aAngle) * currentR,
        sin(aAngle) * currentR,
        wrappedZ
      );

      vec4 mvPosition = viewMatrix * modelMatrix * vec4(currentPos, 1.0);
      gl_Position = projectionMatrix * mvPosition;

      // Alpha depth envelope:
      // Smooth fade-in near center vanishing point (-120.0 to -90.0)
      // Smooth fade-out before clipping near camera plane (-14.0 to -4.0)
      float fadeIn = smoothstep(-120.0, -90.0, wrappedZ);
      float fadeOut = smoothstep(-4.0, -16.0, wrappedZ);
      vAlpha = fadeIn * fadeOut * uWarpIntensity;
    }
  `,
  fragmentShader: `
    varying vec3 vColor;
    varying float vAlpha;

    void main() {
      if (vAlpha <= 0.005) discard;
      gl_FragColor = vec4(vColor, vAlpha * 0.95);
    }
  `
};

// Radial Light Beams Shader for dramatic volumetric light shafts
const RadialLightBeamsShader = {
  vertexShader: `
    varying vec2 vUv;
    varying float vAlpha;
    uniform float uWarpIntensity;

    void main() {
      vUv = uv;
      vAlpha = uWarpIntensity;
      vec4 mvPosition = viewMatrix * modelMatrix * vec4(position, 1.0);
      gl_Position = projectionMatrix * mvPosition;
    }
  `,
  fragmentShader: `
    varying vec2 vUv;
    varying float vAlpha;
    uniform float uTime;

    void main() {
      vec2 center = vUv - vec2(0.5);
      float dist = length(center) * 2.0;
      float angle = atan(center.y, center.x);

      // 16 radial light spokes spinning slowly
      float spokes = sin(angle * 16.0 + uTime * 0.8) * 0.5 + 0.5;
      spokes = pow(spokes, 2.5);

      // Central dark aperture with glowing rim
      float centerHole = smoothstep(0.08, 0.22, dist);
      float outerFade = smoothstep(1.0, 0.35, dist);

      vec3 beamColor = mix(vec3(0.01, 0.45, 0.95), vec3(0.22, 0.85, 1.0), spokes);
      float alpha = spokes * centerHole * outerFade * vAlpha * 0.45;

      if (alpha <= 0.005) discard;
      gl_FragColor = vec4(beamColor, alpha);
    }
  `
};

export function WarpSpeedTunnel({ scrollProgress = 0 }) {
  const { camera } = useThree();
  const groupRef = useRef();
  const tunnelMeshRef = useRef();
  const apertureRef = useRef();
  const beamsRef = useRef();

  const lastScroll = useRef(scrollProgress);
  const scrollDelta = useRef(0);

  // Warp tunnel is active during Sector 5 (Journey) between 0.71 and 0.96
  const warpIntensity = useMemo(() => {
    if (scrollProgress < 0.71 || scrollProgress > 0.96) return 0;
    if (scrollProgress < 0.75) {
      // Accelerating into warp (Skills -> Journey transition)
      return (scrollProgress - 0.71) / (0.75 - 0.71);
    }
    if (scrollProgress > 0.93) {
      // Decelerating out of warp into Contact
      return 1.0 - (scrollProgress - 0.93) / (0.96 - 0.93);
    }
    return 1.0;
  }, [scrollProgress]);

  // Generate 4,800 high-speed radial warp streaks matching the reference image
  const { linePositions, lineHeadColors, lineTailColors, lineSpeeds, lineLengths, lineIsHead, lineRadii, lineAngles } = useMemo(() => {
    const streakCount = 4800;
    const vertexCount = streakCount * 2;

    const positions = new Float32Array(vertexCount * 3);
    const headColors = new Float32Array(vertexCount * 3);
    const tailColors = new Float32Array(vertexCount * 3);
    const speeds = new Float32Array(vertexCount);
    const lengths = new Float32Array(vertexCount);
    const isHead = new Float32Array(vertexCount);
    const radii = new Float32Array(vertexCount);
    const angles = new Float32Array(vertexCount);

    // Color palette carefully matched to reference image:
    // Electric blue, cyan, brilliant white sparks, violet accents
    const headPalette = [
      new THREE.Color('#ffffff'), // White starhead
      new THREE.Color('#38bdf8'), // Vibrant Cyan
      new THREE.Color('#7dd3fc'), // Light Sky Blue
      new THREE.Color('#00f0ff'), // Pure Neon Cyan
      new THREE.Color('#bae6fd'), // Ice White
    ];

    const tailPalette = [
      new THREE.Color('#0284c7'), // Deep Electric Blue
      new THREE.Color('#0369a1'), // Oceanic Blue
      new THREE.Color('#1d4ed8'), // Deep Royal Blue
      new THREE.Color('#2563eb'), // Cobalt Blue
      new THREE.Color('#6366f1'), // Indigo / Violet edge
    ];

    for (let i = 0; i < streakCount; i++) {
      const v0 = i * 2;
      const v1 = i * 2 + 1;
      const i6 = i * 6;

      const angle = Math.random() * Math.PI * 2;
      // Cylindrical/conical radial distribution leaving dark center hole
      const r = 0.9 + Math.pow(Math.random(), 1.45) * 26.0;
      const zBase = -4.0 - Math.random() * 116.0;
      const streakLen = 4.0 + Math.random() * 12.0;
      const spd = 0.8 + Math.random() * 1.8;

      const headCol = headPalette[Math.floor(Math.random() * headPalette.length)];
      const tailCol = tailPalette[Math.floor(Math.random() * tailPalette.length)];

      // Vertex 0: Head of streak
      positions[i6] = 0;
      positions[i6 + 1] = 0;
      positions[i6 + 2] = zBase;

      // Vertex 1: Tail of streak
      positions[i6 + 3] = 0;
      positions[i6 + 4] = 0;
      positions[i6 + 5] = zBase;

      for (let v = 0; v < 2; v++) {
        const vi = v === 0 ? v0 : v1;
        const vi3 = vi * 3;

        headColors[vi3] = headCol.r;
        headColors[vi3 + 1] = headCol.g;
        headColors[vi3 + 2] = headCol.b;

        tailColors[vi3] = tailCol.r;
        tailColors[vi3 + 1] = tailCol.g;
        tailColors[vi3 + 2] = tailCol.b;

        speeds[vi] = spd;
        lengths[vi] = streakLen;
        radii[vi] = r;
        angles[vi] = angle;
      }

      isHead[v0] = 1.0;
      isHead[v1] = 0.0;
    }

    return {
      linePositions: positions,
      lineHeadColors: headColors,
      lineTailColors: tailColors,
      lineSpeeds: speeds,
      lineLengths: lengths,
      lineIsHead: isHead,
      lineRadii: radii,
      lineAngles: angles,
    };
  }, []);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uWarpIntensity: { value: 0 },
      uScrollDelta: { value: 0 },
      uScrollProgress: { value: 0 },
    }),
    []
  );

  const beamUniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uWarpIntensity: { value: 0 },
    }),
    []
  );

  useFrame((state, delta) => {
    // Keep group locked to camera position & orientation
    // This guarantees the vanishing point is always centered in the viewport!
    if (groupRef.current && camera) {
      groupRef.current.position.copy(camera.position);
      groupRef.current.quaternion.copy(camera.quaternion);
    }

    // Measure instantaneous user scroll velocity
    const dScroll = Math.abs(scrollProgress - lastScroll.current);
    scrollDelta.current = THREE.MathUtils.damp(scrollDelta.current, dScroll * 120.0, 7, delta);
    lastScroll.current = scrollProgress;

    const smoothWarp = THREE.MathUtils.damp(
      uniforms.uWarpIntensity.value,
      warpIntensity,
      6,
      delta
    );

    uniforms.uTime.value = state.clock.elapsedTime;
    uniforms.uWarpIntensity.value = smoothWarp;
    uniforms.uScrollDelta.value = scrollDelta.current;
    uniforms.uScrollProgress.value = scrollProgress;

    beamUniforms.uTime.value = state.clock.elapsedTime;
    beamUniforms.uWarpIntensity.value = smoothWarp;

    if (tunnelMeshRef.current) {
      tunnelMeshRef.current.rotation.z += delta * (0.35 + smoothWarp * 0.9);
      tunnelMeshRef.current.material.opacity = smoothWarp * 0.42;
    }

    if (apertureRef.current) {
      apertureRef.current.rotation.z -= delta * 0.25;
      apertureRef.current.material.opacity = smoothWarp * 0.65;
    }
  });

  if (warpIntensity <= 0.002 && uniforms.uWarpIntensity.value <= 0.002) {
    return null;
  }

  return (
    <group ref={groupRef}>
      {/* 
        1. 4,800 Radial Hyperspace Warp Streaks:
        Dense radial lines shooting outward from the central singularity toward camera
      */}
      <lineSegments>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={linePositions.length / 3}
            array={linePositions}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-aHeadColor"
            count={lineHeadColors.length / 3}
            array={lineHeadColors}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-aTailColor"
            count={lineTailColors.length / 3}
            array={lineTailColors}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-aSpeed"
            count={lineSpeeds.length}
            array={lineSpeeds}
            itemSize={1}
          />
          <bufferAttribute
            attach="attributes-aLength"
            count={lineLengths.length}
            array={lineLengths}
            itemSize={1}
          />
          <bufferAttribute
            attach="attributes-aIsHead"
            count={lineIsHead.length}
            array={lineIsHead}
            itemSize={1}
          />
          <bufferAttribute
            attach="attributes-aRadius"
            count={lineRadii.length}
            array={lineRadii}
            itemSize={1}
          />
          <bufferAttribute
            attach="attributes-aAngle"
            count={lineAngles.length}
            array={lineAngles}
            itemSize={1}
          />
        </bufferGeometry>
        <shaderMaterial
          vertexShader={WarpStreaksShader.vertexShader}
          fragmentShader={WarpStreaksShader.fragmentShader}
          uniforms={uniforms}
          transparent={true}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </lineSegments>

      {/* 
        2. Dramatic 16-Spoke Radial Light Beams Disc:
        Creates the wide glowing blue and cyan light shafts seen in the reference image
      */}
      <mesh ref={beamsRef} position={[0, 0, -90]}>
        <planeGeometry args={[140, 140]} />
        <shaderMaterial
          vertexShader={RadialLightBeamsShader.vertexShader}
          fragmentShader={RadialLightBeamsShader.fragmentShader}
          uniforms={beamUniforms}
          transparent={true}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* 
        3. Volumetric Cylindrical Vortex:
        Gives the sensation of traveling inside an infinite relativistic tunnel
      */}
      <mesh ref={tunnelMeshRef} rotation={[Math.PI / 2, 0, 0]} position={[0, 0, -60]}>
        <cylinderGeometry args={[14, 28, 120, 32, 1, true]} />
        <meshBasicMaterial
          color="#0284c7"
          transparent
          opacity={0.35}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
          wireframe
        />
      </mesh>

      {/* 
        4. Central Vanishing Singularity Aperture:
        Dark vortex eye in the exact center surrounded by a brilliant cyan event horizon rim
      */}
      <mesh ref={apertureRef} position={[0, 0, -95]}>
        <ringGeometry args={[0.9, 14.0, 64]} />
        <meshBasicMaterial
          color="#38bdf8"
          transparent
          opacity={0.6}
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  );
}

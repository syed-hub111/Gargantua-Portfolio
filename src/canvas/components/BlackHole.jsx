import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Relativistic Circulation Shader with Seamless Elliptical Edge Feathering
const GargantuaReferenceShader = {
  vertexShader: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    varying vec2 vUv;
    uniform sampler2D uTexture;
    uniform float uTime;

    void main() {
      vec2 uv = vUv;
      vec2 p = uv - vec2(0.5);
      
      // Aspect-ratio-corrected coordinate space (16:9 widescreen = 1.778)
      vec2 aspectP = vec2(p.x * 1.778, p.y);
      float r = length(aspectP);
      float theta = atan(aspectP.y, aspectP.x);

      // Core event horizon shadow (r < 0.12) is preserved crisp and razor-sharp
      float flowWeight = smoothstep(0.12, 0.22, r);
      float diskBand = smoothstep(0.42, 0.05, abs(aspectP.y));

      // Continuous Keplerian orbital velocity tangent (counter-clockwise circulation)
      vec2 tangent = normalize(vec2(-sin(theta), cos(theta) * (1.0 / 1.778)));
      float orbitSpeed = 0.032 / (r + 0.14);

      // Dual-phase continuous relativistic advection (perpetual forward streaming, zero reverse wobble)
      float phase1 = fract(uTime * 0.045);
      float phase2 = fract(uTime * 0.045 + 0.5);
      float flowBlend = sin(phase1 * 3.14159265);

      vec2 shift1 = tangent * (phase1 - 0.5) * orbitSpeed * 0.32 * flowWeight;
      vec2 shift2 = tangent * (phase2 - 0.5) * orbitSpeed * 0.32 * flowWeight;

      // Relativistic horizontal flow shear across the equatorial accretion disk
      vec2 horizFlow = vec2(-0.010 * diskBand * sin(uTime * 1.1 + aspectP.x * 2.5), 0.0) * flowWeight;

      // High-frequency relativistic plasma turbulence
      vec2 ripple = vec2(
        sin(aspectP.y * 36.0 + uTime * 1.8),
        cos(aspectP.x * 30.0 - uTime * 1.5)
      ) * 0.0016 * diskBand * flowWeight;

      vec2 uv1 = clamp(uv + shift1 + horizFlow + ripple, 0.001, 0.999);
      vec2 uv2 = clamp(uv + shift2 + horizFlow + ripple, 0.001, 0.999);

      vec4 col1 = texture2D(uTexture, uv1);
      vec4 col2 = texture2D(uTexture, uv2);

      vec4 col = mix(col1, col2, flowBlend);

      // 1. Relativistic Doppler Beaming
      // Approaching side (left, aspectP.x < 0) is amplified by relativistic velocity
      // Receding side (right, aspectP.x > 0) is gently attenuated
      float dopplerFactor = clamp(1.0 - aspectP.x * 0.75, 0.70, 1.35);
      col.rgb *= mix(1.0, dopplerFactor, diskBand);

      // 2. High Dynamic Range (HDR) Incandescent Core Bloom
      // Superheated gas and the razor-sharp photon ring radiate high-energy emission
      float lum = dot(col.rgb, vec3(0.299, 0.587, 0.114));
      float incandescence = pow(max(0.0, lum - 0.40) / 0.60, 2.0);
      vec3 incandescentTint = mix(vec3(1.05, 0.78, 0.45), vec3(1.25, 1.20, 1.15), lum);
      col.rgb += incandescentTint * incandescence * 0.70;

      // 3. Cinematic Anamorphic Horizontal Streak (Interstellar 70mm IMAX aesthetic)
      float streakY = exp(-abs(aspectP.y) * 36.0);
      float streakX = exp(-abs(aspectP.x) * 1.25);
      float flare = streakY * streakX * incandescence;
      col.rgb += vec3(1.10, 0.92, 0.68) * flare * 0.38;

      // 4. Relativistic Gravitational Redshift & Micro-Chromatic Aberration near Horizon
      float chromaRadius = smoothstep(0.22, 0.13, r) * flowWeight;
      if (chromaRadius > 0.01) {
        vec2 chromaShift = normalize(aspectP) * chromaRadius * 0.0032;
        float rChroma = texture2D(uTexture, clamp(uv1 + chromaShift, 0.001, 0.999)).r;
        float bChroma = texture2D(uTexture, clamp(uv1 - chromaShift, 0.001, 0.999)).b;
        col.r = mix(col.r, rChroma, 0.35);
        col.b = mix(col.b, bChroma, 0.35);
      }

      // 5. Soft Cosmic Coronal Halo diffusing into deep space
      float corona = exp(-r * 3.6) * diskBand;
      col.rgb += vec3(0.85, 0.50, 0.20) * corona * 0.09;

      // 6. Seamless Elliptical Edge Feathering
      // Eliminates rectangular plane edges so Gargantua seamlessly blends into #010206 space
      float edgeX = abs(p.x) * 2.0;
      float edgeY = abs(p.y) * 2.0;
      float edgeDist = length(vec2(edgeX * 0.88, edgeY * 0.92));
      float edgeFade = smoothstep(0.96, 0.62, edgeDist);

      col.rgb *= edgeFade;
      col.a = edgeFade;

      gl_FragColor = col;
    }
  `
};

export function BlackHole({ position = [0, 0, 0] }) {
  const planeRef = useRef();
  const shaderMatRef = useRef();

  // Load the authentic user-provided Gargantua reference image
  const gargantuaTexture = useMemo(() => {
    const loader = new THREE.TextureLoader();
    const tex = loader.load('/gargantua.png');
    tex.generateMipmaps = true;
    tex.minFilter = THREE.LinearMipmapLinearFilter;
    tex.magFilter = THREE.LinearFilter;
    return tex;
  }, []);

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;

    if (shaderMatRef.current) {
      shaderMatRef.current.uniforms.uTime.value = t;
    }

    // Gentle camera parallax orientation tracking
    if (planeRef.current) {
      planeRef.current.quaternion.slerp(state.camera.quaternion, 0.04);
    }
  });

  return (
    <group position={position}>
      {/* 1. Volumetric Accretion Disk Illumination */}
      <pointLight color="#fff1d6" intensity={6.0} distance={220} decay={1.2} />
      <pointLight position={[0, 2.5, 0]} color="#f59e0b" intensity={3.5} distance={140} decay={1.8} />
      <pointLight position={[0, -2.5, 0]} color="#ea580c" intensity={2.8} distance={140} decay={1.8} />

      {/* 2. Authentic 3D Gargantua Reference Mesh with Seamless Edge Feathering */}
      <mesh ref={planeRef} renderOrder={6}>
        {/* Generous 16:9 plane dimensions (44x24.6) with smooth elliptical falloff */}
        <planeGeometry args={[44, 24.6, 1, 1]} />
        <shaderMaterial
          ref={shaderMatRef}
          vertexShader={GargantuaReferenceShader.vertexShader}
          fragmentShader={GargantuaReferenceShader.fragmentShader}
          uniforms={{
            uTexture: { value: gargantuaTexture },
            uTime: { value: 0 },
          }}
          transparent={true}
          depthWrite={false}
          blending={THREE.NormalBlending}
        />
      </mesh>
    </group>
  );
}

import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Atmospheric limb scattering shader for dark celestial body
const AtmosphericLimbShader = {
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
    uniform vec3 uLightPos;
    uniform vec3 uCameraPos;
    varying vec3 vNormal;
    varying vec3 vWorldPosition;

    void main() {
      vec3 viewDir = normalize(uCameraPos - vWorldPosition);
      vec3 lightDir = normalize(uLightPos - vWorldPosition);

      // Light incidence from black hole accretion disk
      float NdotL = max(dot(vNormal, lightDir), 0.0);
      // Limb grazing angle (Fresnel)
      float rim = 1.0 - max(dot(viewDir, vNormal), 0.0);
      float limbGlow = pow(rim, 3.5) * (NdotL * 1.5 + 0.1);

      // Deep, cold oceanic atmosphere limb color
      vec3 atmosphereColor = mix(vec3(0.02, 0.12, 0.22), vec3(0.85, 0.65, 0.35), pow(NdotL, 4.0));
      
      gl_FragColor = vec4(atmosphereColor, clamp(limbGlow * 0.75, 0.0, 1.0));
    }
  `
};

export function CelestialHorizon({ position = [-45, -22, -110] }) {
  const planetRef = useRef();

  useFrame((state, delta) => {
    // Horizontal rotation removed as requested
  });

  return (
    <group position={position}>
      {/* Immense Dark Exoplanet Sphere (Miller's planet aesthetic) */}
      <mesh ref={planetRef}>
        <sphereGeometry args={[18, 64, 64]} />
        <meshStandardMaterial
          color="#040812"
          roughness={0.7}
          metalness={0.3}
        />
      </mesh>

      {/* Atmospheric Scattering Shell on limb */}
      <mesh scale={1.03}>
        <sphereGeometry args={[18, 64, 64]} />
        <shaderMaterial
          vertexShader={AtmosphericLimbShader.vertexShader}
          fragmentShader={AtmosphericLimbShader.fragmentShader}
          uniforms={{
            uLightPos: { value: new THREE.Vector3(0, 0, 0) },
            uCameraPos: { value: new THREE.Vector3() },
          }}
          transparent={true}
          blending={THREE.AdditiveBlending}
          side={THREE.BackSide}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}

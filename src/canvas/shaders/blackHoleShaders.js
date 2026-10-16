// Custom GLSL Shaders for Photorealistic Cinematic Black Hole (Gargantua-inspired)

// 1. Accretion Disk Shader: Multi-octave turbulent plasma with Doppler beaming
export const AccretionDiskShader = {
  vertexShader: `
    varying vec2 vUv;
    varying vec3 vWorldPosition;
    varying vec3 vLocalPosition;

    void main() {
      vUv = uv;
      vLocalPosition = position;
      vec4 worldPos = modelMatrix * vec4(position, 1.0);
      vWorldPosition = worldPos.xyz;
      gl_Position = projectionMatrix * viewMatrix * worldPos;
    }
  `,
  fragmentShader: `
    uniform float uTime;
    uniform vec3 uCameraPos;
    varying vec2 vUv;
    varying vec3 vWorldPosition;
    varying vec3 vLocalPosition;

    // 2D Simplex Noise / Hash helper
    vec3 hash33(vec3 p3) {
      p3 = fract(p3 * vec3(0.1031, 0.1030, 0.0973));
      p3 += dot(p3, p3.yxz + 33.33);
      return fract((p3.xxy + p3.yxx) * p3.zyx);
    }

    float noise(vec2 p) {
      vec2 i = floor(p);
      vec2 f = fract(p);
      f = f * f * (3.0 - 2.0 * f);
      float a = fract(sin(dot(i, vec2(127.1, 311.7))) * 43758.5453);
      float b = fract(sin(dot(i + vec2(1.0, 0.0), vec2(127.1, 311.7))) * 43758.5453);
      float c = fract(sin(dot(i + vec2(0.0, 1.0), vec2(127.1, 311.7))) * 43758.5453);
      float d = fract(sin(dot(i + vec2(1.0, 1.0), vec2(127.1, 311.7))) * 43758.5453);
      return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
    }

    // Fractional Brownian Motion for plasma turbulence
    float fbm(vec2 p) {
      float v = 0.0;
      float a = 0.55;
      mat2 rot = mat2(cos(0.5), sin(0.5), -sin(0.5), cos(0.5));
      for (int i = 0; i < 5; i++) {
        v += a * noise(p);
        p = rot * p * 2.02;
        a *= 0.5;
      }
      return v;
    }

    void main() {
      // Calculate radial distance and polar angle in disk plane
      float r = length(vLocalPosition.xz);
      float angle = atan(vLocalPosition.z, vLocalPosition.x);

      // Inner (ISCO) and Outer boundaries of accretion disk
      float innerRadius = 3.2;
      float outerRadius = 14.0;

      if (r < innerRadius || r > outerRadius) {
        discard;
      }

      // Keplerian differential rotation: inner disk spins faster (omega ~ 1 / r^1.5)
      float omega = 2.4 / pow(r, 1.15);
      float rotatedAngle = angle + uTime * omega;

      // Coordinate mapping for plasma streams
      vec2 polarCoords = vec2(r * 1.8, rotatedAngle * 3.5);
      float plasmaNoise = fbm(polarCoords);
      float plasmaFine = noise(polarCoords * 2.5 + vec2(0.0, uTime * 0.4));
      float turbulentDensity = mix(plasmaNoise, plasmaFine, 0.35);

      // Normalized radial parameter [0.0 = ISCO inner, 1.0 = outer edge]
      float normR = (r - innerRadius) / (outerRadius - innerRadius);

      // Inner razor-sharp plunge into event horizon, smooth outer dissipation
      float innerFade = smoothstep(0.0, 0.06, normR);
      float outerFade = smoothstep(1.0, 0.65, normR);
      float densityMask = innerFade * outerFade * (turbulentDensity * 0.85 + 0.35);

      // Relativistic Doppler beaming:
      // Disk rotates counter-clockwise. Direction vector of gas: (-sin(angle), 0, cos(angle))
      vec3 gasVelocity = normalize(vec3(-sin(angle), 0.0, cos(angle)));
      vec3 viewDir = normalize(uCameraPos - vWorldPosition);
      float dopplerDot = dot(gasVelocity, viewDir);
      // Approaching side is boosted, receding side is dimmed
      float dopplerFactor = clamp(1.0 + dopplerDot * 0.55, 0.35, 1.65);

      // Temperature color palette (Blackbody-inspired radiation)
      // Extreme white/cyan-blue at ISCO -> Brilliant warm amber -> Deep red-brown plasma smoke
      vec3 colorISCO = vec3(1.2, 1.25, 1.4);         // Ultra-hot inner edge (> 10,000 K)
      vec3 colorInner = vec3(1.0, 0.88, 0.65);       // Incandescent warm white
      vec3 colorMid = vec3(0.96, 0.58, 0.12);        // Glowing plasma gold
      vec3 colorOuter = vec3(0.55, 0.14, 0.02);      // Cooler red-brown gas
      vec3 colorEdge = vec3(0.18, 0.03, 0.005);      // Smoky interstellar fringe

      vec3 baseColor;
      if (normR < 0.15) {
        baseColor = mix(colorISCO, colorInner, normR / 0.15);
      } else if (normR < 0.5) {
        baseColor = mix(colorInner, colorMid, (normR - 0.15) / 0.35);
      } else if (normR < 0.85) {
        baseColor = mix(colorMid, colorOuter, (normR - 0.5) / 0.35);
      } else {
        baseColor = mix(colorOuter, colorEdge, (normR - 0.85) / 0.15);
      }

      // Apply Doppler brightness and density
      vec3 finalColor = baseColor * dopplerFactor * (1.1 + (1.0 - normR) * 1.4);
      float alpha = clamp(densityMask * (0.85 + dopplerDot * 0.15), 0.0, 0.95);

      gl_FragColor = vec4(finalColor, alpha);
    }
  `
};

// 2. Gravitational Lensing Halo Shader (The upper and lower warped arches of the disk)
export const LensedHaloShader = {
  vertexShader: `
    varying vec2 vUv;
    varying vec3 vWorldPosition;
    varying vec3 vNormal;

    void main() {
      vUv = uv;
      vNormal = normalize(normalMatrix * normal);
      vec4 worldPos = modelMatrix * vec4(position, 1.0);
      vWorldPosition = worldPos.xyz;
      gl_Position = projectionMatrix * viewMatrix * worldPos;
    }
  `,
  fragmentShader: `
    uniform float uTime;
    uniform vec3 uCameraPos;
    varying vec2 vUv;
    varying vec3 vWorldPosition;
    varying vec3 vNormal;

    float hash(vec2 p) {
      return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
    }

    float noise(vec2 p) {
      vec2 i = floor(p);
      vec2 f = fract(p);
      f = f * f * (3.0 - 2.0 * f);
      return mix(
        mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x),
        mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x),
        f.y
      );
    }

    void main() {
      vec3 viewDir = normalize(uCameraPos - vWorldPosition);
      float fresnel = 1.0 - abs(dot(viewDir, vNormal));

      // Lensed light wraps over the top and bottom of the event horizon
      float angle = atan(vWorldPosition.y, length(vWorldPosition.xz));
      float polarAngle = atan(vWorldPosition.z, vWorldPosition.x);

      // Only visible near grazing angles around shadow
      float arcIntensity = pow(fresnel, 2.2);

      // Subtle plasma structure in lensed image
      float gasNoise = noise(vec2(polarAngle * 4.0 + uTime * 0.15, fresnel * 6.0));
      
      // Warm incandescent lensed color
      vec3 lensedColor = mix(
        vec3(1.0, 0.85, 0.55),
        vec3(0.9, 0.45, 0.08),
        clamp(1.0 - fresnel * 1.2, 0.0, 1.0)
      );

      float alpha = clamp(arcIntensity * (0.45 + gasNoise * 0.35), 0.0, 0.85);
      gl_FragColor = vec4(lensedColor * 1.5, alpha);
    }
  `
};

// 3. Photon Ring Shader (Razor-thin caustic ring at 1.5 Schwarzschild radius)
export const PhotonRingShader = {
  vertexShader: `
    varying vec2 vUv;
    varying vec3 vWorldPosition;
    varying vec3 vNormal;

    void main() {
      vUv = uv;
      vNormal = normalize(normalMatrix * normal);
      vec4 worldPos = modelMatrix * vec4(position, 1.0);
      vWorldPosition = worldPos.xyz;
      gl_Position = projectionMatrix * viewMatrix * worldPos;
    }
  `,
  fragmentShader: `
    uniform vec3 uCameraPos;
    varying vec3 vWorldPosition;
    varying vec3 vNormal;

    void main() {
      vec3 viewDir = normalize(uCameraPos - vWorldPosition);
      // Extremely sharp grazing angle for caustic photon ring
      float rim = 1.0 - abs(dot(viewDir, vNormal));
      float razorRing = pow(rim, 14.0); // Razor sharp caustic

      vec3 photonColor = vec3(1.4, 1.35, 1.15); // Blinding pure white-gold
      float alpha = clamp(razorRing * 1.8, 0.0, 1.0);

      gl_FragColor = vec4(photonColor, alpha);
    }
  `
};

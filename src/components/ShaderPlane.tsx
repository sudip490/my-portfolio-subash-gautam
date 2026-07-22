"use client";

import { useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

/* Domain-warped fBm noise, tinted between the ink and accent tokens.
   The pointer pushes a soft bloom through the field. */
const FRAGMENT = /* glsl */ `
  uniform float uTime;
  uniform vec2  uPointer;
  uniform vec2  uResolution;
  uniform vec3  uAccent;
  varying vec2  vUv;

  // Hash-based value noise — cheap, no texture lookup.
  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(hash(i + vec2(0.0, 0.0)), hash(i + vec2(1.0, 0.0)), u.x),
      mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
      u.y
    );
  }

  // 4 octaves rather than 5: the 5th is below the noise floor once the
  // vignette and grain land on top, but costs a full extra sample set.
  float fbm(vec2 p) {
    float v = 0.0;
    float a = 0.5;
    for (int i = 0; i < 4; i++) {
      v += a * noise(p);
      p *= 2.0;
      a *= 0.5;
    }
    return v;
  }

  void main() {
    vec2 uv = vUv;
    vec2 p = uv * vec2(uResolution.x / uResolution.y, 1.0);

    float t = uTime * 0.05;

    vec2 q = vec2(fbm(p + t), fbm(p + vec2(5.2, 1.3) - t));
    vec2 r = vec2(fbm(p + 4.0 * q + vec2(1.7, 9.2) + t * 1.4),
                  fbm(p + 4.0 * q + vec2(8.3, 2.8) - t * 1.1));
    float f = fbm(p + 4.0 * r);

    /* Accent arrives from the live --color-accent token so the field
       recolors with the theme. deep is derived rather than authored:
       ink pushed ~16% toward the accent, which is what the old
       hand-picked navy was for the cobalt accent. */
    vec3 ink    = vec3(0.031, 0.031, 0.039);
    vec3 deep   = mix(ink, uAccent, 0.16);
    vec3 accent = uAccent;

    /* Intensities are deliberately low. This field was authored while the
       quad was rendering as a ~245px square, where 65% accent read as one
       small vivid detail. Now that it actually covers the hero, the same
       numbers paint a blue wall behind the headline. It's a backdrop: it
       should sit just above ink and never compete with type. */
    vec3 col = mix(ink, deep, clamp(f * f * 1.5, 0.0, 0.8));
    col = mix(col, accent, clamp(length(r) * 0.16, 0.0, 0.2));

    float d = distance(p, uPointer * vec2(uResolution.x / uResolution.y, 1.0));
    col += accent * smoothstep(0.55, 0.0, d) * 0.09;

    /* Tighter than before so the corners fall back to ink and the section
       edges disappear into the page rather than glowing. */
    float vig = smoothstep(1.05, 0.15, distance(uv, vec2(0.5)));
    col *= vig;

    gl_FragColor = vec4(col, 1.0);
  }
`;

const VERTEX = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    /* Straight to clip space — no camera. The plane is 2x2, which is
       exactly the -1..1 of NDC, so writing position through unprojected
       fills the viewport at any size. Running it through
       projectionMatrix * modelViewMatrix instead put a 2-unit quad in
       front of the default perspective camera at z=5, which rendered the
       field as a ~245px square floating in the middle of the hero. */
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;

function Plane() {
  const mat = useRef<THREE.ShaderMaterial>(null);
  // Scratch vectors, reused every frame so the loop allocates nothing.
  const smoothed = useRef(new THREE.Vector2(0.5, 0.5));
  const target = useRef(new THREE.Vector2(0.5, 0.5));

  // Initial uniform objects only — never mutated directly. Per-frame
  // writes go through the material ref below.
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uPointer: { value: new THREE.Vector2(0.5, 0.5) },
      uResolution: { value: new THREE.Vector2(1, 1) },
      uAccent: { value: new THREE.Vector3(0.145, 0.388, 0.922) },
    }),
    []
  );

  /* Feed --color-accent into the shader, and again whenever the theme
     switcher restamps data-theme on <html>. */
  useEffect(() => {
    const readAccent = () => {
      const hex = getComputedStyle(document.documentElement)
        .getPropertyValue("--color-accent")
        .trim();
      const m = /^#([0-9a-f]{6})$/i.exec(hex);
      if (!m || !mat.current) return;
      const n = parseInt(m[1], 16);
      mat.current.uniforms.uAccent.value.set(
        ((n >> 16) & 255) / 255,
        ((n >> 8) & 255) / 255,
        (n & 255) / 255
      );
    };
    readAccent();
    const observer = new MutationObserver(readAccent);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });
    return () => observer.disconnect();
  }, []);

  useFrame((state, delta) => {
    const m = mat.current;
    if (!m) return;

    // Clamp: a backgrounded tab returns one huge delta that would jump
    // the field forward visibly.
    m.uniforms.uTime.value += Math.min(delta, 0.05);
    m.uniforms.uResolution.value.set(state.size.width, state.size.height);

    target.current.set(state.pointer.x * 0.5 + 0.5, state.pointer.y * 0.5 + 0.5);
    smoothed.current.lerp(target.current, 0.05);
    m.uniforms.uPointer.value.copy(smoothed.current);
  });

  return (
    <mesh>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        ref={mat}
        uniforms={uniforms}
        vertexShader={VERTEX}
        fragmentShader={FRAGMENT}
      />
    </mesh>
  );
}

export default function ShaderPlane({ running = true }: { running?: boolean }) {
  return (
    <Canvas
      gl={{ antialias: false, powerPreference: "low-power" }}
      /* Cap at 1.25 rather than 1.5 — this is an out-of-focus noise field
         behind text, so retina sharpness buys nothing and costs ~40% more
         fragments on a 2x display. */
      dpr={[1, 1.25]}
      style={{ position: "absolute", inset: 0 }}
      /* Pause the loop when the hero is off screen instead of unmounting:
         the GL context survives, so scrolling back is instant. */
      frameloop={running ? "always" : "never"}
    >
      <Plane />
    </Canvas>
  );
}

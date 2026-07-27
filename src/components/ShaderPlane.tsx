"use client";

import { useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

/* Domain-warped fBm noise, tinted between the ink and accent tokens.
   The pointer pushes a soft bloom through the field. */
const FRAGMENT = /* glsl */ `
  uniform float uTime;
  uniform vec2  uPointer;
  uniform vec2  uVelocity;
  uniform float uDrag;
  uniform vec2  uResolution;
  uniform vec3  uAccent;
  varying vec2  vUv;

  /* Hash-based value noise — cheap, no texture lookup.

     Pure ALU, no sin(). This is the hottest line in the whole page: the
     field costs 5 fbm x 4 octaves x 4 hash = 80 of these per fragment,
     over the full hero, every frame. The usual fract(sin(dot(p,k))*k2)
     idiom made that 80 transcendentals per pixel — enough to saturate an
     integrated GPU on its own, which then shows up as stutter in
     everything composited over the top, the custom cursor included. */
  float hash(vec2 p) {
    vec3 p3 = fract(p.xyx * 0.1031);
    p3 += dot(p3, p3.yzx + 33.33);
    return fract((p3.x + p3.y) * p3.z);
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
    float aspect = uResolution.x / uResolution.y;
    vec2 p = uv * vec2(aspect, 1.0);
    vec2 ptr = uPointer * vec2(aspect, 1.0);
    float d = distance(p, ptr);

    /* Local falloff around the cursor. Everything the pointer does is
       scaled by this — warping the domain globally just slides the whole
       backdrop about, which reads as a camera move rather than as the
       field being dragged. */
    float grip = smoothstep(0.55, 0.0, d);

    /* Pull the noise domain back along the direction of travel, so the
       field smears out behind the cursor and settles as uVelocity bleeds
       off. It's the falloff in grip that does the work: a shear across the
       edge of the reach, rather than a uniform slide that would just look
       like the whole backdrop sliding. Holding the button doubles it. */
    p -= uVelocity * grip * (1.2 + uDrag * 1.2);

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

    // Bloom under the cursor, opened up a little while the button is held.
    col += accent * smoothstep(0.55, 0.0, d) * (0.09 + uDrag * 0.07);
    // A faint wake that only exists while the pointer is actually moving.
    col += accent * grip * length(uVelocity) * 0.45;

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
  const gl = useThree((state) => state.gl);

  // Scratch vectors, reused every frame so the loop allocates nothing.
  const target = useRef(new THREE.Vector2(0.5, 0.5)); // raw, straight off the DOM
  const smoothed = useRef(new THREE.Vector2(0.5, 0.5)); // eased, fed to the shader
  const previous = useRef(new THREE.Vector2(0.5, 0.5));
  const step = useRef(new THREE.Vector2(0, 0));
  const velocity = useRef(new THREE.Vector2(0, 0));
  const held = useRef(false);
  const drag = useRef(0);

  // Initial uniform objects only — never mutated directly. Per-frame
  // writes go through the material ref below.
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uPointer: { value: new THREE.Vector2(0.5, 0.5) },
      uVelocity: { value: new THREE.Vector2(0, 0) },
      uDrag: { value: 0 },
      uResolution: { value: new THREE.Vector2(1, 1) },
      uAccent: { value: new THREE.Vector3(0.145, 0.388, 0.922) },
    }),
    []
  );

  /* The backdrop wrapper is pointer-events:none on purpose — the field
     must never eat a click meant for the hero — which also means the
     canvas itself receives no pointer events at all, so R3F's
     state.pointer sat at its 0,0 default forever and the bloom was pinned
     to the middle of the screen. Read the pointer off the window instead
     and map it into the canvas box by hand. */
  useEffect(() => {
    const canvas = gl.domElement;
    let box = canvas.getBoundingClientRect();
    const measure = () => {
      box = canvas.getBoundingClientRect();
    };

    const move = (e: PointerEvent) => {
      target.current.set(
        (e.clientX - box.left) / box.width,
        // uv.y climbs up the plane, clientY climbs down the page.
        1 - (e.clientY - box.top) / box.height
      );
    };
    const down = () => {
      held.current = true;
    };
    const release = () => {
      held.current = false;
    };

    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("pointerdown", down, { passive: true });
    window.addEventListener("pointerup", release, { passive: true });
    window.addEventListener("pointercancel", release, { passive: true });
    window.addEventListener("resize", measure);
    /* The hero scrolls out from under the pointer, so the box moves
       without ever resizing. Re-measuring here rather than inside move()
       keeps the layout read off the pointer path, where it would force a
       reflow on every single event. */
    window.addEventListener("scroll", measure, { passive: true });

    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerdown", down);
      window.removeEventListener("pointerup", release);
      window.removeEventListener("pointercancel", release);
      window.removeEventListener("resize", measure);
      window.removeEventListener("scroll", measure);
    };
  }, [gl]);

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
    const dt = Math.min(delta, 0.05);
    m.uniforms.uTime.value += dt;
    m.uniforms.uResolution.value.set(state.size.width, state.size.height);

    /* Exponential ease rather than a fixed per-frame lerp factor. The old
       flat 0.05 chased the pointer twice as fast on a 120Hz display as on
       a 60Hz one; this converges over the same wall-clock time on both. */
    smoothed.current.lerp(target.current, 1 - Math.exp(-6 * dt));

    /* Velocity is what makes a drag read as a drag: how far the point
       travelled this frame, accumulated and bled off over a few hundred
       ms so a flick leaves a wake instead of a one-frame flicker. Clamped
       so a fast sweep across the viewport can't tear the field apart. */
    step.current.subVectors(smoothed.current, previous.current);
    previous.current.copy(smoothed.current);
    velocity.current.multiplyScalar(Math.exp(-6 * dt)).add(step.current);
    velocity.current.clampLength(0, 0.15);

    drag.current += ((held.current ? 1 : 0) - drag.current) * (1 - Math.exp(-8 * dt));

    m.uniforms.uPointer.value.copy(smoothed.current);
    m.uniforms.uVelocity.value.copy(velocity.current);
    m.uniforms.uDrag.value = drag.current;
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
      /* One fragment per CSS pixel, flat, whatever the display. This is an
         out-of-focus noise field behind text and its finest octave is
         still ~12% of the viewport across, so there is nothing here for
         retina fragments to resolve. Coming down from 1.25 is ~1.6x fewer
         fragments on a 2x display — the real saving this pass is in the
         hash above, this just stops paying for pixels twice. */
      dpr={1}
      style={{ position: "absolute", inset: 0 }}
      /* Pause the loop when the hero is off screen instead of unmounting:
         the GL context survives, so scrolling back is instant. */
      frameloop={running ? "always" : "never"}
    >
      <Plane />
    </Canvas>
  );
}

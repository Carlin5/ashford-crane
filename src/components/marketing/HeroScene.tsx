"use client";

import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import type { Mesh } from "three";

/** Slow-rotating faceted glass card — one revolution every ~45s. */
function FacetedCard() {
  const ref = useRef<Mesh>(null);
  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y += delta * ((2 * Math.PI) / 45);
  });
  return (
    <Float speed={1.2} rotationIntensity={0.15} floatIntensity={0.4}>
      <mesh ref={ref} rotation={[0.35, 0, -0.12]}>
        <octahedronGeometry args={[1.6, 0]} />
        <meshPhysicalMaterial
          color="#16213a"
          metalness={0.4}
          roughness={0.15}
          transmission={0.7}
          thickness={1.2}
          transparent
          opacity={0.92}
        />
      </mesh>
      <mesh rotation={[0.35, 0.8, -0.12]} scale={1.12}>
        <octahedronGeometry args={[1.6, 0]} />
        <meshBasicMaterial color="#c9a46b" wireframe transparent opacity={0.12} />
      </mesh>
    </Float>
  );
}

export default function HeroScene() {
  return (
    <Canvas
      camera={{ position: [0, 0, 5.2], fov: 40 }}
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: true }}
      style={{ background: "transparent" }}
      aria-hidden
    >
      <ambientLight intensity={0.5} />
      <directionalLight position={[4, 4, 4]} intensity={1.1} />
      <directionalLight position={[-3, -2, 2]} intensity={0.4} color="#c9a46b" />
      <FacetedCard />
    </Canvas>
  );
}

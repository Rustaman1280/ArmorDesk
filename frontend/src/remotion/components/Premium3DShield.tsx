import React from "react";
import { ThreeCanvas } from "@remotion/three";
import { useCurrentFrame } from "remotion";
import * as THREE from "three";

function StudioShieldMesh() {
  const frame = useCurrentFrame();

  // Smooth rotation driven by frame
  const rotationY = frame * 0.025;
  const rotationX = Math.sin(frame * 0.03) * 0.12;
  const floatY = Math.sin(frame * 0.05) * 0.15;

  return (
    <group position={[0, floatY, 0]} rotation={[rotationX, rotationY, 0]}>
      {/* Outer Metallic Chrome Ring */}
      <mesh>
        <torusGeometry args={[2.2, 0.09, 24, 80]} />
        <meshStandardMaterial
          color="#10b981"
          metalness={0.9}
          roughness={0.1}
          emissive="#059669"
          emissiveIntensity={0.3}
        />
      </mesh>

      {/* Secondary Orbiting Ring */}
      <mesh rotation={[Math.PI / 3, Math.PI / 6, 0]}>
        <torusGeometry args={[1.8, 0.06, 20, 80]} />
        <meshStandardMaterial
          color="#06b6d4"
          metalness={0.95}
          roughness={0.1}
          emissive="#0891b2"
          emissiveIntensity={0.3}
        />
      </mesh>

      {/* Third Tilted Thin Ring */}
      <mesh rotation={[-Math.PI / 4, Math.PI / 3, 0]}>
        <torusGeometry args={[2.5, 0.03, 16, 64]} />
        <meshStandardMaterial
          color="#8b5cf6"
          metalness={0.9}
          roughness={0.1}
          emissive="#7c3aed"
          emissiveIntensity={0.4}
        />
      </mesh>

      {/* Floating 3D Diamond Core */}
      <mesh>
        <octahedronGeometry args={[1.15, 0]} />
        <meshPhysicalMaterial
          color="#10b981"
          metalness={0.2}
          roughness={0.1}
          transmission={0.6}
          thickness={1.2}
          emissive="#10b981"
          emissiveIntensity={0.4}
        />
      </mesh>

      {/* Orbiting Satellite Particle A */}
      <mesh position={[Math.cos(frame * 0.06) * 3, Math.sin(frame * 0.06) * 1.6, Math.sin(frame * 0.06) * 2.2]}>
        <sphereGeometry args={[0.18, 24, 24]} />
        <meshStandardMaterial color="#00DC82" emissive="#00DC82" emissiveIntensity={0.8} />
      </mesh>

      {/* Orbiting Satellite Particle B */}
      <mesh position={[Math.cos(frame * 0.06 + Math.PI) * 3, Math.sin(frame * 0.06 + Math.PI) * 1.6, Math.sin(frame * 0.06 + Math.PI) * 2.2]}>
        <sphereGeometry args={[0.18, 24, 24]} />
        <meshStandardMaterial color="#0070F3" emissive="#0070F3" emissiveIntensity={0.8} />
      </mesh>
    </group>
  );
}

export function Premium3DShield({ width = 450, height = 450 }: { width?: number; height?: number }) {
  return (
    <div style={{ width, height, position: "relative" }}>
      <ThreeCanvas width={width} height={height}>
        <ambientLight intensity={1.2} />
        <directionalLight position={[6, 8, 5]} intensity={1.8} color="#ffffff" />
        <pointLight position={[-8, -6, 5]} intensity={1.2} color="#10b981" />
        <pointLight position={[8, 6, -5]} intensity={1.5} color="#06b6d4" />
        <StudioShieldMesh />
      </ThreeCanvas>
    </div>
  );
}

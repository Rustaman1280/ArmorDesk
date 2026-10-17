import React from "react";
import { ThreeCanvas } from "@remotion/three";
import { useCurrentFrame, interpolate } from "remotion";
import * as THREE from "three";

function ShieldMesh() {
  const frame = useCurrentFrame();

  // Rotation driven by useCurrentFrame, not useFrame
  const rotationY = (frame * 0.02) % (Math.PI * 2);
  const rotationX = Math.sin(frame * 0.03) * 0.15;
  const floatY = Math.sin(frame * 0.04) * 0.2;

  return (
    <group position={[0, floatY, 0]} rotation={[rotationX, rotationY, 0]}>
      {/* Outer Armor Ring */}
      <mesh>
        <torusGeometry args={[2.2, 0.08, 16, 64]} />
        <meshStandardMaterial
          color="#10b981"
          emissive="#059669"
          emissiveIntensity={0.6}
          roughness={0.2}
          metalness={0.8}
        />
      </mesh>

      {/* Secondary Inner Cerulean Ring */}
      <mesh rotation={[Math.PI / 4, 0, 0]}>
        <torusGeometry args={[1.8, 0.05, 16, 64]} />
        <meshStandardMaterial
          color="#06b6d4"
          emissive="#0891b2"
          emissiveIntensity={0.5}
          roughness={0.2}
          metalness={0.9}
        />
      </mesh>

      {/* 3D Core Octahedron (Shield Core) */}
      <mesh>
        <octahedronGeometry args={[1.2, 0]} />
        <meshStandardMaterial
          color="#10b981"
          emissive="#047857"
          emissiveIntensity={0.7}
          roughness={0.1}
          metalness={0.9}
          wireframe={false}
        />
      </mesh>

      {/* Orbiting Satellite Particle 1 */}
      <mesh position={[Math.cos(frame * 0.05) * 2.8, Math.sin(frame * 0.05) * 1.5, Math.sin(frame * 0.05) * 2]}>
        <sphereGeometry args={[0.15, 16, 16]} />
        <meshStandardMaterial color="#34d399" emissive="#10b981" emissiveIntensity={1} />
      </mesh>

      {/* Orbiting Satellite Particle 2 */}
      <mesh position={[Math.cos(frame * 0.05 + Math.PI) * 2.8, Math.sin(frame * 0.05 + Math.PI) * 1.5, Math.sin(frame * 0.05 + Math.PI) * 2]}>
        <sphereGeometry args={[0.15, 16, 16]} />
        <meshStandardMaterial color="#38bdf8" emissive="#0284c7" emissiveIntensity={1} />
      </mesh>
    </group>
  );
}

export function ArmorDesk3DShield({ width = 600, height = 600 }: { width?: number; height?: number }) {
  return (
    <div style={{ width, height, position: "relative" }}>
      <ThreeCanvas width={width} height={height}>
        <ambientLight intensity={0.8} />
        <pointLight position={[10, 10, 10]} intensity={1.5} color="#34d399" />
        <pointLight position={[-10, -10, -10]} intensity={1.2} color="#06b6d4" />
        <directionalLight position={[0, 5, 5]} intensity={1.2} />
        <ShieldMesh />
      </ThreeCanvas>
    </div>
  );
}

/**
 * Diamond3D.tsx
 * Three.js-based 3D diamond logo component with interactive animations.
 * Features a spinning octahedron with dynamic lighting and theme-aware colors.
 */

import { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useTheme } from '../context/ThemeContext';
import '../styles/components/Diamond3D.css';
import { Edges } from '@react-three/drei';

/**
 * Props for the SpinningDiamond component
 * @interface SpinningDiamondProps
 * @property {string} baseColor - Base color for the diamond material
 * @property {string} edgeColor - Color for the diamond edges
 */
interface SpinningDiamondProps { 
  baseColor: string; 
  edgeColor: string 
}

/**
 * SpinningDiamond Component
 * Renders an animated 3D octahedron with physical material properties.
 * Features:
 * - Interactive spin speed on hover
 * - Continuous precession animation
 * - Dynamic lighting and reflections
 * - Edge highlighting
 * 
 * @param {SpinningDiamondProps} props - Component props
 * @returns {JSX.Element} The 3D diamond mesh
 */
function SpinningDiamond({ baseColor, edgeColor }: SpinningDiamondProps) {
  // Refs for animation control
  const group = useRef<THREE.Group>(null!);  // Parent group for precession
  const mesh = useRef<THREE.Mesh>(null!);    // Diamond mesh for spin
  const [hovered, setHovered] = useState(false);

  /**
   * Set up initial diamond orientation
   * Applies a compound rotation for an aesthetically pleasing view:
   * 1. Backward tilt for perspective depth
   * 2. Diagonal tilt in screen plane
   */
  useEffect(() => {
    const diagonalAng = Math.PI / 4;   // 45° tilt in screen plane
    const perspectiveAng = Math.PI / 3; // 60° tilt backward for depth
    group.current.rotation.x = perspectiveAng;
    group.current.rotation.z = diagonalAng;
  }, []);

  // Animation constants
  const PRECESSION_SPEED = 2 * Math.PI / 120; // Full rotation in 120 seconds

  /**
   * Frame animation loop
   * Handles two types of rotation:
   * 1. Local spin around Y axis (speed increases on hover)
   * 2. Global precession around Y axis (constant speed)
   */
  useFrame((_, delta) => {
    // Local spin - faster when hovered
    const spinSpeed = hovered ? delta : delta * 0.2;
    mesh.current.rotation.y += spinSpeed;
    // Global precession
    group.current.rotation.y += PRECESSION_SPEED * delta;
  });

  return (
    <group ref={group}>
      <mesh
        ref={mesh}
        castShadow
        receiveShadow
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <octahedronGeometry args={[1.2, 0]} />
        <meshPhysicalMaterial
          color={baseColor}
          emissive={'#000000'}
          metalness={1}
          roughness={0}
          transmission={0.9}
          opacity={0.4}
          transparent
          clearcoat={1}
          clearcoatRoughness={0.1}
        />
        <Edges color={edgeColor} threshold={15} />
      </mesh>
    </group>
  );
}

/**
 * Diamond3D Component
 * Main container component that sets up the Three.js scene.
 * Features:
 * - Theme-aware color scheme
 * - Dynamic lighting setup
 * - Responsive canvas container
 * - Shadow rendering
 * 
 * @returns {JSX.Element} The diamond logo component
 */
export default function Diamond3D() {
  const { isLightMode } = useTheme();

  // Theme-aware color palette
  const baseColor = isLightMode ? '#ffffff' : '#cccccc';  // Neutral base
  const edgeColor = isLightMode ? '#666666' : '#ffffff';  // Contrasting edges

  return (
    <div className="diamond3d-container">
      <Canvas 
        key={isLightMode ? 'light' : 'dark'} 
        shadows 
        camera={{ position: [0, 0, 3], fov: 50 }}
      >
        {/* Ambient light for base illumination */}
        <ambientLight intensity={0.3} />
        {/* Directional light for shadows and highlights */}
        <directionalLight castShadow intensity={0.8} position={[2, 5, 2]} />
        <SpinningDiamond baseColor={baseColor} edgeColor={edgeColor} />
      </Canvas>
    </div>
  );
} 
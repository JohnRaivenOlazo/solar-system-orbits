import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { PlanetData } from '../../services/api';

interface SunProps {
  data: PlanetData;
  scale: number;
}

export const Sun: React.FC<SunProps> = ({ data, scale }) => {
  const sunRef = useRef<THREE.Mesh>(null);

  useFrame(() => {
    if (sunRef.current) {
      sunRef.current.rotation.y += 0.001;
    }
  });

  return (
    <mesh ref={sunRef} position={[0, 0, 0]}>
      <sphereGeometry args={[data.radius * scale, 64, 64]} />
      <meshStandardMaterial 
        color={data.color}
        emissive={data.color}
        emissiveIntensity={0.5}
      />
      <pointLight color={"#FFF"} intensity={1.5} distance={300} decay={0} />
    </mesh>
  );
};

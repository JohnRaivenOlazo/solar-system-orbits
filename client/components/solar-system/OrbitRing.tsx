import React, { useMemo } from 'react';
import { Line } from '@react-three/drei';
import * as THREE from 'three';

interface OrbitRingProps {
  radius: number;
  rotationY?: number;
}

export const OrbitRing: React.FC<OrbitRingProps> = ({ radius, rotationY = 0 }) => {
  const points = useMemo(() => {
    const segments = 64;
    const points = [];
    for (let i = 0; i <= segments; i++) {
      const theta = (i / segments) * Math.PI * 2;
      points.push(new THREE.Vector3(
        Math.cos(theta) * radius, 
        0, 
        Math.sin(theta) * radius
      ));
    }
    return points;
  }, [radius]);
  
  return (
    <group rotation={[0, rotationY, 0]}>
      <Line 
        points={points}
        color="#666"
        opacity={0.3}
        transparent
        lineWidth={1}
      />
    </group>
  );
};

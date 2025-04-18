import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { PlanetData } from '../../services/api';
import { RotationMarker } from './RotationMarker';
import { OrbitRing } from './OrbitRing';

interface PlanetProps {
  data: PlanetData;
  scale: number;
  time: number;
  orbitVisible?: boolean;
  showLabel?: boolean;
  selected?: boolean;
  showRotation?: boolean;
  onClick?: () => void;
}

export const Planet: React.FC<PlanetProps> = ({ 
  data, 
  scale, 
  time, 
  orbitVisible = true, 
  showLabel = true, 
  selected = false, 
  showRotation = false, 
  onClick 
}) => {
  const planetRef = useRef<THREE.Group>(null);
  const planetBodyRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  
  useFrame(() => {
    if (planetRef.current && planetBodyRef.current) {
      // Enhance rotation speed
      planetBodyRef.current.rotation.y = time * data.rotation * Math.PI * 2;
      
      // Enhance orbital movement speed
      const angle = time * data.orbitalSpeed * 2;
      const x = Math.cos(angle) * data.orbitalDistance;
      const z = Math.sin(angle) * data.orbitalDistance;
      
      planetRef.current.position.x = x;
      planetRef.current.position.z = z;
      
      // Apply orbital inclination
      planetRef.current.rotation.x = data.orbitalInclination;
    }
  });

  return (
    <>
      {orbitVisible && (
        <OrbitRing 
          radius={data.orbitalDistance} 
          rotationY={data.orbitalInclination} 
        />
      )}
      <group 
        ref={planetRef} 
        onClick={onClick}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <mesh ref={planetBodyRef}>
          <sphereGeometry args={[data.radius * scale, 32, 32]} />
          <meshStandardMaterial 
            color={data.color} 
            metalness={0.1} 
            roughness={0.8}
            emissive={hovered ? "#555" : "#000"}
            emissiveIntensity={hovered ? 0.5 : 0}
          />
          {showRotation && <RotationMarker radius={data.radius * scale} />}
        </mesh>
        
        {showLabel && (
          <Html
            position={[0, data.radius * scale * 1.5, 0]}
            center
            distanceFactor={15}
          >
            <div 
              className={`
                px-2 py-1 text-xs text-white whitespace-nowrap 
                ${selected ? 'bg-accent/80' : 'bg-black/70'} 
                rounded-md transform-gpu transition-all duration-200
                ${hovered ? 'scale-125' : ''}
              `}
              style={{ 
                maxWidth: '120px',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                pointerEvents: 'none'
              }}
            >
              {data.name}
            </div>
          </Html>
        )}
      </group>
    </>
  );
};

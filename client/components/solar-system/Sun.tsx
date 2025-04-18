import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF, useAnimations } from '@react-three/drei';
import * as THREE from 'three';
import { PlanetData } from '../../services/api';

type GLTFResult = {
  nodes: Record<string, THREE.Mesh>;
  materials: Record<string, THREE.Material>;
  animations: THREE.AnimationClip[];
};

interface SunProps {
  data: PlanetData;
  scale: number;
}

export const Sun: React.FC<SunProps> = ({ data, scale }) => {
  const group = useRef<THREE.Group>(null);
  const { nodes, materials, animations } = useGLTF('/models/sun.glb') as unknown as GLTFResult;
  const { actions } = useAnimations(animations, group);

  useFrame(() => {
    if (group.current) {
      group.current.rotation.y += 0.001;
    }
  });

  return (
    <group ref={group} position={[0, 0, 0]} scale={data.radius * scale} dispose={null}>
      <group>
        <group rotation={[-Math.PI / 2, 0, 0]}>
          <group rotation={[Math.PI / 2, 0, 0]}>
            <group>
              <group>
                <group name="core" rotation={[-Math.PI / 2, 0, 0]}>
                  <mesh
                    castShadow
                    receiveShadow
                    geometry={nodes['UnstableStarCore_1_0'].geometry}
                    material={materials.material}
                  />
                </group>
                <group name="surface" rotation={[-Math.PI / 2, 0, 0]} scale={1.01}>
                  <mesh
                    castShadow
                    receiveShadow
                    geometry={nodes['UnstableStarref_2_0'].geometry}
                    material={materials.material_1}
                  />
                </group>
              </group>
            </group>
          </group>
        </group>
      </group>
      <pointLight color="#FFF" intensity={1.5} distance={300} decay={0} />
    </group>
  );

};

useGLTF.preload('/models/sun.glb');
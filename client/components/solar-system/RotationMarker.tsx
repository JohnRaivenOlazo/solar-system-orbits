import React from 'react';

interface RotationMarkerProps {
  radius: number;
}

export const RotationMarker: React.FC<RotationMarkerProps> = ({ radius }) => {
  return (
    <mesh position={[radius * 0.5, 0, 0]} scale={[0.1, 0.1, 0.1]}>
      <sphereGeometry />
      <meshBasicMaterial color="white" />
    </mesh>
  );
};

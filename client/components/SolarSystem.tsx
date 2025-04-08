import React, { useState, useEffect, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars, Html } from '@react-three/drei';
import { PlanetData } from '../services/api';
import { Sun } from './solar-system/Sun';
import { Planet } from './solar-system/Planet';

// Error boundary component
class ThreeJSErrorBoundary extends React.Component<{ children: React.ReactNode }> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex items-center justify-center h-screen bg-space-dark text-white">
          <div className="text-center">
            <h2 className="text-xl mb-2">Something went wrong with the 3D rendering</h2>
            <button 
              onClick={() => this.setState({ hasError: false })}
              className="px-4 py-2 bg-blue-600 rounded-md hover:bg-blue-700"
            >
              Try again
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

const LoadingScreen = () => (
  <Html center>
    <div className="text-white text-lg">Loading solar system...</div>
  </Html>
);

interface SceneProps {
  planets: PlanetData[];
  isPlaying: boolean;
  timeScale: number;
  selectedPlanet: string | null;
  showRotationMarkers: boolean;
  onPlanetClick: (planet: PlanetData) => void;
  onTimeUpdate: (time: number) => void;
  simulationTime: number;
}

const Scene: React.FC<SceneProps> = ({
  planets,
  isPlaying,
  timeScale,
  selectedPlanet,
  showRotationMarkers,
  onPlanetClick,
  onTimeUpdate,
  simulationTime
}) => {
  const [time, setTime] = useState(simulationTime);
  const sceneScale = 0.2;
  
  const sun = planets.find(planet => planet.id === "sun");
  const otherPlanets = planets.filter(planet => planet.id !== "sun");

  useEffect(() => {
    if (!isPlaying) return;
    
    let lastTime = performance.now();
    const animate = () => {
      const currentTime = performance.now();
      const deltaTime = (currentTime - lastTime) / 1000; // Convert to seconds
      
      // Apply an exponential scale factor for better response at higher speeds
      const scaledTime = time + (deltaTime * Math.pow(timeScale, 1.5));
      
      setTime(scaledTime);
      onTimeUpdate(scaledTime);
      lastTime = currentTime;
    };

    const interval = setInterval(animate, 1000 / 60); // 60 FPS
    return () => clearInterval(interval);
  }, [isPlaying, timeScale, time, onTimeUpdate]);

  useEffect(() => {
    if (simulationTime !== time) {
      setTime(simulationTime);
    }
  }, [simulationTime]);

  return (
    <group scale={sceneScale}>
      {sun && <Sun data={sun} scale={1} />}
      
      {otherPlanets.map((planet) => (
        <Planet 
          key={planet.id}
          data={planet}
          scale={1}
          time={time}
          orbitVisible={true}
          showLabel={true}
          showRotation={showRotationMarkers}
          selected={selectedPlanet === planet.id}
          onClick={() => onPlanetClick(planet)}
        />
      ))}
    </group>
  );
};

interface SolarSystemProps {
  planets: PlanetData[];
  isPlaying: boolean;
  timeScale: number;
  onPlanetSelect?: (planet: PlanetData | null) => void;
  onTimeUpdate?: (time: number) => void;
  simulationTime?: number;
}

const SolarSystem: React.FC<SolarSystemProps> = ({ 
  planets, 
  isPlaying, 
  timeScale, 
  onPlanetSelect,
  onTimeUpdate,
  simulationTime = 0
}) => {
  const [selectedPlanet, setSelectedPlanet] = useState<string | null>(null);
  const [showRotationMarkers, setShowRotationMarkers] = useState(true);

  const handlePlanetClick = (planet: PlanetData) => {
    const isSelected = selectedPlanet === planet.id;
    const newSelection = isSelected ? null : planet;
    
    setSelectedPlanet(isSelected ? null : planet.id);
    onPlanetSelect?.(newSelection);
  };

  const handleTimeUpdate = (time: number) => {
    onTimeUpdate?.(time);
  };

  return (
    <ThreeJSErrorBoundary>
      <Canvas camera={{ position: [0, 20, 50], fov: 60 }}>
        <Suspense fallback={<LoadingScreen />}>
          <color attach="background" args={['#000']} />
          <ambientLight intensity={0.2} />
          
          <Stars 
            radius={300} 
            depth={60} 
            count={5000} 
            factor={4} 
            saturation={0}
            fade
          />

          <Scene 
            planets={planets}
            isPlaying={isPlaying}
            timeScale={timeScale}
            selectedPlanet={selectedPlanet}
            showRotationMarkers={showRotationMarkers}
            onPlanetClick={handlePlanetClick}
            onTimeUpdate={handleTimeUpdate}
            simulationTime={simulationTime}
          />

          <OrbitControls 
            enablePan={true}
            enableZoom={true}
            enableRotate={true}
            zoomSpeed={0.6}
            rotateSpeed={0.4}
            minDistance={5}
            maxDistance={200}
          />
        </Suspense>
      </Canvas>
    </ThreeJSErrorBoundary>
  );
};

export default SolarSystem;

import React, { useState, useEffect, Suspense, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
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
    <div className="text-center">
      <div className="relative flex justify-center items-center">
        <div className="w-20 h-20 border-4 border-blue-400/20 border-t-blue-500 rounded-full animate-spin shadow-lg shadow-blue-500/20"></div>
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
          <div className="w-20 h-20 rounded-full bg-blue-500/10 blur-xl"></div>
        </div>
      </div>
      <p className="text-xl font-medium bg-gradient-to-r from-blue-200 to-indigo-200 bg-clip-text text-transparent mt-6">
        Loading Solar System...
      </p>
    </div>
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
  const timeRef = useRef(simulationTime);
  const sceneScale = 0.2;
  
  const sun = planets.find(planet => planet.id === "sun");
  const otherPlanets = planets.filter(planet => planet.id !== "sun");

  useFrame((state) => {
    if (!isPlaying) return;
    
    // Apply exponential scaling with a safety limit
    const maxScaleFactor = 1000; // Prevent extreme time scaling
    const scaleFactor = Math.min(Math.pow(2, (timeScale - 1) / 2), maxScaleFactor);
    const deltaTime = state.clock.getDelta();
    const newTime = timeRef.current + (deltaTime * scaleFactor);
    
    // Prevent potential overflow by capping the maximum simulation time
    const maxTime = Number.MAX_SAFE_INTEGER / 1000; // Leave room for calculations
    timeRef.current = Math.min(newTime, maxTime);
    setTime(timeRef.current);
    onTimeUpdate(timeRef.current);
  });

  // Sync with external time changes
  useEffect(() => {
    if (Math.abs(simulationTime - timeRef.current) > 0.001) {
      timeRef.current = simulationTime;
      setTime(simulationTime);
    }
  }, [simulationTime]);

  return (
    <group scale={sceneScale}>
      {sun && <Sun data={sun} scale={0.2} />}
      
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

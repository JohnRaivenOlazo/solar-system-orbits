'use client';
import React, { useState, useEffect } from 'react';
import SolarSystem from '../components/SolarSystem';
import ControlPanel from '../components/ControlPanel';
import ApiDocumentation from '../components/ApiDocumentation';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { BookOpen, Github, Info, HelpCircle, Settings, LayoutDashboard } from 'lucide-react';
import { apiService, PlanetData, SimulationData } from '../services/api';

const Home = () => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [timeScale, setTimeScale] = useState(2); // Default to 2x speed for better visibility
  const [showDocs, setShowDocs] = useState(false);
  const [planets, setPlanets] = useState<PlanetData[]>([]);
  const [selectedPlanet, setSelectedPlanet] = useState<PlanetData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [simulationTime, setSimulationTime] = useState(0);
  const [simulationDate, setSimulationDate] = useState<SimulationData['simulationDate']>({
    earthYears: 2023,
    formattedDate: "January 1, 2023"
  });
  
  const { toast } = useToast();

  useEffect(() => {
    // Fetch simulation data on component mount
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const data = await apiService.getSimulationData();
        setPlanets(data.celestialBodies);
        setSimulationDate(data.simulationDate);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to fetch simulation data",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [toast]);

  // Update simulation date whenever simulation time changes
  useEffect(() => {
    const date = apiService.getSimulationDate(simulationTime);
    setSimulationDate(date);
  }, [simulationTime]);

  const handlePlayToggle = () => {
    setIsPlaying(!isPlaying);
    toast({
      title: isPlaying ? "Simulation Paused" : "Simulation Resumed",
      duration: 2000,
    });
  };

  const handleReset = async () => {
    try {
      await apiService.resetSimulation();
      const data = await apiService.getSimulationData();
      setPlanets(data.celestialBodies);
      setSelectedPlanet(null);
      setSimulationTime(0);
      setSimulationDate(data.simulationDate);
      
      toast({
        title: "Simulation Reset",
        description: "The solar system has been reset to its initial state",
        duration: 3000,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to reset simulation",
        variant: "destructive",
      });
    }
  };

  const handleTimeScaleChange = async (value: number) => {
    setTimeScale(value);
    try {
      await apiService.updateSimulation({ timeScale: value });
    } catch (error) {
      console.error("Failed to update time scale:", error);
    }
  };

  const handlePlanetSelect = (planet: PlanetData | null) => {
    setSelectedPlanet(planet);
    if (planet) {
      toast({
        title: `Selected ${planet.name}`,
        description: `Viewing information about ${planet.name}`,
        duration: 3000,
      });
    }
  };

  const handleTimeUpdate = (time: number) => {
    setSimulationTime(time);
  };
  
  const handleDateChange = (time: number) => {
    setSimulationTime(time);
    // Temporarily pause simulation when directly setting a date
    if (isPlaying) {
      setIsPlaying(false);
      setTimeout(() => setIsPlaying(true), 500); // Resume after a short delay
    }
    
    toast({
      title: "Date Changed",
      description: "The simulation date has been updated",
      duration: 2000,
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-space-dark">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-xl text-white">Loading Solar System...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-screen overflow-hidden bg-space-dark">
      {/* Header with buttons */}
      <header className="absolute top-0 left-0 z-10 p-4 flex items-center gap-2">
        <div className="flex items-center bg-slate-800/70 backdrop-blur-xs rounded-lg px-3 py-1.5 border border-slate-700/50">
          <LayoutDashboard size={18} className="text-blue-400 mr-2" />
          <h1 className="text-white text-lg font-bold">Solar System Simulator</h1>
        </div>
        
        <div className="flex gap-1 ml-2">
          <Button 
            variant="outline" 
            size="sm"
            className="bg-slate-800/70 hover:bg-slate-700/90 border-slate-600 flex items-center gap-2 backdrop-blur-xs"
            onClick={() => setShowDocs(true)}
          >
            <BookOpen size={16} />
            <span className="hidden sm:inline">API Docs</span>
          </Button>
          
          <Button 
            variant="outline" 
            size="sm"
            className="bg-slate-800/70 hover:bg-slate-700/90 border-slate-600 flex items-center gap-2 backdrop-blur-xs"
            onClick={() => window.open('https://github.com/yourusername/solar-system-simulator', '_blank')}
          >
            <Github size={16} />
            <span className="hidden sm:inline">GitHub</span>
          </Button>
          
          <Button 
            variant="outline" 
            size="sm"
            className="bg-slate-800/70 hover:bg-slate-700/90 border-slate-600 flex items-center gap-2 backdrop-blur-xs"
          >
            <HelpCircle size={16} />
            <span className="hidden sm:inline">Help</span>
          </Button>
        </div>
      </header>

      {/* Main 3D simulation canvas */}
      <main className="h-full w-full">
        <SolarSystem 
          planets={planets} 
          isPlaying={isPlaying} 
          timeScale={timeScale} 
          onPlanetSelect={handlePlanetSelect}
          onTimeUpdate={handleTimeUpdate}
          simulationTime={simulationTime}
        />
      </main>

      {/* Control panel */}
      <ControlPanel 
        isPlaying={isPlaying}
        timeScale={timeScale}
        selectedPlanet={selectedPlanet}
        simulationDate={simulationDate}
        onPlayToggle={handlePlayToggle}
        onReset={handleReset}
        onTimeScaleChange={handleTimeScaleChange}
        onCloseInfo={() => setSelectedPlanet(null)}
        onDateChange={handleDateChange}
      />

      {/* API Documentation modal */}
      <ApiDocumentation 
        isOpen={showDocs} 
        onClose={() => setShowDocs(false)} 
      />
    </div>
  );
};

export default Home;

"use client";
import React, { useState, useEffect } from "react";
import SolarSystem from "../components/SolarSystem";
import ControlPanel from "../components/ControlPanel";
import ApiDocumentation from "../components/ApiDocumentation";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import {
  BookOpen,
  Github,
  HelpCircle,
} from "lucide-react";
import { apiService, PlanetData, SimulationData } from "../services/api";

const Home = () => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [timeScale, setTimeScale] = useState(2); // Default to 2x speed for better visibility
  const [showDocs, setShowDocs] = useState(false);
  const [planets, setPlanets] = useState<PlanetData[]>([]);
  const [selectedPlanet, setSelectedPlanet] = useState<PlanetData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [simulationTime, setSimulationTime] = useState(0);  const [simulationDate, setSimulationDate] = useState<
    SimulationData["simulationDate"]
  >({
    earthYears: new Date().getFullYear(),
    formattedDate: new Date().toLocaleDateString('en-US', { 
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }),
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
      <div className="flex items-center justify-center h-screen bg-[#0B1026]">
        <div className="text-center relative flex items-center justify-center flex-col gap-2">
          <div className="w-20 h-20 border-4 border-blue-400/20 border-t-blue-500 rounded-full animate-spin mx-auto mb-6 shadow-lg shadow-blue-500/20"></div>
          <div className="absolute inset-0 pointer-events-none">
            <div className="w-20 h-20 mx-auto rounded-full bg-blue-500/10 blur-xl"></div>
          </div>
          <p className="text-xl font-medium bg-gradient-to-r from-blue-200 to-indigo-200 bg-clip-text text-transparent">
            Loading Solar System...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-screen overflow-hidden bg-space-dark">
      {" "}
      <header className="absolute top-2 left-2 right-2 z-10 px-6 py-5 flex items-center gap-4">
        <div className="flex gap-3">
          <Button
            variant="outline"
            size="sm"
            className="bg-[#1B2A4A]/80 hover:bg-[#2A3B66]/90 border-indigo-500/20 text-blue-100 flex items-center gap-1 backdrop-blur-md shadow-lg shadow-blue-500/10 rounded-xl px-4 hover:border-indigo-500/40 transition-all duration-300"
            onClick={() => setShowDocs(true)}
          >
            <BookOpen size={16} />{" "}
            <span className="hidden sm:inline font-medium">API Docs</span>
          </Button>

          <Button
            variant="outline"
            size="sm"
            className="bg-[#1B2A4A]/80 hover:bg-[#2A3B66]/90 border-indigo-500/20 text-blue-100 flex items-center gap-1 backdrop-blur-md shadow-lg shadow-blue-500/10 rounded-xl px-20 hover:border-indigo-500/40 transition-all duration-300"
            onClick={() =>
              window.open(
                "https://github.com/JohnRaivenOlazo/solar-system-orbits",
                "_blank"
              )
            }
          >
            <Github size={16} className="text-blue-300" />
            <span className="hidden sm:inline font-medium">GitHub</span>
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
      <ApiDocumentation isOpen={showDocs} onClose={() => setShowDocs(false)} />
    </div>
  );
};

export default Home;

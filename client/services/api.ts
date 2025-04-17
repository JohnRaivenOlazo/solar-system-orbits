import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export interface PlanetData {
  id: string;
  name: string;
  position: [number, number, number];
  rotation: number;
  radius: number;
  color: string;
  texture?: string;
  orbitalSpeed: number;
  orbitalDistance: number;
  orbitalInclination: number;
  info: {
    mass: string;
    diameter: string;
    dayLength: string;
    yearLength: string;
    description: string;
    temperature?: string;
    moons?: number;
  };
}

export interface SimulationData {
  timeScale: number;
  currentTime: number;
  celestialBodies: PlanetData[];
  simulationDate: {
    earthYears: number;
    formattedDate: string;
  };
}

// Function to calculate simulation date based on a specific year and date
export const calculatePlanetPositions = (year: number, month: number, day: number): number => {
  const baseDate = new Date();
  const targetDate = new Date(year, month - 1, day);
  const timeDiff = targetDate.getTime() - baseDate.getTime();
  const daysDiff = timeDiff / (1000 * 3600 * 24);
  return daysDiff / 20;
};

// Update simulation date for a given time
const updateSimulationDate = (elapsedTime: number): SimulationData['simulationDate'] => {
  const startDate = new Date();
  const elapsedDays = elapsedTime * 20;
  const newDate = new Date(startDate);
  newDate.setDate(startDate.getDate() + elapsedDays);
  
  const formattedDate = newDate.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
  
  return {
    earthYears: newDate.getFullYear(),
    formattedDate
  };
};

// API service
export const apiService = {
  getSimulationData: async (): Promise<SimulationData> => {
    try {
      const response = await axios.get(`${API_BASE_URL}/simulation`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch simulation data:', error);
      throw error;
    }
  },

  updateSimulation: async (params: { timeScale: number }): Promise<void> => {
    try {
      await axios.post(`${API_BASE_URL}/simulation/settings`, params);
    } catch (error) {
      console.error('Failed to update simulation settings:', error);
      throw error;
    }
  },

  resetSimulation: async (): Promise<void> => {
    try {
      await axios.post(`${API_BASE_URL}/simulation/reset`);
    } catch (error) {
      console.error('Failed to reset simulation:', error);
      throw error;
    }
  },

  getSimulationDate: (elapsedTime: number): SimulationData['simulationDate'] => {
    return updateSimulationDate(elapsedTime);
  },

  setSimulationDate: (year: number, month: number, day: number): number => {
    return calculatePlanetPositions(year, month, day);
  }
};

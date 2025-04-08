
import axios from 'axios';

// Mock the API for development purposes
const API_BASE_URL = 'https://api.example.com/solar-system'; // Replace with real API endpoint when ready

export interface PlanetData {
  id: string;
  name: string;
  position: [number, number, number]; // x, y, z coordinates
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

// Mock data for development
const mockSimulationData: SimulationData = {
  timeScale: 1,
  currentTime: 0,
  simulationDate: {
    earthYears: new Date().getFullYear(),
    formattedDate: new Date().toLocaleDateString('en-US', { 
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  },
  celestialBodies: [
    {
      id: "sun",
      name: "Sun",
      position: [0, 0, 0],
      rotation: 0,
      radius: 2,
      color: "#FDB813",
      orbitalSpeed: 0,
      orbitalDistance: 0,
      orbitalInclination: 0,
      info: {
        mass: "1.989 × 10^30 kg",
        diameter: "1,392,684 km",
        dayLength: "27 Earth days",
        yearLength: "N/A",
        description: "The Sun is the star at the center of the Solar System.",
        temperature: "5,778 K (surface)"
      }
    },
    {
      id: "mercury",
      name: "Mercury",
      position: [3.5, 0, 0],
      rotation: 0.008, // Increased for visibility
      radius: 0.38,
      color: "#A9A9A9",
      orbitalSpeed: 0.08,  // Increased speed
      orbitalDistance: 3.5,
      orbitalInclination: 0.03,
      info: {
        mass: "3.3011 × 10^23 kg",
        diameter: "4,879.4 km",
        dayLength: "58.7 Earth days",
        yearLength: "88 Earth days",
        description: "Mercury is the smallest and innermost planet in the Solar System.",
        temperature: "430°C (day), -180°C (night)",
        moons: 0
      }
    },
    {
      id: "venus",
      name: "Venus",
      position: [6.7, 0, 0],
      rotation: 0.004, // Increased for visibility
      radius: 0.95,
      color: "#E8B23C",
      orbitalSpeed: 0.03,  // Increased speed
      orbitalDistance: 6.7,
      orbitalInclination: 0.009,
      info: {
        mass: "4.8675 × 10^24 kg",
        diameter: "12,104 km",
        dayLength: "243 Earth days",
        yearLength: "225 Earth days",
        description: "Venus is the second planet from the Sun and the hottest planet in our solar system.",
        temperature: "462°C (average)",
        moons: 0
      }
    },
    {
      id: "earth",
      name: "Earth",
      position: [9.3, 0, 0],
      rotation: 0.02, // Increased rotation speed
      radius: 1,
      color: "#4B94D1",
      orbitalSpeed: 0.02,  // Increased speed
      orbitalDistance: 9.3,
      orbitalInclination: 0.002,
      info: {
        mass: "5.9722 × 10^24 kg",
        diameter: "12,742 km",
        dayLength: "24 hours",
        yearLength: "365.25 days",
        description: "Earth is the third planet from the Sun and the only astronomical object known to harbor life.",
        temperature: "15°C (average)",
        moons: 1
      }
    },
    {
      id: "mars",
      name: "Mars",
      position: [14.2, 0, 0],
      rotation: 0.018, // Increased for visibility
      radius: 0.53,
      color: "#C1440E",
      orbitalSpeed: 0.016,  // Increased speed
      orbitalDistance: 14.2,
      orbitalInclination: 0.035,
      info: {
        mass: "6.4169 × 10^23 kg",
        diameter: "6,779 km",
        dayLength: "24.6 hours",
        yearLength: "687 Earth days",
        description: "Mars is the fourth planet from the Sun and the second-smallest planet in the Solar System.",
        temperature: "-65°C (average)",
        moons: 2
      }
    },
    {
      id: "jupiter",
      name: "Jupiter",
      position: [48.4, 0, 0],
      rotation: 0.04, // Faster rotation, increased for visibility
      radius: 11.2,
      color: "#E7B861",
      orbitalSpeed: 0.008,  // Increased speed
      orbitalDistance: 48.4,
      orbitalInclination: 0.01,
      info: {
        mass: "1.8981 × 10^27 kg",
        diameter: "139,820 km",
        dayLength: "9.8 hours",
        yearLength: "12 Earth years",
        description: "Jupiter is the fifth planet from the Sun and the largest in the Solar System.",
        temperature: "-145°C (cloud tops)",
        moons: 79
      }
    },
    {
      id: "saturn",
      name: "Saturn",
      position: [88.9, 0, 0],
      rotation: 0.036, // Increased for visibility
      radius: 9.4,
      color: "#F4D29E",
      orbitalSpeed: 0.006,  // Increased speed
      orbitalDistance: 88.9,
      orbitalInclination: 0.023,
      info: {
        mass: "5.6832 × 10^26 kg",
        diameter: "116,460 km",
        dayLength: "10.7 hours",
        yearLength: "29 Earth years",
        description: "Saturn is the sixth planet from the Sun and the second-largest in the Solar System.",
        temperature: "-178°C (average)",
        moons: 82
      }
    },
    {
      id: "uranus",
      name: "Uranus",
      position: [179, 0, 0],
      rotation: 0.024, // Increased for visibility
      radius: 4,
      color: "#9AB8E5",
      orbitalSpeed: 0.0022,  // Increased speed
      orbitalDistance: 179,
      orbitalInclination: 0.057,
      info: {
        mass: "8.6810 × 10^25 kg",
        diameter: "50,724 km",
        dayLength: "17.2 hours",
        yearLength: "84 Earth years",
        description: "Uranus is the seventh planet from the Sun and has the third-largest diameter in our solar system.",
        temperature: "-224°C (average)",
        moons: 27
      }
    },
    {
      id: "neptune",
      name: "Neptune",
      position: [288, 0, 0],
      rotation: 0.028, // Increased for visibility
      radius: 3.9,
      color: "#4968AA",
      orbitalSpeed: 0.0016,  // Increased speed
      orbitalDistance: 288,
      orbitalInclination: 0.042,
      info: {
        mass: "1.0241 × 10^26 kg",
        diameter: "49,244 km",
        dayLength: "16.1 hours",
        yearLength: "165 Earth years",
        description: "Neptune is the eighth planet from the Sun and the farthest known planet in the Solar System.",
        temperature: "-214°C (average)",
        moons: 14
      }
    }
  ]
};

// Function to calculate simulation date based on a specific year and date
export const calculatePlanetPositions = (year: number, month: number, day: number): number => {
  // Calculate position of planets based on the date
  // Using current date as base date
  const baseDate = new Date();
  const targetDate = new Date(year, month - 1, day);
  
  // Calculate days difference
  const timeDiff = targetDate.getTime() - baseDate.getTime();
  const daysDiff = timeDiff / (1000 * 3600 * 24);
  
  // Convert to simulation time units
  return daysDiff / 20; // Each simulation time unit represents 20 days
};

// Update simulation date for a given time
const updateSimulationDate = (elapsedTime: number): SimulationData['simulationDate'] => {
  // Start from current date
  const startDate = new Date();
  
  // Convert simulation time to days (1 time unit = 20 days)
  const elapsedDays = elapsedTime * 20;
  
  // Add elapsed days to start date
  const newDate = new Date(startDate);
  newDate.setDate(startDate.getDate() + elapsedDays);
  
  // Format the date
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
  // Fetch simulation data from the backend
  getSimulationData: async (): Promise<SimulationData> => {
    try {
      // In a real implementation, this would fetch data from the backend API
      // const response = await axios.get(`${API_BASE_URL}/simulation`);
      // return response.data;

      // For now, return mock data
      return Promise.resolve(mockSimulationData);
    } catch (error) {
      console.error('Failed to fetch simulation data:', error);
      throw error;
    }
  },

  // Update simulation parameters (time scale)
  updateSimulation: async (params: { timeScale: number }): Promise<void> => {
    try {
      // In a real implementation, this would update the simulation
      // await axios.post(`${API_BASE_URL}/simulation/settings`, params);
      
      // Mock success
      return Promise.resolve();
    } catch (error) {
      console.error('Failed to update simulation settings:', error);
      throw error;
    }
  },

  // Reset the simulation to its initial state
  resetSimulation: async (): Promise<void> => {
    try {
      // In a real implementation, this would reset the simulation
      // await axios.post(`${API_BASE_URL}/simulation/reset`);
      
      // Mock success
      return Promise.resolve();
    } catch (error) {
      console.error('Failed to reset simulation:', error);
      throw error;
    }
  },

  // Get current simulation date based on elapsed time
  getSimulationDate: (elapsedTime: number): SimulationData['simulationDate'] => {
    return updateSimulationDate(elapsedTime);
  },

  // Set simulation to a specific date
  setSimulationDate: (year: number, month: number, day: number): number => {
    return calculatePlanetPositions(year, month, day);
  }
};

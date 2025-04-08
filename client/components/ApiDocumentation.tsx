
import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronRight, Code, X } from 'lucide-react';

interface ApiDocumentationProps {
  isOpen: boolean;
  onClose: () => void;
}

const ApiDocumentation: React.FC<ApiDocumentationProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-xs z-50 overflow-auto animate-fade-in">
      <div className="max-w-3xl mx-auto bg-slate-900 rounded-lg mt-12 mb-12 border border-slate-700 overflow-hidden">
        <div className="p-4 border-b border-slate-700 bg-slate-800 flex justify-between items-center">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Code size={20} /> API Documentation
          </h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X size={20} />
          </Button>
        </div>

        <div className="p-6 space-y-8 overflow-auto max-h-[80vh]">
          <section className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Overview</h3>
            <p className="text-slate-300">
              This application connects to a Flask API that simulates the solar system. 
              The frontend visualizes the data provided by the backend.
            </p>
          </section>

          <section className="space-y-4">
            <h3 className="text-lg font-semibold text-white">API Endpoints</h3>
            
            <div className="space-y-6">
              <div className="border border-slate-700 rounded-md overflow-hidden">
                <div className="bg-slate-800 p-3 flex items-center">
                  <span className="px-2 py-1 bg-green-700 text-xs rounded-md mr-3">GET</span>
                  <code className="text-green-400">/api/solar-system/simulation</code>
                </div>
                <div className="p-4 bg-slate-900">
                  <p className="text-slate-300 mb-2">Returns the current state of the simulation, including the positions of all celestial bodies.</p>
                  <pre className="bg-slate-800 p-3 rounded-md overflow-auto text-xs text-slate-300">
{`{
  "timeScale": 1,
  "currentTime": 2345.67,
  "celestialBodies": [
    {
      "id": "sun",
      "name": "Sun",
      "position": [0, 0, 0],
      "rotation": 0,
      "radius": 2,
      "color": "#FDB813",
      "orbitalSpeed": 0,
      "orbitalDistance": 0,
      "orbitalInclination": 0,
      "info": {
        "mass": "1.989 × 10^30 kg",
        "diameter": "1,392,684 km",
        "dayLength": "27 Earth days",
        "yearLength": "N/A",
        "description": "The Sun is..."
      }
    },
    {
      "id": "earth",
      // Earth data...
    }
    // More planets...
  ]
}`}
                  </pre>
                </div>
              </div>

              <div className="border border-slate-700 rounded-md overflow-hidden">
                <div className="bg-slate-800 p-3 flex items-center">
                  <span className="px-2 py-1 bg-blue-700 text-xs rounded-md mr-3">POST</span>
                  <code className="text-blue-400">/api/solar-system/simulation/settings</code>
                </div>
                <div className="p-4 bg-slate-900">
                  <p className="text-slate-300 mb-2">Updates simulation parameters like time scale.</p>
                  <p className="text-slate-400 text-sm mb-2">Request Body:</p>
                  <pre className="bg-slate-800 p-3 rounded-md overflow-auto text-xs text-slate-300">
{`{
  "timeScale": 2.5
}`}
                  </pre>
                </div>
              </div>

              <div className="border border-slate-700 rounded-md overflow-hidden">
                <div className="bg-slate-800 p-3 flex items-center">
                  <span className="px-2 py-1 bg-blue-700 text-xs rounded-md mr-3">POST</span>
                  <code className="text-blue-400">/api/solar-system/simulation/reset</code>
                </div>
                <div className="p-4 bg-slate-900">
                  <p className="text-slate-300">Resets the simulation to its initial state.</p>
                </div>
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Integration Code Example</h3>
            <pre className="bg-slate-800 p-4 rounded-md overflow-auto text-xs text-slate-300">
{`import axios from 'axios';

const API_BASE_URL = 'https://your-flask-api.com/api';

export const fetchSimulationData = async () => {
  try {
    const response = await axios.get(
      \`\${API_BASE_URL}/solar-system/simulation\`
    );
    return response.data;
  } catch (error) {
    console.error('Failed to fetch simulation data:', error);
    throw error;
  }
};

export const updateSimulation = async (timeScale) => {
  try {
    await axios.post(
      \`\${API_BASE_URL}/solar-system/simulation/settings\`, 
      { timeScale }
    );
  } catch (error) {
    console.error('Failed to update simulation:', error);
    throw error;
  }
};

export const resetSimulation = async () => {
  try {
    await axios.post(\`\${API_BASE_URL}/solar-system/simulation/reset\`);
  } catch (error) {
    console.error('Failed to reset simulation:', error);
    throw error;
  }
};`}
            </pre>
          </section>

          <section className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Backend Implementation</h3>
            <p className="text-slate-300">
              The Python Flask backend implements physics-based gravitational simulations to calculate the positions 
              of celestial bodies over time. It handles:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-slate-300">
              <li>Orbital mechanics using Newton's law of universal gravitation</li>
              <li>Time-stepping for simulation advancement</li>
              <li>Conversion of simulation data to JSON responses</li>
              <li>Parameter adjustments through API endpoints</li>
            </ul>
          </section>
        </div>
        
        <div className="p-4 border-t border-slate-700 bg-slate-800 flex justify-between">
          <Button variant="ghost" onClick={onClose}>Close</Button>
          <Button variant="default" className="bg-accent hover:bg-accent/90">
            View Full Documentation <ChevronRight size={16} className="ml-1" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ApiDocumentation;

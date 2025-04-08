
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { PauseIcon, PlayIcon, RefreshCw, Info, Calendar, Clock, Globe, ChevronDown, ChevronUp } from 'lucide-react';
import { PlanetData, SimulationData, calculatePlanetPositions } from '../services/api';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ControlPanelProps {
  isPlaying: boolean;
  timeScale: number;
  selectedPlanet: PlanetData | null;
  simulationDate?: SimulationData['simulationDate'];
  onPlayToggle: () => void;
  onReset: () => void;
  onTimeScaleChange: (value: number) => void;
  onCloseInfo: () => void;
  onDateChange: (simulationTime: number) => void;
}

const ControlPanel: React.FC<ControlPanelProps> = ({
  isPlaying,
  timeScale,
  selectedPlanet,
  simulationDate,
  onPlayToggle,
  onReset,
  onTimeScaleChange,
  onCloseInfo,
  onDateChange
}) => {
  const [year, setYear] = useState<number>(2023);
  const [month, setMonth] = useState<number>(1);
  const [day, setDay] = useState<number>(1);
  const [isDateExpanded, setIsDateExpanded] = useState<boolean>(false);

  const handleDateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const simulationTime = calculatePlanetPositions(year, month, day);
    onDateChange(simulationTime);
  };

  return (
    <div className="control-panel fixed bottom-0 left-0 right-0 p-4 text-white z-10 bg-black/60 backdrop-blur-xs border-t border-slate-700/50 md:left-auto md:top-0 md:bottom-auto md:right-0 md:w-[350px] md:h-full md:overflow-y-auto md:border-t-0 md:border-l">
      
      {/* Time and date display */}
      {simulationDate && (
        <Card className="bg-slate-900/80 border-slate-700 text-white mb-4">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <CardTitle className="text-lg flex items-center gap-2">
                <Calendar size={16} />
                Simulation Time
              </CardTitle>
              <Button 
                variant="outline" 
                size="icon" 
                className="h-7 w-7 bg-slate-800 border-slate-700"
                onClick={() => setIsDateExpanded(!isDateExpanded)}
              >
                {isDateExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              </Button>
            </div>
            <CardDescription className="text-slate-300">
              {simulationDate.formattedDate}
            </CardDescription>
          </CardHeader>

          {isDateExpanded && (
            <CardContent>
              <form onSubmit={handleDateSubmit} className="grid grid-cols-4 gap-2">
                <div className="col-span-2">
                  <label htmlFor="year" className="text-xs text-slate-400 block mb-1">Year</label>
                  <input
                    id="year"
                    type="number"
                    className="bg-slate-800 border border-slate-700 rounded px-2 py-1 text-sm w-full"
                    placeholder="Year"
                    min="1900"
                    max="2200" 
                    value={year}
                    onChange={(e) => setYear(Math.max(1900, Math.min(2200, parseInt(e.target.value) || 2023)))}
                  />
                </div>
                <div>
                  <label htmlFor="month" className="text-xs text-slate-400 block mb-1">Month</label>
                  <input
                    id="month"
                    type="number"
                    className="bg-slate-800 border border-slate-700 rounded px-2 py-1 text-sm w-full"
                    placeholder="Month"
                    min="1"
                    max="12"
                    value={month}
                    onChange={(e) => setMonth(Math.max(1, Math.min(12, parseInt(e.target.value) || 1)))}
                  />
                </div>
                <div>
                  <label htmlFor="day" className="text-xs text-slate-400 block mb-1">Day</label>
                  <input
                    id="day"
                    type="number"
                    className="bg-slate-800 border border-slate-700 rounded px-2 py-1 text-sm w-full"
                    placeholder="Day"
                    min="1"
                    max="31"
                    value={day}
                    onChange={(e) => setDay(Math.max(1, Math.min(31, parseInt(e.target.value) || 1)))}
                  />
                </div>
                <Button 
                  type="submit" 
                  className="col-span-4 mt-2 bg-blue-600 hover:bg-blue-700 text-sm"
                  size="sm"
                >
                  Set Date
                </Button>
              </form>
            </CardContent>
          )}
        </Card>
      )}
      
      {/* Main controls - always visible */}
      <Card className="bg-slate-900/80 border-slate-700 text-white mb-4">
        <CardContent className="pt-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={onPlayToggle}
                className="bg-slate-800 hover:bg-slate-700 border-slate-600"
              >
                {isPlaying ? <PauseIcon size={18} /> : <PlayIcon size={18} />}
              </Button>
              
              <Button
                variant="outline"
                size="icon"
                onClick={onReset}
                className="bg-slate-800 hover:bg-slate-700 border-slate-600"
              >
                <RefreshCw size={18} />
              </Button>
            </div>
            
            <div className="flex items-center gap-2">
              <Clock size={16} className="text-slate-400" />
              <span className="text-sm font-mono bg-slate-800 px-2 py-1 rounded">
                {timeScale.toFixed(1)}x
              </span>
            </div>
          </div>
          
          <div className="mt-3">
            <label className="text-xs text-slate-400 block mb-1">Simulation Speed</label>
            <Slider 
              value={[timeScale]} 
              min={0.1} 
              max={20} // Increased max timeScale for much faster simulation
              step={0.1} 
              onValueChange={(values) => onTimeScaleChange(values[0])}
              className="mt-1"
            />
          </div>
        </CardContent>
      </Card>

      {/* Planet information panel */}
      {selectedPlanet && (
        <Card className="bg-slate-900/80 border-slate-700 text-white animate-fade-in">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <CardTitle className="text-lg flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: selectedPlanet.color }} 
                />
                {selectedPlanet.name}
              </CardTitle>
              <Button variant="ghost" size="icon" onClick={onCloseInfo} className="h-7 w-7">
                <span className="sr-only">Close</span>
                <span aria-hidden className="text-lg">×</span>
              </Button>
            </div>
            <CardDescription className="text-slate-300">
              {selectedPlanet.info.description}
            </CardDescription>
          </CardHeader>
          
          <CardContent className="pb-3">
            <Tabs defaultValue="physical" className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-slate-800">
                <TabsTrigger value="physical">Physical Data</TabsTrigger>
                <TabsTrigger value="orbital">Orbital Data</TabsTrigger>
              </TabsList>
              <TabsContent value="physical" className="pt-2">
                <Table>
                  <TableBody>
                    {selectedPlanet.info.mass && (
                      <TableRow>
                        <TableCell className="py-1 text-slate-400 text-xs">Mass</TableCell>
                        <TableCell className="py-1 font-mono text-sm">{selectedPlanet.info.mass}</TableCell>
                      </TableRow>
                    )}
                    {selectedPlanet.info.diameter && (
                      <TableRow>
                        <TableCell className="py-1 text-slate-400 text-xs">Diameter</TableCell>
                        <TableCell className="py-1 font-mono text-sm">{selectedPlanet.info.diameter}</TableCell>
                      </TableRow>
                    )}
                    {selectedPlanet.info.temperature && (
                      <TableRow>
                        <TableCell className="py-1 text-slate-400 text-xs">Temperature</TableCell>
                        <TableCell className="py-1 font-mono text-sm">{selectedPlanet.info.temperature}</TableCell>
                      </TableRow>
                    )}
                    {selectedPlanet.info.moons !== undefined && (
                      <TableRow>
                        <TableCell className="py-1 text-slate-400 text-xs">Moons</TableCell>
                        <TableCell className="py-1 font-mono text-sm">{selectedPlanet.info.moons}</TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TabsContent>
              <TabsContent value="orbital" className="pt-2">
                <Table>
                  <TableBody>
                    {selectedPlanet.info.dayLength && (
                      <TableRow>
                        <TableCell className="py-1 text-slate-400 text-xs">Day Length</TableCell>
                        <TableCell className="py-1 font-mono text-sm">{selectedPlanet.info.dayLength}</TableCell>
                      </TableRow>
                    )}
                    {selectedPlanet.info.yearLength && (
                      <TableRow>
                        <TableCell className="py-1 text-slate-400 text-xs">Year Length</TableCell>
                        <TableCell className="py-1 font-mono text-sm">{selectedPlanet.info.yearLength}</TableCell>
                      </TableRow>
                    )}
                    <TableRow>
                      <TableCell className="py-1 text-slate-400 text-xs">Orbital Distance</TableCell>
                      <TableCell className="py-1 font-mono text-sm">{selectedPlanet.orbitalDistance.toFixed(1)} AU</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="py-1 text-slate-400 text-xs">Orbital Speed</TableCell>
                      <TableCell className="py-1 font-mono text-sm">{selectedPlanet.orbitalSpeed.toFixed(4)} rad/s</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}

      {/* Footer note about API integration */}
      <div className="text-xs text-slate-400 mt-3 flex items-center bg-slate-800/50 p-2 rounded-md">
        <Info size={12} className="mr-1" />
        <span>Currently using mock data.</span>
      </div>
    </div>
  );
};

export default ControlPanel;

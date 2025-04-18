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
    <div className="control-panel fixed md:right-4 md:top-4 md:w-[350px] md:h-auto md:max-h-[calc(100vh-2rem)] md:overflow-y-auto bottom-0 right-0 p-4 z-10 pointer-events-none">
      <div className="space-y-4 pointer-events-auto">
        {/* Time and date display */}
        {simulationDate && (
          <Card className="bg-white/10 border-white/20 shadow-lg">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg flex items-center gap-2 text-white">
                  <Calendar size={16} />
                  Simulation Time
                </CardTitle>
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="h-7 w-7 bg-white/10 hover:bg-white/20 border-white/20"
                  onClick={() => setIsDateExpanded(!isDateExpanded)}
                >
                  {isDateExpanded ? <ChevronUp size={14} className="text-white" /> : <ChevronDown size={14} className="text-white" />}
                </Button>
              </div>
              <CardDescription className="text-gray-200">
                {simulationDate.formattedDate}
              </CardDescription>
            </CardHeader>

            {isDateExpanded && (
              <CardContent>
                <form onSubmit={handleDateSubmit} className="grid grid-cols-4 gap-2">
                  <div className="col-span-2">
                    <label htmlFor="year" className="text-sm text-gray-200 block mb-1">Year</label>
                    <input
                      id="year"
                      type="number"
                      className="bg-white/10 border border-white/20 rounded px-2 py-1 text-sm w-full text-white placeholder-gray-400"
                      placeholder="Year"
                      min="1900"
                      max="2200" 
                      value={year}
                      onChange={(e) => setYear(Math.max(1900, Math.min(2200, parseInt(e.target.value) || 2023)))}
                    />
                  </div>
                  <div>
                    <label htmlFor="month" className="text-sm text-gray-200 block mb-1">Month</label>
                    <input
                      id="month"
                      type="number"
                      className="bg-white/10 border border-white/20 rounded px-2 py-1 text-sm w-full text-white placeholder-gray-400"
                      placeholder="Month"
                      min="1"
                      max="12"
                      value={month}
                      onChange={(e) => setMonth(Math.max(1, Math.min(12, parseInt(e.target.value) || 1)))}
                    />
                  </div>
                  <div>
                    <label htmlFor="day" className="text-sm text-gray-200 block mb-1">Day</label>
                    <input
                      id="day"
                      type="number"
                      className="bg-white/10 border border-white/20 rounded px-2 py-1 text-sm w-full text-white placeholder-gray-400"
                      placeholder="Day"
                      min="1"
                      max="31"
                      value={day}
                      onChange={(e) => setDay(Math.max(1, Math.min(31, parseInt(e.target.value) || 1)))}
                    />
                  </div>
                  <Button 
                    type="submit" 
                    className="col-span-4 mt-2 bg-blue-500/80 hover:bg-blue-600/80 text-white text-sm"
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
        <Card className="bg-white/10 border-white/20 shadow-lg">
          <CardContent className="pt-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={onPlayToggle}
                  className="bg-white/10 hover:bg-white/20 border-white/20 text-white"
                >
                  {isPlaying ? <PauseIcon size={18} /> : <PlayIcon size={18} />}
                </Button>
                
                <Button
                  variant="outline"
                  size="icon"
                  onClick={onReset}
                  className="bg-white/10 hover:bg-white/20 border-white/20 text-white"
                >
                  <RefreshCw size={18} />
                </Button>
              </div>
              
              <div className="flex items-center gap-2">
                <Clock size={16} className="text-white" />
                <span className="text-sm font-mono bg-white/10 px-2 py-1 rounded text-white">
                  {timeScale.toFixed(1)}x
                </span>
              </div>
            </div>
            
            <div className="mt-3">
              <label className="text-sm text-gray-200 block mb-1">Simulation Speed</label>
              <Slider 
                value={[timeScale]} 
                min={0.1} 
                max={1000}
                step={0.1} 
                onValueChange={(values) => onTimeScaleChange(values[0])}
                className="mt-1"
              />
              <div className="text-xs text-gray-400 mt-1">
                {timeScale < 1 ? (
                  // Less than 1 day per second
                  `${timeScale.toFixed(1)} days per second`
                ) : timeScale < 30 ? (
                  // 1-30 days per second
                  `${timeScale.toFixed(1)} days per second (${(timeScale/365).toFixed(3)} years/sec)`
                ) : timeScale < 365 ? (
                  // 1-12 months per second
                  `${(timeScale/30).toFixed(1)} months per second (${(timeScale/365).toFixed(2)} years/sec)`
                ) : (
                  // Years per second
                  `${(timeScale/365).toFixed(1)} years per second`
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Planet information panel */}
        {selectedPlanet && (
          <Card className="bg-white/10 border-white/20 shadow-lg animate-fade-in">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg flex items-center gap-2 text-white">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: selectedPlanet.color }} 
                  />
                  {selectedPlanet.name}
                </CardTitle>
                <Button variant="ghost" size="icon" onClick={onCloseInfo} className="h-7 w-7 text-white hover:bg-white/20">
                  <span className="sr-only">Close</span>
                  <span aria-hidden className="text-lg">×</span>
                </Button>
              </div>
              <CardDescription className="text-gray-200">
                {selectedPlanet.info.description}
              </CardDescription>
            </CardHeader>
            
            <CardContent className="pb-3">
              <Tabs defaultValue="physical" className="w-full">
                <TabsList className="grid w-full grid-cols-2 bg-white/10">
                  <TabsTrigger value="physical" className="text-white data-[state=active]:bg-white/20">Physical Data</TabsTrigger>
                  <TabsTrigger value="orbital" className="text-white data-[state=active]:bg-white/20">Orbital Data</TabsTrigger>
                </TabsList>
                <TabsContent value="physical" className="pt-2">
                  <Table>
                    <TableBody>
                      {selectedPlanet.info.mass && (
                        <TableRow>
                          <TableCell className="py-1 text-gray-300 text-xs">Mass</TableCell>
                          <TableCell className="py-1 font-mono text-sm text-white">{selectedPlanet.info.mass}</TableCell>
                        </TableRow>
                      )}
                      {selectedPlanet.info.diameter && (
                        <TableRow>
                          <TableCell className="py-1 text-gray-300 text-xs">Diameter</TableCell>
                          <TableCell className="py-1 font-mono text-sm text-white">{selectedPlanet.info.diameter}</TableCell>
                        </TableRow>
                      )}
                      {selectedPlanet.info.temperature && (
                        <TableRow>
                          <TableCell className="py-1 text-gray-300 text-xs">Temperature</TableCell>
                          <TableCell className="py-1 font-mono text-sm text-white">{selectedPlanet.info.temperature}</TableCell>
                        </TableRow>
                      )}
                      {selectedPlanet.info.moons !== undefined && (
                        <TableRow>
                          <TableCell className="py-1 text-gray-300 text-xs">Moons</TableCell>
                          <TableCell className="py-1 font-mono text-sm text-white">{selectedPlanet.info.moons}</TableCell>
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
                          <TableCell className="py-1 text-gray-300 text-xs">Day Length</TableCell>
                          <TableCell className="py-1 font-mono text-sm text-white">{selectedPlanet.info.dayLength}</TableCell>
                        </TableRow>
                      )}
                      {selectedPlanet.info.yearLength && (
                        <TableRow>
                          <TableCell className="py-1 text-gray-300 text-xs">Year Length</TableCell>
                          <TableCell className="py-1 font-mono text-sm text-white">{selectedPlanet.info.yearLength}</TableCell>
                        </TableRow>
                      )}
                      <TableRow>
                        <TableCell className="py-1 text-gray-300 text-xs">Orbital Distance</TableCell>
                        <TableCell className="py-1 font-mono text-sm text-white">{selectedPlanet.orbitalDistance.toFixed(1)} AU</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="py-1 text-gray-300 text-xs">Orbital Speed</TableCell>
                        <TableCell className="py-1 font-mono text-sm text-white">{selectedPlanet.orbitalSpeed.toFixed(4)} rad/s</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default ControlPanel;

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { PauseIcon, PlayIcon, RefreshCw, Info, Calendar, Clock, Globe, ChevronDown, ChevronUp, X } from 'lucide-react';
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
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ScrollArea } from "@/components/ui/scroll-area";

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
          <Card className="p-4 space-y-4 bg-black/20 backdrop-blur-md border-zinc-800">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-semibold text-white">
                {selectedPlanet.name}
              </h3>
              <Button
                variant="ghost"
                size="icon"
                onClick={onCloseInfo}
                className="text-zinc-400 hover:text-white"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="details" className="border-zinc-800">
                <AccordionTrigger className="text-sm text-zinc-200 hover:text-white">
                  Details
                </AccordionTrigger>
                <AccordionContent className="text-sm space-y-2 text-zinc-300">
                  <p><span className="text-zinc-400">Mass:</span> {selectedPlanet.info.mass}</p>
                  <p><span className="text-zinc-400">Diameter:</span> {selectedPlanet.info.diameter}</p>
                  <p><span className="text-zinc-400">Day Length:</span> {selectedPlanet.info.dayLength}</p>
                  <p><span className="text-zinc-400">Year Length:</span> {selectedPlanet.info.yearLength}</p>
                  <p><span className="text-zinc-400">Temperature:</span> {selectedPlanet.info.temperature}</p>
                  {selectedPlanet.info.moons !== undefined && (
                    <p><span className="text-zinc-400">Moons:</span> {selectedPlanet.info.moons}</p>
                  )}
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="description" className="border-zinc-800">
                <AccordionTrigger className="text-sm text-zinc-200 hover:text-white">
                  Description
                </AccordionTrigger>
                <AccordionContent className="text-sm text-zinc-300">
                  {selectedPlanet.info.description}
                </AccordionContent>
              </AccordionItem>

              {selectedPlanet.id === 'earth' && selectedPlanet.info.perihelionDates && (
                <AccordionItem value="perihelion" className="border-zinc-800">
                  <AccordionTrigger className="text-sm text-zinc-200 hover:text-white">
                    Closest Approaches to Sun
                  </AccordionTrigger>
                  <AccordionContent>
                    <ScrollArea className="h-[200px] rounded-md">
                      <div className="space-y-2 p-2">
                        {selectedPlanet.info.perihelionDates.map((date, index) => {
                          const [month, day, year] = date.date
                            .replace(',', '')
                            .split(' ')
                            .filter(part => part.length > 0);
                          
                          const monthNum = new Date(`${month} 1, 2000`).getMonth() + 1;
                          const dayNum = parseInt(day);
                          const yearNum = parseInt(year);
                          
                          return (
                            <div 
                              key={index} 
                              className="text-sm text-zinc-300 border-b border-zinc-800 pb-2 cursor-pointer hover:bg-white/5 p-2 rounded transition-colors"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                const simulationTime = calculatePlanetPositions(yearNum, monthNum, dayNum);
                                onDateChange(simulationTime);
                              }}
                            >
                              <p className="font-medium">{date.date}</p>
                              <p className="text-zinc-400 text-xs">Distance: {date.distance}</p>
                              {date.description && (
                                <p className="text-zinc-400 text-xs mt-1 italic">{date.description}</p>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </ScrollArea>
                  </AccordionContent>
                </AccordionItem>
              )}
            </Accordion>
          </Card>
        )}
      </div>
    </div>
  );
};

export default ControlPanel;

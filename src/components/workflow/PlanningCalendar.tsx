
import React, { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Search, Filter, ChevronLeft, ChevronRight } from "lucide-react";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";

const teams = [
  { id: "1", name: "RA Eco Bat 1", color: "bg-blue-600" },
  { id: "2", name: "RA Eco Bat 2", color: "bg-green-500" },
  { id: "3", name: "RA Eco Bat 3", color: "bg-cyan-500" },
  { id: "4", name: "Service Technique", color: "bg-amber-500" },
  { id: "5", name: "Léo Certicasa", color: "bg-purple-500" },
  { id: "6", name: "Pit Certicasa", color: "bg-pink-500" },
];

export const PlanningCalendar = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [view, setView] = useState<"day" | "week" | "month">("week");

  const handlePreviousDay = () => {
    if (date) {
      const newDate = new Date(date);
      newDate.setDate(newDate.getDate() - 1);
      setDate(newDate);
    }
  };

  const handleNextDay = () => {
    if (date) {
      const newDate = new Date(date);
      newDate.setDate(newDate.getDate() + 1);
      setDate(newDate);
    }
  };

  const formatDateRange = (date?: Date) => {
    if (!date) return "";

    const start = new Date(date);
    // For week view, adjust to start of week (Monday)
    const day = start.getDay();
    const diff = start.getDate() - day + (day === 0 ? -6 : 1);
    start.setDate(diff);

    const end = new Date(start);
    end.setDate(end.getDate() + 6);

    const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long' };
    const startStr = start.toLocaleDateString('fr-FR', options);
    const endStr = end.toLocaleDateString('fr-FR', options);
    
    return `${startStr} - ${endStr} ${start.getFullYear()}`;
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex justify-between items-center mb-4 px-4">
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-semibold">Planning d'intervention</h2>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-white rounded-md border overflow-hidden">
            <Button 
              variant="ghost" 
              size="sm" 
              className={view === "day" ? "bg-primary/10" : ""}
              onClick={() => setView("day")}
            >
              Jour
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              className={view === "week" ? "bg-primary/10" : ""}
              onClick={() => setView("week")}
            >
              Semaine
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              className={view === "month" ? "bg-primary/10" : ""}
              onClick={() => setView("month")}
            >
              Mois
            </Button>
          </div>
          
          <Button variant="outline" size="sm">
            Aujourd'hui
          </Button>
        </div>
      </div>

      <div className="flex items-center justify-between mb-4 px-4">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={handlePreviousDay}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div className="font-medium">
            {formatDateRange(date)}
          </div>
          <Button variant="outline" size="icon" onClick={handleNextDay}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher..."
              className="pl-9 pr-4 w-64"
            />
          </div>
          
          <Select defaultValue="all">
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Toutes les équipes" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes les équipes</SelectItem>
              {teams.map(team => (
                <SelectItem key={team.id} value={team.id}>{team.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="flex-grow overflow-hidden mb-6">
        <ResizablePanelGroup direction="horizontal" className="h-full">
          <ResizablePanel defaultSize={15} minSize={10} maxSize={20} className="border-r">
            <div className="p-3">
              <h3 className="font-medium text-sm mb-2">Non assigné</h3>
              <div className="space-y-2">
                {/* Placeholder for unassigned events */}
                <div className="bg-gray-100 border rounded p-2 text-xs cursor-grab">
                  <div className="font-medium">Cliente A - Pose fenêtres</div>
                  <div>23/05, 9:00-12:00</div>
                </div>
                <div className="bg-gray-100 border rounded p-2 text-xs cursor-grab">
                  <div className="font-medium">Client B - SAV murs</div>
                  <div>24/05, 14:00-15:30</div>
                </div>
              </div>
            </div>
          </ResizablePanel>
          
          <ResizableHandle withHandle />
          
          <ResizablePanel defaultSize={85} className="overflow-auto">
            <div className="grid grid-cols-[64px_repeat(7,1fr)] h-full min-w-[800px]">
              {/* Time column */}
              <div className="border-r">
                {Array.from({ length: 11 }).map((_, i) => (
                  <div key={i} className="h-20 border-b relative">
                    <div className="absolute -top-3 left-2 text-xs text-gray-500">
                      {9 + i}:00
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Team columns */}
              {teams.map((team) => (
                <div key={team.id} className="border-r">
                  <div className="h-8 flex items-center justify-center bg-gray-50 border-b sticky top-0 z-10">
                    <span className="text-xs font-medium truncate px-2">{team.name}</span>
                  </div>
                  
                  {Array.from({ length: 11 }).map((_, i) => (
                    <div key={i} className="h-20 border-b relative hover:bg-gray-50/50">
                      {/* Placeholder for an event in this time slot */}
                      {team.id === "1" && i === 2 && (
                        <div className="absolute top-0 left-1 right-1 h-40 bg-blue-600 text-white rounded px-2 py-1 text-xs">
                          <div className="font-medium">37330 - Jonathan Calvo</div>
                          <div>11:00 - 15:00</div>
                          <div>Installation isolation</div>
                        </div>
                      )}
                      
                      {team.id === "2" && i === 5 && (
                        <div className="absolute top-0 left-1 right-1 h-20 bg-green-500 text-white rounded px-2 py-1 text-xs">
                          <div className="font-medium">42637 - Javier Pérez</div>
                          <div>14:00 - 16:00</div>
                          <div>Visite technique</div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  );
};

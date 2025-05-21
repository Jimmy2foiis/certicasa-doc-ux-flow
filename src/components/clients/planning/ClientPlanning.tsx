
import React from "react";
import { CalendarRange, Calendar, Clock, UserCheck, AlertTriangle, Check } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useNavigate } from "react-router-dom";

// Define the types for our planning items
export type PlanningStatus = "pending" | "completed" | "cancelled" | "in-progress";

export interface PlanningEvent {
  id: string;
  title: string;
  date: string; // ISO date string
  startTime: string;
  endTime: string;
  team: string;
  status: PlanningStatus;
  clientId?: string;
  notes?: string;
}

interface ClientPlanningProps {
  clientId: string;
  clientName: string;
  events?: PlanningEvent[];
}

const getStatusBadge = (status: PlanningStatus) => {
  switch (status) {
    case "pending":
      return <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-200">À venir</Badge>;
    case "completed":
      return <Badge variant="success" className="bg-green-100 text-green-800 border-green-200">Terminé</Badge>;
    case "cancelled":
      return <Badge className="bg-red-100 text-red-800 border-red-200">Annulé</Badge>;
    case "in-progress":
      return <Badge className="bg-blue-100 text-blue-800 border-blue-200">En cours</Badge>;
    default:
      return <Badge variant="outline">Inconnu</Badge>;
  }
};

const getStatusIcon = (status: PlanningStatus) => {
  switch (status) {
    case "pending":
      return <Clock className="h-4 w-4 text-amber-500" />;
    case "completed":
      return <Check className="h-4 w-4 text-green-500" />;
    case "cancelled":
      return <AlertTriangle className="h-4 w-4 text-red-500" />;
    case "in-progress":
      return <UserCheck className="h-4 w-4 text-blue-500" />;
    default:
      return <Clock className="h-4 w-4" />;
  }
};

// Sample data for demonstration
const sampleEvents: PlanningEvent[] = [
  {
    id: "1",
    title: "Installation fenêtres",
    date: "2025-05-22",
    startTime: "09:00",
    endTime: "12:00",
    team: "RA Eco Bat 1",
    status: "pending",
    notes: "Accès par le portail principal"
  },
  {
    id: "2",
    title: "Mesures et vérifications",
    date: "2025-05-20",
    startTime: "14:00",
    endTime: "16:00",
    team: "Service Technique",
    status: "completed",
    notes: "Client absent, clé sous le pot"
  },
  {
    id: "3",
    title: "SAV isolation murs",
    date: "2025-05-18",
    startTime: "10:00",
    endTime: "11:30",
    team: "RA Eco Bat 2",
    status: "cancelled",
    notes: "Client a annulé pour raisons personnelles"
  }
];

export const ClientPlanning = ({ clientId, clientName, events = sampleEvents }: ClientPlanningProps) => {
  const navigate = useNavigate();

  const sortedEvents = [...events].sort((a, b) => {
    // Sort by date first (newest to oldest)
    const dateComparison = new Date(b.date).getTime() - new Date(a.date).getTime();
    if (dateComparison !== 0) return dateComparison;
    
    // If same date, sort by start time
    return a.startTime.localeCompare(b.startTime);
  });

  const goToGlobalPlanning = () => {
    // Navigate to the global planning with this client pre-filtered
    navigate(`/workflow?clientId=${clientId}`);
  };

  const handleAddIntervention = () => {
    // Logic to add new intervention (would open a modal)
    console.log("Adding intervention for client:", clientId);
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(date);
  };

  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg font-medium flex items-center gap-2">
            <CalendarRange className="h-5 w-5 text-primary" />
            Planning des interventions
          </CardTitle>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={goToGlobalPlanning}>
              Voir dans Planning global
            </Button>
            <Button variant="default" size="sm" onClick={handleAddIntervention}>
              + Ajouter
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <ScrollArea className="h-[320px] pr-4">
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-[18px] top-0 bottom-0 w-0.5 bg-gray-200"></div>
            
            {/* Timeline events */}
            <div className="space-y-4">
              {sortedEvents.map((event) => (
                <div key={event.id} className="relative pl-10">
                  {/* Timeline dot */}
                  <div className="absolute left-0 top-1.5 h-4 w-4 rounded-full bg-white border-2 border-primary flex items-center justify-center">
                    {getStatusIcon(event.status)}
                  </div>
                  
                  {/* Event card */}
                  <div className="bg-white rounded-md border p-3 shadow-sm hover:shadow transition-shadow">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-medium text-sm">{event.title}</h4>
                        <div className="text-xs text-gray-500">
                          {formatDate(event.date)} • {event.startTime} - {event.endTime}
                        </div>
                      </div>
                      {getStatusBadge(event.status)}
                    </div>
                    
                    <div className="text-xs text-gray-600 mb-2">
                      <span className="font-medium">Équipe:</span> {event.team}
                    </div>
                    
                    {event.notes && (
                      <div className="text-xs text-gray-500 italic">
                        {event.notes}
                      </div>
                    )}
                    
                    <div className="mt-2 flex gap-2 justify-end">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-7 px-2">
                              <Calendar className="h-3.5 w-3.5" />
                              <span className="sr-only">Replanifier</span>
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Replanifier</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                      
                      <Button variant="outline" size="sm" className="h-7 px-2 text-xs">
                        Éditer
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

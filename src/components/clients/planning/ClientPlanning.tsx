
import React, { useState } from "react";
import { CalendarRange, Calendar, Clock, UserCheck, AlertTriangle, Check, ChevronLeft, ChevronRight, Filter, Plus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useNavigate } from "react-router-dom";

// Type du statut des événements
export type PlanningStatus = "pending" | "completed" | "cancelled" | "in-progress";

// Type d'intervention
export type InterventionType = "installation" | "sav" | "measure" | "visit" | "other";

// Type d'un événement de planning
export interface PlanningEvent {
  id: string;
  title: string;
  date: string; // ISO date string
  startTime: string;
  endTime: string;
  team: string;
  status: PlanningStatus;
  type: InterventionType;
  clientId?: string;
  notes?: string;
}

// Props du composant
interface ClientPlanningProps {
  clientId: string;
  clientName: string;
  events?: PlanningEvent[];
}

// Fonction pour obtenir un badge selon le statut
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

// Fonction pour obtenir une icône selon le statut
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

// Fonction pour obtenir une couleur selon le type d'intervention
const getTypeColor = (type: InterventionType) => {
  switch (type) {
    case "installation":
      return "bg-blue-600";
    case "sav":
      return "bg-amber-500";
    case "measure":
      return "bg-purple-500";
    case "visit":
      return "bg-green-500";
    default:
      return "bg-gray-500";
  }
};

// Fonction pour formater une date
const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  return new Intl.DateTimeFormat('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  }).format(date);
};

// Données d'exemple
const sampleEvents: PlanningEvent[] = [
  {
    id: "1",
    title: "Installation fenêtres",
    date: "2025-05-22",
    startTime: "09:00",
    endTime: "12:00",
    team: "RA Eco Bat 1",
    status: "pending",
    type: "installation",
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
    type: "measure",
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
    type: "sav",
    notes: "Client a annulé pour raisons personnelles"
  },
  {
    id: "4",
    title: "Visite commerciale",
    date: "2025-05-25",
    startTime: "15:00",
    endTime: "16:00",
    team: "Léo Certicasa",
    status: "pending",
    type: "visit",
    notes: "Rendez-vous confirmé par SMS"
  }
];

export const ClientPlanning = ({ clientId, clientName, events = sampleEvents }: ClientPlanningProps) => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");

  // Filtrer les événements
  const filteredEvents = events.filter(event => {
    const matchesSearch = !searchQuery || 
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.team.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (event.notes && event.notes.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesStatus = statusFilter === "all" || event.status === statusFilter;
    const matchesType = typeFilter === "all" || event.type === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  // Trier les événements par date (les plus récents en premier)
  const sortedEvents = [...filteredEvents].sort((a, b) => {
    // Trier d'abord par date (les plus récentes en premier)
    const dateComparison = new Date(a.date).getTime() - new Date(b.date).getTime();
    if (dateComparison !== 0) return dateComparison;
    
    // Si même date, trier par heure de début
    return a.startTime.localeCompare(b.startTime);
  });

  const goToGlobalPlanning = () => {
    // Naviguer vers le planning global avec ce client présélectionné
    navigate(`/workflow?clientId=${clientId}`);
  };

  const handleAddIntervention = () => {
    // Logique pour ajouter une nouvelle intervention (ouvrirait une modale)
    console.log("Ajout d'une intervention pour le client:", clientId);
  };

  const clearSearch = () => {
    setSearchQuery("");
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
              <Plus className="h-4 w-4 mr-1" />
              Ajouter
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="mb-4 flex gap-2 items-center">
          <div className="relative flex-1">
            <Input
              type="search"
              placeholder="Rechercher..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 w-full"
            />
            {searchQuery && (
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-1 top-1 h-7 w-7 p-0"
                onClick={clearSearch}
              >
                <ChevronLeft className="h-3 w-3" />
                <span className="sr-only">Effacer la recherche</span>
              </Button>
            )}
          </div>
          
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Statut" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les statuts</SelectItem>
              <SelectItem value="pending">À venir</SelectItem>
              <SelectItem value="in-progress">En cours</SelectItem>
              <SelectItem value="completed">Terminé</SelectItem>
              <SelectItem value="cancelled">Annulé</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les types</SelectItem>
              <SelectItem value="installation">Installation</SelectItem>
              <SelectItem value="sav">SAV</SelectItem>
              <SelectItem value="measure">Mesures</SelectItem>
              <SelectItem value="visit">Visite</SelectItem>
              <SelectItem value="other">Autre</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <ScrollArea className="h-[320px] pr-4">
          <div className="relative">
            {/* Ligne de la timeline */}
            <div className="absolute left-[18px] top-0 bottom-0 w-0.5 bg-gray-200"></div>
            
            {/* Événements de la timeline */}
            <div className="space-y-4">
              {sortedEvents.length === 0 ? (
                <div className="text-center py-10 text-gray-500">
                  Aucune intervention planifiée
                </div>
              ) : (
                sortedEvents.map((event) => (
                  <div key={event.id} className="relative pl-10">
                    {/* Point de la timeline */}
                    <div className="absolute left-0 top-1.5 h-4 w-4 rounded-full bg-white border-2 border-primary flex items-center justify-center">
                      {getStatusIcon(event.status)}
                    </div>
                    
                    {/* Carte d'événement */}
                    <div className="bg-white rounded-md border p-3 shadow-sm hover:shadow transition-shadow">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className={`w-2 h-2 rounded-full ${getTypeColor(event.type)}`}></span>
                            <h4 className="font-medium text-sm">{event.title}</h4>
                          </div>
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
                ))
              )}
            </div>
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

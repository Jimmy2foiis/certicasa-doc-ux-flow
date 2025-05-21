
import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { 
  Search, 
  Filter, 
  ChevronLeft, 
  ChevronRight, 
  Plus,
  Calendar as CalendarIcon,
  List,
  UserCheck
} from "lucide-react";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useNavigate, useLocation } from "react-router-dom";

// Types d'intervention
export type InterventionType = "installation" | "sav" | "measure" | "visit" | "other";

// Type d'événement pour le planning
export interface PlanningEvent {
  id: string;
  clientId: string;
  clientName: string;
  title: string;
  type: InterventionType;
  date: string;
  startTime: string;
  endTime: string;
  team: string;
  teamId: string;
  status: "pending" | "completed" | "cancelled" | "in-progress" | "unassigned";
  notes?: string;
}

// Données des équipes
const teams = [
  { id: "1", name: "RA Eco Bat 1", color: "bg-blue-600" },
  { id: "2", name: "RA Eco Bat 2", color: "bg-green-500" },
  { id: "3", name: "RA Eco Bat 3", color: "bg-cyan-500" },
  { id: "4", name: "Service Technique", color: "bg-amber-500" },
  { id: "5", name: "Léo Certicasa", color: "bg-purple-500" },
  { id: "6", name: "Pit Certicasa", color: "bg-pink-500" },
];

// Données d'exemple pour les événements
const sampleEvents: PlanningEvent[] = [
  {
    id: "1",
    clientId: "37330",
    clientName: "Jonathan Calvo",
    title: "Installation isolation",
    type: "installation",
    date: "2025-05-22",
    startTime: "11:00",
    endTime: "15:00",
    team: "RA Eco Bat 1",
    teamId: "1",
    status: "pending",
    notes: "Accès par le portail principal"
  },
  {
    id: "2",
    clientId: "42637",
    clientName: "Javier Pérez",
    title: "Visite technique",
    type: "visit",
    date: "2025-05-22",
    startTime: "14:00",
    endTime: "16:00",
    team: "RA Eco Bat 2",
    teamId: "2",
    status: "in-progress",
    notes: "Client prévenu par SMS"
  },
  {
    id: "3",
    clientId: "18475",
    clientName: "Marie Dupont",
    title: "SAV fenêtres",
    type: "sav",
    date: "2025-05-22",
    startTime: "09:00",
    endTime: "10:30",
    teamId: "",
    team: "",
    status: "unassigned",
    notes: "Urgent - à programmer rapidement"
  },
  {
    id: "4",
    clientId: "27965",
    clientName: "Carlos Rodriguez",
    title: "Mesures finales",
    type: "measure",
    date: "2025-05-22",
    startTime: "16:30",
    endTime: "18:00",
    teamId: "",
    team: "",
    status: "unassigned",
    notes: "Rendez-vous confirmé par téléphone"
  }
];

// Fonction utilitaire pour obtenir la couleur en fonction du type d'intervention
const getEventTypeColor = (type: InterventionType): string => {
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

// Fonction utilitaire pour formater une date
const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  return new Intl.DateTimeFormat('fr-FR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  }).format(date);
};

export const PlanningCalendar = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [view, setView] = useState<"day" | "week" | "month" | "list">("week");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedTeam, setSelectedTeam] = useState<string>("all");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [events, setEvents] = useState<PlanningEvent[]>(sampleEvents);
  const location = useLocation();
  const navigate = useNavigate();
  
  // Récupérer l'ID client du query param s'il existe
  const queryParams = new URLSearchParams(location.search);
  const clientIdParam = queryParams.get('clientId');

  // Filtrer les événements en fonction des critères de recherche
  const filteredEvents = events.filter(event => {
    // Filtre par recherche
    const matchesSearch = searchQuery === "" || 
      event.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.clientId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.title.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Filtre par équipe
    const matchesTeam = selectedTeam === "all" || event.teamId === selectedTeam;
    
    // Filtre par type
    const matchesType = selectedType === "all" || event.type === selectedType;
    
    // Filtre par client ID (si fourni via l'URL)
    const matchesClientId = !clientIdParam || event.clientId === clientIdParam;
    
    return matchesSearch && matchesTeam && matchesType && matchesClientId;
  });
  
  // Événements non assignés (pour la colonne de gauche)
  const unassignedEvents = filteredEvents.filter(event => event.status === "unassigned");
  
  // Événements assignés (pour le calendrier principal)
  const assignedEvents = filteredEvents.filter(event => event.status !== "unassigned");

  const handlePreviousDay = () => {
    if (date) {
      const newDate = new Date(date);
      if (view === "day") {
        newDate.setDate(newDate.getDate() - 1);
      } else if (view === "week") {
        newDate.setDate(newDate.getDate() - 7);
      } else {
        newDate.setMonth(newDate.getMonth() - 1);
      }
      setDate(newDate);
    }
  };

  const handleNextDay = () => {
    if (date) {
      const newDate = new Date(date);
      if (view === "day") {
        newDate.setDate(newDate.getDate() + 1);
      } else if (view === "week") {
        newDate.setDate(newDate.getDate() + 7);
      } else {
        newDate.setMonth(newDate.getMonth() + 1);
      }
      setDate(newDate);
    }
  };

  const handleToday = () => {
    setDate(new Date());
  };

  const formatDateRange = (date?: Date) => {
    if (!date) return "";

    if (view === "day") {
      return formatDate(date.toISOString().split('T')[0]);
    }
    
    if (view === "week") {
      const start = new Date(date);
      // Ajuster au début de la semaine (lundi)
      const day = start.getDay();
      const diff = start.getDate() - day + (day === 0 ? -6 : 1);
      start.setDate(diff);
  
      const end = new Date(start);
      end.setDate(end.getDate() + 6);
  
      const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long' };
      const startStr = start.toLocaleDateString('fr-FR', options);
      const endStr = end.toLocaleDateString('fr-FR', options);
      
      return `${startStr} - ${endStr} ${start.getFullYear()}`;
    }
    
    if (view === "month") {
      return new Intl.DateTimeFormat('fr-FR', { month: 'long', year: 'numeric' }).format(date);
    }
    
    return "";
  };
  
  const handleAddEvent = () => {
    // Logique pour ajouter un nouvel événement
    console.log("Ajouter un nouvel événement");
  };
  
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, eventId: string) => {
    e.dataTransfer.setData("text/plain", eventId);
  };
  
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };
  
  const handleDrop = (e: React.DragEvent<HTMLDivElement>, teamId: string, hour: number) => {
    e.preventDefault();
    const eventId = e.dataTransfer.getData("text/plain");
    
    // Mettre à jour l'événement avec la nouvelle équipe et l'heure
    setEvents(prevEvents => prevEvents.map(event => {
      if (event.id === eventId) {
        // Trouvez le nom de l'équipe correspondant à l'ID de l'équipe
        const team = teams.find(t => t.id === teamId);
        return {
          ...event,
          teamId,
          team: team ? team.name : "",
          status: teamId ? "pending" : "unassigned",
          startTime: `${9 + hour}:00`,
          endTime: `${10 + hour}:00`
        };
      }
      return event;
    }));
  };

  return (
    <div className="h-full flex flex-col">
      {/* En-tête avec titre et boutons de vue */}
      <div className="flex justify-between items-center mb-4 px-4">
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-semibold">Planning d'intervention</h2>
          {clientIdParam && (
            <Badge variant="outline" className="ml-2">
              Client #{clientIdParam}
            </Badge>
          )}
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
            <Button 
              variant="ghost" 
              size="sm"
              className={view === "list" ? "bg-primary/10" : ""}
              onClick={() => setView("list")}
            >
              <List className="h-4 w-4 mr-1" />
              Liste
            </Button>
          </div>
          
          <Button variant="outline" size="sm" onClick={handleToday}>
            Aujourd'hui
          </Button>
          
          <Button variant="default" size="sm" onClick={handleAddEvent}>
            <Plus className="h-4 w-4 mr-1" />
            Ajouter
          </Button>
        </div>
      </div>

      {/* Navigation de date et filtres */}
      <div className="flex items-center justify-between mb-4 px-4">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={handlePreviousDay}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div className="font-medium min-w-32 text-center">
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
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <Select 
            value={selectedTeam} 
            onValueChange={setSelectedTeam}
          >
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
          
          <Select 
            value={selectedType} 
            onValueChange={setSelectedType}
          >
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Tous les types" />
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
          
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Contenu principal avec panneaux redimensionnables */}
      <div className="flex-grow overflow-hidden mb-2">
        {view === "list" ? (
          <Card className="h-full overflow-auto">
            <div className="p-4">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="py-2 px-4 text-left font-medium">Date</th>
                    <th className="py-2 px-4 text-left font-medium">Client</th>
                    <th className="py-2 px-4 text-left font-medium">Type</th>
                    <th className="py-2 px-4 text-left font-medium">Horaire</th>
                    <th className="py-2 px-4 text-left font-medium">Équipe</th>
                    <th className="py-2 px-4 text-left font-medium">Statut</th>
                    <th className="py-2 px-4 text-left font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredEvents.map(event => (
                    <tr key={event.id} className="border-b hover:bg-gray-50">
                      <td className="py-2 px-4">{formatDate(event.date)}</td>
                      <td className="py-2 px-4">
                        <div className="font-medium">{event.clientName}</div>
                        <div className="text-xs text-gray-500">#{event.clientId}</div>
                      </td>
                      <td className="py-2 px-4">
                        <Badge 
                          className={`${getEventTypeColor(event.type)} text-white`}
                        >
                          {event.type === "installation" ? "Installation" :
                           event.type === "sav" ? "SAV" :
                           event.type === "measure" ? "Mesures" :
                           event.type === "visit" ? "Visite" : "Autre"}
                        </Badge>
                      </td>
                      <td className="py-2 px-4">{event.startTime} - {event.endTime}</td>
                      <td className="py-2 px-4">
                        {event.team || <Badge variant="outline">Non assigné</Badge>}
                      </td>
                      <td className="py-2 px-4">
                        {event.status === "pending" && <Badge className="bg-amber-100 text-amber-800 border-amber-200">À venir</Badge>}
                        {event.status === "completed" && <Badge className="bg-green-100 text-green-800 border-green-200">Terminé</Badge>}
                        {event.status === "cancelled" && <Badge className="bg-red-100 text-red-800 border-red-200">Annulé</Badge>}
                        {event.status === "in-progress" && <Badge className="bg-blue-100 text-blue-800 border-blue-200">En cours</Badge>}
                        {event.status === "unassigned" && <Badge className="bg-gray-100 text-gray-800 border-gray-200">Non assigné</Badge>}
                      </td>
                      <td className="py-2 px-4">
                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm">Éditer</Button>
                          <Button variant="ghost" size="sm" className="text-red-600">Annuler</Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        ) : (
          <ResizablePanelGroup direction="horizontal" className="h-full">
            {/* Panneau d'événements non assignés */}
            <ResizablePanel defaultSize={15} minSize={10} maxSize={30} className="border-r">
              <div className="flex flex-col h-full">
                <div className="p-3 border-b bg-gray-50">
                  <h3 className="font-medium text-sm flex items-center gap-1">
                    <UserCheck className="h-4 w-4 text-primary" />
                    Non assigné
                    <Badge variant="outline" className="ml-auto">{unassignedEvents.length}</Badge>
                  </h3>
                </div>
                <div className="p-3 overflow-auto flex-1">
                  <div className="space-y-2">
                    {unassignedEvents.map(event => (
                      <div 
                        key={event.id}
                        className="bg-white border rounded-md p-2 text-xs cursor-grab shadow-sm hover:shadow-md transition-shadow"
                        draggable
                        onDragStart={(e) => handleDragStart(e, event.id)}
                      >
                        <div className="font-medium flex items-center">
                          <span className={`w-2 h-2 rounded-full ${getEventTypeColor(event.type)} mr-1`}></span>
                          {event.title}
                        </div>
                        <div className="text-gray-500 mt-1">{event.clientId} - {event.clientName}</div>
                        <div className="mt-1">{formatDate(event.date)}, {event.startTime}-{event.endTime}</div>
                        {event.notes && (
                          <div className="mt-1 text-gray-500 italic text-xs">{event.notes}</div>
                        )}
                      </div>
                    ))}
                    
                    {unassignedEvents.length === 0 && (
                      <div className="text-center text-gray-500 py-4">
                        Aucun événement non assigné
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </ResizablePanel>
            
            <ResizableHandle withHandle />
            
            {/* Panneau principal du calendrier */}
            <ResizablePanel defaultSize={85} className="overflow-auto">
              <div className="grid grid-cols-[64px_repeat(6,1fr)] h-full min-w-[800px]">
                {/* Colonne des heures */}
                <div className="border-r">
                  <div className="h-8 bg-gray-50 border-b"></div> {/* En-tête vide pour l'alignement */}
                  
                  {Array.from({ length: 11 }).map((_, i) => (
                    <div key={i} className="h-20 border-b relative">
                      <div className="absolute -top-3 left-2 text-xs text-gray-500">
                        {9 + i}:00
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Colonnes des équipes */}
                {teams.map((team) => (
                  <div key={team.id} className="border-r">
                    <div className="h-8 flex items-center justify-center bg-gray-50 border-b sticky top-0 z-10">
                      <div className="flex items-center gap-1">
                        <div className={`w-2 h-2 rounded-full ${team.color}`}></div>
                        <span className="text-xs font-medium truncate px-2">{team.name}</span>
                      </div>
                    </div>
                    
                    {Array.from({ length: 11 }).map((_, i) => (
                      <div 
                        key={i} 
                        className="h-20 border-b relative hover:bg-gray-50/50"
                        onDragOver={handleDragOver}
                        onDrop={(e) => handleDrop(e, team.id, i)}
                      >
                        {/* Événements assignés à cette équipe et à cette heure */}
                        {assignedEvents
                          .filter(event => 
                            event.teamId === team.id && 
                            parseInt(event.startTime.split(':')[0]) <= (9 + i) && 
                            parseInt(event.endTime.split(':')[0]) > (9 + i)
                          )
                          .map(event => {
                            // Calcul de la hauteur de l'événement en fonction de sa durée
                            const startHour = parseInt(event.startTime.split(':')[0]);
                            const endHour = parseInt(event.endTime.split(':')[0]);
                            const startMinutes = parseInt(event.startTime.split(':')[1] || "0");
                            const endMinutes = parseInt(event.endTime.split(':')[1] || "0");
                            
                            const startPosition = (startHour - 9) * 80 + (startMinutes / 60) * 80;
                            const duration = ((endHour - startHour) * 60 + (endMinutes - startMinutes)) / 60 * 80;
                            
                            // N'afficher l'événement que s'il commence dans cette tranche horaire
                            if (startHour === 9 + i || (startHour < 9 + i && i === 0)) {
                              return (
                                <div 
                                  key={event.id}
                                  className={`absolute left-1 right-1 ${getEventTypeColor(event.type)} text-white rounded-md px-2 py-1 text-xs overflow-hidden cursor-pointer`}
                                  style={{ 
                                    top: `${(startHour === 9 + i) ? 0 : startPosition}px`, 
                                    height: `${duration}px`,
                                    minHeight: "20px"
                                  }}
                                  draggable
                                  onDragStart={(e) => handleDragStart(e, event.id)}
                                >
                                  <div className="font-medium">{event.clientId} - {event.clientName}</div>
                                  <div>{event.startTime} - {event.endTime}</div>
                                  <div className="text-white/90 truncate">{event.title}</div>
                                </div>
                              );
                            }
                            return null;
                          })}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>
        )}
      </div>
    </div>
  );
};

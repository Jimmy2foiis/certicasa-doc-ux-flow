
import { InterventionType, PlanningEvent } from "../types/planningTypes";

// Function to get event type color
export const getEventTypeColor = (type: InterventionType): string => {
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

// Function to format a date
export const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  return new Intl.DateTimeFormat('fr-FR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  }).format(date);
};

// Format date range based on view type
export const formatDateRange = (date?: Date, view?: "day" | "week" | "month" | "list") => {
  if (!date) return "";

  if (view === "day") {
    return formatDate(date.toISOString().split('T')[0]);
  }
  
  if (view === "week") {
    const start = new Date(date);
    // Adjust to start of week (Monday)
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

// Filter events based on search criteria
export const filterEvents = (
  events: PlanningEvent[],
  searchQuery: string,
  selectedTeam: string,
  selectedType: string,
  clientIdParam: string | null
) => {
  return events.filter(event => {
    // Filter by search
    const matchesSearch = searchQuery === "" || 
      event.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.clientId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.title.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Filter by team
    const matchesTeam = selectedTeam === "all" || event.teamId === selectedTeam;
    
    // Filter by type
    const matchesType = selectedType === "all" || event.type === selectedType;
    
    // Filter by client ID (if provided via the URL)
    const matchesClientId = !clientIdParam || event.clientId === clientIdParam;
    
    return matchesSearch && matchesTeam && matchesType && matchesClientId;
  });
};

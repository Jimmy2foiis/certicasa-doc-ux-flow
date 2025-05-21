
import { useState } from "react";
import { PlanningEvent } from "@/components/workflow/types/planningTypes";
import { useNavigate } from "react-router-dom";

export const useClientPlanning = (clientId: string, initialEvents: PlanningEvent[]) => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");

  // Filter events based on search query and filters
  const filteredEvents = initialEvents.filter(event => {
    const matchesSearch = !searchQuery || 
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.team.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (event.notes && event.notes.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesStatus = statusFilter === "all" || event.status === statusFilter;
    const matchesType = typeFilter === "all" || event.type === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  // Sort events by date and time
  const sortedEvents = [...filteredEvents].sort((a, b) => {
    // Sort by date (more recent first)
    const dateComparison = new Date(a.date).getTime() - new Date(b.date).getTime();
    if (dateComparison !== 0) return dateComparison;
    
    // If same date, sort by start time
    return a.startTime.localeCompare(b.startTime);
  });

  // Navigate to global planning with this client preselected
  const goToGlobalPlanning = () => {
    navigate(`/workflow?clientId=${clientId}`);
  };

  // Handle adding a new intervention (would open a modal)
  const handleAddIntervention = () => {
    console.log("Ajout d'une intervention pour le client:", clientId);
  };

  // Clear search query
  const clearSearch = () => {
    setSearchQuery("");
  };

  return {
    searchQuery,
    setSearchQuery,
    statusFilter, 
    setStatusFilter,
    typeFilter,
    setTypeFilter,
    sortedEvents,
    goToGlobalPlanning,
    handleAddIntervention,
    clearSearch
  };
};


import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ClientPlanningProps } from "./types";
import { sampleEvents } from "./data/sampleEvents";
import { useClientPlanning } from "./hooks/useClientPlanning";
import PlanningHeader from "./components/PlanningHeader";
import EventFilters from "./components/EventFilters";
import EventsList from "./components/EventsList";

export const ClientPlanning: React.FC<ClientPlanningProps> = ({ 
  clientId, 
  clientName, 
  events = sampleEvents 
}) => {
  const {
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    typeFilter,
    setTypeFilter,
    sortedEvents,
    handleAddIntervention,
    clearSearch
  } = useClientPlanning(clientId, events);

  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-3">
        <PlanningHeader 
          clientId={clientId} 
          handleAddIntervention={handleAddIntervention} 
        />
      </CardHeader>

      <CardContent>
        <EventFilters
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          typeFilter={typeFilter}
          setTypeFilter={setTypeFilter}
          clearSearch={clearSearch}
        />
        
        <ScrollArea className="h-[320px] pr-4">
          <EventsList events={sortedEvents} />
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

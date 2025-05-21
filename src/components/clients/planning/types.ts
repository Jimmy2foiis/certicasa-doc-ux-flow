
import { PlanningEvent, InterventionType, PlanningStatus } from "@/components/workflow/types/planningTypes";

// Props for ClientPlanning component
export interface ClientPlanningProps {
  clientId: string;
  clientName: string;
  events?: PlanningEvent[];
}

// Props for TimelineEvent component
export interface TimelineEventProps {
  event: PlanningEvent;
}

// Props for EventFilters component
export interface EventFiltersProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  statusFilter: string;
  setStatusFilter: (status: string) => void;
  typeFilter: string;
  setTypeFilter: (type: string) => void;
  clearSearch: () => void;
}

// Props for PlanningHeader component
export interface PlanningHeaderProps {
  clientId: string;
  handleAddIntervention: () => void;
}

// Props for the EventsList component
export interface EventsListProps {
  events: PlanningEvent[];
}

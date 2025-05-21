
// Types of intervention
export type InterventionType = "installation" | "sav" | "measure" | "visit" | "other";

// Type for planning events
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

// Team data type
export interface Team {
  id: string;
  name: string;
  color: string;
}

// Props for the main PlanningCalendar component
export interface PlanningCalendarProps {
  initialDate?: Date;
  initialView?: "day" | "week" | "month" | "list";
  clientId?: string;
}

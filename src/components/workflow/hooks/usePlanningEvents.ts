
import { useState } from "react";
import { PlanningEvent } from "../types/planningTypes";
import { sampleEvents, teams } from "../data/sampleData";

export const usePlanningEvents = (initialEvents = sampleEvents) => {
  const [events, setEvents] = useState<PlanningEvent[]>(initialEvents);
  
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, eventId: string) => {
    e.dataTransfer.setData("text/plain", eventId);
  };
  
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };
  
  const handleDrop = (e: React.DragEvent<HTMLDivElement>, teamId: string, hour: number) => {
    e.preventDefault();
    const eventId = e.dataTransfer.getData("text/plain");
    
    // Update the event with the new team and time
    setEvents(prevEvents => prevEvents.map(event => {
      if (event.id === eventId) {
        // Find the team name corresponding to the team ID
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
  
  const handleAddEvent = () => {
    // Logic to add a new event
    console.log("Add a new event");
  };
  
  return {
    events,
    setEvents,
    handleDragStart,
    handleDragOver,
    handleDrop,
    handleAddEvent
  };
};

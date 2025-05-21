
import React from "react";
import { Badge } from "@/components/ui/badge";
import { UserCheck } from "lucide-react";
import { PlanningEvent } from "../../types/planningTypes";
import { getEventTypeColor, formatDate } from "../../utils/planningUtils";

interface UnassignedEventsPanelProps {
  unassignedEvents: PlanningEvent[];
  handleDragStart: (e: React.DragEvent<HTMLDivElement>, eventId: string) => void;
}

const UnassignedEventsPanel = ({ unassignedEvents, handleDragStart }: UnassignedEventsPanelProps) => {
  return (
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
  );
};

export default UnassignedEventsPanel;

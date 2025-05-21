
import React from "react";
import { PlanningEvent } from "../types/planningTypes";
import { teams } from "../data/sampleData";
import { getEventTypeColor } from "../utils/planningUtils";

interface TeamCalendarViewProps {
  assignedEvents: PlanningEvent[];
  handleDragStart: (e: React.DragEvent<HTMLDivElement>, eventId: string) => void;
  handleDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
  handleDrop: (e: React.DragEvent<HTMLDivElement>, teamId: string, hour: number) => void;
}

const TeamCalendarView = ({
  assignedEvents,
  handleDragStart,
  handleDragOver,
  handleDrop
}: TeamCalendarViewProps) => {
  return (
    <div className="grid grid-cols-[64px_repeat(6,1fr)] h-full min-w-[800px]">
      {/* Hours column */}
      <div className="border-r">
        <div className="h-8 bg-gray-50 border-b"></div> {/* Empty header for alignment */}
        
        {Array.from({ length: 11 }).map((_, i) => (
          <div key={i} className="h-20 border-b relative">
            <div className="absolute -top-3 left-2 text-xs text-gray-500">
              {9 + i}:00
            </div>
          </div>
        ))}
      </div>
      
      {/* Team columns */}
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
              {/* Events assigned to this team at this hour */}
              {assignedEvents
                .filter(event => 
                  event.teamId === team.id && 
                  parseInt(event.startTime.split(':')[0]) <= (9 + i) && 
                  parseInt(event.endTime.split(':')[0]) > (9 + i)
                )
                .map(event => {
                  // Calculate event height based on duration
                  const startHour = parseInt(event.startTime.split(':')[0]);
                  const endHour = parseInt(event.endTime.split(':')[0]);
                  const startMinutes = parseInt(event.startTime.split(':')[1] || "0");
                  const endMinutes = parseInt(event.endTime.split(':')[1] || "0");
                  
                  const startPosition = (startHour - 9) * 80 + (startMinutes / 60) * 80;
                  const duration = ((endHour - startHour) * 60 + (endMinutes - startMinutes)) / 60 * 80;
                  
                  // Only show the event if it starts in this time slot
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
  );
};

export default TeamCalendarView;

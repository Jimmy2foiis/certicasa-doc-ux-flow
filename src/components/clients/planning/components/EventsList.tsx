
import React from "react";
import TimelineEvent from "./TimelineEvent";
import { EventsListProps } from "../types";

const EventsList: React.FC<EventsListProps> = ({ events }) => {
  return (
    <div className="relative">
      {/* Ligne de la timeline */}
      <div className="absolute left-[18px] top-0 bottom-0 w-0.5 bg-gray-200"></div>
      
      {/* Événements de la timeline */}
      <div className="space-y-4">
        {events.length === 0 ? (
          <div className="text-center py-10 text-gray-500">
            Aucune intervention planifiée
          </div>
        ) : (
          events.map((event) => (
            <TimelineEvent key={event.id} event={event} />
          ))
        )}
      </div>
    </div>
  );
};

export default EventsList;

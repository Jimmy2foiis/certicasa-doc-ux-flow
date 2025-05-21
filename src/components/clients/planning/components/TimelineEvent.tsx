
import React from "react";
import { Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { TimelineEventProps } from "../types";
import { getStatusBadge, getStatusIcon, getTypeColor } from "../utils/styleUtils";
import { formatDate } from "../utils/formatUtils";

const TimelineEvent: React.FC<TimelineEventProps> = ({ event }) => {
  return (
    <div className="relative pl-10">
      {/* Point de la timeline */}
      <div className="absolute left-0 top-1.5 h-4 w-4 rounded-full bg-white border-2 border-primary flex items-center justify-center">
        {getStatusIcon(event.status)}
      </div>
      
      {/* Carte d'événement */}
      <div className="bg-white rounded-md border p-3 shadow-sm hover:shadow transition-shadow">
        <div className="flex justify-between items-start mb-2">
          <div>
            <div className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${getTypeColor(event.type)}`}></span>
              <h4 className="font-medium text-sm">{event.title}</h4>
            </div>
            <div className="text-xs text-gray-500">
              {formatDate(event.date)} • {event.startTime} - {event.endTime}
            </div>
          </div>
          {getStatusBadge(event.status)}
        </div>
        
        <div className="text-xs text-gray-600 mb-2">
          <span className="font-medium">Équipe:</span> {event.team}
        </div>
        
        {event.notes && (
          <div className="text-xs text-gray-500 italic">
            {event.notes}
          </div>
        )}
        
        <div className="mt-2 flex gap-2 justify-end">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="sm" className="h-7 px-2">
                  <Calendar className="h-3.5 w-3.5" />
                  <span className="sr-only">Replanifier</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Replanifier</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <Button variant="outline" size="sm" className="h-7 px-2 text-xs">
            Éditer
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TimelineEvent;

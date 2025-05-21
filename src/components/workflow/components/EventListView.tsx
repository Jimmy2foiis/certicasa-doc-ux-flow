
import React from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PlanningEvent } from "../types/planningTypes";
import { formatDate, getEventTypeColor } from "../utils/planningUtils";

interface EventListViewProps {
  filteredEvents: PlanningEvent[];
}

const EventListView = ({ filteredEvents }: EventListViewProps) => {
  return (
    <Card className="h-full overflow-auto">
      <div className="p-4">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b">
              <th className="py-2 px-4 text-left font-medium">Date</th>
              <th className="py-2 px-4 text-left font-medium">Client</th>
              <th className="py-2 px-4 text-left font-medium">Type</th>
              <th className="py-2 px-4 text-left font-medium">Horaire</th>
              <th className="py-2 px-4 text-left font-medium">Équipe</th>
              <th className="py-2 px-4 text-left font-medium">Statut</th>
              <th className="py-2 px-4 text-left font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredEvents.map(event => (
              <tr key={event.id} className="border-b hover:bg-gray-50">
                <td className="py-2 px-4">{formatDate(event.date)}</td>
                <td className="py-2 px-4">
                  <div className="font-medium">{event.clientName}</div>
                  <div className="text-xs text-gray-500">#{event.clientId}</div>
                </td>
                <td className="py-2 px-4">
                  <Badge 
                    className={`${getEventTypeColor(event.type)} text-white`}
                  >
                    {event.type === "installation" ? "Installation" :
                     event.type === "sav" ? "SAV" :
                     event.type === "measure" ? "Mesures" :
                     event.type === "visit" ? "Visite" : "Autre"}
                  </Badge>
                </td>
                <td className="py-2 px-4">{event.startTime} - {event.endTime}</td>
                <td className="py-2 px-4">
                  {event.team || <Badge variant="outline">Non assigné</Badge>}
                </td>
                <td className="py-2 px-4">
                  {event.status === "pending" && <Badge className="bg-amber-100 text-amber-800 border-amber-200">À venir</Badge>}
                  {event.status === "completed" && <Badge className="bg-green-100 text-green-800 border-green-200">Terminé</Badge>}
                  {event.status === "cancelled" && <Badge className="bg-red-100 text-red-800 border-red-200">Annulé</Badge>}
                  {event.status === "in-progress" && <Badge className="bg-blue-100 text-blue-800 border-blue-200">En cours</Badge>}
                  {event.status === "unassigned" && <Badge className="bg-gray-100 text-gray-800 border-gray-200">Non assigné</Badge>}
                </td>
                <td className="py-2 px-4">
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm">Éditer</Button>
                    <Button variant="ghost" size="sm" className="text-red-600">Annuler</Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
};

export default EventListView;

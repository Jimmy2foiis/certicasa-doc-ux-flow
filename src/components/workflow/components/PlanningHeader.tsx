
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { List, Plus } from "lucide-react";

interface PlanningHeaderProps {
  clientIdParam: string | null;
  view: "day" | "week" | "month" | "list";
  setView: (view: "day" | "week" | "month" | "list") => void;
  handleToday: () => void;
  handleAddEvent: () => void;
}

const PlanningHeader = ({
  clientIdParam,
  view,
  setView,
  handleToday,
  handleAddEvent
}: PlanningHeaderProps) => {
  return (
    <div className="flex justify-between items-center mb-4 px-4">
      <div className="flex items-center gap-2">
        <h2 className="text-xl font-semibold">Planning d'intervention</h2>
        {clientIdParam && (
          <Badge variant="outline" className="ml-2">
            Client #{clientIdParam}
          </Badge>
        )}
      </div>
      
      <div className="flex items-center gap-3">
        <div className="flex items-center bg-white rounded-md border overflow-hidden">
          <Button 
            variant="ghost" 
            size="sm" 
            className={view === "day" ? "bg-primary/10" : ""}
            onClick={() => setView("day")}
          >
            Jour
          </Button>
          <Button 
            variant="ghost" 
            size="sm"
            className={view === "week" ? "bg-primary/10" : ""}
            onClick={() => setView("week")}
          >
            Semaine
          </Button>
          <Button 
            variant="ghost" 
            size="sm"
            className={view === "month" ? "bg-primary/10" : ""}
            onClick={() => setView("month")}
          >
            Mois
          </Button>
          <Button 
            variant="ghost" 
            size="sm"
            className={view === "list" ? "bg-primary/10" : ""}
            onClick={() => setView("list")}
          >
            <List className="h-4 w-4 mr-1" />
            Liste
          </Button>
        </div>
        
        <Button variant="outline" size="sm" onClick={handleToday}>
          Aujourd'hui
        </Button>
        
        <Button variant="default" size="sm" onClick={handleAddEvent}>
          <Plus className="h-4 w-4 mr-1" />
          Ajouter
        </Button>
      </div>
    </div>
  );
};

export default PlanningHeader;


import React from "react";
import { CalendarRange, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CardTitle } from "@/components/ui/card";
import { PlanningHeaderProps } from "../types";

const PlanningHeader: React.FC<PlanningHeaderProps> = ({ clientId, handleAddIntervention }) => {
  return (
    <div className="flex justify-between items-center">
      <CardTitle className="text-lg font-medium flex items-center gap-2">
        <CalendarRange className="h-5 w-5 text-primary" />
        Planning des interventions
      </CardTitle>
      <div className="flex gap-2">
        <Button variant="outline" size="sm" onClick={() => window.open(`/workflow?clientId=${clientId}`, '_blank')}>
          Voir dans Planning global
        </Button>
        <Button variant="default" size="sm" onClick={handleAddIntervention}>
          <Plus className="h-4 w-4 mr-1" />
          Ajouter
        </Button>
      </div>
    </div>
  );
};

export default PlanningHeader;

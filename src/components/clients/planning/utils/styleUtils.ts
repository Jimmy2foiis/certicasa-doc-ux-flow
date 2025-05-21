
import { PlanningStatus, InterventionType } from "@/components/workflow/types/planningTypes";
import { Badge } from "@/components/ui/badge";
import { Clock, Check, AlertTriangle, UserCheck } from "lucide-react";
import React from "react";

/**
 * Get a badge component based on the planning status
 */
export const getStatusBadge = (status: PlanningStatus) => {
  switch (status) {
    case "pending":
      return <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-200">À venir</Badge>;
    case "completed":
      return <Badge variant="success" className="bg-green-100 text-green-800 border-green-200">Terminé</Badge>;
    case "cancelled":
      return <Badge className="bg-red-100 text-red-800 border-red-200">Annulé</Badge>;
    case "in-progress":
      return <Badge className="bg-blue-100 text-blue-800 border-blue-200">En cours</Badge>;
    case "unassigned":
      return <Badge variant="outline" className="bg-gray-100 text-gray-800 border-gray-200">Non assigné</Badge>;
    default:
      return <Badge variant="outline">Inconnu</Badge>;
  }
};

/**
 * Get an icon component based on the planning status
 */
export const getStatusIcon = (status: PlanningStatus) => {
  switch (status) {
    case "pending":
      return <Clock className="h-4 w-4 text-amber-500" />;
    case "completed":
      return <Check className="h-4 w-4 text-green-500" />;
    case "cancelled":
      return <AlertTriangle className="h-4 w-4 text-red-500" />;
    case "in-progress":
      return <UserCheck className="h-4 w-4 text-blue-500" />;
    case "unassigned":
      return <Clock className="h-4 w-4 text-gray-500" />;
    default:
      return <Clock className="h-4 w-4" />;
  }
};

/**
 * Get a color class based on the intervention type
 */
export const getTypeColor = (type: InterventionType) => {
  switch (type) {
    case "installation":
      return "bg-blue-600";
    case "sav":
      return "bg-amber-500";
    case "measure":
      return "bg-purple-500";
    case "visit":
      return "bg-green-500";
    default:
      return "bg-gray-500";
  }
};

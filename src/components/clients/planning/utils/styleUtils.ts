
/**
 * This utility file provides consistent styling for planning components
 */

import { InterventionType, PlanningStatus } from "@/components/workflow/types/planningTypes";
import { AlertCircle, CheckCircle, Clock, XCircle } from "lucide-react";
import React from "react";

/**
 * Get background color based on event status
 */
export const getStatusColor = (status: PlanningStatus): string => {
  switch (status) {
    case "pending":
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    case "completed":
      return "bg-green-100 text-green-800 border-green-200";
    case "cancelled":
      return "bg-red-100 text-red-800 border-red-200";
    case "in-progress":
      return "bg-blue-100 text-blue-800 border-blue-200";
    case "unassigned":
      return "bg-gray-100 text-gray-800 border-gray-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

/**
 * Get badge component based on status
 */
export const getStatusBadge = (status: PlanningStatus): React.ReactNode => {
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getStatusColor(status)}`}>
      {formatStatus(status)}
    </span>
  );
};

/**
 * Get status icon based on status
 */
export const getStatusIcon = (status: PlanningStatus): React.ReactNode => {
  switch (status) {
    case "pending":
      return <Clock className="h-2.5 w-2.5 text-yellow-600" />;
    case "completed":
      return <CheckCircle className="h-2.5 w-2.5 text-green-600" />;
    case "cancelled":
      return <XCircle className="h-2.5 w-2.5 text-red-600" />;
    case "in-progress":
      return <Clock className="h-2.5 w-2.5 text-blue-600" />;
    case "unassigned":
      return <AlertCircle className="h-2.5 w-2.5 text-gray-600" />;
    default:
      return null;
  }
};

/**
 * Get icon and color based on intervention type
 */
export const getTypeDetails = (type: InterventionType): { icon: string; color: string } => {
  switch (type) {
    case "installation":
      return { icon: "tool", color: "text-blue-600" };
    case "sav":
      return { icon: "wrench", color: "text-amber-600" };
    case "measure":
      return { icon: "ruler", color: "text-violet-600" };
    case "visit":
      return { icon: "eye", color: "text-green-600" };
    case "other":
      return { icon: "clipboard", color: "text-gray-600" };
    default:
      return { icon: "calendar", color: "text-gray-600" };
  }
};

/**
 * Get color based on intervention type
 */
export const getTypeColor = (type: InterventionType): string => {
  switch (type) {
    case "installation":
      return "bg-blue-600";
    case "sav":
      return "bg-amber-600";
    case "measure":
      return "bg-violet-600";
    case "visit":
      return "bg-green-600";
    case "other":
      return "bg-gray-600";
    default:
      return "bg-gray-600";
  }
};

/**
 * Format status text for display
 */
export const formatStatus = (status: PlanningStatus): string => {
  const statusMap: Record<PlanningStatus, string> = {
    "pending": "En attente",
    "completed": "Terminé",
    "cancelled": "Annulé",
    "in-progress": "En cours",
    "unassigned": "Non assigné"
  };
  
  return statusMap[status] || status;
};

/**
 * Format intervention type for display
 */
export const formatType = (type: InterventionType): string => {
  const typeMap: Record<InterventionType, string> = {
    "installation": "Installation",
    "sav": "Service après-vente",
    "measure": "Prise de mesure",
    "visit": "Visite",
    "other": "Autre"
  };
  
  return typeMap[type] || type;
};

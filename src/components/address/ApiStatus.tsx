
import React from "react";
import { CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface ApiStatusProps {
  isLoading: boolean;
  apiAvailable: boolean;
  className?: string;
  message?: string;
}

/**
 * Composant qui affiche le statut de l'API Google Maps
 * Permet d'afficher des messages personnalisés pendant les étapes de géocodage
 */
export const ApiStatus = ({ 
  isLoading, 
  apiAvailable, 
  className,
  message 
}: ApiStatusProps) => {
  if (isLoading) {
    return (
      <div className={cn("flex items-center text-xs text-amber-600", className)}>
        <Loader2 className="h-3 w-3 mr-1 animate-spin" />
        <span>{message || "Chargement de l'API Google Maps..."}</span>
      </div>
    );
  }

  if (!apiAvailable) {
    return (
      <div className={cn("flex items-center text-xs text-red-600", className)}>
        <AlertCircle className="h-3 w-3 mr-1" />
        <span>API Google Maps non disponible. L'autocomplétion est désactivée.</span>
      </div>
    );
  }

  return (
    <div className={cn("flex items-center text-xs text-green-600", className)}>
      <CheckCircle className="h-3 w-3 mr-1" />
      <span>API Google Maps disponible. Autocomplétion activée.</span>
    </div>
  );
};

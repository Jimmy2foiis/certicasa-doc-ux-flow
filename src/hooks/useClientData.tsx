import { useEffect } from "react";
import { useClientInfo } from "./useClientInfo";
import { useClientCadastralData } from "./useClientCadastralData";
import { useSavedCalculations } from "./useSavedCalculations";
import { useCoordinates } from "./useCoordinates";
import { useToast } from "@/components/ui/use-toast";

export const useClientData = (clientId: string) => {
  const { toast } = useToast();
  
  // Utiliser les hooks spécialisés
  const {
    client,
    clientAddress,
    setClientAddress,
    projects,
    loadProjectsFromSupabase
  } = useClientInfo(clientId);
  
  const {
    coordinates,
    setClientCoordinates
  } = useCoordinates();
  
  const {
    savedCalculations,
    loadSavedCalculations
  } = useSavedCalculations(clientId);
  
  const {
    utmCoordinates,
    cadastralReference,
    climateZone,
    apiSource,
    loadingCadastral,
    cadastralError,
    refreshCadastralData
  } = useClientCadastralData(clientId, clientAddress, coordinates);

  // Afficher les erreurs cadastrales dans un toast
  useEffect(() => {
    if (cadastralError) {
      toast({
        title: "Erreur cadastrale",
        description: cadastralError,
        variant: "destructive",
        duration: 5000,
      });
    }
  }, [cadastralError, toast]);

  return {
    client,
    clientAddress,
    setClientAddress,
    coordinates,
    setClientCoordinates,
    projects,
    savedCalculations,
    loadSavedCalculations,
    utmCoordinates,
    cadastralReference,
    climateZone,
    apiSource,
    loadingCadastral,
    refreshCadastralData,
    loadProjectsFromSupabase
  };
};

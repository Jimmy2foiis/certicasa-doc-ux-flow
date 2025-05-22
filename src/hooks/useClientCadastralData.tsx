
import { useState, useCallback } from "react";
import { useCadastralData } from "@/hooks/useCadastralData";
import { GeoCoordinates } from "@/services/geoCoordinatesService";
import { useToast } from "@/components/ui/use-toast";
import { saveCadastralData } from "@/services/clientApiService";

export const useClientCadastralData = (clientId: string, clientAddress: string, coordinates?: GeoCoordinates) => {
  const { toast } = useToast();
  
  // Utiliser les coordonnées directes si disponibles (méthode recommandée pour plus de précision)
  const { 
    utmCoordinates, 
    cadastralReference, 
    climateZone, 
    apiSource,
    isLoading: loadingCadastral,
    error: cadastralError,
    refreshData: refreshCadastralData
  } = useCadastralData(
    clientAddress, 
    coordinates
  );

  // Fonction pour rafraîchir les données cadastrales et les sauvegarder dans localStorage
  const handleRefreshCadastralData = useCallback(async () => {
    try {
      await refreshCadastralData();
      
      // Sauvegarder les nouvelles données
      if (utmCoordinates || cadastralReference || climateZone) {
        const cadastralDataToSave = {
          clientId: clientId,
          utmCoordinates: utmCoordinates,
          cadastralReference: cadastralReference,
          climateZone: climateZone,
          apiSource: apiSource
        };
        
        const saved = await saveCadastralData(cadastralDataToSave);
        
        if (saved) {
          console.log("Données cadastrales sauvegardées:", cadastralDataToSave);
        }
      }
      
      toast({
        title: "Données cadastrales rafraîchies",
        description: "Les données cadastrales ont été mises à jour avec succès et sauvegardées.",
        duration: 3000,
      });
    } catch (error) {
      console.error("Erreur lors du rafraîchissement des données cadastrales:", error);
      toast({
        title: "Erreur",
        description: "Échec du rafraîchissement des données cadastrales.",
        variant: "destructive",
        duration: 5000,
      });
    }
  }, [refreshCadastralData, toast, clientId, utmCoordinates, cadastralReference, climateZone, apiSource]);

  return {
    utmCoordinates,
    cadastralReference,
    climateZone,
    apiSource,
    loadingCadastral,
    cadastralError,
    refreshCadastralData: handleRefreshCadastralData
  };
};

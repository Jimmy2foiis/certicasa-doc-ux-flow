
import { useState, useCallback } from "react";
import { useCadastralData } from "@/hooks/useCadastralData";
import { GeoCoordinates } from "@/services/geoCoordinatesService";
import { useToast } from "@/components/ui/use-toast";
import { saveCadastralData, CadastralData as SupabaseCadastralData } from "@/services/supabaseService";

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

  // Fonction pour rafraîchir les données cadastrales et les sauvegarder dans Supabase
  const handleRefreshCadastralData = useCallback(async () => {
    try {
      await refreshCadastralData();
      
      // Sauvegarder les nouvelles données dans Supabase
      if (utmCoordinates || cadastralReference || climateZone) {
        const cadastralDataToSave: SupabaseCadastralData = {
          client_id: clientId,
          utm_coordinates: utmCoordinates,
          cadastral_reference: cadastralReference,
          climate_zone: climateZone,
          api_source: apiSource
        };
        
        const savedData = await saveCadastralData(cadastralDataToSave);
        
        if (savedData) {
          console.log("Données cadastrales sauvegardées dans Supabase:", savedData);
        }
      }
      
      toast({
        title: "Données cadastrales rafraîchies",
        description: "Les données cadastrales ont été mises à jour avec succès et sauvegardées dans la base de données.",
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

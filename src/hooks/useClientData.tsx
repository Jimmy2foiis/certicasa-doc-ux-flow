import { useState, useEffect, useCallback } from "react";
import { clientsData } from "@/data/mock";
import { useCadastralData } from "@/hooks/useCadastralData";
import { GeoCoordinates } from "@/services/geoCoordinatesService";
import { useToast } from "@/components/ui/use-toast";

interface SavedCalculation {
  id: string;
  projectId: string;
  projectName: string;
  clientId: string;
  type: string;
  surface: number;
  date: string;
  improvement: number;
  calculationData: any;
}

// Clé pour le stockage local des calculs
const SAVED_CALCULATIONS_KEY = 'saved_calculations';

export const useClientData = (clientId: string) => {
  const { toast } = useToast();
  const client = clientsData.find(c => c.id === clientId);
  const [savedCalculations, setSavedCalculations] = useState<SavedCalculation[]>([]);
  
  // État pour stocker l'adresse du client actuelle
  const [clientAddress, setClientAddress] = useState(
    client ? (client as any).address || "Rue Serrano 120, 28006 Madrid" : ""
  );
  
  // État pour stocker les coordonnées (priorisées pour la récupération des données cadastrales)
  const [coordinates, setCoordinates] = useState<GeoCoordinates | undefined>(undefined);
  
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

  // Fonction pour récupérer les calculs sauvegardés du localStorage
  const loadSavedCalculations = useCallback(() => {
    try {
      const savedData = localStorage.getItem(SAVED_CALCULATIONS_KEY);
      if (savedData) {
        const allCalculations = JSON.parse(savedData) as SavedCalculation[];
        // Filtrer pour ne montrer que les calculs du client actuel
        const clientCalculations = allCalculations.filter(calc => calc.clientId === clientId);
        setSavedCalculations(clientCalculations);
      }
    } catch (error) {
      console.error("Erreur lors du chargement des calculs sauvegardés:", error);
    }
  }, [clientId]);
  
  // Mettre à jour les coordonnées (obtenues via Google Maps Geocoding API)
  const setClientCoordinates = useCallback((newCoordinates: GeoCoordinates) => {
    console.log("Mise à jour des coordonnées client:", newCoordinates);
    setCoordinates(newCoordinates);
  }, []);
  
  // Fonction pour rafraîchir les données cadastrales
  const handleRefreshCadastralData = useCallback(async () => {
    try {
      await refreshCadastralData();
      toast({
        title: "Données cadastrales rafraîchies",
        description: "Les données cadastrales ont été mises à jour avec succès.",
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
  }, [refreshCadastralData, toast]);

  // Charger les calculs sauvegardés au montage du composant
  useEffect(() => {
    loadSavedCalculations();
    
    // Initialiser l'adresse du client
    if (client) {
      setClientAddress((client as any).address || "Rue Serrano 120, 28006 Madrid");
    }
  }, [clientId, client, loadSavedCalculations]);

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
    savedCalculations,
    loadSavedCalculations,
    utmCoordinates,
    cadastralReference,
    climateZone,
    apiSource,
    loadingCadastral,
    refreshCadastralData: handleRefreshCadastralData
  };
};

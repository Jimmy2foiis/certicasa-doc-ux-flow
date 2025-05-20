
import { useState, useEffect } from "react";
import { clientsData } from "@/data/mock";
import { useCadastralData } from "@/hooks/useCadastralData";

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
  const client = clientsData.find(c => c.id === clientId);
  const [savedCalculations, setSavedCalculations] = useState<SavedCalculation[]>([]);
  
  // État pour stocker l'adresse du client actuelle
  const [clientAddress, setClientAddress] = useState(
    client ? (client as any).address || "Rue Serrano 120, 28006 Madrid" : ""
  );
  
  const { utmCoordinates, cadastralReference, climateZone, isLoading: loadingCadastral } = useCadastralData(clientAddress);

  // Fonction pour récupérer les calculs sauvegardés du localStorage
  const loadSavedCalculations = () => {
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
  };

  // Charger les calculs sauvegardés au montage du composant
  useEffect(() => {
    loadSavedCalculations();
    
    // Initialiser l'adresse du client
    if (client) {
      setClientAddress((client as any).address || "Rue Serrano 120, 28006 Madrid");
    }
  }, [clientId, client]);

  return {
    client,
    clientAddress,
    setClientAddress,
    savedCalculations,
    loadSavedCalculations,
    utmCoordinates,
    cadastralReference,
    climateZone,
    loadingCadastral
  };
};

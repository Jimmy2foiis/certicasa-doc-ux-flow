
import { useState, useEffect, useCallback } from "react";
import { useToast } from "@/components/ui/use-toast";
import { getCadastralDataForClient } from "@/services/api";
import { httpClient } from "@/services/api/httpClient";
import { useCalculationEventListener } from "./useCalculationEvents";

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

export const useSavedCalculations = (clientId: string) => {
  const { toast } = useToast();
  
  const [savedCalculations, setSavedCalculations] = useState<SavedCalculation[]>([]);
  const [loading, setLoading] = useState(true);

  const loadSavedCalculations = useCallback(async () => {
    try {
      setLoading(true);
      
      if (clientId.startsWith('local_')) {
        const localData = localStorage.getItem('saved_calculations');
        if (localData) {
          const allCalculations = JSON.parse(localData);
          const clientCalculations = allCalculations.filter((calc: any) => calc.clientId === clientId);
          setSavedCalculations(clientCalculations);
          console.log(`${clientCalculations.length} calculs trouvés pour le client ${clientId}`);
        } else {
          setSavedCalculations([]);
        }
        return;
      }
      
      try {
        const response = await httpClient.get<any[]>(`/prospects/${clientId}/calculations`);
        
        if (response.success && response.data) {
          const formattedCalculations: SavedCalculation[] = response.data.map(calc => {
            return {
              id: calc.id || '',
              projectId: calc.project_id || '',
              projectName: calc.project_name || 'Projet sans nom',
              clientId: calc.client_id || '',
              type: calc.type || '',
              surface: calc.surface_area || 0,
              date: new Date(calc.created_at).toLocaleDateString('fr-FR'),
              improvement: calc.improvement_percent || 0,
              calculationData: calc.calculation_data || {}
            };
          });
          
          setSavedCalculations(formattedCalculations);
        } else {
          useLocalStorage();
        }
      } catch (error) {
        console.error("Erreur lors du chargement des calculs sauvegardés depuis l'API:", error);
        useLocalStorage();
      }
    } catch (error) {
      console.error("Erreur lors du chargement des calculs sauvegardés:", error);
      useLocalStorage();
    } finally {
      setLoading(false);
    }
  }, [clientId]);

  const useLocalStorage = () => {
    try {
      const localData = localStorage.getItem('saved_calculations');
      if (localData) {
        const allCalculations = JSON.parse(localData);
        const clientCalculations = allCalculations.filter((calc: any) => calc.clientId === clientId);
        setSavedCalculations(clientCalculations);
        console.log(`${clientCalculations.length} calculs trouvés localement pour le client ${clientId}`);
      }
    } catch (e) {
      console.error("Impossible de récupérer les données locales:", e);
    }
  };

  // Listen to calculation events for real-time updates
  useCalculationEventListener(
    () => {
      console.log("Événement calcul détecté, rechargement...");
      loadSavedCalculations();
    },
    () => {
      loadSavedCalculations();
    },
    () => {
      loadSavedCalculations();
    }
  );

  useEffect(() => {
    loadSavedCalculations();
    
    const loadCadastralData = async () => {
      try {
        const cadastralData = await getCadastralDataForClient(clientId);
        if (cadastralData) {
          console.log("Données cadastrales chargées:", cadastralData);
        }
      } catch (error) {
        console.error("Erreur lors du chargement des données cadastrales:", error);
      }
    };
    
    loadCadastralData();
  }, [clientId, loadSavedCalculations]);

  return {
    savedCalculations,
    loading,
    loadSavedCalculations
  };
};

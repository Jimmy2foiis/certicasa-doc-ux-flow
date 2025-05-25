
import { useState, useEffect, useCallback } from "react";
import { useToast } from "@/components/ui/use-toast";
import { getCadastralDataForClient } from "@/services/api";
import { httpClient } from "@/services/api/httpClient";
import { getCalculationsForClient } from "@/services/api/calculationService";
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

// Type pour les calculs stockés localement (différent du type API)
interface LocalStorageCalculation {
  id?: string;
  project_id?: string;
  project_name?: string;
  client_id?: string;
  client_name?: string;
  type?: string;
  surface_area?: number;
  surface?: number;
  improvement_percent?: number;
  improvement?: number;
  calculation_data?: any;
  calculationData?: any;
  created_at?: string;
  saved_at?: string;
}

export const useSavedCalculations = (clientId: string) => {
  const { toast } = useToast();
  
  const [savedCalculations, setSavedCalculations] = useState<SavedCalculation[]>([]);
  const [loading, setLoading] = useState(true);

  const loadSavedCalculations = useCallback(async () => {
    try {
      setLoading(true);
      console.log('🔍 Chargement des calculs pour le client:', clientId);
      
      // Récupérer depuis localStorage directement
      const savedData = localStorage.getItem('saved_calculations');
      let localCalculations: LocalStorageCalculation[] = [];
      
      if (savedData) {
        try {
          const allCalculations = JSON.parse(savedData);
          localCalculations = Array.isArray(allCalculations) ? allCalculations : [];
        } catch (parseError) {
          console.error('Erreur parsing localStorage:', parseError);
          localCalculations = [];
        }
      }

      // Filtrer les calculs pour ce client
      const clientCalculations = localCalculations.filter((calc: LocalStorageCalculation) => 
        calc.client_id === clientId || (calc as any).clientId === clientId
      );
      
      // Formater les données pour l'affichage
      const formattedCalculations: SavedCalculation[] = clientCalculations.map(calc => {
        return {
          id: calc.id || `calc_${Date.now()}`,
          projectId: calc.project_id || `project_${Date.now()}`,
          projectName: calc.project_name || (calc as any).projectName || 'Projet sans nom',
          clientId: calc.client_id || (calc as any).clientId || clientId,
          type: calc.type || 'RES010',
          surface: calc.surface_area || calc.surface || 0,
          date: calc.created_at ? new Date(calc.created_at).toLocaleDateString('fr-FR') : 
                calc.saved_at ? new Date(calc.saved_at).toLocaleDateString('fr-FR') : 
                new Date().toLocaleDateString('fr-FR'),
          improvement: calc.improvement_percent || calc.improvement || 0,
          calculationData: calc.calculation_data || calc.calculationData || {}
        };
      });
      
      setSavedCalculations(formattedCalculations);
      console.log(`✅ ${formattedCalculations.length} calculs chargés pour le client ${clientId}`);
      
    } catch (error) {
      console.error("❌ Erreur lors du chargement des calculs sauvegardés:", error);
      setSavedCalculations([]);
    } finally {
      setLoading(false);
    }
  }, [clientId]);

  // Listen to calculation events for real-time updates
  useCalculationEventListener(
    () => {
      console.log("📡 Événement calcul détecté, rechargement...");
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
    if (clientId) {
      loadSavedCalculations();
    }
    
    // Charger les données cadastrales en parallèle
    const loadCadastralData = async () => {
      try {
        const cadastralData = await getCadastralDataForClient(clientId);
        if (cadastralData) {
          console.log("🗺️ Données cadastrales chargées:", cadastralData);
        }
      } catch (error) {
        console.error("❌ Erreur lors du chargement des données cadastrales:", error);
      }
    };
    
    if (clientId) {
      loadCadastralData();
    }
  }, [clientId, loadSavedCalculations]);

  return {
    savedCalculations,
    loading,
    loadSavedCalculations
  };
};

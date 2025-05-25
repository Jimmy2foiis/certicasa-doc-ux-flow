
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

export const useSavedCalculations = (clientId: string) => {
  const { toast } = useToast();
  
  const [savedCalculations, setSavedCalculations] = useState<SavedCalculation[]>([]);
  const [loading, setLoading] = useState(true);

  const loadSavedCalculations = useCallback(async () => {
    try {
      setLoading(true);
      console.log('🔍 Chargement des calculs pour le client:', clientId);
      
      // Utiliser la nouvelle fonction de service
      const calculations = await getCalculationsForClient(clientId);
      
      // Formater les données pour l'affichage
      const formattedCalculations: SavedCalculation[] = calculations.map(calc => {
        return {
          id: calc.id || '',
          projectId: calc.project_id || '',
          projectName: calc.project_name || calc.projectName || 'Projet sans nom',
          clientId: calc.client_id || calc.clientId || '',
          type: calc.type || '',
          surface: calc.surface_area || calc.surface || 0,
          date: calc.created_at ? new Date(calc.created_at).toLocaleDateString('fr-FR') : new Date().toLocaleDateString('fr-FR'),
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

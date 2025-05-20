
import { useState, useEffect, useCallback } from "react";
import { useToast } from "@/components/ui/use-toast";
import { getCadastralDataForClient } from "@/services/supabaseService";

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

// Clé pour le stockage local des calculs (utilisé pendant la transition)
const SAVED_CALCULATIONS_KEY = 'saved_calculations';

export const useSavedCalculations = (clientId: string) => {
  const { toast } = useToast();
  
  // État pour stocker les calculs sauvegardés (temporaire, à remplacer par Supabase)
  const [savedCalculations, setSavedCalculations] = useState<SavedCalculation[]>([]);

  // Fonction pour récupérer les calculs sauvegardés du localStorage
  const loadSavedCalculations = useCallback(() => {
    try {
      // Note: Dans une future version, cette fonction devrait être adaptée pour utiliser Supabase
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

  // Charger les calculs sauvegardés et les données cadastrales au montage du composant
  useEffect(() => {
    loadSavedCalculations();
    
    // Récupérer les données cadastrales existantes
    const loadCadastralData = async () => {
      try {
        const supabaseData = await getCadastralDataForClient(clientId);
        if (supabaseData) {
          console.log("Données cadastrales chargées depuis Supabase:", supabaseData);
        }
      } catch (error) {
        console.error("Erreur lors du chargement des données cadastrales depuis Supabase:", error);
      }
    };
    
    loadCadastralData();
  }, [clientId, loadSavedCalculations]);

  return {
    savedCalculations,
    loadSavedCalculations
  };
};

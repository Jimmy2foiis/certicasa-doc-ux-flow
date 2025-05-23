
import { useState, useEffect, useCallback } from "react";
import { useToast } from "@/components/ui/use-toast";
import { getCadastralDataForClient } from "@/services/api"; // Importation depuis la nouvelle API
import { httpClient } from "@/services/api/httpClient";

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
  
  // État pour stocker les calculs sauvegardés
  const [savedCalculations, setSavedCalculations] = useState<SavedCalculation[]>([]);

  // Fonction pour récupérer les calculs sauvegardés depuis l'API
  const loadSavedCalculations = useCallback(async () => {
    try {
      // Vérifier si l'ID client commence par "local_" pour gérer les données locales
      if (clientId.startsWith('local_')) {
        // Récupérer depuis le localStorage
        const localData = localStorage.getItem('saved_calculations');
        if (localData) {
          const allCalculations = JSON.parse(localData);
          const clientCalculations = allCalculations.filter((calc: any) => calc.clientId === clientId);
          setSavedCalculations(clientCalculations);
        } else {
          setSavedCalculations([]);
        }
        return;
      }
      
      // Si ce n'est pas un ID local, récupérer depuis l'API
      // Note: cet endpoint n'existe peut-être pas encore, à adapter selon l'API réelle
      try {
        const response = await httpClient.get<any[]>(`/prospects/${clientId}/calculations`);
        
        if (response.success && response.data) {
          // Convertir du format API au format local
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
          // Fallback au localStorage
          useLocalStorage();
        }
      } catch (error) {
        console.error("Erreur lors du chargement des calculs sauvegardés depuis l'API:", error);
        useLocalStorage();
      }
    } catch (error) {
      console.error("Erreur lors du chargement des calculs sauvegardés:", error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les calculs sauvegardés.",
        variant: "destructive",
      });
      // Essayer de récupérer depuis le localStorage en dernier recours
      useLocalStorage();
    }
  }, [clientId, toast]);

  // Fonction utilitaire pour récupérer les données depuis le localStorage
  const useLocalStorage = () => {
    try {
      const localData = localStorage.getItem('saved_calculations');
      if (localData) {
        const allCalculations = JSON.parse(localData);
        const clientCalculations = allCalculations.filter((calc: any) => calc.clientId === clientId);
        setSavedCalculations(clientCalculations);
        toast({
          title: "Information",
          description: "Utilisation des calculs stockés localement.",
          duration: 3000,
        });
      }
    } catch (e) {
      console.error("Impossible de récupérer les données locales:", e);
    }
  };

  // Charger les calculs sauvegardés et les données cadastrales au montage du composant
  useEffect(() => {
    loadSavedCalculations();
    
    // Récupérer les données cadastrales existantes
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
    loadSavedCalculations
  };
};

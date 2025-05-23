
import { useState, useEffect, useCallback } from "react";
import { useToast } from "@/components/ui/use-toast";
import { getCadastralDataForClient } from "@/services/supabaseService";
import { supabase } from '@/integrations/supabase/client';
import { Json } from '@/integrations/supabase/types';

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

  // Fonction pour récupérer les calculs sauvegardés depuis Supabase
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
      
      // Si ce n'est pas un ID local, récupérer depuis Supabase
      const { data, error } = await supabase
        .from('saved_calculations')
        .select('*')
        .eq('client_id', clientId);
      
      if (error) {
        throw error;
      }
      
      if (data) {
        // Convertir du format Supabase au format local
        const formattedCalculations: SavedCalculation[] = data.map(calc => {
          const calcData = calc.calculation_data as Record<string, any> | null;
          
          return {
            id: calc.id,
            projectId: calc.project_id || '',
            projectName: calcData?.projectName || 'Projet sans nom',
            clientId: calc.client_id || '',
            type: calc.type || '',
            surface: calc.surface || 0,
            date: new Date(calc.date).toLocaleDateString('fr-FR'),
            improvement: calc.improvement || 0,
            calculationData: calc.calculation_data || {}
          };
        });
        
        setSavedCalculations(formattedCalculations);
      } else {
        setSavedCalculations([]);
      }
    } catch (error) {
      console.error("Erreur lors du chargement des calculs sauvegardés:", error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les calculs sauvegardés.",
        variant: "destructive",
      });
      // En cas d'erreur, on essaie de récupérer depuis le localStorage
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
    }
  }, [clientId, toast]);

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

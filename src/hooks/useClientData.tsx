
import { useState, useEffect, useCallback } from "react";
import { clientsData } from "@/data/mock"; // Pour la transition, on garde temporairement les données mock
import { useCadastralData } from "@/hooks/useCadastralData";
import { GeoCoordinates } from "@/services/geoCoordinatesService";
import { useToast } from "@/components/ui/use-toast";
import { 
  saveCadastralData, 
  getCadastralDataForClient, 
  getClientById,
  getProjectsForClient,
  getCalculationsForProject,
  Project,
  Calculation,
  CadastralData as SupabaseCadastralData
} from "@/services/supabaseService";

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

export const useClientData = (clientId: string) => {
  const { toast } = useToast();
  
  // État pour le client (actuellement à partir des données mock, à remplacer par Supabase)
  const [client, setClient] = useState(clientsData.find(c => c.id === clientId));
  
  // États pour les données de Supabase
  const [projects, setProjects] = useState<Project[]>([]);
  
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
  
  // Mettre à jour les coordonnées (obtenues via Google Maps Geocoding API)
  const setClientCoordinates = useCallback((newCoordinates: GeoCoordinates) => {
    console.log("Mise à jour des coordonnées client:", newCoordinates);
    setCoordinates(newCoordinates);
  }, []);
  
  // Fonction pour charger les données du client depuis Supabase
  const loadClientFromSupabase = useCallback(async () => {
    try {
      const clientData = await getClientById(clientId);
      if (clientData) {
        console.log("Client chargé depuis Supabase:", clientData);
        // Dans une future version, cette fonction remplacera l'utilisation des données mock
        // setClient(clientData);
        // setClientAddress(clientData.address || "");
      }
    } catch (error) {
      console.error("Erreur lors du chargement du client depuis Supabase:", error);
    }
  }, [clientId]);
  
  // Fonction pour charger les projets du client depuis Supabase
  const loadProjectsFromSupabase = useCallback(async () => {
    try {
      const projectsData = await getProjectsForClient(clientId);
      if (projectsData) {
        console.log("Projets chargés depuis Supabase:", projectsData);
        setProjects(projectsData);
      }
    } catch (error) {
      console.error("Erreur lors du chargement des projets depuis Supabase:", error);
    }
  }, [clientId]);
  
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

  // Charger les calculs sauvegardés et les données cadastrales au montage du composant
  useEffect(() => {
    loadSavedCalculations();
    
    // Initialiser l'adresse du client
    if (client) {
      setClientAddress((client as any).address || "Rue Serrano 120, 28006 Madrid");
    }
    
    // Récupérer les données de Supabase
    const loadSupabaseData = async () => {
      // Charger le client
      await loadClientFromSupabase();
      
      // Charger les projets
      await loadProjectsFromSupabase();
      
      // Récupérer les données cadastrales existantes
      try {
        const supabaseData = await getCadastralDataForClient(clientId);
        if (supabaseData) {
          console.log("Données cadastrales chargées depuis Supabase:", supabaseData);
        }
      } catch (error) {
        console.error("Erreur lors du chargement des données cadastrales depuis Supabase:", error);
      }
    };
    
    loadSupabaseData();
  }, [clientId, client, loadSavedCalculations, loadClientFromSupabase, loadProjectsFromSupabase]);

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
    projects, // Nouvelle propriété pour les projets de Supabase
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

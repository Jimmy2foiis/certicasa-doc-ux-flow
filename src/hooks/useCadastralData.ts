
import { useState, useEffect, useCallback } from 'react';
import { 
  getCadastralInfoFromCoordinates, 
  refreshCadastralData, 
  clearCadastralCache, 
  type CatastroData 
} from '../services/catastroService';
import { type GeoCoordinates } from '../services/geoCoordinatesService';
import { useToast } from '@/components/ui/use-toast';

interface CadastralData {
  utmCoordinates: string;
  cadastralReference: string;
  climateZone: string;
  apiSource?: string;
  isLoading: boolean;
  error: string | null;
  refreshData: () => Promise<void>;
}

interface UseCadastralDataOptions {
  skipInitialFetch?: boolean;
}

/**
 * Hook optimisé pour récupérer les données cadastrales uniquement via coordonnées GPS
 * Cette approche est plus fiable car elle évite les problèmes d'interprétation d'adresses textuelles
 */
export const useCadastralData = (
  address: string, 
  coordinates?: GeoCoordinates,
  options: UseCadastralDataOptions = {}
): CadastralData => {
  const [data, setData] = useState<Omit<CadastralData, 'isLoading' | 'error' | 'refreshData'>>({
    utmCoordinates: '',
    cadastralReference: '',
    climateZone: '',
    apiSource: ''
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { skipInitialFetch = false } = options;
  const { toast } = useToast();
  
  // Fonction pour récupérer les données cadastrales exclusivement par coordonnées
  const fetchCadastralData = useCallback(async (forceRefresh = false) => {
    // Ne rien faire si pas de coordonnées disponibles
    if (!coordinates || !coordinates.lat || !coordinates.lng) {
      console.log('Aucune coordonnée disponible pour récupérer les données cadastrales', { coordinates });
      setError("Coordonnées GPS manquantes. Veuillez saisir une adresse valide.");
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      console.log('Récupération des données cadastrales avec les coordonnées :', coordinates);
      
      // Log détaillé des coordonnées pour le débogage
      console.log(`Données envoyées à l'API Catastro: lat=${coordinates.lat}, lng=${coordinates.lng}`);
      
      // Toujours utiliser la méthode par coordonnées qui est plus fiable
      const cadastralInfo = forceRefresh 
        ? await refreshCadastralData(coordinates) 
        : await getCadastralInfoFromCoordinates(coordinates.lat, coordinates.lng);
      
      console.log('Réponse du service cadastral:', cadastralInfo);
      
      if (cadastralInfo.error) {
        toast({
          title: "Erreur données cadastrales",
          description: cadastralInfo.error,
          variant: "destructive"
        });
        throw new Error(cadastralInfo.error);
      }
      
      setData({
        utmCoordinates: cadastralInfo.utmCoordinates || '',
        cadastralReference: cadastralInfo.cadastralReference || '',
        climateZone: cadastralInfo.climateZone || '',
        apiSource: cadastralInfo.apiSource || 'REST'
      });
      
      // Notification de succès
      if (cadastralInfo.cadastralReference) {
        toast({
          title: "Données cadastrales récupérées",
          description: `Référence: ${cadastralInfo.cadastralReference.substring(0, 10)}... - Zone: ${cadastralInfo.climateZone}`,
        });
      } else if (cadastralInfo.utmCoordinates) {
        toast({
          title: "Données UTM récupérées",
          description: `Coordonnées UTM: ${cadastralInfo.utmCoordinates}`,
        });
      }
    } catch (err) {
      console.error('Erreur lors de la récupération des données cadastrales:', err);
      setError('Impossible de récupérer les données cadastrales. Veuillez vérifier les coordonnées et réessayer.');
    } finally {
      setIsLoading(false);
    }
  }, [coordinates, toast]);
  
  // Fonction pour forcer un rafraîchissement des données
  const refreshData = useCallback(async () => {
    if (!coordinates) {
      toast({
        title: "Impossible de rafraîchir",
        description: "Aucune coordonnée GPS disponible pour cette adresse",
        variant: "destructive"
      });
      return;
    }
    
    toast({
      title: "Rafraîchissement en cours",
      description: "Récupération des données cadastrales depuis l'API...",
    });
    
    await fetchCadastralData(true);
  }, [fetchCadastralData, coordinates, toast]);

  // Effet pour charger les données quand les coordonnées changent
  useEffect(() => {
    if (!skipInitialFetch && coordinates) {
      fetchCadastralData();
    }
  }, [coordinates, skipInitialFetch, fetchCadastralData]);

  return { ...data, isLoading, error, refreshData };
};

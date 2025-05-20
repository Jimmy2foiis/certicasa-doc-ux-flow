
import { useState, useEffect, useCallback } from 'react';
import { 
  getCadastralInfoFromCoordinates, 
  refreshCadastralData, 
  clearCadastralCache, 
  type CatastroData 
} from '../services/catastroService';
import { type GeoCoordinates } from '../services/geoCoordinatesService';

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
  
  // Fonction pour récupérer les données cadastrales exclusivement par coordonnées
  const fetchCadastralData = useCallback(async (forceRefresh = false) => {
    // Ne rien faire si pas de coordonnées disponibles
    if (!coordinates || !coordinates.lat || !coordinates.lng) {
      console.log('Aucune coordonnée disponible pour récupérer les données cadastrales');
      setError("Coordonnées GPS manquantes. Veuillez saisir une adresse valide.");
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      console.log('Récupération des données cadastrales avec les coordonnées :', coordinates);
      
      // Toujours utiliser la méthode par coordonnées qui est plus fiable
      const cadastralInfo = forceRefresh 
        ? await getCadastralInfoFromCoordinates(coordinates.lat, coordinates.lng, true) 
        : await getCadastralInfoFromCoordinates(coordinates.lat, coordinates.lng);
      
      if (cadastralInfo.error) {
        throw new Error(cadastralInfo.error);
      }
      
      setData({
        utmCoordinates: cadastralInfo.utmCoordinates || '',
        cadastralReference: cadastralInfo.cadastralReference || '',
        climateZone: cadastralInfo.climateZone || '',
        apiSource: cadastralInfo.apiSource || 'REST'
      });
    } catch (err) {
      console.error('Erreur lors de la récupération des données cadastrales:', err);
      setError('Impossible de récupérer les données cadastrales. Veuillez vérifier les coordonnées et réessayer.');
    } finally {
      setIsLoading(false);
    }
  }, [coordinates]);
  
  // Fonction pour forcer un rafraîchissement des données
  const refreshData = useCallback(async () => {
    await fetchCadastralData(true);
  }, [fetchCadastralData]);

  // Effet pour charger les données quand les coordonnées changent
  useEffect(() => {
    if (!skipInitialFetch && coordinates) {
      fetchCadastralData();
    }
  }, [coordinates, skipInitialFetch, fetchCadastralData]);

  return { ...data, isLoading, error, refreshData };
};

import { useState, useEffect, useCallback } from 'react';
import { getCadastralDataFromAddress, getCadastralInfoFromCoordinates, refreshCadastralData, clearCadastralCache, type CatastroData } from '../services/catastroService';
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
  useDirectCoordinates?: boolean;
  skipInitialFetch?: boolean;
}

/**
 * Hook amélioré pour récupérer les données cadastrales à partir d'une adresse ou de coordonnées directes
 * en utilisant l'API officielle du Catastro Español avec mécanismes de cache et refresh
 * Utilise l'API REST/JSON moderne en priorité avec fallback sur SOAP
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
  const { useDirectCoordinates = true, skipInitialFetch = false } = options;
  
  // Fonction pour récupérer les données cadastrales
  const fetchCadastralData = useCallback(async (forceRefresh = false) => {
    // Si pas de coordonnées ni d'adresse, on ne fait rien
    if ((!address || address.trim() === '') && !coordinates) {
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      let cadastralInfo: CatastroData;
      
      // Décider si on utilise le refresh forcé ou les fonctions normales
      if (forceRefresh) {
        if (coordinates && useDirectCoordinates) {
          cadastralInfo = await refreshCadastralData(coordinates);
        } else {
          cadastralInfo = await refreshCadastralData(address);
        }
      } else {
        // Si on a des coordonnées directes et l'option est activée, on les utilise directement
        // Cette approche est plus fiable car elle évite une étape de géocodage supplémentaire
        if (coordinates && useDirectCoordinates) {
          console.log('Récupération des données cadastrales avec coordonnées directes:', coordinates);
          cadastralInfo = await getCadastralInfoFromCoordinates(coordinates.lat, coordinates.lng);
        } else {
          console.log('Récupération des données cadastrales à partir de l\'adresse:', address);
          cadastralInfo = await getCadastralDataFromAddress(address);
        }
      }
      
      if (cadastralInfo.error) {
        throw new Error(cadastralInfo.error);
      }
      
      setData({
        utmCoordinates: cadastralInfo.utmCoordinates || '',
        cadastralReference: cadastralInfo.cadastralReference || '',
        climateZone: cadastralInfo.climateZone || '',
        apiSource: cadastralInfo.apiSource || 'REST' // Par défaut, on suppose que c'est l'API REST
      });
    } catch (err) {
      console.error('Erreur lors de la récupération des données cadastrales:', err);
      setError('Impossible de récupérer les données cadastrales. Veuillez vérifier l\'adresse et réessayer.');
    } finally {
      setIsLoading(false);
    }
  }, [address, coordinates, useDirectCoordinates]);
  
  // Fonction pour forcer un rafraîchissement des données
  const refreshData = useCallback(async () => {
    await fetchCadastralData(true);
  }, [fetchCadastralData]);

  // Effet pour charger les données au montage ou quand les dépendances changent
  useEffect(() => {
    if (!skipInitialFetch) {
      fetchCadastralData();
    }
  }, [address, coordinates, useDirectCoordinates, skipInitialFetch, fetchCadastralData]);

  return { ...data, isLoading, error, refreshData };
};

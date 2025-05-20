
import { GeoCoordinates } from './geoCoordinatesService';
import { getCadastralDataByCoordinatesREST } from './catastroRestService';
import { getClimateZoneByAddress } from './climateZoneService';

// Interface pour les données cadastrales
export interface CatastroData {
  utmCoordinates: string;
  cadastralReference: string;
  climateZone: string;
  apiSource?: string;
  error: string | null;
}

// Clé pour le cache localStorage
const CATASTRAL_CACHE_KEY = 'catastro_cache';

// Structure du cache
interface CacheItem {
  timestamp: number;
  data: CatastroData;
}

interface CatastralCache {
  [key: string]: CacheItem;
}

// Durée du cache en millisecondes (24 heures)
const CACHE_DURATION = 24 * 60 * 60 * 1000;

// Fonction pour sauvegarder les données dans le cache
const saveToCache = (key: string, data: CatastroData): void => {
  try {
    const cache = getCache();
    cache[key] = {
      timestamp: Date.now(),
      data
    };
    localStorage.setItem(CATASTRAL_CACHE_KEY, JSON.stringify(cache));
  } catch (error) {
    console.error('Erreur lors de la sauvegarde dans le cache:', error);
  }
};

// Fonction pour récupérer le cache complet
const getCache = (): CatastralCache => {
  try {
    const cache = localStorage.getItem(CATASTRAL_CACHE_KEY);
    return cache ? JSON.parse(cache) : {};
  } catch (error) {
    console.error('Erreur lors de la récupération du cache:', error);
    return {};
  }
};

// Fonction pour récupérer des données du cache
const getFromCache = (key: string): CatastroData | null => {
  try {
    const cache = getCache();
    const item = cache[key];
    
    if (item && (Date.now() - item.timestamp) < CACHE_DURATION) {
      return item.data;
    }
    return null;
  } catch (error) {
    console.error('Erreur lors de la récupération depuis le cache:', error);
    return null;
  }
};

// Fonction pour vider le cache
export const clearCadastralCache = (): void => {
  try {
    localStorage.removeItem(CATASTRAL_CACHE_KEY);
  } catch (error) {
    console.error('Erreur lors de la suppression du cache:', error);
  }
};

// Fonction principale pour récupérer les données cadastrales à partir de coordonnées
export const getCadastralInfoFromCoordinates = async (
  latitude: number, 
  longitude: number, 
  forceRefresh = false
): Promise<CatastroData> => {
  const cacheKey = `coord_${latitude}_${longitude}`;
  
  // Vérifier dans le cache d'abord (sauf si forceRefresh)
  if (!forceRefresh) {
    const cachedData = getFromCache(cacheKey);
    if (cachedData) {
      console.log('Données cadastrales récupérées du cache pour les coordonnées:', latitude, longitude);
      return cachedData;
    }
  }
  
  // Récupérer les données fraîches
  console.log(`Appel à l'API Catastro avec coordonnées: lat=${latitude}, lng=${longitude}`);
  const cadastralData = await getCadastralDataByCoordinatesREST(latitude, longitude);
  
  // Si les données sont valides, les mettre en cache
  if (cadastralData && !cadastralData.error) {
    saveToCache(cacheKey, cadastralData);
  } else if (cadastralData.error) {
    console.error('Erreur API Catastro:', cadastralData.error);
    
    // En cas d'erreur, essayer de déterminer au moins la zone climatique approximative
    // basée sur la latitude/longitude (si possible)
    return {
      utmCoordinates: '',
      cadastralReference: '',
      // Utilise la latitude pour estimer la province/zone climatique
      climateZone: latitude > 40 ? 'D3' : 'B3', // Estimation très approximative
      apiSource: 'FALLBACK',
      error: cadastralData.error
    };
  }
  
  return cadastralData;
};

// Fonction pour forcer un rafraîchissement des données
export const refreshCadastralData = async (coordinates: GeoCoordinates): Promise<CatastroData> => {
  try {
    const { lat, lng } = coordinates;
    const cacheKey = `coord_${lat}_${lng}`;
    
    // Supprimer du cache si existe
    const cache = getCache();
    delete cache[cacheKey];
    localStorage.setItem(CATASTRAL_CACHE_KEY, JSON.stringify(cache));
    
    // Récupérer de nouvelles données
    return await getCadastralInfoFromCoordinates(lat, lng);
  } catch (error) {
    console.error('Erreur lors du rafraîchissement des données cadastrales:', error);
    return {
      utmCoordinates: '',
      cadastralReference: '',
      climateZone: '',
      apiSource: 'ERROR',
      error: error instanceof Error ? error.message : 'Erreur inconnue'
    };
  }
};

// Cette fonction n'est plus utilisée dans l'approche optimisée, mais conservée 
// pour la compatibilité avec le code existant. Elle sera dépréciée.
export const getCadastralDataFromAddress = async (address: string): Promise<CatastroData> => {
  console.warn('DÉPRÉCIÉ: getCadastralDataFromAddress est déconseillé. Utilisez la méthode par coordonnées.');
  return {
    utmCoordinates: '',
    cadastralReference: '',
    climateZone: getClimateZoneByAddress(address),
    apiSource: 'DEPRECATED',
    error: 'Méthode dépréciée. Utilisez l\'approche par géocodage puis coordonnées.'
  };
};

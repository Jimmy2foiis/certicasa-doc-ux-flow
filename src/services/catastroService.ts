
import { GeoCoordinates } from './geoCoordinatesService';
import { getCadastralDataByCoordinatesREST, getCadastralDataByAddressREST } from './catastroRestService';
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
export const getCadastralInfoFromCoordinates = async (latitude: number, longitude: number): Promise<CatastroData> => {
  const cacheKey = `coord_${latitude}_${longitude}`;
  
  // Vérifier dans le cache d'abord
  const cachedData = getFromCache(cacheKey);
  if (cachedData) {
    console.log('Données cadastrales récupérées du cache pour les coordonnées:', latitude, longitude);
    return cachedData;
  }
  
  // Récupérer les données fraîches
  const cadastralData = await getCadastralDataByCoordinatesREST(latitude, longitude);
  
  // Si les données sont valides, les mettre en cache
  if (cadastralData && !cadastralData.error) {
    saveToCache(cacheKey, cadastralData);
  }
  
  return cadastralData;
};

// Fonction principale pour récupérer les données cadastrales à partir d'une adresse
export const getCadastralDataFromAddress = async (address: string): Promise<CatastroData> => {
  const cacheKey = `addr_${address}`;
  
  // Vérifier dans le cache d'abord
  const cachedData = getFromCache(cacheKey);
  if (cachedData) {
    console.log('Données cadastrales récupérées du cache pour l\'adresse:', address);
    return cachedData;
  }
  
  // Récupérer les données via l'API REST
  const cadastralData = await getCadastralDataByAddressREST(address);
  
  // Si les données sont incomplètes ou en erreur, essayer l'approche traditionnelle
  if (!cadastralData.cadastralReference && !cadastralData.error) {
    console.log('Données cadastrales insuffisantes, utilisation de la méthode traditionnelle');
    
    // Récupérer la zone climatique basée sur l'adresse
    const climateZone = getClimateZoneByAddress(address);
    
    return {
      utmCoordinates: '',
      cadastralReference: '',
      climateZone,
      apiSource: 'FALLBACK',
      error: null
    };
  }
  
  // Si les données sont valides, les mettre en cache
  if (cadastralData && !cadastralData.error) {
    saveToCache(cacheKey, cadastralData);
  }
  
  return cadastralData;
};

// Fonction pour forcer un rafraîchissement des données
export const refreshCadastralData = async (addressOrCoordinates: string | GeoCoordinates): Promise<CatastroData> => {
  try {
    let result: CatastroData;
    
    if (typeof addressOrCoordinates === 'string') {
      // Supprimer du cache si existe
      const cacheKey = `addr_${addressOrCoordinates}`;
      const cache = getCache();
      delete cache[cacheKey];
      localStorage.setItem(CATASTRAL_CACHE_KEY, JSON.stringify(cache));
      
      // Récupérer de nouvelles données
      result = await getCadastralDataFromAddress(addressOrCoordinates);
    } else {
      // C'est un objet de coordonnées
      const { lat, lng } = addressOrCoordinates;
      const cacheKey = `coord_${lat}_${lng}`;
      
      // Supprimer du cache si existe
      const cache = getCache();
      delete cache[cacheKey];
      localStorage.setItem(CATASTRAL_CACHE_KEY, JSON.stringify(cache));
      
      // Récupérer de nouvelles données
      result = await getCadastralInfoFromCoordinates(lat, lng);
    }
    
    return result;
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

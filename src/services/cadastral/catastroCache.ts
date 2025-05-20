
import { CatastroData } from "../catastroTypes";

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
export const saveToCache = (key: string, data: CatastroData): void => {
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
export const getCache = (): CatastralCache => {
  try {
    const cache = localStorage.getItem(CATASTRAL_CACHE_KEY);
    return cache ? JSON.parse(cache) : {};
  } catch (error) {
    console.error('Erreur lors de la récupération du cache:', error);
    return {};
  }
};

// Fonction pour récupérer des données du cache
export const getFromCache = (key: string): CatastroData | null => {
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

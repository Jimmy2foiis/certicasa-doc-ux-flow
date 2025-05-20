
import { CatastroData } from "../catastroService";

// Clé pour le cache localStorage
const CATASTRO_CACHE_KEY = 'cadastral_cache';
const CACHE_EXPIRY_TIME = 24 * 60 * 60 * 1000; // 24 heures en millisecondes

interface CacheItem {
  timestamp: number;
  data: CatastroData;
}

interface CoordinateKey {
  lat: number;
  lng: number;
}

interface CadastralCache {
  [key: string]: CacheItem;
}

// Génère une clé de cache unique pour des coordonnées
const generateCacheKey = (lat: number, lng: number): string => {
  // Arrondir à 6 décimales pour éviter de stocker des clés similaires
  // mais conserver assez de précision pour l'usage cadastral
  return `${lat.toFixed(6)}_${lng.toFixed(6)}`;
};

// Vérifie si une entrée de cache est encore valide
const isCacheValid = (cacheItem: CacheItem): boolean => {
  const now = Date.now();
  return (now - cacheItem.timestamp) < CACHE_EXPIRY_TIME;
};

// Récupère les données du cache
export const getCachedCadastralData = (lat: number, lng: number): CatastroData | null => {
  try {
    const cacheKey = generateCacheKey(lat, lng);
    const cacheString = localStorage.getItem(CATASTRO_CACHE_KEY);
    
    if (!cacheString) return null;
    
    const cache: CadastralCache = JSON.parse(cacheString);
    const cacheItem = cache[cacheKey];
    
    if (cacheItem && isCacheValid(cacheItem)) {
      console.log(`Données cadastrales récupérées du cache pour ${lat}, ${lng}`);
      return cacheItem.data;
    }
    
    return null;
  } catch (error) {
    console.error("Erreur lors de la récupération du cache cadastral:", error);
    return null;
  }
};

// Stocke des données dans le cache
export const setCachedCadastralData = (lat: number, lng: number, data: CatastroData): void => {
  try {
    const cacheKey = generateCacheKey(lat, lng);
    let cache: CadastralCache = {};
    
    const cacheString = localStorage.getItem(CATASTRO_CACHE_KEY);
    if (cacheString) {
      cache = JSON.parse(cacheString);
    }
    
    cache[cacheKey] = {
      timestamp: Date.now(),
      data
    };
    
    localStorage.setItem(CATASTRO_CACHE_KEY, JSON.stringify(cache));
    console.log(`Données cadastrales mises en cache pour ${lat}, ${lng}`);
  } catch (error) {
    console.error("Erreur lors de la mise en cache des données cadastrales:", error);
  }
};

// Efface le cache
export const clearCadastralCache = (): void => {
  try {
    localStorage.removeItem(CATASTRO_CACHE_KEY);
    console.log("Cache cadastral effacé");
  } catch (error) {
    console.error("Erreur lors de l'effacement du cache cadastral:", error);
  }
};


import { GeoCoordinates } from '../geoCoordinatesService';
import { getCadastralDataByCoordinatesREST } from '../catastroRestService';
import { getFromCache, saveToCache, getCache } from './catastroCache';
import { CatastroData } from '../catastroTypes';

// Fonction principale pour récupérer les données cadastrales à partir de coordonnées
export const getCadastralInfoFromCoordinates = async (
  latitude: number, 
  longitude: number, 
  forceRefresh = false
): Promise<CatastroData> => {
  // Validation des coordonnées
  if (!latitude || !longitude || isNaN(latitude) || isNaN(longitude)) {
    console.error("Coordonnées invalides:", { latitude, longitude });
    return {
      utmCoordinates: '',
      cadastralReference: '',
      climateZone: '',
      apiSource: 'ERROR',
      error: 'Coordonnées GPS invalides'
    };
  }
  
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
    console.log("Données cadastrales mises en cache:", cadastralData);
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
    if (!coordinates || !coordinates.lat || !coordinates.lng) {
      throw new Error("Coordonnées invalides pour le rafraîchissement des données");
    }
    
    const { lat, lng } = coordinates;
    const cacheKey = `coord_${lat}_${lng}`;
    
    // Supprimer du cache si existe
    const cache = getCache();
    delete cache[cacheKey];
    localStorage.setItem('catastro_cache', JSON.stringify(cache));
    console.log(`Cache supprimé pour les coordonnées: ${lat}, ${lng}`);
    
    // Récupérer de nouvelles données
    return await getCadastralInfoFromCoordinates(lat, lng, true);
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

// Fonction pour supprimer tout le cache
export const clearCadastralCache = (): void => {
  try {
    localStorage.removeItem('catastro_cache');
    console.log('Cache cadastral entièrement supprimé');
  } catch (error) {
    console.error('Erreur lors de la suppression du cache cadastral:', error);
  }
};

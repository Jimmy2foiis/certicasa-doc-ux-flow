
import { GeoCoordinates, getFormattedUTMCoordinates } from '../geoCoordinatesService';
import { getCadastralDataByCoordinatesREST } from './catastroApiService';
import { getCachedCadastralData, setCachedCadastralData } from './catastroCache';
import { getClimateZoneByProvince, getClimateZoneByAddress } from '../climateZoneService';
import { CatastroData } from '../catastroTypes';

/**
 * Fonction principale pour obtenir les informations cadastrales à partir de coordonnées GPS
 * Utilise le cache local pour éviter des appels API répétés
 */
export const getCadastralInfoFromCoordinates = async (
  latitude: number, 
  longitude: number
): Promise<CatastroData> => {
  try {
    console.log(`Recherche de données cadastrales pour les coordonnées: ${latitude}, ${longitude}`);
    
    // Validation des coordonnées pour éviter les appels API inutiles
    if (!latitude || !longitude || isNaN(latitude) || isNaN(longitude)) {
      throw new Error("Coordonnées GPS invalides ou manquantes");
    }
    
    // Vérifier si les données sont dans le cache
    const cachedData = getCachedCadastralData(latitude, longitude);
    if (cachedData) {
      console.log("Données cadastrales trouvées dans le cache");
      return cachedData;
    }
    
    console.log("Données cadastrales non trouvées dans le cache, appel à l'API REST...");
    
    // Obtenir les coordonnées UTM à partir des coordonnées GPS
    const utmCoordinates = getFormattedUTMCoordinates(latitude, longitude);
    console.log(`Coordonnées UTM calculées: ${utmCoordinates}`);
    
    // Récupérer les données cadastrales via l'API REST
    const cadastralData = await getCadastralDataByCoordinatesREST(latitude, longitude);
    
    // Si l'API ne retourne pas de coordonnées UTM, utiliser celles calculées localement
    if (!cadastralData.utmCoordinates && utmCoordinates) {
      cadastralData.utmCoordinates = utmCoordinates;
    }
    
    // Si l'API ne retourne pas de zone climatique, essayer de la détecter par d'autres moyens
    if (!cadastralData.climateZone || cadastralData.climateZone === "N/A") {
      // Tenter de déterminer la zone climatique à partir de la position géographique
      let climateZone = "";
      
      // Espagne continentale - zones climatiques approximatives par coordonnées
      // Nord/Nord-ouest (zones C1, C2)
      if (latitude > 42.0) {
        climateZone = longitude < -6.0 ? "C1" : "C2";
      }
      // Centre/Nord-est (zones D1, D2, D3)
      else if (latitude > 40.0) {
        if (longitude < -4.0) climateZone = "D3";
        else if (longitude < 0) climateZone = "D2";
        else climateZone = "D1";
      }
      // Centre/Sud (zones A3, A4, B3, B4)
      else {
        if (longitude < -6.0) climateZone = latitude > 38.0 ? "C4" : "A4";
        else if (longitude < -3.0) climateZone = latitude > 38.0 ? "B4" : "A4";
        else climateZone = latitude > 38.0 ? "B3" : "A3";
      }
      
      if (climateZone) {
        cadastralData.climateZone = climateZone;
      }
    }
    
    // Mise en cache des résultats
    setCachedCadastralData(latitude, longitude, cadastralData);
    
    return cadastralData;
    
  } catch (error) {
    console.error("Erreur lors de la récupération des informations cadastrales:", error);
    
    // Retourner au moins les coordonnées UTM calculées en cas d'erreur
    const utmCoordinates = getFormattedUTMCoordinates(latitude, longitude);
    
    return {
      cadastralReference: "",
      utmCoordinates,
      climateZone: "",
      apiSource: "REST",
      error: error instanceof Error ? error.message : "Erreur inconnue"
    };
  }
};

/**
 * Fonction pour rafraîchir les données cadastrales (ignorer le cache)
 */
export const refreshCadastralData = async (coordinates: GeoCoordinates): Promise<CatastroData> => {
  try {
    // Validation des coordonnées
    if (!coordinates || !coordinates.lat || !coordinates.lng) {
      throw new Error("Coordonnées GPS invalides ou manquantes");
    }
    
    console.log(`Rafraîchissement des données cadastrales pour: ${coordinates.lat}, ${coordinates.lng}`);
    
    // Obtenir les coordonnées UTM à partir des coordonnées GPS
    const utmCoordinates = getFormattedUTMCoordinates(coordinates.lat, coordinates.lng);
    
    // Récupérer les données cadastrales via l'API REST
    const cadastralData = await getCadastralDataByCoordinatesREST(
      coordinates.lat, 
      coordinates.lng
    );
    
    // Si l'API ne retourne pas de coordonnées UTM, utiliser celles calculées localement
    if (!cadastralData.utmCoordinates && utmCoordinates) {
      cadastralData.utmCoordinates = utmCoordinates;
    }
    
    // Mise en cache des résultats rafraîchis
    setCachedCadastralData(coordinates.lat, coordinates.lng, cadastralData);
    
    return cadastralData;
    
  } catch (error) {
    console.error("Erreur lors du rafraîchissement des données cadastrales:", error);
    
    const utmCoordinates = coordinates ? getFormattedUTMCoordinates(coordinates.lat, coordinates.lng) : "";
    
    return {
      cadastralReference: "",
      utmCoordinates,
      climateZone: "",
      apiSource: "REST",
      error: error instanceof Error ? error.message : "Erreur inconnue"
    };
  }
};

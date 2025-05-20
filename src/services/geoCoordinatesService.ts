
/**
 * Service pour la gestion des coordonnées géographiques
 * Utilise l'API Google Maps pour le géocodage des adresses
 */

import proj4 from 'proj4';

// Interface pour les coordonnées géographiques
export interface GeoCoordinates {
  lat: number;
  lng: number;
}

// Configuration de proj4 pour la conversion WGS84 vers UTM ETRS89 Zone 30N (utilisé par le Catastro)
// EPSG:4326 est WGS84 (latitude/longitude standard)
// EPSG:25830 est ETRS89 / UTM zone 30N (utilisé en Espagne)
const setupProj4 = () => {
  proj4.defs("EPSG:25830", "+proj=utm +zone=30 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs");
};

setupProj4();

/**
 * Conversion de l'adresse en coordonnées géographiques via Google Maps Geocoding
 * Optimisé pour les adresses espagnoles avec la dernière version de l'API
 * Cette fonction est cruciale pour la récupération des données cadastrales
 */
export const getCoordinatesFromAddress = async (address: string): Promise<GeoCoordinates | null> => {
  try {
    if (!address || address.trim() === "") {
      console.error("Adresse vide fournie au géocodeur");
      return null;
    }
    
    // Vérifier que l'API Google Maps est disponible
    if (!window.google || !window.google.maps || !window.google.maps.Geocoder) {
      console.error("Google Maps API non disponible");
      return null;
    }

    const geocoder = new window.google.maps.Geocoder();
    
    // Normaliser l'adresse pour l'Espagne avant de géocoder
    const normalizedAddress = normalizeSpanishAddress(address);
    console.log(`Adresse normalisée pour géocodage: ${normalizedAddress}`);
    
    // Options de géocodage avec restriction au pays (Espagne)
    // Utilisation des options recommandées dans la dernière documentation Google
    const geocodingOptions = {
      address: normalizedAddress,
      region: 'es', // Code de région pour l'Espagne
      componentRestrictions: { country: 'es' } // Limiter aux résultats en Espagne
    };
    
    return new Promise((resolve, reject) => {
      geocoder.geocode(geocodingOptions, (results: any, status: any) => {
        if (status === "OK" && results && results.length > 0) {
          const location = results[0].geometry.location;
          const coordinates = {
            lat: location.lat(),
            lng: location.lng(),
          };
          
          // Vérifier que les coordonnées sont bien en Espagne
          if (validateSpanishCoordinates(coordinates)) {
            console.log(`Géocodage réussi pour: ${normalizedAddress}`, coordinates);
            resolve(coordinates);
          } else {
            console.error(`Coordonnées obtenues hors d'Espagne:`, coordinates);
            reject(new Error("Les coordonnées obtenues sont en dehors de l'Espagne"));
          }
        } else {
          console.error(`Erreur de géocodage pour ${normalizedAddress}:`, status);
          reject(new Error(`Erreur de géocodage: ${status}`));
        }
      });
    });
  } catch (error) {
    console.error("Erreur lors de la conversion de l'adresse en coordonnées:", error);
    return null;
  }
};

/**
 * Vérifie si des coordonnées sont bien en Espagne
 * Utile pour valider les résultats avant de les envoyer à l'API Catastro
 */
export const validateSpanishCoordinates = (coordinates: GeoCoordinates): boolean => {
  // Boîte englobante approximative de l'Espagne continentale
  const SPAIN_BOUNDS = {
    north: 43.8, // Nord de l'Espagne
    south: 36.0, // Sud de l'Espagne
    west: -9.4,  // Ouest de l'Espagne
    east: 4.4    // Est de l'Espagne
  };
  
  // Vérifier si les coordonnées sont dans la boîte englobante de l'Espagne
  return (
    coordinates.lat >= SPAIN_BOUNDS.south &&
    coordinates.lat <= SPAIN_BOUNDS.north &&
    coordinates.lng >= SPAIN_BOUNDS.west &&
    coordinates.lng <= SPAIN_BOUNDS.east
  );
};

/**
 * Normalisation d'une adresse espagnole
 */
export const normalizeSpanishAddress = (address: string): string => {
  if (!address) return "";
  
  // Normaliser les caractères accentués et spéciaux pour l'espagnol
  const normalizedAddress = address
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
  
  // Si l'adresse ne se termine pas par "España" ou "Spain", ajouter "España"
  if (!normalizedAddress.match(/españa|spain/i)) {
    return `${normalizedAddress}, España`;
  }
  
  return normalizedAddress;
};

/**
 * Convertit des coordonnées WGS84 (lat/lng) en UTM ETRS89 (système utilisé par le Catastro)
 * Utilise proj4js pour une conversion précise
 */
export const convertToUTM = (lat: number, lng: number): { x: number, y: number } => {
  try {
    // Convertir les coordonnées WGS84 en UTM ETRS89 Zone 30N
    const result = proj4('EPSG:4326', 'EPSG:25830', [lng, lat]);
    
    // Arrondir les coordonnées UTM à l'entier le plus proche
    const x = Math.round(result[0]);
    const y = Math.round(result[1]);
    
    console.log(`Conversion UTM réussie: (${lat}, ${lng}) -> UTM (${x}, ${y})`);
    
    return { x, y };
  } catch (error) {
    console.error("Erreur lors de la conversion UTM:", error);
    
    // Fallback à la méthode approximative si proj4js échoue
    console.warn("Utilisation de la méthode de conversion UTM approximative");
    
    // Facteurs de conversion approximatifs pour l'Espagne (UTM zone 30N)
    const UTM_SCALE_X = 111320; // mètres par degré de longitude à l'équateur
    const UTM_SCALE_Y = 110540; // mètres par degré de latitude
    
    // Point de référence UTM zone 30N (méridien central 3°W)
    const REF_LNG = -3;
    const REF_LAT = 0;
    
    // Conversion approximative
    const x = Math.round(UTM_SCALE_X * (lng - REF_LNG) * Math.cos(lat * Math.PI / 180) + 500000);
    const y = Math.round(UTM_SCALE_Y * (lat - REF_LAT));
    
    return { x, y };
  }
};

/**
 * Obtient les coordonnées UTM sous forme de chaîne formatée
 * Format : "X: 12345, Y: 67890"
 */
export const getFormattedUTMCoordinates = (lat: number, lng: number): string => {
  try {
    const { x, y } = convertToUTM(lat, lng);
    return `X: ${x}, Y: ${y}`;
  } catch (error) {
    console.error("Erreur lors du formatage des coordonnées UTM:", error);
    return "";
  }
};

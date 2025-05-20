
/**
 * Service pour la gestion des coordonnées géographiques
 * Utilise l'API Google Maps pour le géocodage des adresses
 */

// Interface pour les coordonnées géographiques
export interface GeoCoordinates {
  lat: number;
  lng: number;
}

/**
 * Conversion de l'adresse en coordonnées géographiques via Google Maps Geocoding
 * Optimisé pour les adresses espagnoles avec la dernière version de l'API
 */
export const getCoordinatesFromAddress = async (address: string): Promise<GeoCoordinates | null> => {
  try {
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
          
          console.log(`Géocodage réussi pour: ${normalizedAddress}`, coordinates);
          resolve(coordinates);
        } else {
          console.error(`Erreur de géocodage pour ${normalizedAddress}:`, status);
          reject(null);
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
 * Convertit des coordonnées décimales (WGS84) en UTM ETRS89 (système utilisé par le Catastro)
 * Cette fonction est une approximation simplifiée, pour une conversion précise
 * il faudrait utiliser une librairie spécialisée comme proj4js
 */
export const convertToUTM = (lat: number, lng: number): { x: number, y: number } => {
  // Note: Cette conversion est simplifiée et approximative
  // Le Catastro utilise ETRS89 UTM zone 30N pour la péninsule ibérique
  
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
};


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
 * Optimisé pour les adresses espagnoles
 */
export const getCoordinatesFromAddress = async (address: string): Promise<GeoCoordinates | null> => {
  try {
    // Vérifier que l'API Google Maps est disponible
    if (!window.google || !window.google.maps || !window.google.maps.Geocoder) {
      console.error("Google Maps API non disponible");
      return null;
    }

    const geocoder = new window.google.maps.Geocoder();
    
    // Options de géocodage avec restriction au pays (Espagne)
    const geocodingOptions = {
      address: address,
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
          
          console.log(`Géocodage réussi pour: ${address}`, coordinates);
          resolve(coordinates);
        } else {
          console.error(`Erreur de géocodage pour ${address}:`, status);
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
 * Normalisation d'une adresse espagnole
 */
export const normalizeSpanishAddress = (address: string): string => {
  if (!address) return "";
  
  // Si l'adresse ne se termine pas par "España" ou "Spain", ajouter "España"
  if (!address.match(/españa|spain/i)) {
    return `${address}, España`;
  }
  
  return address;
};

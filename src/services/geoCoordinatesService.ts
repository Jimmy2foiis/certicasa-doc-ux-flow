
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
 */
export const getCoordinatesFromAddress = async (address: string): Promise<GeoCoordinates | null> => {
  try {
    // Vérifier que l'API Google Maps est disponible
    if (!window.google || !window.google.maps || !window.google.maps.Geocoder) {
      console.error("Google Maps API non disponible");
      return null;
    }

    const geocoder = new window.google.maps.Geocoder();
    
    return new Promise((resolve, reject) => {
      geocoder.geocode({ address }, (results: any, status: any) => {
        if (status === "OK" && results && results.length > 0) {
          const location = results[0].geometry.location;
          resolve({
            lat: location.lat(),
            lng: location.lng(),
          });
        } else {
          console.error("Erreur de géocodage:", status);
          reject(null);
        }
      });
    });
  } catch (error) {
    console.error("Erreur lors de la conversion de l'adresse en coordonnées:", error);
    return null;
  }
};

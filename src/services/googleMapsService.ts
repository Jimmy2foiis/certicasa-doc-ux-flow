
import { GOOGLE_MAPS_API_KEY } from '@/config/googleMapsConfig';

/**
 * Charge l'API Google Maps de manière asynchrone
 */
export const loadGoogleMapsApi = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    // Si l'API est déjà chargée, on résout immédiatement
    if (window.google && window.google.maps && window.google.maps.places) {
      console.log('API Google Maps déjà chargée');
      resolve();
      return;
    }

    if (!GOOGLE_MAPS_API_KEY) {
      console.error('Clé API Google Maps non disponible');
      reject(new Error('Clé API Google Maps non disponible'));
      return;
    }

    console.log('Chargement de l\'API Google Maps...');

    // Gestionnaire pour la réussite du chargement
    window.initGoogleMapsAutocomplete = () => {
      console.log('API Google Maps chargée avec succès');
      resolve();
    };

    // Gestionnaire pour les erreurs d'authentification
    window.gm_authFailure = () => {
      console.error('Échec d\'authentification à l\'API Google Maps');
      reject(new Error('Clé API Google Maps invalide'));
    };

    // Créer et ajouter le script à la page
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places&callback=initGoogleMapsAutocomplete`;
    script.async = true;
    script.defer = true;
    
    // Gestionnaire d'erreur de chargement
    script.onerror = () => {
      console.error('Erreur lors du chargement du script Google Maps');
      reject(new Error('Impossible de charger le script Google Maps'));
    };

    document.head.appendChild(script);
  });
};

/**
 * Vérifie si l'API Google Maps est disponible dans le contexte actuel
 */
export const isGoogleMapsLoaded = (): boolean => {
  return !!(window.google && window.google.maps && window.google.maps.places);
};


/**
 * Configuration de l'API Google Maps
 */

// La clé API est stockée dans les variables d'environnement
export const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';

// Options par défaut pour l'autocomplétion
export const DEFAULT_AUTOCOMPLETE_OPTIONS = {
  componentRestrictions: { country: 'es' }, // Limiter aux adresses en Espagne
  fields: ['address_components', 'formatted_address', 'geometry', 'name'],
  types: ['address']
};

// Durée du cache pour les résultats de géocodage (en ms)
export const GEOCODING_CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 heures


/**
 * Point d'entrée principal pour tous les services
 */

// Services de l'API REST
export * from './api';

// Services existants maintenus pour rétrocompatibilité
export * from './geoCoordinatesService';
export * from './catastroService';
export * from './climateZoneService';
export * from './documentService';
export * from './proxyService';
export * from './supabaseService'; // Re-exports des services par compatibilité

// Utils et types
// export * from './cadastral/catastroTypes';

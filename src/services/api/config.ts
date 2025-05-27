
/**
 * Configuration de l'API REST
 */

// URL de base de l'API - updated to use cert.mitain.com
export const API_BASE_URL = 'https://cert.mitain.com/api';

// Options par défaut pour les requêtes fetch
export const DEFAULT_FETCH_OPTIONS = {
  headers: {
    'Content-Type': 'application/json',
  },
};

// Timeout pour les requêtes (en ms)
export const API_TIMEOUT = 30000;

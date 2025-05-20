
// Re-export des fonctions depuis les modules restructurés
export { getCadastralDataByCoordinatesREST, getCadastralDataByAddressREST } from './cadastral/catastroApiService';
export { parseAddress, normalizeProvince } from './cadastral/addressParser';


/**
 * Point d'entrée principal pour les services API
 */

// Re-export des configurations
export * from './config';
export * from './types';

// Re-export des services
export * from './clientService';
export * from './cadastralService';
export * from './projectService';
export * from './calculationService';
export * from './documentService';
export * from './batchService';

// Re-export des fonctions spécifiques pour les clients
export { getClientsByTokens } from './clients/getClients';

// Ré-export du client HTTP pour les cas particuliers
export { httpClient } from './httpClient';

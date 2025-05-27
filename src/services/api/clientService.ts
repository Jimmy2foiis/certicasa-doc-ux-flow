
/**
 * Service for client management via external REST API
 * URL: https://certicasa.mitain.com/api/prospects/
 */

// Re-export client CRUD operations
export { getClients } from './clients/getClients';
export { getClientById } from './clients/getClientById';
export { createClientRecord } from './clients/createClient';
export { updateClientRecord } from './clients/updateClient';
export { deleteClientRecord } from './clients/deleteClient';

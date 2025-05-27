
/**
 * Service for creating new clients
 */
import { httpClient } from '../httpClient';
import { Client } from '../types';
import { mapClientToApiRequest, mapProspectToClient } from '../mappers/clientMapper';

/**
 * Creates a new client in the external API
 */
export const createClientRecord = async (clientData: Client): Promise<Client | null> => {
  try {
    // Transform client data to API format
    const requestData = mapClientToApiRequest(clientData);
    
    const response = await httpClient.post<any>('/prospects/', requestData);
    
    if (!response.success || !response.data) {
      console.error('Erreur lors de la création du client:', response.error || response.message);
      return null;
    }
    
    // Map API response back to Client model
    const client = mapProspectToClient(response.data);

    return client;
  } catch (error) {
    console.error('Erreur lors de la création du client:', error);
    return null;
  }
};

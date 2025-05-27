
/**
 * Service for updating existing clients
 */
import { httpClient } from '../httpClient';
import { Client } from '../types';
import { mapClientToApiRequest, mapProspectToClient } from '../mappers/clientMapper';

/**
 * Updates an existing client in the external API
 */
export const updateClientRecord = async (clientId: string, clientData: Partial<Client>): Promise<Client | null> => {
  try {
    // Transform client data to API format
    const requestData = mapClientToApiRequest(clientData);
    
    const response = await httpClient.patch<any>(`/prospects/${clientId}/`, requestData);
    
    if (!response.success || !response.data) {
      console.error(`Erreur lors de la mise à jour du client ${clientId}:`, response.error || response.message);
      return null;
    }
    
    // Map API response back to Client model
    const client = mapProspectToClient(response.data);

    return client;
  } catch (error) {
    console.error(`Erreur lors de la mise à jour du client ${clientId}:`, error);
    return null;
  }
};

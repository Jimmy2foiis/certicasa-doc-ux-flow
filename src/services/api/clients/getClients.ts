
/**
 * Service for retrieving client data
 */
import { httpClient } from '../httpClient';
import { Client } from '../types';
import { mapProspectToClient } from '../mappers/clientMapper';

/**
 * Fetches all clients from the external API
 */
export const getClients = async (): Promise<Client[]> => {
  try {
    const response = await httpClient.get<any[]>('/prospects/');
    
    if (!response.success || !response.data) {
      console.error('Erreur lors de la récupération des clients:', response.message);
      return [];
    }
    
    // Map API data to Client model
    const clients: Client[] = response.data.map(mapProspectToClient);

    return clients;
  } catch (error) {
    console.error("Erreur lors de la récupération des clients:", error);
    return [];
  }
};

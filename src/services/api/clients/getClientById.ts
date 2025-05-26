
/**
 * Service for retrieving a single client by ID
 */
import { httpClient } from '../httpClient';
import { Client } from '../types';
import { getClients } from './getClients';
import { mapProspectToClient } from '../mappers/clientMapper';

/**
 * Fetches a client by ID from the external API
 */
export const getClientById = async (clientId: string): Promise<Client | null> => {
  try {
    // Most REST APIs expose detail view with a final slash
    const response = await httpClient.get<any>(`/prospects/${clientId}/`);
    
    if (!response.success || !response.data) {
      console.warn(`Endpoint détail non disponible pour le client ${clientId}. Tentative de fallback via la liste complète…`);

      // Fallback: get full list and filter
      const allClients = await getClients();
      const found = allClients.find((c) => c.id === clientId);
      if (found) return found;

      console.error(`Client ${clientId} introuvable même après fallback.`);
      return null;
    }
    
    // Map API data to Client model
    const client = mapProspectToClient(response.data);

    return client;
  } catch (error) {
    console.error(`Erreur lors de la récupération du client ${clientId}:`, error);
    return null;
  }
};

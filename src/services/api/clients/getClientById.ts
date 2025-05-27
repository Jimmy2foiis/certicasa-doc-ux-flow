
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
    console.log(`Recherche du client ${clientId}...`);
    
    // First try to get the client from the full list (more reliable)
    const allClients = await getClients();
    const found = allClients.find((c) => c.id === clientId);
    
    if (found) {
      console.log(`Client ${clientId} trouvé dans la liste complète`);
      return found;
    }

    // Fallback: try the detail endpoint
    try {
      const response = await httpClient.get<any>(`/prospects/${clientId}/`);
      
      if (response.success && response.data) {
        const client = mapProspectToClient(response.data);
        console.log(`Client ${clientId} récupéré via l'endpoint détail`);
        return client;
      }
    } catch (detailError) {
      console.warn(`Endpoint détail non disponible pour le client ${clientId}`, detailError);
    }

    console.error(`Client ${clientId} introuvable`);
    return null;
    
  } catch (error) {
    console.error(`Erreur lors de la récupération du client ${clientId}:`, error);
    return null;
  }
};

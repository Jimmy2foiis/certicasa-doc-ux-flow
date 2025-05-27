
/**
 * Service for retrieving client data
 */
import { httpClient } from '../httpClient';
import { Client } from '../types';
import { mapProspectToClient } from '../mappers/clientMapper';

/**
 * Fetches all clients from the API
 */
export const getClients = async (): Promise<Client[]> => {
  try {
    console.log('Chargement des clients depuis l\'API...');
    
    // Récupérer les clients depuis l'API
    const response = await httpClient.get<any[]>('/prospects/');
    
    if (response.success && response.data) {
      // Map API data to Client model
      const clients = response.data.map(mapProspectToClient);
      console.log(`${clients.length} clients récupérés depuis l'API`);
      return clients;
    } else {
      console.warn('Aucune donnée reçue de l\'API');
      return [];
    }
    
  } catch (error) {
    console.error("Erreur lors de la récupération des clients:", error);
    return [];
  }
};

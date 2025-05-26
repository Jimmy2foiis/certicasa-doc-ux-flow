
/**
 * Service for retrieving client data from real APIs
 */
import { httpClient } from '../httpClient';
import { Client } from '../types';
import { mapProspectToClient } from '../mappers/clientMapper';

/**
 * Fetches all clients from the internal API only
 * Note: Beetool API requires individual tokens, so we only use internal API for listing
 */
export const getClients = async (): Promise<Client[]> => {
  try {
    console.log('Chargement des clients depuis l\'API interne...');
    
    // Récupérer les clients depuis l'API interne uniquement
    const response = await httpClient.get<any[]>('/prospects/');
    
    if (!response.success || !response.data) {
      console.warn('Aucune donnée reçue de l\'API interne');
      return [];
    }
    
    // Map API data to Client model
    const clients = response.data.map(mapProspectToClient);
    console.log(`${clients.length} clients récupérés depuis l'API interne`);
    
    return clients;
    
  } catch (error) {
    console.error("Erreur lors de la récupération des clients:", error);
    return [];
  }
};

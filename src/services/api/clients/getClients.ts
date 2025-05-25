
/**
 * Service for retrieving client data
 */
import { httpClient } from '../httpClient';
import { Client } from '../types';
import { mapProspectToClient } from '../mappers/clientMapper';
import { fetchExternalProspects } from '../externalApiService';

/**
 * Fetches all clients from both the external API and internal API
 */
export const getClients = async (): Promise<Client[]> => {
  try {
    console.log('Chargement des clients depuis les APIs...');
    
    // Récupérer les clients depuis l'API externe
    let externalClients: Client[] = [];
    try {
      externalClients = await fetchExternalProspects();
      console.log(`${externalClients.length} clients récupérés depuis l'API externe`);
    } catch (externalError) {
      console.warn('Erreur lors de la récupération depuis l\'API externe, continuons avec l\'API interne seulement:', externalError);
    }
    
    // Récupérer les clients depuis l'API interne
    let internalClients: Client[] = [];
    try {
      const response = await httpClient.get<any[]>('/prospects/');
      
      if (response.success && response.data) {
        // Map API data to Client model
        internalClients = response.data.map(mapProspectToClient);
        console.log(`${internalClients.length} clients récupérés depuis l'API interne`);
      }
    } catch (internalError) {
      console.warn('Erreur lors de la récupération depuis l\'API interne:', internalError);
    }
    
    // Combiner les deux sources en évitant les doublons
    const allClients = [...externalClients];
    
    // Ajouter les clients internes qui ne sont pas déjà présents
    internalClients.forEach(internalClient => {
      const exists = externalClients.some(extClient => 
        extClient.id === internalClient.id || 
        (extClient.email && internalClient.email && extClient.email === internalClient.email)
      );
      
      if (!exists) {
        allClients.push(internalClient);
      }
    });
    
    console.log(`Total: ${allClients.length} clients disponibles`);
    return allClients;
    
  } catch (error) {
    console.error("Erreur lors de la récupération des clients:", error);
    return [];
  }
};

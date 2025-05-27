
/**
 * Service for external API operations
 */
import { Client } from './types';
import { mapProspectToClient } from './mappers/clientMapper';

/**
 * Fetches prospects from the main API endpoint
 */
export const fetchExternalProspects = async (): Promise<Client[]> => {
  try {
    console.log('Récupération des prospects depuis l\'API externe...');
    
    const response = await fetch('https://cert.mitain.com/api/prospects/');
    
    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${response.status}`);
    }
    
    const prospects = await response.json();
    
    if (!Array.isArray(prospects)) {
      throw new Error('Format de réponse invalide');
    }
    
    // Map prospects to Client model
    const clients = prospects.map(mapProspectToClient);
    
    console.log(`${clients.length} prospects récupérés depuis l'API externe`);
    return clients;
    
  } catch (error) {
    console.error('Erreur lors de la récupération des prospects externes:', error);
    throw new Error(`Impossible de récupérer les données: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
  }
};

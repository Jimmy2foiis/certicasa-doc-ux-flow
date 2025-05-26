
/**
 * Service pour récupérer un client par son beetoolToken depuis l'API réelle
 */
import { Client } from '../types';
import { RealApiService } from '../realApiService';

/**
 * Récupère un client par son beetoolToken depuis votre API réelle
 */
export const getClientById = async (beetoolToken: string): Promise<Client | null> => {
  try {
    console.log(`Récupération du prospect avec beetoolToken: ${beetoolToken}`);
    
    const client = await RealApiService.getProspect(beetoolToken);
    
    if (!client) {
      console.warn(`Prospect avec beetoolToken ${beetoolToken} non trouvé`);
      return null;
    }
    
    console.log(`Prospect récupéré:`, client);
    return client;

  } catch (error) {
    console.error(`Erreur lors de la récupération du client ${beetoolToken}:`, error);
    return null;
  }
};

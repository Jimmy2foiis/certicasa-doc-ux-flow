
/**
 * Service pour mettre à jour les clients avec l'API réelle
 */
import { Client } from '../types';
import { RealApiService } from '../realApiService';

/**
 * Met à jour un client existant avec votre API réelle
 */
export const updateClientRecord = async (beetoolToken: string, clientData: Partial<Client>): Promise<Client | null> => {
  try {
    console.log(`Mise à jour du prospect avec beetoolToken: ${beetoolToken}`);
    
    const updatedClient = await RealApiService.updateProspect(beetoolToken, clientData);
    
    if (!updatedClient) {
      console.error(`Erreur lors de la mise à jour du client ${beetoolToken}`);
      return null;
    }
    
    console.log('Client mis à jour avec succès:', updatedClient);
    return updatedClient;
    
  } catch (error) {
    console.error(`Erreur lors de la mise à jour du client ${beetoolToken}:`, error);
    return null;
  }
};

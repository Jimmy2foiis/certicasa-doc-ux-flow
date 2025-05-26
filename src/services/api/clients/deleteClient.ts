
/**
 * Service for deleting clients using Beetool API
 */
import { httpClient } from '../httpClient';
import { BeetoolService } from '../beetoolService';

/**
 * Deletes a client using Beetool API if ID looks like a token
 */
export const deleteClientRecord = async (clientId: string): Promise<boolean> => {
  try {
    // Si l'ID ressemble à un token Beetool, utiliser l'API Beetool
    if (clientId.length > 10) {
      return await BeetoolService.deleteProspect(clientId);
    }

    // Fallback vers l'API interne
    const response = await httpClient.delete<any>(`/prospects/${clientId}/`);
    return response.success;
    
  } catch (error) {
    console.error(`Erreur lors de la suppression du client ${clientId}:`, error);
    return false;
  }
};

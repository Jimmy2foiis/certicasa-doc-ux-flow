
/**
 * Service for deleting clients
 */
import { httpClient } from '../httpClient';

/**
 * Deletes a client from the external API
 */
export const deleteClientRecord = async (clientId: string): Promise<boolean> => {
  try {
    const response = await httpClient.delete<any>(`/prospects/${clientId}/`);
    return response.success;
  } catch (error) {
    console.error(`Erreur lors de la suppression du client ${clientId}:`, error);
    return false;
  }
};

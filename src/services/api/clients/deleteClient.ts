
/**
 * Service pour supprimer des clients avec l'API réelle
 */
import { RealApiService } from '../realApiService';

/**
 * Supprime un client avec votre API réelle
 */
export const deleteClientRecord = async (beetoolToken: string): Promise<boolean> => {
  try {
    console.log(`Suppression du prospect avec beetoolToken: ${beetoolToken}`);
    
    const success = await RealApiService.deleteProspect(beetoolToken);
    
    if (success) {
      console.log(`Prospect ${beetoolToken} supprimé avec succès`);
    } else {
      console.error(`Erreur lors de la suppression du prospect ${beetoolToken}`);
    }
    
    return success;
    
  } catch (error) {
    console.error(`Erreur lors de la suppression du client ${beetoolToken}:`, error);
    return false;
  }
};

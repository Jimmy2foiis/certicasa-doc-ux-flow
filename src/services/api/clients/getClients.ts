
/**
 * Service pour récupérer la liste des clients depuis l'API réelle
 */
import { Client } from '../types';
import { RealApiService } from '../realApiService';

/**
 * Note: L'API ne fournit pas d'endpoint pour lister tous les prospects.
 * Cette fonction retourne une liste vide pour l'instant.
 * Vous devrez soit :
 * 1. Créer un endpoint GET /api/prospects pour lister tous les prospects
 * 2. Ou maintenir une liste des beetoolTokens localement
 */
export const getClients = async (): Promise<Client[]> => {
  try {
    console.log('Note: Aucun endpoint disponible pour lister tous les prospects');
    console.log('Utilisez getClientById avec un beetoolToken spécifique');
    
    // Pour l'instant, retourner une liste vide
    // Vous pouvez stocker les beetoolTokens connus et les interroger individuellement
    return [];
    
  } catch (error) {
    console.error("Erreur lors de la récupération des clients:", error);
    return [];
  }
};

/**
 * Fonction utilitaire pour récupérer plusieurs clients par leurs beetoolTokens
 */
export const getClientsByTokens = async (beetoolTokens: string[]): Promise<Client[]> => {
  try {
    const clients: Client[] = [];
    
    for (const token of beetoolTokens) {
      const client = await RealApiService.getProspect(token);
      if (client) {
        clients.push(client);
      }
    }
    
    return clients;
  } catch (error) {
    console.error("Erreur lors de la récupération des clients par tokens:", error);
    return [];
  }
};

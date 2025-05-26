
/**
 * Service pour créer de nouveaux clients avec l'API réelle
 */
import { Client } from '../types';
import { RealApiService } from '../realApiService';

/**
 * Crée un nouveau client avec votre API réelle
 */
export const createClientRecord = async (clientData: Client, beetoolToken?: string): Promise<Client | null> => {
  try {
    // Utiliser le beetoolToken fourni ou générer un ID unique
    const token = beetoolToken || clientData.beetoolToken || `token_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    console.log(`Création du prospect avec beetoolToken: ${token}`);
    
    const createdClient = await RealApiService.createProspect(token, clientData);
    
    if (!createdClient) {
      console.error('Erreur lors de la création du client');
      return null;
    }
    
    console.log('Client créé avec succès:', createdClient);
    return createdClient;
    
  } catch (error) {
    console.error('Erreur lors de la création du client:', error);
    return null;
  }
};

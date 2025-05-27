
/**
 * Service pour récupérer un client par ID - refactorisé
 */
import { Client } from '../types';
import { clientsApiService } from './clientsApiService';

/**
 * Récupère un client par son ID
 */
export const getClientById = async (clientId: string): Promise<Client | null> => {
  console.group(`🔍 getClientById(${clientId}) - Entry Point`);
  
  try {
    console.log('🔄 Delegating to ClientsApiService...');
    const client = await clientsApiService.getClientById(clientId);
    
    if (client) {
      console.log(`✅ getClientById(${clientId}) found client:`, client.name);
    } else {
      console.warn(`⚠️ getClientById(${clientId}) - client not found`);
    }
    
    return client;
    
  } catch (error) {
    console.error(`❌ getClientById(${clientId}) failed:`, error);
    return null;
  } finally {
    console.groupEnd();
  }
};

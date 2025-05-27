
/**
 * Service pour récupérer les données clients - refactorisé avec debug
 */
import { Client } from '../types';
import { clientsApiService } from './clientsApiService';

/**
 * Récupère tous les clients depuis l'API
 */
export const getClients = async (): Promise<Client[]> => {
  console.group('🚀 getClients() - Entry Point');
  
  try {
    console.log('🔄 Delegating to ClientsApiService...');
    const clients = await clientsApiService.getAllClients();
    
    console.log(`✅ getClients() completed successfully with ${clients.length} clients`);
    return clients;
    
  } catch (error) {
    console.error('❌ getClients() failed:', error);
    
    // Log détaillé de l'erreur
    if (error instanceof Error) {
      console.error('📋 Error details:');
      console.error('- Name:', error.name);
      console.error('- Message:', error.message);
      console.error('- Stack:', error.stack);
    }
    
    throw new Error(`Failed to retrieve clients: ${error instanceof Error ? error.message : 'Unknown error'}`);
  } finally {
    console.groupEnd();
  }
};

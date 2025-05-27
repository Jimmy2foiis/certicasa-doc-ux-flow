
/**
 * Service API spécialisé pour les clients avec debug avancé
 */
import { httpClient } from '../httpClient';
import { Client } from '../types';
import { mapProspectToClient } from '../mappers/clientMapper';

export class ClientsApiService {
  private readonly endpoint = '/prospects/';

  async getAllClients(): Promise<Client[]> {
    console.group('🔄 ClientsApiService.getAllClients()');
    
    try {
      console.log('📡 Calling API endpoint:', this.endpoint);
      
      const response = await httpClient.get<any[]>(this.endpoint);
      
      console.log('📋 Raw API response:', response);
      
      if (!response.success) {
        console.error('❌ API call failed:', response.message);
        throw new Error(`API Error: ${response.message}`);
      }
      
      if (!response.data) {
        console.warn('⚠️ No data in response');
        return [];
      }
      
      if (!Array.isArray(response.data)) {
        console.error('❌ Expected array but got:', typeof response.data);
        throw new Error(`Expected array but got ${typeof response.data}`);
      }
      
      console.log(`✅ Received ${response.data.length} prospects from API`);
      
      // Log des données brutes
      if (response.data.length > 0) {
        console.log('📄 Sample prospect data:', response.data[0]);
      }
      
      // Mapping des données
      const clients = response.data.map((prospect, index) => {
        try {
          const client = mapProspectToClient(prospect);
          
          if (index === 0) {
            console.log('🔄 Sample mapped client:', client);
          }
          
          return client;
        } catch (mappingError) {
          console.error(`❌ Mapping error for prospect ${prospect.id}:`, mappingError);
          console.error('📄 Problematic prospect data:', prospect);
          throw mappingError;
        }
      });
      
      console.log(`✅ Successfully mapped ${clients.length} clients`);
      return clients;
      
    } catch (error) {
      console.error('❌ ClientsApiService.getAllClients() failed:', error);
      throw error;
    } finally {
      console.groupEnd();
    }
  }

  async getClientById(clientId: string): Promise<Client | null> {
    console.group(`🔄 ClientsApiService.getClientById(${clientId})`);
    
    try {
      const response = await httpClient.get<any>(`${this.endpoint}${clientId}/`);
      
      if (!response.success || !response.data) {
        console.warn(`⚠️ Client ${clientId} not found via detail endpoint, trying fallback`);
        
        // Fallback: récupérer tous les clients et filtrer
        const allClients = await this.getAllClients();
        const found = allClients.find(c => c.id === clientId);
        
        if (found) {
          console.log(`✅ Found client ${clientId} via fallback`);
          return found;
        }
        
        console.error(`❌ Client ${clientId} not found even with fallback`);
        return null;
      }
      
      const client = mapProspectToClient(response.data);
      console.log(`✅ Found client ${clientId}:`, client);
      return client;
      
    } catch (error) {
      console.error(`❌ Error fetching client ${clientId}:`, error);
      return null;
    } finally {
      console.groupEnd();
    }
  }
}

export const clientsApiService = new ClientsApiService();

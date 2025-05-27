
/**
 * Service for retrieving client data
 */
import { httpClient } from '../httpClient';
import { Client } from '../types';
import { mapProspectToClient } from '../mappers/clientMapper';

/**
 * Fetches all clients from the API
 */
export const getClients = async (): Promise<Client[]> => {
  try {
    console.log('🔄 Début de la récupération des clients depuis l\'API...');
    
    // Récupération depuis l'API prospects
    const response = await httpClient.get<any[]>('/prospects/');
    console.log('📡 Réponse API reçue:', response);
    
    if (response.success && response.data && Array.isArray(response.data)) {
      console.log(`✅ ${response.data.length} prospects reçus de l'API`);
      
      // Log d'un échantillon des données brutes
      if (response.data.length > 0) {
        console.log('📋 Échantillon de prospect brut:', response.data[0]);
      }
      
      // Map API data to Client model
      const clients = response.data.map((prospect, index) => {
        try {
          const mappedClient = mapProspectToClient(prospect);
          if (index === 0) {
            console.log('🔄 Client mappé (échantillon):', mappedClient);
          }
          return mappedClient;
        } catch (mappingError) {
          console.error(`❌ Erreur de mapping pour le prospect ${prospect.id}:`, mappingError);
          console.error('Données du prospect problématique:', prospect);
          throw mappingError;
        }
      });
      
      console.log(`✅ ${clients.length} clients mappés avec succès`);
      return clients;
      
    } else {
      console.warn('⚠️ Format de réponse API inattendu ou données manquantes:', response);
      
      if (!response.success) {
        throw new Error(`Échec de l'API: ${response.message || 'Erreur inconnue'}`);
      }
      
      if (!response.data) {
        throw new Error('Aucune donnée reçue de l\'API');
      }
      
      if (!Array.isArray(response.data)) {
        throw new Error(`Format de données inattendu: ${typeof response.data}`);
      }
      
      return [];
    }
    
  } catch (error) {
    console.error("❌ Erreur lors de la récupération des clients:", error);
    
    // Log détaillé de l'erreur
    if (error instanceof Error) {
      console.error("Type d'erreur:", error.name);
      console.error("Message d'erreur:", error.message);
      console.error("Stack trace:", error.stack);
    }
    
    // Re-throw pour que les composants puissent gérer l'erreur
    throw new Error(`Impossible de récupérer les clients depuis l'API: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
  }
};

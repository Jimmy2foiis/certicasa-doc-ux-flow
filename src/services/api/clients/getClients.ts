/**
 * Service pour récupérer les données clients - refactorisé avec debug
 */
import { Client } from '../types';
import { mapProspectToClient } from '../mappers/clientMapper';

/**
 * Récupère tous les clients depuis l'API
 * Implémentation simplifiée qui fait un fetch natif sur l'endpoint complet.
 */
export const getClients = async (): Promise<Client[]> => {
  console.group('🚀 getClients() - Simple fetch');

  try {
    const response = await fetch('https://cert.mitain.com/api/prospects/');

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const rawProspects: unknown = await response.json();

    if (!Array.isArray(rawProspects)) {
      throw new Error('La réponse attendue devait être un tableau.');
    }

    const clients = (rawProspects as any[]).map(mapProspectToClient);

    console.log(`✅ getClients() completed successfully with ${clients.length} clients`);
    return clients;
  } catch (error) {
    console.error('❌ getClients() failed:', error);
    throw new Error(`Failed to retrieve clients: ${error instanceof Error ? error.message : 'Unknown error'}`);
  } finally {
    console.groupEnd();
  }
};

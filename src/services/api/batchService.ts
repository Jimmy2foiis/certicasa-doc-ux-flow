
/**
 * Service pour la gestion des lots via l'API REST
 */
import { httpClient } from './httpClient';
import { ApiResponse, Batch } from './types';

/**
 * Récupère tous les lots
 */
export const getBatches = async (): Promise<Batch[]> => {
  try {
    // Simuler une réponse de l'API externe car l'endpoint n'existe pas encore
    // À remplacer par l'appel réel quand l'API sera disponible
    const mockBatches: Batch[] = [
      {
        id: "L001",
        name: "LOT-2025-01",
        status: "En cours de dépôt",
        client_count: 15,
        created_at: "2025-01-15T00:00:00Z"
      },
      {
        id: "L002",
        name: "LOT-2025-02",
        status: "Déposé",
        client_count: 23,
        created_at: "2025-02-10T00:00:00Z",
        submitted_at: "2025-02-15T00:00:00Z"
      },
      {
        id: "L003",
        name: "LOT-2025-03",
        status: "Validé",
        client_count: 18,
        created_at: "2025-03-05T00:00:00Z",
        submitted_at: "2025-03-10T00:00:00Z"
      }
    ];
    
    return mockBatches;
  } catch (error) {
    console.error("Erreur lors de la récupération des lots:", error);
    return [];
  }
};

/**
 * Crée un nouveau lot
 */
export const createBatch = async (name: string, clientIds: string[]): Promise<Batch | null> => {
  try {
    // Simuler une création de lot (à remplacer par l'appel API réel quand disponible)
    console.log(`Création du lot "${name}" avec les clients:`, clientIds);
    
    // Génération d'un nouveau lot fictif
    const newBatch: Batch = {
      id: `L${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
      name,
      status: "En cours de dépôt",
      client_count: clientIds.length,
      created_at: new Date().toISOString()
    };
    
    return newBatch;
  } catch (error) {
    console.error("Erreur lors de la création du lot:", error);
    return null;
  }
};

/**
 * Ajoute des clients à un lot existant
 */
export const addClientsToBatch = async (batchId: string, clientIds: string[]): Promise<boolean> => {
  try {
    // Simuler l'ajout de clients à un lot (à remplacer par l'appel API réel)
    console.log(`Ajout de clients au lot ${batchId}:`, clientIds);
    return true;
  } catch (error) {
    console.error("Erreur lors de l'ajout de clients au lot:", error);
    return false;
  }
};

/**
 * Soumet un lot pour dépôt
 */
export const submitBatch = async (batchId: string): Promise<boolean> => {
  try {
    // Simuler la soumission d'un lot (à remplacer par l'appel API réel)
    console.log(`Soumission du lot ${batchId} pour dépôt`);
    return true;
  } catch (error) {
    console.error("Erreur lors de la soumission du lot:", error);
    return false;
  }
};

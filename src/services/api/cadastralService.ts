
/**
 * Service pour la gestion des données cadastrales
 */
import { httpClient } from './httpClient';
import { CadastralData } from './types';

/**
 * Sauvegarde les données cadastrales d'un client
 */
export const saveCadastralData = async (cadastralData: CadastralData): Promise<CadastralData | null> => {
  try {
    // Si l'ID client commence par "local_", on stocke localement
    if (cadastralData.client_id && cadastralData.client_id.toString().startsWith('local_')) {
      const key = `cadastral_${cadastralData.client_id}`;
      const dataWithTimestamp = {
        ...cadastralData,
        created_at: cadastralData.created_at || new Date().toISOString()
      };
      localStorage.setItem(key, JSON.stringify(dataWithTimestamp));
      return dataWithTimestamp;
    }
    
    // Pour l'API externe
    // Note: cet endpoint n'existe peut-être pas encore dans l'API externe
    // À adapter selon les spécifications réelles
    const response = await httpClient.post<CadastralData>(`/cadastral-data/`, cadastralData);
    
    if (!response.success || !response.data) {
      // Fallback vers le stockage local
      const key = `cadastral_${cadastralData.client_id}_fallback`;
      const dataWithTimestamp = {
        ...cadastralData,
        created_at: new Date().toISOString(),
        saved_locally: true,
        api_error: response.message
      };
      localStorage.setItem(key, JSON.stringify(dataWithTimestamp));
      return cadastralData;
    }
    
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la sauvegarde des données cadastrales:", error);
    
    // Fallback vers le stockage local en cas d'erreur
    try {
      const key = `cadastral_${cadastralData.client_id}_fallback`;
      const dataWithTimestamp = {
        ...cadastralData,
        created_at: new Date().toISOString(),
        saved_locally: true,
        error: error instanceof Error ? error.message : 'Erreur inconnue'
      };
      localStorage.setItem(key, JSON.stringify(dataWithTimestamp));
      return cadastralData;
    } catch (localError) {
      console.error("Échec du fallback local:", localError);
      return null;
    }
  }
};

/**
 * Récupère les données cadastrales d'un client
 */
export const getCadastralDataForClient = async (clientId: string): Promise<CadastralData | null> => {
  try {
    // Si l'ID client commence par "local_", on récupère localement
    if (clientId.toString().startsWith('local_')) {
      const key = `cadastral_${clientId}`;
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : null;
    }
    
    // Pour l'API externe
    // Note: cet endpoint n'existe peut-être pas encore dans l'API externe
    // À adapter selon les spécifications réelles
    const response = await httpClient.get<CadastralData>(`/cadastral-data/client/${clientId}`);
    
    if (!response.success || !response.data) {
      // Vérifier le fallback local
      const key = `cadastral_${clientId}_fallback`;
      const localData = localStorage.getItem(key);
      if (localData) {
        return JSON.parse(localData);
      }
      return null;
    }
    
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la récupération des données cadastrales:", error);
    
    // Vérifier le fallback local en cas d'erreur
    const key = `cadastral_${clientId}_fallback`;
    const localData = localStorage.getItem(key);
    if (localData) {
      return JSON.parse(localData);
    }
    
    return null;
  }
};

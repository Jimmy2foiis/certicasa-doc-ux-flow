
/**
 * Service pour la gestion des documents
 */
import { httpClient } from './httpClient';
import { Document } from './types';

/**
 * Récupère tous les documents d'un client
 */
export const getDocumentsForClient = async (clientId: string): Promise<Document[]> => {
  try {
    // Note: cet endpoint n'existe peut-être pas encore dans l'API externe
    // À adapter selon les spécifications réelles
    const response = await httpClient.get<Document[]>(`/prospects/${clientId}/documents`);
    
    if (!response.success || !response.data) {
      console.error(`Erreur lors de la récupération des documents pour le client ${clientId}:`, response.message);
      return [];
    }
    
    return response.data;
  } catch (error) {
    console.error(`Erreur lors de la récupération des documents pour le client ${clientId}:`, error);
    return [];
  }
};

/**
 * Récupère tous les documents d'un projet
 */
export const getDocumentsForProject = async (projectId: string): Promise<Document[]> => {
  try {
    // Note: cet endpoint n'existe peut-être pas encore dans l'API externe
    // À adapter selon les spécifications réelles
    const response = await httpClient.get<Document[]>(`/projects/${projectId}/documents`);
    
    if (!response.success || !response.data) {
      console.error(`Erreur lors de la récupération des documents pour le projet ${projectId}:`, response.message);
      return [];
    }
    
    return response.data;
  } catch (error) {
    console.error(`Erreur lors de la récupération des documents pour le projet ${projectId}:`, error);
    return [];
  }
};

/**
 * Crée un nouveau document
 */
export const createDocument = async (documentData: Document): Promise<Document | null> => {
  try {
    // Déterminer l'endpoint en fonction des données
    let endpoint = '';
    if (documentData.client_id) {
      endpoint = `/prospects/${documentData.client_id}/documents`;
    } else if (documentData.project_id) {
      endpoint = `/projects/${documentData.project_id}/documents`;
    } else {
      console.error("Erreur: client_id ou project_id requis pour créer un document");
      return null;
    }
    
    // Envoi à l'API
    const response = await httpClient.post<Document>(endpoint, documentData);
    
    if (!response.success || !response.data) {
      console.error('Erreur lors de la création du document:', response.message);
      return null;
    }
    
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la création du document:', error);
    return null;
  }
};

/**
 * Met à jour un document existant
 */
export const updateDocument = async (documentId: string, documentData: Partial<Document>): Promise<Document | null> => {
  try {
    // Note: cet endpoint n'existe peut-être pas encore dans l'API externe
    // À adapter selon les spécifications réelles
    const response = await httpClient.patch<Document>(`/documents/${documentId}`, documentData);
    
    if (!response.success || !response.data) {
      console.error(`Erreur lors de la mise à jour du document ${documentId}:`, response.message);
      return null;
    }
    
    return response.data;
  } catch (error) {
    console.error(`Erreur lors de la mise à jour du document ${documentId}:`, error);
    return null;
  }
};

/**
 * Supprime un document
 */
export const deleteDocument = async (documentId: string): Promise<boolean> => {
  try {
    // Note: cet endpoint n'existe peut-être pas encore dans l'API externe
    // À adapter selon les spécifications réelles
    const response = await httpClient.delete<any>(`/documents/${documentId}`);
    return response.success;
  } catch (error) {
    console.error(`Erreur lors de la suppression du document ${documentId}:`, error);
    return false;
  }
};

/**
 * Récupère un document par son ID
 */
export const getDocumentById = async (documentId: string): Promise<Document | null> => {
  try {
    // Note: cet endpoint n'existe peut-être pas encore dans l'API externe
    // À adapter selon les spécifications réelles
    const response = await httpClient.get<Document>(`/documents/${documentId}`);
    
    if (!response.success || !response.data) {
      console.error(`Erreur lors de la récupération du document ${documentId}:`, response.message);
      return null;
    }
    
    return response.data;
  } catch (error) {
    console.error(`Erreur lors de la récupération du document ${documentId}:`, error);
    return null;
  }
};

/**
 * Marque un document comme envoyé
 */
export const markDocumentAsSent = async (documentId: string): Promise<boolean> => {
  try {
    // Note: cet endpoint n'existe peut-être pas encore dans l'API externe
    // À adapter selon les spécifications réelles
    const response = await httpClient.patch<any>(`/documents/${documentId}/status`, { status: 'sent' });
    return response.success;
  } catch (error) {
    console.error(`Erreur lors du marquage du document ${documentId} comme envoyé:`, error);
    return false;
  }
};

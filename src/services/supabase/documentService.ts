
import { supabase } from './supabaseClient';
import { Document } from './types';

// Fonctions pour gérer les documents
export const getDocumentsForClient = async (clientId: string): Promise<Document[]> => {
  // Si l'ID client commence par "local_", on récupère localement
  if (clientId.toString().startsWith('local_')) {
    try {
      const key = `documents_client_${clientId}`;
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error("Erreur lors de la récupération locale des documents du client:", error);
      return [];
    }
  }

  const { data, error } = await supabase
    .from('documents')
    .select('*')
    .eq('client_id', clientId)
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Erreur lors de la récupération des documents du client:', error);
    return [];
  }
  
  return data || [];
};

export const getDocumentsForProject = async (projectId: string): Promise<Document[]> => {
  // Si l'ID du projet commence par "local_" ou "project_", on récupère localement
  if (projectId.toString().startsWith('local_') || projectId.toString().startsWith('project_')) {
    try {
      const key = `documents_project_${projectId}`;
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error("Erreur lors de la récupération locale des documents du projet:", error);
      return [];
    }
  }

  const { data, error } = await supabase
    .from('documents')
    .select('*')
    .eq('project_id', projectId)
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Erreur lors de la récupération des documents du projet:', error);
    return [];
  }
  
  return data || [];
};

export const createDocument = async (documentData: Document): Promise<Document | null> => {
  // Si l'ID client ou projet commence par "local_" ou "project_", on sauvegarde localement
  if ((documentData.client_id && documentData.client_id.toString().startsWith('local_')) || 
      (documentData.project_id && (documentData.project_id.toString().startsWith('local_') || 
                                 documentData.project_id.toString().startsWith('project_')))) {
    try {
      // Générer un ID unique pour le document
      const newDocument = {
        ...documentData,
        id: `doc_${Date.now()}`,
        created_at: new Date().toISOString()
      };
      
      // Sauvegarder pour le client
      if (documentData.client_id) {
        const clientKey = `documents_client_${documentData.client_id}`;
        const clientDocs = localStorage.getItem(clientKey);
        const existingClientDocs = clientDocs ? JSON.parse(clientDocs) : [];
        existingClientDocs.push(newDocument);
        localStorage.setItem(clientKey, JSON.stringify(existingClientDocs));
      }
      
      // Sauvegarder pour le projet
      if (documentData.project_id) {
        const projectKey = `documents_project_${documentData.project_id}`;
        const projectDocs = localStorage.getItem(projectKey);
        const existingProjectDocs = projectDocs ? JSON.parse(projectDocs) : [];
        existingProjectDocs.push(newDocument);
        localStorage.setItem(projectKey, JSON.stringify(existingProjectDocs));
      }
      
      console.log("Document sauvegardé localement:", newDocument);
      return newDocument;
    } catch (error) {
      console.error("Erreur lors de la sauvegarde locale du document:", error);
      return null;
    }
  }

  const { data, error } = await supabase
    .from('documents')
    .insert([documentData])
    .select();
  
  if (error) {
    console.error('Erreur lors de la création du document:', error);
    return null;
  }
  
  return data?.[0] || null;
};

export const updateDocument = async (documentId: string, documentData: Partial<Document>): Promise<Document | null> => {
  // Si l'ID du document commence par "doc_", on met à jour localement
  if (documentId.toString().startsWith('doc_')) {
    try {
      const updateLocalDocuments = (key: string) => {
        const docs = localStorage.getItem(key);
        if (docs) {
          const allDocs = JSON.parse(docs);
          const updatedDocs = allDocs.map((doc: any) => {
            if (doc.id === documentId) {
              return { ...doc, ...documentData };
            }
            return doc;
          });
          localStorage.setItem(key, JSON.stringify(updatedDocs));
        }
      };
      
      // Mettre à jour dans tous les stockages possibles
      // Puisqu'on ne sait pas exactement où il est stocké
      const clientId = documentData.client_id || '';
      const projectId = documentData.project_id || '';
      
      if (clientId) {
        updateLocalDocuments(`documents_client_${clientId}`);
      }
      
      if (projectId) {
        updateLocalDocuments(`documents_project_${projectId}`);
      }
      
      return { ...documentData, id: documentId } as Document;
    } catch (error) {
      console.error("Erreur lors de la mise à jour locale du document:", error);
      return null;
    }
  }

  const { data, error } = await supabase
    .from('documents')
    .update(documentData)
    .eq('id', documentId)
    .select();
  
  if (error) {
    console.error('Erreur lors de la mise à jour du document:', error);
    return null;
  }
  
  return data?.[0] || null;
};

export const deleteDocument = async (documentId: string): Promise<boolean> => {
  // Si l'ID du document commence par "doc_", on supprime localement
  if (documentId.toString().startsWith('doc_')) {
    try {
      // On parcourt toutes les clés potentielles dans localStorage
      // qui pourraient contenir des documents
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('documents_')) {
          const docs = localStorage.getItem(key);
          if (docs) {
            const allDocs = JSON.parse(docs);
            const updatedDocs = allDocs.filter((doc: any) => doc.id !== documentId);
            if (allDocs.length !== updatedDocs.length) {
              // Le document a été trouvé et supprimé
              localStorage.setItem(key, JSON.stringify(updatedDocs));
            }
          }
        }
      }
      return true;
    } catch (error) {
      console.error("Erreur lors de la suppression locale du document:", error);
      return false;
    }
  }

  const { error } = await supabase
    .from('documents')
    .delete()
    .eq('id', documentId);
  
  if (error) {
    console.error('Erreur lors de la suppression du document:', error);
    return false;
  }
  
  return true;
};

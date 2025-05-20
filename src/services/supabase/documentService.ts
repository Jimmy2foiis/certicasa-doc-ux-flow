
import { supabase } from './supabaseClient';
import { Document } from './types';

// Fonctions pour gérer les documents
export const getDocumentsForClient = async (clientId: string): Promise<Document[]> => {
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

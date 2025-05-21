
import { supabase } from '@/integrations/supabase/client';

export interface Document {
  id: string;
  name: string;
  type: string;
  status: string;
  client_id: string | null;
  project_id?: string | null;
  content?: string | null;
  file_path?: string | null;
  created_at: string;
  updated_at?: string | null;
}

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

export const createDocument = async (documentData: Partial<Document>): Promise<Document | null> => {
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

// Récupérer un document par ID
export const getDocumentById = async (documentId: string): Promise<Document | null> => {
  const { data, error } = await supabase
    .from('documents')
    .select('*')
    .eq('id', documentId)
    .single();
  
  if (error) {
    console.error('Erreur lors de la récupération du document:', error);
    return null;
  }
  
  return data || null;
};

// Marquer un document comme envoyé
export const markDocumentAsSent = async (documentId: string): Promise<boolean> => {
  const { error } = await supabase
    .from('documents')
    .update({ status: 'sent', updated_at: new Date().toISOString() })
    .eq('id', documentId);
  
  if (error) {
    console.error('Erreur lors du marquage du document comme envoyé:', error);
    return false;
  }
  
  return true;
};

// Compter les documents par client et statut
export const countDocumentsByStatus = async (clientId: string): Promise<Record<string, number>> => {
  const { data, error } = await supabase
    .from('documents')
    .select('status')
    .eq('client_id', clientId);
  
  if (error) {
    console.error('Erreur lors du comptage des documents:', error);
    return {};
  }
  
  // Compter les documents par statut
  const counts: Record<string, number> = {};
  data.forEach(doc => {
    const status = doc.status || 'unknown';
    counts[status] = (counts[status] || 0) + 1;
  });
  
  return counts;
};


import { createClient } from '@supabase/supabase-js';

// Constantes de configuration Supabase
const SUPABASE_URL = 'https://tedweevlyvduuxndixsl.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRlZHdlZXZseXZkdXV4bmRpeHNsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc3NjUyNDgsImV4cCI6MjA2MzM0MTI0OH0.C2ofsxnXb2_mUt6EOISxx7YetMQ62n9ZNSox5b-s-jY';

// Types pour les données
export interface Client {
  id?: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  nif?: string;
  type?: string;
  status?: string;
  projects?: number;
  created_at?: string;
}

export interface CadastralData {
  id?: string;
  client_id: string;
  utm_coordinates?: string;
  cadastral_reference?: string;
  climate_zone?: string;
  api_source?: string;
  created_at?: string;
}

export interface Project {
  id?: string;
  client_id: string;
  name: string;
  type?: string;
  status?: string;
  surface_area?: number;
  roof_area?: number;
  created_at?: string;
  completion_date?: string;
}

export interface Calculation {
  id?: string;
  project_id: string;
  before_layers?: any;
  after_layers?: any;
  project_type?: string;
  surface_area?: number;
  roof_area?: number;
  ventilation_before?: number;
  ventilation_after?: number;
  ratio_before?: number;
  ratio_after?: number;
  u_value_before?: number;
  u_value_after?: number;
  improvement_percent?: number;
  climate_zone?: string;
  created_at?: string;
  meets_requirements?: boolean;
}

export interface Document {
  id?: string;
  project_id?: string;
  client_id?: string;
  name: string;
  type?: string;
  status?: string;
  file_path?: string;
  created_at?: string;
}

// Création du client Supabase
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Fonctions d'authentification
export const signUp = async (email: string, password: string) => {
  return await supabase.auth.signUp({
    email,
    password,
  });
};

export const signIn = async (email: string, password: string) => {
  return await supabase.auth.signInWithPassword({
    email,
    password,
  });
};

export const signOut = async () => {
  return await supabase.auth.signOut();
};

export const getCurrentUser = async () => {
  return await supabase.auth.getUser();
};

// Fonctions pour gérer les clients
export const getClients = async (): Promise<Client[]> => {
  const { data, error } = await supabase
    .from('clients')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Erreur lors de la récupération des clients:', error);
    return [];
  }
  
  return data || [];
};

export const getClientById = async (clientId: string): Promise<Client | null> => {
  const { data, error } = await supabase
    .from('clients')
    .select('*')
    .eq('id', clientId)
    .single();
  
  if (error) {
    console.error('Erreur lors de la récupération du client:', error);
    return null;
  }
  
  return data;
};

export const createClientRecord = async (clientData: Client): Promise<Client | null> => {
  const { data, error } = await supabase
    .from('clients')
    .insert([clientData])
    .select();
  
  if (error) {
    console.error('Erreur lors de la création du client:', error);
    return null;
  }
  
  return data?.[0] || null;
};

export const updateClientRecord = async (clientId: string, clientData: Partial<Client>): Promise<Client | null> => {
  const { data, error } = await supabase
    .from('clients')
    .update(clientData)
    .eq('id', clientId)
    .select();
  
  if (error) {
    console.error('Erreur lors de la mise à jour du client:', error);
    return null;
  }
  
  return data?.[0] || null;
};

export const deleteClientRecord = async (clientId: string): Promise<boolean> => {
  const { error } = await supabase
    .from('clients')
    .delete()
    .eq('id', clientId);
  
  if (error) {
    console.error('Erreur lors de la suppression du client:', error);
    return false;
  }
  
  return true;
};

// Fonctions pour gérer les données cadastrales
export const saveCadastralData = async (cadastralData: CadastralData): Promise<CadastralData | null> => {
  const { data, error } = await supabase
    .from('cadastral_data')
    .insert([cadastralData])
    .select();
  
  if (error) {
    console.error('Erreur lors de la sauvegarde des données cadastrales:', error);
    return null;
  }
  
  return data?.[0] || null;
};

export const getCadastralDataForClient = async (clientId: string): Promise<CadastralData | null> => {
  const { data, error } = await supabase
    .from('cadastral_data')
    .select('*')
    .eq('client_id', clientId)
    .order('created_at', { ascending: false })
    .limit(1);
  
  if (error) {
    console.error('Erreur lors de la récupération des données cadastrales:', error);
    return null;
  }
  
  return data?.[0] || null;
};

// Fonctions pour gérer les projets
export const getProjectsForClient = async (clientId: string): Promise<Project[]> => {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('client_id', clientId)
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Erreur lors de la récupération des projets du client:', error);
    return [];
  }
  
  return data || [];
};

export const createProject = async (projectData: Project): Promise<Project | null> => {
  const { data, error } = await supabase
    .from('projects')
    .insert([projectData])
    .select();
  
  if (error) {
    console.error('Erreur lors de la création du projet:', error);
    return null;
  }
  
  // Update client's project count
  await updateClientProjectCount(projectData.client_id);
  
  return data?.[0] || null;
};

export const updateProject = async (projectId: string, projectData: Partial<Project>): Promise<Project | null> => {
  const { data, error } = await supabase
    .from('projects')
    .update(projectData)
    .eq('id', projectId)
    .select();
  
  if (error) {
    console.error('Erreur lors de la mise à jour du projet:', error);
    return null;
  }
  
  return data?.[0] || null;
};

export const deleteProject = async (projectId: string, clientId: string): Promise<boolean> => {
  const { error } = await supabase
    .from('projects')
    .delete()
    .eq('id', projectId);
  
  if (error) {
    console.error('Erreur lors de la suppression du projet:', error);
    return false;
  }
  
  // Update client's project count
  await updateClientProjectCount(clientId);
  
  return true;
};

// Helper function to update client's project count
export const updateClientProjectCount = async (clientId: string): Promise<void> => {
  try {
    // Get the count of projects for the client
    const { count, error } = await supabase
      .from('projects')
      .select('*', { count: 'exact', head: true })
      .eq('client_id', clientId);
    
    if (error) {
      console.error('Erreur lors du comptage des projets:', error);
      return;
    }
    
    // Update the client's project count
    await supabase
      .from('clients')
      .update({ projects: count || 0 })
      .eq('id', clientId);
  } catch (error) {
    console.error('Erreur lors de la mise à jour du nombre de projets du client:', error);
  }
};

// Fonctions pour gérer les calculs
export const getCalculationsForProject = async (projectId: string): Promise<Calculation[]> => {
  const { data, error } = await supabase
    .from('calculations')
    .select('*')
    .eq('project_id', projectId)
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Erreur lors de la récupération des calculs du projet:', error);
    return [];
  }
  
  return data || [];
};

export const createCalculation = async (calculationData: Calculation): Promise<Calculation | null> => {
  const { data, error } = await supabase
    .from('calculations')
    .insert([calculationData])
    .select();
  
  if (error) {
    console.error('Erreur lors de la création du calcul:', error);
    return null;
  }
  
  return data?.[0] || null;
};

export const updateCalculation = async (calculationId: string, calculationData: Partial<Calculation>): Promise<Calculation | null> => {
  const { data, error } = await supabase
    .from('calculations')
    .update(calculationData)
    .eq('id', calculationId)
    .select();
  
  if (error) {
    console.error('Erreur lors de la mise à jour du calcul:', error);
    return null;
  }
  
  return data?.[0] || null;
};

export const deleteCalculation = async (calculationId: string): Promise<boolean> => {
  const { error } = await supabase
    .from('calculations')
    .delete()
    .eq('id', calculationId);
  
  if (error) {
    console.error('Erreur lors de la suppression du calcul:', error);
    return false;
  }
  
  return true;
};

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

// Fonction pour mettre à jour le hook useClientData
export const updateClientDataHook = (): void => {
  console.log('Implémentation requise: mise à jour du hook useClientData pour utiliser Supabase');
};

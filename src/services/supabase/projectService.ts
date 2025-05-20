
import { supabase } from './supabaseClient';
import { Project } from './types';
import { updateClientProjectCount } from './utilsService';

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

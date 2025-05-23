// @ts-nocheck

import { supabase } from './supabaseClient';
import { Project } from './types';
import { updateClientProjectCount } from './utilsService';

// Fonctions pour gérer les projets
export const getProjectsForClient = async (clientId: string): Promise<Project[]> => {
  // Si l'ID client commence par "local_", on récupère localement
  if (clientId.toString().startsWith('local_')) {
    try {
      const key = `projects_${clientId}`;
      const data = localStorage.getItem(key);
      if (data) {
        return JSON.parse(data);
      }
      
      // Fallback: chercher dans les calculs sauvegardés
      const savedCalculations = localStorage.getItem('saved_calculations');
      if (savedCalculations) {
        const calculations = JSON.parse(savedCalculations);
        const projectIds = new Set<string>();
        const projects: Project[] = [];
        
        calculations.forEach((calc: any) => {
          if (calc.clientId === clientId && !projectIds.has(calc.projectId)) {
            projectIds.add(calc.projectId);
            projects.push({
              id: calc.projectId,
              client_id: clientId,
              name: calc.projectName || `Projet ${projects.length + 1}`,
              type: calc.type || "Réhabilitation",
              status: "En cours",
              surface_area: calc.surface || 0,
              created_at: calc.date || new Date().toISOString()
            });
          }
        });
        
        return projects;
      }
      
      return [];
    } catch (error) {
      console.error("Erreur lors de la récupération locale des projets:", error);
      return [];
    }
  }

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
  // Si l'ID client commence par "local_", on sauvegarde localement
  if (projectData.client_id && projectData.client_id.toString().startsWith('local_')) {
    try {
      const newProject = {
        ...projectData,
        id: `project_${Date.now()}`,
        created_at: new Date().toISOString()
      };
      
      const key = `projects_${projectData.client_id}`;
      const existingData = localStorage.getItem(key);
      const projects = existingData ? JSON.parse(existingData) : [];
      
      projects.push(newProject);
      localStorage.setItem(key, JSON.stringify(projects));
      
      // Mise à jour du compteur de projets
      const clientKey = 'local_clients';
      const clientsData = localStorage.getItem(clientKey);
      if (clientsData) {
        const clients = JSON.parse(clientsData);
        const updatedClients = clients.map((c: any) => {
          if (c.id === projectData.client_id) {
            return { ...c, projects: (c.projects || 0) + 1 };
          }
          return c;
        });
        localStorage.setItem(clientKey, JSON.stringify(updatedClients));
      }
      
      return newProject;
    } catch (error) {
      console.error("Erreur lors de la création locale du projet:", error);
      return null;
    }
  }

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
  // Si l'ID du projet commence par "project_" ou "local_", on met à jour localement
  if (projectId.toString().startsWith('project_') || projectId.toString().startsWith('local_')) {
    try {
      const clientId = projectData.client_id;
      if (!clientId) {
        // On doit connaître le client pour mettre à jour le projet
        return null;
      }
      
      const key = `projects_${clientId}`;
      const existingData = localStorage.getItem(key);
      if (existingData) {
        const projects = JSON.parse(existingData);
        const updatedProjects = projects.map((proj: any) => {
          if (proj.id === projectId) {
            return { ...proj, ...projectData };
          }
          return proj;
        });
        
        localStorage.setItem(key, JSON.stringify(updatedProjects));
        
        const updatedProject = updatedProjects.find((proj: any) => proj.id === projectId);
        if (updatedProject) {
          return updatedProject;
        }
      }
      
      return null;
    } catch (error) {
      console.error("Erreur lors de la mise à jour locale du projet:", error);
      return null;
    }
  }

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
  // Si l'ID du projet commence par "project_" ou "local_", on supprime localement
  if (projectId.toString().startsWith('project_') || projectId.toString().startsWith('local_')) {
    try {
      const key = `projects_${clientId}`;
      const existingData = localStorage.getItem(key);
      if (existingData) {
        const projects = JSON.parse(existingData);
        const updatedProjects = projects.filter((proj: any) => proj.id !== projectId);
        
        localStorage.setItem(key, JSON.stringify(updatedProjects));
        
        // Mise à jour du compteur de projets dans client
        const clientKey = 'local_clients';
        const clientsData = localStorage.getItem(clientKey);
        if (clientsData) {
          const clients = JSON.parse(clientsData);
          const updatedClients = clients.map((c: any) => {
            if (c.id === clientId) {
              const newCount = Math.max(0, (c.projects || 1) - 1);
              return { ...c, projects: newCount };
            }
            return c;
          });
          localStorage.setItem(clientKey, JSON.stringify(updatedClients));
        }
        
        // Supprimer également les calculs associés
        const savedCalculations = localStorage.getItem('saved_calculations');
        if (savedCalculations) {
          const calculations = JSON.parse(savedCalculations);
          const updatedCalculations = calculations.filter((calc: any) => calc.projectId !== projectId);
          localStorage.setItem('saved_calculations', JSON.stringify(updatedCalculations));
        }
        
        return true;
      }
      
      return false;
    } catch (error) {
      console.error("Erreur lors de la suppression locale du projet:", error);
      return false;
    }
  }

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

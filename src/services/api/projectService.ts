/**
 * Service pour la gestion des projets
 */
import { httpClient } from './httpClient';
import { Project } from './types';

/**
 * Récupère tous les projets d'un client
 */
export const getProjectsForClient = async (clientId: string): Promise<Project[]> => {
  // Si l'ID client commence par "local_", on récupère localement
  if (clientId.toString().startsWith('local_')) {
    try {
      const key = `projects_${clientId}`;
      const data = localStorage.getItem(key);
      if (data) {
        return JSON.parse(data);
      }
      return [];
    } catch (error) {
      console.error("Erreur lors de la récupération locale des projets:", error);
      return [];
    }
  }

  try {
    // Note: cet endpoint n'existe peut-être pas encore dans l'API externe
    // À adapter selon les spécifications réelles
    const response = await httpClient.get<Project[]>(`/prospects/${clientId}/projects/`);
    
    if (!response.success || !response.data) {
      console.error(`Erreur lors de la récupération des projets pour le client ${clientId}:`, response.message);
      return [];
    }
    
    return response.data;
  } catch (error) {
    console.error(`Erreur lors de la récupération des projets pour le client ${clientId}:`, error);
    return [];
  }
};

/**
 * Crée un nouveau projet
 */
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
      
      return newProject;
    } catch (error) {
      console.error("Erreur lors de la création locale du projet:", error);
      return null;
    }
  }

  try {
    // Note: cet endpoint n'existe peut-être pas encore dans l'API externe
    // À adapter selon les spécifications réelles
    const response = await httpClient.post<Project>(`/prospects/${projectData.client_id}/projects`, projectData);
    
    if (!response.success || !response.data) {
      console.error('Erreur lors de la création du projet:', response.message);
      return null;
    }
    
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la création du projet:', error);
    return null;
  }
};

/**
 * Met à jour un projet existant
 */
export const updateProject = async (projectId: string, projectData: Partial<Project>): Promise<Project | null> => {
  // Si l'ID du projet commence par "project_" ou "local_", on met à jour localement
  if (projectId.toString().startsWith('project_') || projectId.toString().startsWith('local_')) {
    try {
      const clientId = projectData.client_id;
      if (!clientId) {
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
        
        return updatedProjects.find((proj: any) => proj.id === projectId);
      }
      
      return null;
    } catch (error) {
      console.error("Erreur lors de la mise à jour locale du projet:", error);
      return null;
    }
  }

  try {
    // Note: cet endpoint n'existe peut-être pas encore dans l'API externe
    // À adapter selon les spécifications réelles
    const response = await httpClient.patch<Project>(`/projects/${projectId}`, projectData);
    
    if (!response.success || !response.data) {
      console.error(`Erreur lors de la mise à jour du projet ${projectId}:`, response.message);
      return null;
    }
    
    return response.data;
  } catch (error) {
    console.error(`Erreur lors de la mise à jour du projet ${projectId}:`, error);
    return null;
  }
};

/**
 * Supprime un projet
 */
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
        return true;
      }
      
      return false;
    } catch (error) {
      console.error("Erreur lors de la suppression locale du projet:", error);
      return false;
    }
  }

  try {
    // Note: cet endpoint n'existe peut-être pas encore dans l'API externe
    // À adapter selon les spécifications réelles
    const response = await httpClient.delete<any>(`/projects/${projectId}`);
    return response.success;
  } catch (error) {
    console.error(`Erreur lors de la suppression du projet ${projectId}:`, error);
    return false;
  }
};

/**
 * Met à jour le compteur de projets d'un client
 */
export const updateClientProjectCount = async (clientId: string): Promise<void> => {
  if (clientId.toString().startsWith('local_')) {
    // Pour les clients locaux, mise à jour du compteur dans le localStorage
    const projects = await getProjectsForClient(clientId);
    const clientsKey = 'local_clients';
    const clientsData = localStorage.getItem(clientsKey);
    
    if (clientsData) {
      const clients = JSON.parse(clientsData);
      const updatedClients = clients.map((c: any) => {
        if (c.id === clientId) {
          return { ...c, projects: projects.length };
        }
        return c;
      });
      
      localStorage.setItem(clientsKey, JSON.stringify(updatedClients));
    }
    return;
  }

  try {
    // Cette fonction peut être adaptée pour appeler une API qui met à jour le compteur
    // ou simplement être utilisée côté client pour la gestion de l'interface
    const projects = await getProjectsForClient(clientId);
    const projectCount = projects.length;
    
    // Option 1: Mise à jour via un endpoint dédié (si disponible)
    // await httpClient.patch(`/prospects/${clientId}/update-project-count`, { count: projectCount });
    
    // Option 2: Mise à jour via l'endpoint standard du client
    // await updateClientRecord(clientId, { projects: projectCount });
    
    console.log(`Compteur de projets mis à jour pour le client ${clientId}: ${projectCount}`);
  } catch (error) {
    console.error(`Erreur lors de la mise à jour du compteur de projets pour le client ${clientId}:`, error);
  }
};

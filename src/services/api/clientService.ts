/**
 * Service pour la gestion des clients via l'API REST
 */
import { httpClient } from './httpClient';
import { ApiResponse, Client } from './types';

/**
 * Récupère tous les clients depuis l'API
 */
export const getClients = async (): Promise<Client[]> => {
  try {
    const response = await httpClient.get<any[]>('/prospects/');
    
    if (!response.success || !response.data) {
      console.error('Erreur lors de la récupération des clients:', response.message);
      return [];
    }
    
    // Adapter le format des données de l'API externe
    const clients: Client[] = response.data.map((prospect: any) => ({
      id: prospect.id?.toString() || '',
      name: prospect.prenom ? `${prospect.prenom} ${prospect.nom || ''}`.trim() : (prospect.nom || 'Client sans nom'),
      email: prospect.email || '',
      phone: prospect.tel || prospect.telephone || '',
      address: prospect.adresse || '',
      nif: prospect.nif || '',
      type: prospect.type || 'RES010',
      status: "Actif",
      projects: 0, // À compléter avec une requête séparée si besoin
      created_at: prospect.createdAt || new Date().toISOString()
    }));

    return clients;
  } catch (error) {
    console.error("Erreur lors de la récupération des clients:", error);
    return [];
  }
};

/**
 * Récupère un client par son identifiant
 */
export const getClientById = async (clientId: string): Promise<Client | null> => {
  try {
    // La plupart des frameworks REST (Django REST Framework, FastAPI, etc.)
    // exposent la vue détail avec un slash final « /prospects/:id/ » alors
    // que la vue liste se trouve sur « /prospects/ ». Sans ce slash final, le
    // serveur renvoie souvent un 404. Nous ajoutons donc le slash ici pour
    // garantir la compatibilité.
    const response = await httpClient.get<any>(`/prospects/${clientId}/`);
    
    if (!response.success || !response.data) {
      console.error(`Erreur lors de la récupération du client ${clientId}:`, response.message);
      return null;
    }
    
    const prospect = response.data;
    
    // Adapter le format des données
    const client: Client = {
      id: prospect.id?.toString() || '',
      name: prospect.prenom ? `${prospect.prenom} ${prospect.nom || ''}`.trim() : (prospect.nom || 'Client sans nom'),
      email: prospect.email || '',
      phone: prospect.tel || prospect.telephone || '',
      address: prospect.adresse || '',
      nif: prospect.nif || '',
      type: prospect.type || 'RES010',
      status: "Actif",
      projects: 0, // À compléter avec une requête séparée si besoin
      created_at: prospect.createdAt || new Date().toISOString()
    };

    return client;
  } catch (error) {
    console.error(`Erreur lors de la récupération du client ${clientId}:`, error);
    return null;
  }
};

/**
 * Crée un nouveau client
 */
export const createClientRecord = async (clientData: Client): Promise<Client | null> => {
  try {
    // Transformer les données au format attendu par l'API
    const requestData = {
      prenom: clientData.name.split(' ').slice(0, -1).join(' ') || clientData.name,
      nom: clientData.name.split(' ').slice(-1).join(' ') || '',
      email: clientData.email || '',
      tel: clientData.phone || '',
      adresse: clientData.address || '',
      nif: clientData.nif || '',
    };
    
    const response = await httpClient.post<any>('/prospects/', requestData);
    
    if (!response.success || !response.data) {
      console.error('Erreur lors de la création du client:', response.message);
      return null;
    }
    
    const createdProspect = response.data;
    
    // Adapter le format des données
    const client: Client = {
      id: createdProspect.id?.toString() || '',
      name: createdProspect.prenom ? `${createdProspect.prenom} ${createdProspect.nom || ''}`.trim() : (createdProspect.nom || 'Client sans nom'),
      email: createdProspect.email || '',
      phone: createdProspect.tel || createdProspect.telephone || '',
      address: createdProspect.adresse || '',
      nif: createdProspect.nif || '',
      type: createdProspect.type || 'RES010',
      status: "Actif",
      projects: 0, 
      created_at: createdProspect.createdAt || new Date().toISOString()
    };

    return client;
  } catch (error) {
    console.error('Erreur lors de la création du client:', error);
    return null;
  }
};

/**
 * Met à jour un client existant
 */
export const updateClientRecord = async (clientId: string, clientData: Partial<Client>): Promise<Client | null> => {
  try {
    // Transformer les données au format attendu par l'API
    const requestData: Record<string, any> = {};
    
    if (clientData.name) {
      const nameParts = clientData.name.split(' ');
      requestData.prenom = nameParts.slice(0, -1).join(' ') || clientData.name;
      requestData.nom = nameParts.slice(-1).join(' ') || '';
    }
    
    if (clientData.email) requestData.email = clientData.email;
    if (clientData.phone) requestData.tel = clientData.phone;
    if (clientData.address) requestData.adresse = clientData.address;
    if (clientData.nif) requestData.nif = clientData.nif;
    
    const response = await httpClient.patch<any>(`/prospects/${clientId}`, requestData);
    
    if (!response.success || !response.data) {
      console.error(`Erreur lors de la mise à jour du client ${clientId}:`, response.message);
      return null;
    }
    
    const updatedProspect = response.data;
    
    // Adapter le format des données
    const client: Client = {
      id: updatedProspect.id?.toString() || '',
      name: updatedProspect.prenom ? `${updatedProspect.prenom} ${updatedProspect.nom || ''}`.trim() : (updatedProspect.nom || 'Client sans nom'),
      email: updatedProspect.email || '',
      phone: updatedProspect.tel || updatedProspect.telephone || '',
      address: updatedProspect.adresse || '',
      nif: updatedProspect.nif || '',
      type: updatedProspect.type || 'RES010',
      status: "Actif",
      projects: 0, // À compléter avec une requête séparée si besoin
      created_at: updatedProspect.createdAt || new Date().toISOString()
    };

    return client;
  } catch (error) {
    console.error(`Erreur lors de la mise à jour du client ${clientId}:`, error);
    return null;
  }
};

/**
 * Supprime un client
 */
export const deleteClientRecord = async (clientId: string): Promise<boolean> => {
  try {
    const response = await httpClient.delete<any>(`/prospects/${clientId}`);
    return response.success;
  } catch (error) {
    console.error(`Erreur lors de la suppression du client ${clientId}:`, error);
    return false;
  }
};

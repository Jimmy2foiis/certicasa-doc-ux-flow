
import { Client } from './types';
import { API_BASE_URL } from './config';

/**
 * Retrieves all clients from the API
 */
export const getClients = async (): Promise<Client[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/prospects/`);
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Adapter le format des données de l'API externe au format attendu par l'interface
    const adaptedClients: Client[] = data.map((prospect: any) => ({
      id: prospect.id.toString(),
      name: prospect.name || prospect.company_name || "Client sans nom",
      email: prospect.email,
      phone: prospect.phone,
      address: prospect.address,
      nif: prospect.nif || prospect.tax_id,
      type: prospect.type || "RES010",
      status: prospect.status || "Actif",
      projects: prospect.projects_count || 0,
      created_at: prospect.created_at || new Date().toISOString()
    }));

    console.log('Clients récupérés depuis l\'API:', adaptedClients);
    return adaptedClients;
  } catch (error) {
    console.error('Erreur lors de la récupération des clients depuis l\'API:', error);
    return [];
  }
};

/**
 * Retrieves a specific client by ID
 */
export const getClientById = async (clientId: string): Promise<Client | null> => {
  try {
    const response = await fetch(`${API_BASE_URL}/prospects/${clientId}`);
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    const prospect = await response.json();
    
    // Adapter le format des données
    const adaptedClient: Client = {
      id: prospect.id.toString(),
      name: prospect.name || prospect.company_name || "Client sans nom",
      email: prospect.email,
      phone: prospect.phone,
      address: prospect.address,
      nif: prospect.nif || prospect.tax_id,
      type: prospect.type || "RES010",
      status: prospect.status || "Actif",
      projects: prospect.projects_count || 0,
      created_at: prospect.created_at || new Date().toISOString()
    };

    return adaptedClient;
  } catch (error) {
    console.error('Erreur lors de la récupération du client depuis l\'API:', error);
    return null;
  }
};

/**
 * Creates a new client record
 */
export const createClientRecord = async (clientData: Client): Promise<Client | null> => {
  try {
    const response = await fetch(`${API_BASE_URL}/prospects/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: clientData.name,
        email: clientData.email,
        phone: clientData.phone,
        address: clientData.address,
        nif: clientData.nif,
        type: clientData.type || "RES010",
        status: clientData.status || "Actif"
      })
    });
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    const createdProspect = await response.json();
    
    // Adapter le format des données
    const adaptedClient: Client = {
      id: createdProspect.id.toString(),
      name: createdProspect.name || createdProspect.company_name || "Client sans nom", 
      email: createdProspect.email,
      phone: createdProspect.phone,
      address: createdProspect.address,
      nif: createdProspect.nif || createdProspect.tax_id,
      type: createdProspect.type || "RES010",
      status: createdProspect.status || "Actif",
      projects: createdProspect.projects_count || 0,
      created_at: createdProspect.created_at || new Date().toISOString()
    };

    return adaptedClient;
  } catch (error) {
    console.error('Erreur lors de la création du client dans l\'API:', error);
    return null;
  }
};

/**
 * Updates an existing client record
 */
export const updateClientRecord = async (clientId: string, clientData: Partial<Client>): Promise<Client | null> => {
  try {
    const response = await fetch(`${API_BASE_URL}/prospects/${clientId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(clientData)
    });
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    const updatedProspect = await response.json();
    
    // Adapter le format des données
    const adaptedClient: Client = {
      id: updatedProspect.id.toString(),
      name: updatedProspect.name || updatedProspect.company_name || "Client sans nom",
      email: updatedProspect.email,
      phone: updatedProspect.phone,
      address: updatedProspect.address,
      nif: updatedProspect.nif || updatedProspect.tax_id,
      type: updatedProspect.type || "RES010",
      status: updatedProspect.status || "Actif",
      projects: updatedProspect.projects_count || 0,
      created_at: updatedProspect.created_at || new Date().toISOString()
    };

    return adaptedClient;
  } catch (error) {
    console.error('Erreur lors de la mise à jour du client dans l\'API:', error);
    return null;
  }
};

/**
 * Deletes a client record
 */
export const deleteClientRecord = async (clientId: string): Promise<boolean> => {
  try {
    const response = await fetch(`${API_BASE_URL}/prospects/${clientId}`, {
      method: 'DELETE'
    });
    
    return response.ok;
  } catch (error) {
    console.error('Erreur lors de la suppression du client dans l\'API:', error);
    return false;
  }
};

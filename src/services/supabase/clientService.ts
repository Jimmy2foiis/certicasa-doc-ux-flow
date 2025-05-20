
import { supabase } from './supabaseClient';
import { Client } from './types';

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
  try {
    const { data, error } = await supabase
      .from('clients')
      .insert([clientData])
      .select();
    
    if (error) {
      console.error('Erreur lors de la création du client:', error);
      
      // On stocke toujours localement, même en cas d'erreur RLS 
      // (pour compatibilité avec le comportement précédent)
      const localClient = {
        ...clientData,
        id: `local_${Date.now()}`,
        created_at: new Date().toISOString(),
        status: "Actif"
      };
      
      // Stocker localement
      const existingClients = localStorage.getItem('local_clients');
      const clients = existingClients ? JSON.parse(existingClients) : [];
      clients.push(localClient);
      localStorage.setItem('local_clients', JSON.stringify(clients));
      
      return localClient;
    }
    
    return data?.[0] || null;
  } catch (error) {
    console.error('Exception lors de la création du client:', error);
    return null;
  }
};

export const updateClientRecord = async (clientId: string, clientData: Partial<Client>): Promise<Client | null> => {
  // Vérifier s'il s'agit d'un client local
  if (clientId.startsWith('local_')) {
    try {
      const localClientsString = localStorage.getItem('local_clients');
      if (localClientsString) {
        const localClients = JSON.parse(localClientsString);
        const updatedClients = localClients.map((client: Client) => {
          if (client.id === clientId) {
            return { ...client, ...clientData };
          }
          return client;
        });
        localStorage.setItem('local_clients', JSON.stringify(updatedClients));
        
        const updatedClient = updatedClients.find((client: Client) => client.id === clientId);
        return updatedClient || null;
      }
      return null;
    } catch (error) {
      console.error('Erreur lors de la mise à jour du client local:', error);
      return null;
    }
  }
  
  // Si c'est un client Supabase
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
  // Vérifier s'il s'agit d'un client local
  if (clientId.startsWith('local_')) {
    try {
      const localClientsString = localStorage.getItem('local_clients');
      if (localClientsString) {
        const localClients = JSON.parse(localClientsString);
        const updatedClients = localClients.filter((client: Client) => client.id !== clientId);
        localStorage.setItem('local_clients', JSON.stringify(updatedClients));
        return true;
      }
      return false;
    } catch (error) {
      console.error('Erreur lors de la suppression du client local:', error);
      return false;
    }
  }
  
  // Si c'est un client Supabase
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


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
    
    // Si c'est une erreur RLS ou autre, on utilise uniquement les clients locaux
    const localClientsString = localStorage.getItem('local_clients');
    const localClients = localClientsString ? JSON.parse(localClientsString) : [];
    return localClients;
  }
  
  // Si Supabase a réussi, on combine avec les clients locaux
  const localClientsString = localStorage.getItem('local_clients');
  const localClients = localClientsString ? JSON.parse(localClientsString) : [];
  
  // Combiner les deux sources
  return [...(data || []), ...localClients];
};

export const getClientById = async (clientId: string): Promise<Client | null> => {
  // Vérifier d'abord si c'est un client local
  if (clientId.startsWith('local_')) {
    const localClientsString = localStorage.getItem('local_clients');
    if (localClientsString) {
      const localClients = JSON.parse(localClientsString);
      const client = localClients.find((c: Client) => c.id === clientId);
      return client || null;
    }
    return null;
  }
  
  // Si ce n'est pas un client local, interroger Supabase
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
    // Toujours stocker localement d'abord pour éviter la perte de données
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
    console.log('Client créé localement:', localClient);
    
    // Essayer de créer dans Supabase ensuite (mais continuer même en cas d'échec)
    const { data, error } = await supabase
      .from('clients')
      .insert([clientData])
      .select();
    
    if (error) {
      console.error('Erreur lors de la création du client dans Supabase:', error);
      // On retourne le client local puisque Supabase a échoué
      return localClient;
    }
    
    // Si Supabase a réussi, on supprime le client local et on retourne le client Supabase
    const updatedClients = clients.filter((c: Client) => c.id !== localClient.id);
    localStorage.setItem('local_clients', JSON.stringify(updatedClients));
    console.log('Client créé dans Supabase:', data?.[0]);
    return data?.[0] || localClient;
  } catch (error) {
    console.error('Exception lors de la création du client:', error);
    // En cas d'erreur, on retourne le dernier client local créé
    const localClientsString = localStorage.getItem('local_clients');
    if (localClientsString) {
      const localClients = JSON.parse(localClientsString);
      return localClients[localClients.length - 1] || null;
    }
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
    // Stocker localement en cas d'échec Supabase
    try {
      const client = await getClientById(clientId);
      if (client) {
        const localClient = {
          ...client,
          ...clientData,
          id: `local_${Date.now()}`,
        };
        
        const localClientsString = localStorage.getItem('local_clients');
        const localClients = localClientsString ? JSON.parse(localClientsString) : [];
        localClients.push(localClient);
        localStorage.setItem('local_clients', JSON.stringify(localClients));
        
        return localClient;
      }
    } catch (localError) {
      console.error('Erreur lors du stockage local du client mis à jour:', localError);
    }
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
    console.error('Erreur lors de la suppression du client dans Supabase:', error);
    // Marquer comme supprimé localement
    try {
      const client = await getClientById(clientId);
      if (client) {
        const localClientsToDeleteString = localStorage.getItem('local_clients_to_delete') || '[]';
        const localClientsToDelete = JSON.parse(localClientsToDeleteString);
        localClientsToDelete.push(clientId);
        localStorage.setItem('local_clients_to_delete', JSON.stringify(localClientsToDelete));
      }
    } catch (localError) {
      console.error('Erreur lors du marquage local du client comme supprimé:', localError);
    }
    return false;
  }
  
  return true;
};

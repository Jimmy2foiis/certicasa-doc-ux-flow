
import { supabase } from './supabaseClient';
import { Client } from './types';

// Fonctions pour gérer les clients
export const getClients = async (): Promise<Client[]> => {
  try {
    // Essayer d'abord de récupérer depuis Supabase
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .order('created_at', { ascending: false });
    
    // Récupérer les clients locaux dans tous les cas
    const localClientsString = localStorage.getItem('local_clients');
    const localClients = localClientsString ? JSON.parse(localClientsString) : [];
    
    if (error) {
      console.error('Erreur lors de la récupération des clients depuis Supabase:', error);
      // En cas d'erreur, retourner uniquement les clients locaux
      return localClients;
    }
    
    // En cas de succès, combiner les deux sources
    return [...(data || []), ...localClients];
  } catch (error) {
    console.error('Exception lors de la récupération des clients:', error);
    // En cas d'exception, essayer de retourner les clients locaux
    const localClientsString = localStorage.getItem('local_clients');
    return localClientsString ? JSON.parse(localClientsString) : [];
  }
};

export const getClientById = async (clientId: string): Promise<Client | null> => {
  try {
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
      console.error('Erreur lors de la récupération du client depuis Supabase:', error);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error('Exception lors de la récupération du client:', error);
    return null;
  }
};

export const createClientRecord = async (clientData: Client): Promise<Client | null> => {
  // Créer un client local avec un ID temporaire
  const localClient = {
    ...clientData,
    id: `local_${Date.now()}`,
    created_at: new Date().toISOString(),
    status: "Actif"
  };
  
  // Toujours stocker localement d'abord pour éviter la perte de données
  let localClientsUpdated = false;
  try {
    const existingClients = localStorage.getItem('local_clients');
    const clients = existingClients ? JSON.parse(existingClients) : [];
    clients.push(localClient);
    localStorage.setItem('local_clients', JSON.stringify(clients));
    localClientsUpdated = true;
    console.log('Client créé localement:', localClient);
  } catch (storageError) {
    console.error('Erreur lors du stockage local du client:', storageError);
  }
  
  try {
    // Essayer de créer dans Supabase
    const { data, error } = await supabase
      .from('clients')
      .insert([clientData])
      .select();
    
    if (error) {
      console.error('Erreur lors de la création du client dans Supabase:', error);
      // On retourne le client local puisque Supabase a échoué
      return localClientsUpdated ? localClient : null;
    }
    
    // Si Supabase a réussi, on supprime le client local
    if (localClientsUpdated) {
      try {
        const existingClients = localStorage.getItem('local_clients');
        if (existingClients) {
          const clients = JSON.parse(existingClients);
          const updatedClients = clients.filter((c: Client) => c.id !== localClient.id);
          localStorage.setItem('local_clients', JSON.stringify(updatedClients));
        }
      } catch (cleanupError) {
        console.error('Erreur lors du nettoyage du client local:', cleanupError);
      }
    }
    
    console.log('Client créé dans Supabase:', data?.[0]);
    return data?.[0] || localClient;
  } catch (error) {
    console.error('Exception lors de la création du client dans Supabase:', error);
    // En cas d'erreur, on retourne le client local si disponible
    return localClientsUpdated ? localClient : null;
  }
};

export const updateClientRecord = async (clientId: string, clientData: Partial<Client>): Promise<Client | null> => {
  try {
    // Vérifier s'il s'agit d'un client local
    if (clientId.startsWith('local_')) {
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
    }
    
    // Si c'est un client Supabase
    const { data, error } = await supabase
      .from('clients')
      .update(clientData)
      .eq('id', clientId)
      .select();
    
    if (error) {
      console.error('Erreur lors de la mise à jour du client dans Supabase:', error);
      
      // Créer une version locale du client mis à jour
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
  } catch (error) {
    console.error('Exception lors de la mise à jour du client:', error);
    return null;
  }
};

export const deleteClientRecord = async (clientId: string): Promise<boolean> => {
  try {
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
        const localClientsToDeleteString = localStorage.getItem('local_clients_to_delete') || '[]';
        const localClientsToDelete = JSON.parse(localClientsToDeleteString);
        localClientsToDelete.push(clientId);
        localStorage.setItem('local_clients_to_delete', JSON.stringify(localClientsToDelete));
      } catch (localError) {
        console.error('Erreur lors du marquage local du client comme supprimé:', localError);
      }
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Exception lors de la suppression du client:', error);
    return false;
  }
};

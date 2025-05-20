
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

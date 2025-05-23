// @ts-nocheck

import { supabase } from './supabaseClient';

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

// Fonction pour mettre à jour le hook useClientData
export const updateClientDataHook = (): void => {
  console.log('Implémentation requise: mise à jour du hook useClientData pour utiliser Supabase');
};

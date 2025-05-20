
import { supabase } from './supabaseClient';
import { CadastralData } from './types';

// Fonctions pour gérer les données cadastrales
export const saveCadastralData = async (cadastralData: CadastralData): Promise<CadastralData | null> => {
  const { data, error } = await supabase
    .from('cadastral_data')
    .insert([cadastralData])
    .select();
  
  if (error) {
    console.error('Erreur lors de la sauvegarde des données cadastrales:', error);
    return null;
  }
  
  return data?.[0] || null;
};

export const getCadastralDataForClient = async (clientId: string): Promise<CadastralData | null> => {
  const { data, error } = await supabase
    .from('cadastral_data')
    .select('*')
    .eq('client_id', clientId)
    .order('created_at', { ascending: false })
    .limit(1);
  
  if (error) {
    console.error('Erreur lors de la récupération des données cadastrales:', error);
    return null;
  }
  
  return data?.[0] || null;
};

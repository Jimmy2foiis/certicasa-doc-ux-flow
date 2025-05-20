
import { supabase } from './supabaseClient';
import { CadastralData } from './types';

// Fonctions pour gérer les données cadastrales
export const saveCadastralData = async (cadastralData: CadastralData): Promise<CadastralData | null> => {
  // Si l'ID client commence par "local_", on stocke localement
  if (cadastralData.client_id && cadastralData.client_id.toString().startsWith('local_')) {
    try {
      const key = `cadastral_${cadastralData.client_id}`;
      localStorage.setItem(key, JSON.stringify(cadastralData));
      console.log("Données cadastrales sauvegardées localement:", cadastralData);
      return cadastralData;
    } catch (error) {
      console.error("Erreur lors du stockage local des données cadastrales:", error);
      return null;
    }
  }

  // Sinon, on utilise Supabase
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
  // Si l'ID client commence par "local_", on récupère localement
  if (clientId.toString().startsWith('local_')) {
    try {
      const key = `cadastral_${clientId}`;
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error("Erreur lors de la récupération locale des données cadastrales:", error);
      return null;
    }
  }

  // Sinon, on utilise Supabase
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

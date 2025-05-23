
import { supabase } from './supabaseClient';
import { CadastralData } from './types';

// Fonctions pour gérer les données cadastrales
export const saveCadastralData = async (cadastralData: CadastralData): Promise<CadastralData | null> => {
  // Log pour débogage
  console.log("Tentative de sauvegarde des données cadastrales:", cadastralData);
  
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
  try {
    const { data, error } = await supabase
      .from('cadastral_data')
      .insert([cadastralData])
      .select();
    
    if (error) {
      console.error('Erreur lors de la sauvegarde des données cadastrales:', error);
      
      // Fallback vers le stockage local en cas d'erreur Supabase
      try {
        const key = `cadastral_${cadastralData.client_id}_fallback`;
        localStorage.setItem(key, JSON.stringify({
          ...cadastralData,
          saved_locally: true,
          supabase_error: error.message
        }));
        console.log("Données cadastrales sauvegardées localement suite à une erreur Supabase");
        return cadastralData;
      } catch (localError) {
        console.error("Échec du fallback local:", localError);
      }
      
      return null;
    }
    
    console.log("Données cadastrales sauvegardées dans Supabase:", data?.[0]);
    return data?.[0] || null;
  } catch (error) {
    console.error("Exception lors de la sauvegarde des données cadastrales:", error);
    return null;
  }
};

export const getCadastralDataForClient = async (clientId: string): Promise<CadastralData | null> => {
  console.log(`Récupération des données cadastrales pour le client: ${clientId}`);
  
  // Si l'ID client commence par "local_", on récupère localement
  if (clientId.toString().startsWith('local_')) {
    try {
      const key = `cadastral_${clientId}`;
      const data = localStorage.getItem(key);
      const parsedData = data ? JSON.parse(data) : null;
      console.log("Données cadastrales locales récupérées:", parsedData);
      return parsedData;
    } catch (error) {
      console.error("Erreur lors de la récupération locale des données cadastrales:", error);
      return null;
    }
  }

  // Sinon, on utilise Supabase
  try {
    const { data, error } = await supabase
      .from('cadastral_data')
      .select('*')
      .eq('client_id', clientId)
      .order('created_at', { ascending: false })
      .limit(1);
    
    if (error) {
      console.error('Erreur lors de la récupération des données cadastrales:', error);
      
      // Vérifier le fallback local
      try {
        const key = `cadastral_${clientId}_fallback`;
        const localData = localStorage.getItem(key);
        if (localData) {
          console.log("Récupération du fallback local suite à une erreur Supabase");
          return JSON.parse(localData);
        }
      } catch (localError) {
        console.error("Échec de la récupération du fallback local:", localError);
      }
      
      return null;
    }
    
    const result = data?.[0] || null;
    console.log("Données cadastrales récupérées de Supabase:", result);
    return result;
  } catch (error) {
    console.error("Exception lors de la récupération des données cadastrales:", error);
    return null;
  }
};

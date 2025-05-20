
import { CatastroData } from "../catastroService";
import { supabase } from '@/integrations/supabase/client';
import { Json } from '@/integrations/supabase/types';

// Constante pour la durée d'expiration du cache (24 heures en millisecondes)
const CACHE_EXPIRY_TIME = 24 * 60 * 60 * 1000;

// Génère une clé de cache unique pour des coordonnées
const generateCacheKey = (lat: number, lng: number): string => {
  // Arrondir à 6 décimales pour éviter de stocker des clés similaires
  // mais conserver assez de précision pour l'usage cadastral
  return `${lat.toFixed(6)}_${lng.toFixed(6)}`;
};

// Vérifie si une entrée de cache est encore valide
const isCacheValid = (timestamp: string): boolean => {
  const cacheTime = new Date(timestamp).getTime();
  const now = Date.now();
  return (now - cacheTime) < CACHE_EXPIRY_TIME;
};

// Récupère les données du cache Supabase
export const getCachedCadastralData = async (lat: number, lng: number): Promise<CatastroData | null> => {
  try {
    const cacheKey = generateCacheKey(lat, lng);
    
    const { data, error } = await supabase
      .from('cadastral_cache')
      .select('*')
      .eq('coordinate_key', cacheKey)
      .single();
    
    if (error) {
      console.log("Aucune donnée en cache pour cette coordonnée");
      return null;
    }
    
    if (data && isCacheValid(data.timestamp)) {
      console.log(`Données cadastrales récupérées du cache pour ${lat}, ${lng}`);
      // Conversion sécurisée du JSONB stocké vers CatastroData
      const cachedData = data.data as Record<string, any>;
      
      return {
        cadastralReference: cachedData.cadastralReference || '',
        utmCoordinates: cachedData.utmCoordinates || '',
        climateZone: cachedData.climateZone || '',
        apiSource: cachedData.apiSource || '',
        error: cachedData.error || null
      };
    }
    
    // Si les données sont expirées, on les supprime
    if (data) {
      await supabase
        .from('cadastral_cache')
        .delete()
        .eq('coordinate_key', cacheKey);
    }
    
    return null;
  } catch (error) {
    console.error("Erreur lors de la récupération du cache cadastral:", error);
    return null;
  }
};

// Stocke des données dans le cache Supabase
export const setCachedCadastralData = async (lat: number, lng: number, data: CatastroData): Promise<void> => {
  try {
    const cacheKey = generateCacheKey(lat, lng);
    
    // Préparer les données JSON pour Supabase
    const jsonData: Record<string, any> = {
      cadastralReference: data.cadastralReference || '',
      utmCoordinates: data.utmCoordinates || '',
      climateZone: data.climateZone || '',
      apiSource: data.apiSource || '',
      error: data.error || null
    };
    
    // Vérifier si l'entrée existe déjà
    const { data: existingData, error: checkError } = await supabase
      .from('cadastral_cache')
      .select('id')
      .eq('coordinate_key', cacheKey)
      .single();
    
    if (checkError && checkError.code !== 'PGRST116') {  // PGRST116 = not found
      console.error("Erreur lors de la vérification du cache:", checkError);
    }
    
    // Mise à jour ou insertion
    if (existingData) {
      const { error: updateError } = await supabase
        .from('cadastral_cache')
        .update({
          data: jsonData,
          timestamp: new Date().toISOString()
        })
        .eq('id', existingData.id);
      
      if (updateError) {
        throw updateError;
      }
    } else {
      const { error: insertError } = await supabase
        .from('cadastral_cache')
        .insert([{
          coordinate_key: cacheKey,
          data: jsonData,
          timestamp: new Date().toISOString()
        }]);
      
      if (insertError) {
        throw insertError;
      }
    }
    
    console.log(`Données cadastrales mises en cache pour ${lat}, ${lng}`);
  } catch (error) {
    console.error("Erreur lors de la mise en cache des données cadastrales:", error);
  }
};

// Efface le cache
export const clearCadastralCache = async (): Promise<void> => {
  try {
    const { error } = await supabase
      .from('cadastral_cache')
      .delete()
      .gte('id', '0');  // Condition toujours vraie pour tout supprimer
    
    if (error) {
      throw error;
    }
    
    console.log("Cache cadastral effacé");
  } catch (error) {
    console.error("Erreur lors de l'effacement du cache cadastral:", error);
  }
};

import { CatastroData } from "../catastroTypes";
import { apiClient } from "@/lib/api-client";

// Type definition to replace the Supabase Json type
type Json = string | number | boolean | null | { [key: string]: Json } | Json[];

// Constante pour la durée d'expiration du cache (24 heures en millisecondes)
const CACHE_EXPIRY_TIME = 24 * 60 * 60 * 1000;

/**
 * Génère une clé de cache unique pour les coordonnées données
 */
const generateCacheKey = (lat: number, lng: number): string => {
  return `${lat.toFixed(6)}_${lng.toFixed(6)}`;
};

/**
 * Vérifie si les données du cache sont encore valides
 */
const isCacheValid = (timestamp: string): boolean => {
  const cacheTime = new Date(timestamp).getTime();
  const currentTime = new Date().getTime();
  return (currentTime - cacheTime) < CACHE_EXPIRY_TIME;
};

/**
 * Efface toutes les données du cache cadastral ou pour des coordonnées spécifiques
 */
export const clearCadastralCache = async (lat?: number, lng?: number): Promise<void> => {
  try {
    if (lat !== undefined && lng !== undefined) {
      // Supprimer une entrée spécifique du cache
      const cacheKey = generateCacheKey(lat, lng);
      
      const { error } = await apiClient
        .from('cadastral_cache')
        .delete()
        .eq('coordinate_key', cacheKey)
      
      if (error) {
        console.error(`Erreur lors de la suppression du cache pour ${lat}, ${lng}:`, error);
        throw error;
      }
      
      console.log(`Cache supprimé pour les coordonnées ${lat}, ${lng}`);
    } else {
      // Supprimer tout le cache
      const { error } = await apiClient
        .from('cadastral_cache')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000'); // Condition pour tout supprimer
      
      if (error) {
        console.error("Erreur lors de la suppression complète du cache cadastral:", error);
        throw error;
      }
      
      console.log("Cache cadastral entièrement supprimé");
    }
  } catch (error) {
    console.error("Erreur lors du nettoyage du cache cadastral:", error);
  }
};

/**
 * Récupère les données cadastrales du cache pour les coordonnées spécifiées
 */
export const getCachedCadastralData = async (lat: number, lng: number): Promise<CatastroData | null> => {
  try {
    const cacheKey = generateCacheKey(lat, lng);
    
    // Récupérer les données du cache
    const { data, error } = await apiClient
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
      await apiClient
        .from('cadastral_cache')
        .delete()
        .eq('id', data.id);
      console.log(`Cache expiré pour ${lat}, ${lng}, données supprimées`);
    }
    
    return null;
  } catch (error) {
    console.error("Erreur lors de la récupération du cache cadastral:", error);
    return null;
  }
};

/**
 * Stocke les données cadastrales dans le cache pour les coordonnées spécifiées
 */
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
    const { data: existingData, error: checkError } = await apiClient
      .from('cadastral_cache')
      .select('*')
      .eq('coordinate_key', cacheKey)
      .single();
    
    if (checkError && checkError.code !== 'PGRST116') {
      console.error("Erreur lors de la vérification du cache:", checkError);
    }
    
    // Si l'entrée existe, on la met à jour
    if (existingData) {
      console.log(`Mise à jour du cache pour ${lat}, ${lng}`);
      const { error: updateError } = await apiClient
        .from('cadastral_cache')
        .update({
          data: jsonData as Json,
          timestamp: new Date().toISOString()
        })
        .eq('id', existingData.id);
      
      if (updateError) throw updateError;
    } else {
      // Sinon, on crée une nouvelle entrée
      console.log(`Création d'une nouvelle entrée de cache pour ${lat}, ${lng}`);
      const { error: insertError } = await apiClient
        .from('cadastral_cache')
        .insert({
          coordinate_key: cacheKey,
          data: jsonData as Json,
          timestamp: new Date().toISOString()
        });
      
      if (insertError) throw insertError;
    }
  } catch (error) {
    console.error("Erreur lors de la mise en cache des données cadastrales:", error);
  }
};

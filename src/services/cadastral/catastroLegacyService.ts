
/**
 * Service legacy pour la récupération des données cadastrales par adresse
 * Préférer l'utilisation du service par coordonnées (catastroCoordinatesService)
 * qui est plus fiable et plus précis
 */

import { parseAddress } from './addressParser';
import { getClimateZoneByProvince } from '../climateZoneService';
import { CatastroData } from '../catastroTypes';

/**
 * Fonction pour obtenir des données cadastrales à partir d'une adresse
 * Cette méthode est moins fiable que celle par coordonnées et est conservée
 * uniquement pour compatibilité avec d'anciennes implémentations
 */
export const getCadastralDataFromAddress = async (address: string): Promise<CatastroData> => {
  try {
    console.log("Attention: Utilisation de la méthode legacy par adresse. Préférer la méthode par coordonnées.");
    console.log(`Recherche de données cadastrales pour l'adresse: ${address}`);
    
    // Parser l'adresse pour extraire les composants
    const parsedAddress = parseAddress(address);
    
    // Détermination de la zone climatique par province
    const climateZone = getClimateZoneByProvince(parsedAddress.province);
    
    console.log("Cette méthode ne permet pas d'obtenir de référence cadastrale directement.");
    console.log(`Zone climatique déterminée: ${climateZone}`);
    
    return {
      cadastralReference: "",  // Nécessite un appel API spécifique
      utmCoordinates: "",      // Nécessite des coordonnées GPS
      climateZone,
      apiSource: "LEGACY",
      error: "Méthode d'adresse textuelle peu précise. Utilisez des coordonnées GPS."
    };
    
  } catch (error) {
    console.error("Erreur lors de la récupération des données cadastrales par adresse:", error);
    
    return {
      cadastralReference: "",
      utmCoordinates: "",
      climateZone: "",
      apiSource: "LEGACY",
      error: error instanceof Error ? error.message : "Erreur inconnue"
    };
  }
};

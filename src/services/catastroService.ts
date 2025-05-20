
/**
 * Service pour interagir avec l'API officielle du Catastro Español (Sede Electrónica del Catastro)
 */

import { fetchViaProxy } from './proxyService';
import { getCoordinatesFromAddress, normalizeSpanishAddress, validateSpanishCoordinates, convertToUTM, type GeoCoordinates } from './geoCoordinatesService';
import { createCoordinatesSoapEnvelope } from './soapRequestService';
import { parseCatastroResponse, type CatastroData } from './cadastralParserService';

const CATASTRO_API_URL = "https://ovc.catastro.meh.es/ovcservweb/OVCSWLocalizacionRC/OVCCoordenadas.asmx";

/**
 * Interrogation de l'API Catastro à partir de coordonnées
 * Utilise directement les coordonnées WGS84 (latitude/longitude)
 */
export const getCadastralInfoFromCoordinates = async (lat: number, lng: number): Promise<CatastroData> => {
  try {
    console.log(`Interrogation API Catastro avec coordonnées: ${lat}, ${lng}`);
    
    // Vérification que les coordonnées sont bien en Espagne
    if (!validateSpanishCoordinates({ lat, lng })) {
      console.error("Coordonnées en dehors de l'Espagne:", lat, lng);
      return {
        cadastralReference: "",
        address: "",
        utmCoordinates: "",
        climateZone: "",
        error: "Les coordonnées fournies ne semblent pas être en Espagne."
      };
    }

    // Création de l'enveloppe SOAP avec les coordonnées
    const soapEnvelope = createCoordinatesSoapEnvelope(lat, lng);
    
    // Tentative avec le service proxy principal
    try {
      const response = await fetchViaProxy(CATASTRO_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "text/xml;charset=UTF-8",
          "SOAPAction": "http://catastro.meh.es/Consulta_RCCOOR_DGC"
        },
        body: soapEnvelope
      });
      
      const xmlText = await response.text();
      console.log("Réponse XML reçue de l'API Catastro");
      
      // Convertir les coordonnées en UTM pour plus de précision dans les logs
      const utmCoords = convertToUTM(lat, lng);
      console.log(`Coordonnées UTM approximatives: X=${utmCoords.x}, Y=${utmCoords.y}`);
      
      // Analyse de la réponse XML
      const result = parseCatastroResponse(xmlText);
      
      // Si pas d'erreur mais pas de référence cadastrale, ajouter un avertissement
      if (!result.error && !result.cadastralReference) {
        console.warn("Aucune référence cadastrale trouvée pour ces coordonnées:", lat, lng);
      }
      
      return result;
    } catch (proxyError) {
      console.error("Erreur avec le service proxy principal:", proxyError);
      throw proxyError; // Propager l'erreur pour la gestion globale
    }
  } catch (error) {
    console.error("Erreur lors de la communication avec l'API Catastro:", error);
    return {
      cadastralReference: "",
      address: "",
      utmCoordinates: "",
      climateZone: "",
      error: `Erreur de communication avec l'API Catastro: ${error instanceof Error ? error.message : String(error)}`
    };
  }
};

/**
 * Fonction principale pour obtenir les données cadastrales à partir d'une adresse
 * Cette fonction fait d'abord une conversion de l'adresse en coordonnées via Google Maps
 */
export const getCadastralDataFromAddress = async (address: string): Promise<CatastroData> => {
  try {
    // Normaliser l'adresse pour s'assurer qu'elle est bien formatée pour l'Espagne
    const normalizedAddress = normalizeSpanishAddress(address);
    console.log(`Adresse normalisée: ${normalizedAddress}`);
    
    // 1. Obtenir les coordonnées géographiques à partir de l'adresse
    const coordinates = await getCoordinatesFromAddress(normalizedAddress);
    
    if (!coordinates) {
      console.error("Impossible de géocoder l'adresse:", normalizedAddress);
      return {
        cadastralReference: "",
        address: normalizedAddress,
        utmCoordinates: "",
        climateZone: "",
        error: "Impossible de géocoder l'adresse. Vérifiez que l'adresse est correcte et en Espagne."
      };
    }
    
    console.log(`Coordonnées obtenues: ${coordinates.lat}, ${coordinates.lng}`);
    
    // 2. Utiliser les coordonnées pour interroger l'API Catastro
    const cadastralData = await getCadastralInfoFromCoordinates(coordinates.lat, coordinates.lng);
    return {
      ...cadastralData,
      address: normalizedAddress, // Utiliser l'adresse normalisée pour plus de clarté
    };
  } catch (error) {
    console.error("Erreur lors de la récupération des données cadastrales:", error);
    return {
      cadastralReference: "",
      address: address,
      utmCoordinates: "",
      climateZone: "",
      error: `Erreur lors de la récupération des données cadastrales: ${error instanceof Error ? error.message : String(error)}`
    };
  }
};

// Re-export des types pour faciliter l'utilisation
export type { CatastroData, GeoCoordinates };

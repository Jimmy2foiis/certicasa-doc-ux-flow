
/**
 * Service pour interagir avec l'API officielle du Catastro Español (Sede Electrónica del Catastro)
 */

import { fetchViaProxy } from './proxyService';
import { getCoordinatesFromAddress, type GeoCoordinates } from './geoCoordinatesService';
import { createCoordinatesSoapEnvelope } from './soapRequestService';
import { parseCatastroResponse, type CatastroData } from './cadastralParserService';

/**
 * Interrogation de l'API Catastro à partir de coordonnées
 */
export const getCadastralInfoFromCoordinates = async (lat: number, lng: number): Promise<CatastroData> => {
  try {
    const soapEnvelope = createCoordinatesSoapEnvelope(lat, lng);
    const apiUrl = "https://ovc.catastro.meh.es/ovcservweb/OVCSWLocalizacionRC/OVCCoordenadas.asmx";
    
    const response = await fetchViaProxy(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "text/xml;charset=UTF-8",
        "SOAPAction": "http://catastro.meh.es/Consulta_RCCOOR_DGC"
      },
      body: soapEnvelope
    });
    
    const xmlText = await response.text();
    return parseCatastroResponse(xmlText);
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
 */
export const getCadastralDataFromAddress = async (address: string): Promise<CatastroData> => {
  try {
    // 1. Obtenir les coordonnées géographiques à partir de l'adresse
    const coordinates = await getCoordinatesFromAddress(address);
    
    if (!coordinates) {
      return {
        cadastralReference: "",
        address: "",
        utmCoordinates: "",
        climateZone: "",
        error: "Impossible de géocoder l'adresse"
      };
    }
    
    // 2. Utiliser les coordonnées pour interroger l'API Catastro
    const cadastralData = await getCadastralInfoFromCoordinates(coordinates.lat, coordinates.lng);
    return {
      ...cadastralData,
      address: address, // Utiliser l'adresse originale pour plus de clarté
    };
  } catch (error) {
    console.error("Erreur lors de la récupération des données cadastrales:", error);
    return {
      cadastralReference: "",
      address: "",
      utmCoordinates: "",
      climateZone: "",
      error: `Erreur lors de la récupération des données cadastrales: ${error instanceof Error ? error.message : String(error)}`
    };
  }
};

// Re-export des types pour faciliter l'utilisation
export type { CatastroData, GeoCoordinates };

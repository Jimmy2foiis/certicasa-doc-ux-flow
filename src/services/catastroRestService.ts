
/**
 * Service pour interagir avec l'API REST du Catastro Español (Sede Electrónica del Catastro)
 * Cette implémentation utilise les endpoints REST/JSON modernes au lieu de SOAP
 */

import { fetchViaProxy } from './proxyService';
import { GeoCoordinates } from './geoCoordinatesService';

// Types pour les réponses de l'API REST
export interface CatastroRestResponse {
  error?: string;
  cadastralReference?: string;
  address?: string;
  utmCoordinates?: string;
  climateZone?: string;
  municipality?: string;
  province?: string;
}

// URLs des endpoints REST
const CATASTRO_REST_ENDPOINTS = {
  // Consultation par coordonnées
  COORDINATES: "https://ovc.catastro.meh.es/OVCServWeb/OVCWcfCallejero/COVCCoordenadas.svc/json/Consulta_RCCOOR",
  // Consultation par adresse structurée
  ADDRESS: "https://ovc.catastro.meh.es/OVCServWeb/OVCWcfCallejero/COVCCallejero.svc/json/Consulta_DNPLOC",
  // Consultation par référence cadastrale
  REFERENCE: "https://ovc.catastro.meh.es/OVCServWeb/OVCWcfCallejero/COVCCallejero.svc/json/Consulta_DNPRC"
};

// Liste des serveurs proxy alternatifs
const ALTERNATIVE_PROXIES = [
  "https://corsproxy.io/?",
  "https://cors-anywhere.herokuapp.com/",
  "https://api.allorigins.win/raw?url="
];

/**
 * Table de correspondance des types de voie pour l'API Catastro
 * Page 22 de la documentation officielle
 */
const ROAD_TYPE_MAPPING: Record<string, string> = {
  "CALLE": "CL",
  "AVENIDA": "AV",
  "PLAZA": "PZ",
  "PASEO": "PS",
  "CARRETERA": "CR",
  "CAMINO": "CM",
  "PASAJE": "PJ",
  "RONDA": "RD",
  "TRAVESIA": "TR",
  // Ajouter d'autres types selon la documentation
};

/**
 * Analyser l'adresse pour extraire les composants nécessaires à l'API REST
 * (province, municipalité, type de voie, nom de voie, numéro)
 */
export const parseAddressComponents = (address: string): {
  province: string;
  municipality: string;
  roadType: string;
  roadName: string;
  number: string;
} | null => {
  try {
    // Nettoyer l'adresse
    let cleanAddress = address
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toUpperCase();
    
    // Supprimer "ESPAÑA" ou "SPAIN" s'ils sont présents
    cleanAddress = cleanAddress.replace(/,?\s*ESPA(Ñ|N)A$|,?\s*SPAIN$/i, "");
    
    // Tentative basique d'extraction des composants
    // Format attendu approximatif: TYPE_VOIE NOM_VOIE NUMERO, VILLE, PROVINCE
    
    // Extraire la province (supposée être après la dernière virgule)
    const parts = cleanAddress.split(",");
    let province = parts.length > 1 ? parts[parts.length - 1].trim() : "MADRID";
    
    // Extraire la municipalité (supposée être l'avant-dernière partie après virgule)
    let municipality = parts.length > 2 ? parts[parts.length - 2].trim() : province;
    
    // Si pas de virgule, utiliser des heuristiques simples
    if (parts.length <= 1) {
      // Par défaut, utiliser Madrid
      province = "MADRID";
      municipality = "MADRID";
    }
    
    // Extraire l'adresse de rue (première partie)
    const streetPart = parts[0].trim();
    const streetMatch = streetPart.match(/^([A-Za-z\s]+)\s+([A-Za-z\s]+)\s+(\d+.*)$/i);
    
    if (!streetMatch) {
      console.error("Format d'adresse non reconnu:", address);
      return null;
    }
    
    const potentialRoadType = streetMatch[1].trim();
    const roadName = streetMatch[2].trim();
    const number = streetMatch[3].trim();
    
    // Mapper le type de voie à son abréviation
    let roadType = "CL"; // Par défaut "Calle"
    for (const [key, value] of Object.entries(ROAD_TYPE_MAPPING)) {
      if (potentialRoadType.toUpperCase().includes(key)) {
        roadType = value;
        break;
      }
    }
    
    return {
      province,
      municipality,
      roadType,
      roadName,
      number
    };
  } catch (error) {
    console.error("Erreur lors de l'analyse de l'adresse:", error);
    return null;
  }
};

/**
 * Récupérer les données cadastrales à partir des coordonnées géographiques (méthode la plus fiable)
 */
export const getCadastralDataByCoordinates = async (
  lat: number, 
  lng: number
): Promise<CatastroRestResponse> => {
  try {
    // Préparer les paramètres pour l'API REST
    const params = new URLSearchParams({
      'SRS': 'EPSG:4326', // WGS84 (coordonnées standard GPS)
      'Coordenada_X': lng.toString(), // Longitude
      'Coordenada_Y': lat.toString() // Latitude
    });
    
    // Construire l'URL avec les paramètres
    const apiUrl = `${CATASTRO_REST_ENDPOINTS.COORDINATES}?${params.toString()}`;
    console.log("URL API Catastro REST (coordonnées):", apiUrl);
    
    // Essayer avec différents proxies en cas d'échec
    for (const proxy of [null, ...ALTERNATIVE_PROXIES]) {
      try {
        const url = proxy ? `${proxy}${encodeURIComponent(apiUrl)}` : apiUrl;
        const response = await fetch(url);
        
        if (!response.ok) {
          throw new Error(`HTTP error: ${response.status}`);
        }
        
        const data = await response.json();
        console.log("Réponse API Catastro REST:", data);
        
        // Analyser la réponse JSON
        if (data.consulta_coordenadasResponse?.control?.cuerr) {
          const error = data.consulta_coordenadasResponse.control.cuerr;
          throw new Error(`Erreur API Catastro: ${error}`);
        }
        
        // Extraire la référence cadastrale
        const rcList = data.consulta_coordenadasResponse?.coordenadas?.coord;
        if (!rcList || rcList.length === 0) {
          throw new Error("Aucune référence cadastrale trouvée pour ces coordonnées");
        }
        
        // Prendre la première référence cadastrale trouvée
        const firstResult = rcList[0];
        const refCatastral = firstResult.pc?.pc1 || '';
        const municipio = firstResult.municipio?.nm || '';
        const provincia = firstResult.provincia?.np || '';
        
        // Déterminer la zone climatique (à implémenter selon les besoins)
        const climateZone = await getClimateZoneFromProvince(provincia);
        
        return {
          cadastralReference: refCatastral,
          municipality: municipio,
          province: provincia,
          climateZone
        };
      } catch (proxyError) {
        console.warn(`Erreur avec le proxy ${proxy || 'direct'}:`, proxyError);
        // Continuer avec le proxy suivant
        if (proxy === ALTERNATIVE_PROXIES[ALTERNATIVE_PROXIES.length - 1]) {
          throw proxyError; // Dernier proxy, propager l'erreur
        }
      }
    }
    
    throw new Error("Tous les services proxy ont échoué");
  } catch (error) {
    console.error("Erreur lors de la récupération des données cadastrales par coordonnées:", error);
    return {
      error: `Erreur: ${error instanceof Error ? error.message : String(error)}`
    };
  }
};

/**
 * Récupérer les données cadastrales à partir d'une adresse structurée
 */
export const getCadastralDataByAddress = async (address: string): Promise<CatastroRestResponse> => {
  try {
    // Analyser l'adresse en composants
    const addressComponents = parseAddressComponents(address);
    
    if (!addressComponents) {
      throw new Error("Impossible d'analyser correctement l'adresse");
    }
    
    const { province, municipality, roadType, roadName, number } = addressComponents;
    
    // Préparer les paramètres pour l'API REST
    const params = new URLSearchParams({
      'Provincia': province,
      'Municipio': municipality,
      'TipoVia': roadType,
      'NombreVia': roadName,
      'Numero': number
    });
    
    // Construire l'URL avec les paramètres
    const apiUrl = `${CATASTRO_REST_ENDPOINTS.ADDRESS}?${params.toString()}`;
    console.log("URL API Catastro REST (adresse):", apiUrl);
    
    // Essayer avec différents proxies en cas d'échec
    for (const proxy of [null, ...ALTERNATIVE_PROXIES]) {
      try {
        const url = proxy ? `${proxy}${encodeURIComponent(apiUrl)}` : apiUrl;
        const response = await fetch(url);
        
        if (!response.ok) {
          throw new Error(`HTTP error: ${response.status}`);
        }
        
        const data = await response.json();
        console.log("Réponse API Catastro REST (adresse):", data);
        
        // Analyser la réponse JSON
        if (data.consulta_dnplocResponse?.control?.cuerr) {
          const error = data.consulta_dnplocResponse.control.cuerr;
          throw new Error(`Erreur API Catastro: ${error}`);
        }
        
        // Extraire la référence cadastrale
        const lerrs = data.consulta_dnplocResponse?.lerrs?.lerr;
        if (lerrs && lerrs.length > 0) {
          throw new Error(`Erreur: ${lerrs[0].txt || 'Erreur inconnue'}`);
        }
        
        const items = data.consulta_dnplocResponse?.lrcdnploc?.rcdnp;
        if (!items || items.length === 0) {
          throw new Error("Aucune référence cadastrale trouvée pour cette adresse");
        }
        
        // Prendre la première référence cadastrale trouvée
        const firstResult = items[0];
        const refCatastral = firstResult.rc?.pc1 || '';
        
        // Récupérer les informations supplémentaires via la référence
        if (refCatastral) {
          return await getCadastralDataByReference(refCatastral);
        } else {
          throw new Error("Référence cadastrale non trouvée dans la réponse");
        }
      } catch (proxyError) {
        console.warn(`Erreur avec le proxy ${proxy || 'direct'}:`, proxyError);
        if (proxy === ALTERNATIVE_PROXIES[ALTERNATIVE_PROXIES.length - 1]) {
          throw proxyError; // Dernier proxy, propager l'erreur
        }
      }
    }
    
    throw new Error("Tous les services proxy ont échoué");
  } catch (error) {
    console.error("Erreur lors de la récupération des données cadastrales par adresse:", error);
    return {
      error: `Erreur: ${error instanceof Error ? error.message : String(error)}`
    };
  }
};

/**
 * Récupérer les données cadastrales à partir d'une référence cadastrale
 */
export const getCadastralDataByReference = async (reference: string): Promise<CatastroRestResponse> => {
  try {
    if (!reference || reference.trim() === '') {
      throw new Error("Référence cadastrale non fournie");
    }
    
    // Préparer les paramètres
    const params = new URLSearchParams({
      'RefCat': reference.trim()
    });
    
    // Construire l'URL avec les paramètres
    const apiUrl = `${CATASTRO_REST_ENDPOINTS.REFERENCE}?${params.toString()}`;
    console.log("URL API Catastro REST (référence):", apiUrl);
    
    // Essayer avec différents proxies en cas d'échec
    for (const proxy of [null, ...ALTERNATIVE_PROXIES]) {
      try {
        const url = proxy ? `${proxy}${encodeURIComponent(apiUrl)}` : apiUrl;
        const response = await fetch(url);
        
        if (!response.ok) {
          throw new Error(`HTTP error: ${response.status}`);
        }
        
        const data = await response.json();
        console.log("Réponse API Catastro REST (référence):", data);
        
        // Analyser la réponse JSON
        if (data.consulta_dnprcResponse?.control?.cuerr) {
          const error = data.consulta_dnprcResponse.control.cuerr;
          throw new Error(`Erreur API Catastro: ${error}`);
        }
        
        const lerrs = data.consulta_dnprcResponse?.lerrs?.lerr;
        if (lerrs && lerrs.length > 0) {
          throw new Error(`Erreur: ${lerrs[0].txt || 'Erreur inconnue'}`);
        }
        
        // Extraire les données
        const result = data.consulta_dnprcResponse;
        const municipio = result?.bico?.bi?.idbi?.muni?.nm || '';
        const provincia = result?.bico?.bi?.idbi?.muni?.np || '';
        
        // Déterminer la zone climatique
        const climateZone = await getClimateZoneFromProvince(provincia);
        
        return {
          cadastralReference: reference,
          municipality: municipio,
          province: provincia,
          climateZone,
          // Note: Les coordonnées UTM ne sont pas directement disponibles dans cette réponse
          // Il faudrait un appel supplémentaire pour les obtenir
        };
      } catch (proxyError) {
        console.warn(`Erreur avec le proxy ${proxy || 'direct'}:`, proxyError);
        if (proxy === ALTERNATIVE_PROXIES[ALTERNATIVE_PROXIES.length - 1]) {
          throw proxyError; // Dernier proxy, propager l'erreur
        }
      }
    }
    
    throw new Error("Tous les services proxy ont échoué");
  } catch (error) {
    console.error("Erreur lors de la récupération des données cadastrales par référence:", error);
    return {
      error: `Erreur: ${error instanceof Error ? error.message : String(error)}`
    };
  }
};

/**
 * Récupère la zone climatique à partir de la province
 * (Méthode utilitaire réutilisée du service existant)
 */
const getClimateZoneFromProvince = async (province: string): Promise<string> => {
  // Import dynamique pour éviter les dépendances circulaires
  const { getClimateZoneByProvince } = await import('./climateZoneService');
  return getClimateZoneByProvince(province);
};

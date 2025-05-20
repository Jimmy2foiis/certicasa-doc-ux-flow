
/**
 * Service pour interagir avec l'API officielle du Catastro Español (Sede Electrónica del Catastro)
 */

import { fetchViaProxy } from './proxyService';
import { getCoordinatesFromAddress, normalizeSpanishAddress, validateSpanishCoordinates, convertToUTM, type GeoCoordinates } from './geoCoordinatesService';
import { createCoordinatesSoapEnvelope } from './soapRequestService';
import { parseCatastroResponse, type CatastroData } from './cadastralParserService';

const CATASTRO_API_URL = "https://ovc.catastro.meh.es/ovcservweb/OVCSWLocalizacionRC/OVCCoordenadas.asmx";
// Liste des serveurs proxy alternatifs en cas d'échec
const ALTERNATIVE_PROXIES = [
  "https://corsproxy.io/?",
  "https://cors-anywhere.herokuapp.com/",
  "https://api.allorigins.win/raw?url="
];

// Cache pour stocker les résultats des requêtes précédentes (éviter les appels répétitifs)
const cadastralCache = new Map<string, CatastroData>();

/**
 * Interrogation de l'API Catastro à partir de coordonnées
 * Utilise directement les coordonnées WGS84 (latitude/longitude)
 */
export const getCadastralInfoFromCoordinates = async (lat: number, lng: number): Promise<CatastroData> => {
  try {
    // Vérifier si les résultats sont dans le cache
    const cacheKey = `${lat.toFixed(6)},${lng.toFixed(6)}`;
    if (cadastralCache.has(cacheKey)) {
      console.log("Utilisation des données cadastrales du cache pour", cacheKey);
      return cadastralCache.get(cacheKey)!;
    }

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
    
    // Convertir les coordonnées en UTM pour les logs
    const utmCoords = convertToUTM(lat, lng);
    console.log(`Coordonnées UTM calculées: X=${utmCoords.x}, Y=${utmCoords.y}`);

    // Essayer avec le service proxy principal et les alternatives en cas d'échec
    for (let i = 0; i < ALTERNATIVE_PROXIES.length; i++) {
      const currentProxy = ALTERNATIVE_PROXIES[i];
      try {
        console.log(`Tentative avec le proxy ${i + 1}/${ALTERNATIVE_PROXIES.length}: ${currentProxy}`);
        
        const proxyUrl = `${currentProxy}${encodeURIComponent(CATASTRO_API_URL)}`;
        const response = await fetch(proxyUrl, {
          method: "POST",
          headers: {
            "Content-Type": "text/xml;charset=UTF-8",
            "SOAPAction": "http://catastro.meh.es/Consulta_RCCOOR_DGC"
          },
          body: soapEnvelope
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error: ${response.status}`);
        }
        
        const xmlText = await response.text();
        console.log("Réponse XML reçue de l'API Catastro");
        
        // Analyse de la réponse XML
        const result: CatastroData = parseCatastroResponse(xmlText);
        
        // Si pas d'erreur mais pas de référence cadastrale, ajouter un avertissement
        if (!result.error && !result.cadastralReference) {
          console.warn("Aucune référence cadastrale trouvée pour ces coordonnées:", lat, lng);
        } else if (!result.error) {
          // Mettre en cache les résultats réussis
          result.utmCoordinates = `${utmCoords.x}, ${utmCoords.y}`;
          cadastralCache.set(cacheKey, result);
        }
        
        return { ...result, utmCoordinates: `${utmCoords.x}, ${utmCoords.y}` };
      } catch (proxyError) {
        console.error(`Erreur avec le proxy ${i + 1}:`, proxyError);
        if (i === ALTERNATIVE_PROXIES.length - 1) {
          // Si c'est le dernier proxy, propager l'erreur
          throw proxyError;
        }
        // Sinon, continuer avec le prochain proxy
      }
    }

    // Si aucun proxy n'a réussi
    throw new Error("Tous les services proxy ont échoué");
  } catch (error) {
    console.error("Erreur lors de la communication avec l'API Catastro:", error);
    return {
      cadastralReference: "",
      address: "",
      utmCoordinates: `${convertToUTM(lat, lng).x}, ${convertToUTM(lat, lng).y}`,
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
    
    // Vérifier si les résultats sont dans le cache
    const cacheKey = `addr:${normalizedAddress}`;
    if (cadastralCache.has(cacheKey)) {
      console.log("Utilisation des données cadastrales du cache pour l'adresse", normalizedAddress);
      return cadastralCache.get(cacheKey)!;
    }
    
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
    const result = {
      ...cadastralData,
      address: normalizedAddress, // Utiliser l'adresse normalisée pour plus de clarté
    };

    // Mettre en cache les résultats (seulement si succès)
    if (!result.error) {
      cadastralCache.set(cacheKey, result);
    }
    
    return result;
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

/**
 * Force une nouvelle requête en ignorant le cache
 */
export const refreshCadastralData = async (addressOrCoordinates: string | GeoCoordinates): Promise<CatastroData> => {
  console.log("Rafraîchissement des données cadastrales...");
  
  // Supprimer du cache
  if (typeof addressOrCoordinates === 'string') {
    cadastralCache.delete(`addr:${normalizeSpanishAddress(addressOrCoordinates)}`);
    return getCadastralDataFromAddress(addressOrCoordinates);
  } else {
    const { lat, lng } = addressOrCoordinates;
    cadastralCache.delete(`${lat.toFixed(6)},${lng.toFixed(6)}`);
    return getCadastralInfoFromCoordinates(lat, lng);
  }
};

// Vider le cache
export const clearCadastralCache = () => {
  cadastralCache.clear();
  console.log("Cache des données cadastrales vidé");
};

// Re-export des types pour faciliter l'utilisation
export type { CatastroData, GeoCoordinates };

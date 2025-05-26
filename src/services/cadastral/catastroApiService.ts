import { CatastroData } from '../catastroTypes';
import { OVC_COORDENADAS_URL, OVC_CALLEJERO_DNPLOC_URL } from './catastroEndpoints';
import { parseAddress } from './addressParser';
import { parseCoordinatesResponse, parseAddressResponse } from './catastroResponseParser';
import { getBestCadastralDataByProximity } from './catastroProximityService';

/**
 * Codes d'erreur spécifiques de l'API Catastro selon la documentation officielle
 */
const CATASTRO_ERROR_CODES = {
  76: 'No se ha encontrado la dirección postal',
  77: 'Coordenadas fuera del ámbito de Catastro',
  78: 'No se ha encontrado información catastral'
};

/**
 * Fonction pour interpréter les codes d'erreur de l'API Catastro
 */
const interpretCatastroError = (data: any): string | null => {
  // Vérifier si la réponse contient un code d'erreur
  if (data.consulta_coordenadas?.lerr?.err?.cod) {
    const errorCode = parseInt(data.consulta_coordenadas.lerr.err.cod);
    return CATASTRO_ERROR_CODES[errorCode] || `Erreur Catastro code ${errorCode}`;
  }
  
  // Vérifier d'autres formats d'erreur possibles
  if (data.lerr?.err?.cod) {
    const errorCode = parseInt(data.lerr.err.cod);
    return CATASTRO_ERROR_CODES[errorCode] || `Erreur Catastro code ${errorCode}`;
  }
  
  return null;
};

/**
 * Fonction pour créer des données cadastrales approximatives basées sur les coordonnées
 */
const createFallbackCadastralData = (latitude: number, longitude: number): CatastroData => {
  // Calculer les coordonnées UTM approximatives
  const zone = 30; // Espagne utilise principalement UTM zone 30N
  const utmX = Math.round((longitude + 3) * 100000 + 500000);
  const utmY = Math.round(latitude * 110000);
  
  // Déterminer la zone climatique approximative basée sur les coordonnées
  let climateZone = '';
  
  // Nord/Nord-ouest (zones C1, C2)
  if (latitude > 42.0) {
    climateZone = longitude < -6.0 ? 'C1' : 'C2';
  }
  // Centre/Nord-est (zones D1, D2, D3)  
  else if (latitude > 40.0) {
    if (longitude < -4.0) climateZone = 'D3';
    else if (longitude < 0) climateZone = 'D2';
    else climateZone = 'D1';
  }
  // Centre/Sud (zones A3, A4, B3, B4)
  else {
    if (longitude < -6.0) climateZone = latitude > 38.0 ? 'C4' : 'A4';
    else if (longitude < -3.0) climateZone = latitude > 38.0 ? 'B4' : 'A4';  
    else climateZone = latitude > 38.0 ? 'B3' : 'A3';
  }

  return {
    cadastralReference: '', // Ne peut pas être calculé sans l'API
    utmCoordinates: `X: ${utmX}, Y: ${utmY} (Zone ${zone}N)`,
    climateZone,
    apiSource: 'FALLBACK',
    error: 'API Catastro non disponible - Données approximatives calculées'
  };
};

/**
 * Fonction améliorée pour obtenir des données cadastrales par coordonnées
 * Inclut un système de fallback robuste en cas d'erreur CORS
 */
export const getCadastralDataByCoordinatesREST = async (
  latitude: number,
  longitude: number,
): Promise<CatastroData> => {
  try {
    // Validation préliminaire des coordonnées
    if (isNaN(latitude) || isNaN(longitude) || !latitude || !longitude) {
      throw new Error('Coordonnées invalides ou manquantes');
    }

    // Validation des limites de coordonnées pour l'Espagne
    const longitudeNum = parseFloat(longitude.toString());
    const latitudeNum = parseFloat(latitude.toString());

    if (longitudeNum < -10 || longitudeNum > 5) {
      throw new Error("Longitude hors des limites de l'Espagne");
    }
    if (latitudeNum < 35 || latitudeNum > 45) {
      throw new Error("Latitude hors des limites de l'Espagne");
    }

    // Création de l'URL avec paramètres
    const url = new URL(OVC_COORDENADAS_URL);
    url.searchParams.append('SRS', 'EPSG:4326');
    url.searchParams.append('Coordenada_X', longitude.toString().replace(',', '.'));
    url.searchParams.append('Coordenada_Y', latitude.toString().replace(',', '.'));

    console.log(`Tentative d'appel API REST Catastro: ${url.toString()}`);

    // Tentative d'appel à l'API avec gestion d'erreur CORS
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000); // Timeout réduit

    try {
      const response = await fetch(url.toString(), {
        signal: controller.signal,
        mode: 'cors',
        headers: {
          Accept: 'application/json',
          'User-Agent': 'CertiCasaDoc/1.0',
        },
      });
      
      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`Erreur HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Réponse API Catastro reçue:', data);

      // Vérifier les codes d'erreur spécifiques de l'API Catastro
      const catastroError = interpretCatastroError(data);
      if (catastroError) {
        console.warn(`Erreur Catastro détectée: ${catastroError}`);
        throw new Error(catastroError);
      }

      // Parser la réponse JSON normale
      const result = parseCoordinatesResponse(data);

      // Si pas de référence cadastrale, créer des données de fallback
      if (!result.cadastralReference) {
        const fallbackData = createFallbackCadastralData(latitude, longitude);
        return {
          ...fallbackData,
          utmCoordinates: result.utmCoordinates || fallbackData.utmCoordinates,
          climateZone: result.climateZone || fallbackData.climateZone,
          apiSource: 'PARTIAL'
        };
      }

      console.log(`✓ Référence cadastrale obtenue: ${result.cadastralReference}`);
      return {
        ...result,
        apiSource: 'REST'
      };

    } catch (fetchError) {
      clearTimeout(timeoutId);
      
      // Gestion spécifique des erreurs CORS et réseau
      if (fetchError instanceof TypeError && fetchError.message.includes('fetch')) {
        console.warn('Erreur CORS ou réseau détectée - Utilisation du fallback');
        return createFallbackCadastralData(latitude, longitude);
      }
      
      if ((fetchError as Error).name === 'AbortError') {
        console.warn('Timeout de la requête - Utilisation du fallback');
        return createFallbackCadastralData(latitude, longitude);
      }
      
      throw fetchError;
    }

  } catch (error) {
    console.error('Erreur lors de la récupération des données cadastrales REST:', error);
    
    // En cas d'erreur, retourner des données de fallback calculées
    const fallbackData = createFallbackCadastralData(latitude, longitude);
    
    return {
      ...fallbackData,
      error: error instanceof Error ? error.message : 'Erreur inconnue',
    };
  }
};

/**
 * Fonction pour obtenir des données cadastrales à partir d'une adresse structurée
 * Note: Cette fonction est maintenue pour compatibilité, mais il est recommandé
 * d'utiliser la méthode par coordonnées géographiques qui est plus fiable
 */
export const getCadastralDataByAddressREST = async (address: string): Promise<CatastroData> => {
  try {
    // Parser l'adresse pour extraire les composants
    const { province, municipality, roadType, roadName, number } = parseAddress(address);

    // Validation des données d'entrée
    if (!province || !municipality || !roadName) {
      throw new Error('Adresse incomplète: province, municipalité et nom de rue sont requis');
    }

    // Création de l'URL avec paramètres
    const url = new URL(OVC_CALLEJERO_DNPLOC_URL);
    url.searchParams.append('Provincia', province);
    url.searchParams.append('Municipio', municipality);

    if (roadType) {
      url.searchParams.append('TipoVia', roadType);
    }

    url.searchParams.append('NombreVia', roadName);

    if (number) {
      url.searchParams.append('Numero', number);
    }

    // Appel à l'API
    console.log(`Appel API REST Catastro par adresse: ${url.toString()}`);

    // Ajout d'un timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

    try {
      const response = await fetch(url.toString(), {
        signal: controller.signal,
        headers: {
          Accept: 'application/json',
          'User-Agent': 'CertiCasaDoc/1.0',
        },
      });
      clearTimeout(timeoutId);

      // Vérifier le code de statut
      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      // Parser la réponse JSON
      const data = await response.json();
      console.log('Réponse API Catastro par adresse:', data);

      return parseAddressResponse(data, province);
    } catch (fetchError) {
      clearTimeout(timeoutId);
      // Gérer les erreurs spécifiques au fetch
      if ((fetchError as Error).name === 'AbortError') {
        throw new Error("La requête a dépassé le délai d'attente");
      }
      throw fetchError;
    }
  } catch (error) {
    console.error(
      'Erreur lors de la récupération des données cadastrales REST par adresse:',
      error,
    );
    return {
      cadastralReference: '',
      utmCoordinates: '',
      climateZone: '',
      apiSource: 'REST',
      error: error instanceof Error ? error.message : 'Erreur inconnue',
    };
  }
};

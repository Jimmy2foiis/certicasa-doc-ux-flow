
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
 * Fonction améliorée pour obtenir des données cadastrales par coordonnées
 * Inclut un fallback vers la recherche par proximité en cas d'échec
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

    // Création de l'URL avec paramètres (selon la documentation officielle)
    const url = new URL(OVC_COORDENADAS_URL);
    url.searchParams.append('SRS', 'EPSG:4326'); // WGS84 comme dans la documentation
    url.searchParams.append('Coordenada_X', longitude.toString().replace(',', '.'));
    url.searchParams.append('Coordenada_Y', latitude.toString().replace(',', '.'));

    console.log(`Appel API REST Catastro par coordonnées: ${url.toString()}`);

    // Appel à l'API avec timeout optimisé
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    try {
      const response = await fetch(url.toString(), {
        signal: controller.signal,
        headers: {
          Accept: 'application/json',
          'User-Agent': 'CertiCasaDoc/1.0',
          'Cache-Control': 'no-cache'
        },
      });
      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`Erreur HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Réponse API Catastro (brute):', data);

      // Vérifier les codes d'erreur spécifiques de l'API Catastro
      const catastroError = interpretCatastroError(data);
      if (catastroError) {
        console.warn(`Erreur Catastro détectée: ${catastroError}`);
        
        // Si l'erreur est "coordonnées hors du champ" ou "pas d'info cadastrale", 
        // essayer la recherche par proximité
        if (catastroError.includes('77') || catastroError.includes('78')) {
          console.log('Tentative de recherche par proximité...');
          const proximityResult = await getBestCadastralDataByProximity(latitude, longitude);
          
          if (proximityResult.cadastralReference) {
            console.log('✓ Référence cadastrale trouvée par proximité');
            return proximityResult;
          }
        }
        
        throw new Error(catastroError);
      }

      // Parser la réponse JSON normale
      const result = parseCoordinatesResponse(data);

      // Validation du résultat
      if (!result.cadastralReference && !result.utmCoordinates) {
        console.log('Aucun résultat direct, tentative de recherche par proximité...');
        const proximityResult = await getBestCadastralDataByProximity(latitude, longitude);
        
        if (proximityResult.cadastralReference) {
          console.log('✓ Référence cadastrale trouvée par proximité');
          return proximityResult;
        }
      }

      // Logging des résultats
      if (result.cadastralReference) {
        console.log(`✓ Référence cadastrale obtenue: ${result.cadastralReference}`);
      }
      if (result.climateZone) {
        console.log(`✓ Zone climatique obtenue: ${result.climateZone}`);
      }

      return {
        ...result,
        apiSource: 'REST'
      };

    } catch (fetchError) {
      clearTimeout(timeoutId);
      
      if ((fetchError as Error).name === 'AbortError') {
        // En cas de timeout, essayer directement la recherche par proximité
        console.log('Timeout, tentative de recherche par proximité...');
        const proximityResult = await getBestCadastralDataByProximity(latitude, longitude);
        
        if (proximityResult.cadastralReference) {
          console.log('✓ Référence cadastrale trouvée par proximité après timeout');
          return proximityResult;
        }
        
        throw new Error("La requête a dépassé le délai d'attente");
      }
      throw fetchError;
    }

  } catch (error) {
    console.error('Erreur lors de la récupération des données cadastrales REST:', error);
    return {
      cadastralReference: '',
      utmCoordinates: '',
      climateZone: '',
      apiSource: 'REST',
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

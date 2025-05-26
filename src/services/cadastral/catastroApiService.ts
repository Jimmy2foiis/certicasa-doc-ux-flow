import { CatastroData } from '../catastroTypes';
import { OVC_COORDENADAS_URL, OVC_CALLEJERO_DNPLOC_URL } from './catastroEndpoints';
import { parseAddress } from './addressParser';
import { parseCoordinatesResponse, parseAddressResponse } from './catastroResponseParser';
import { getCadastralDataByCoordinatesSOAP } from './catastroSoapService';

/**
 * Fonction pour obtenir des données cadastrales par coordonnées avec fallback SOAP
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

    console.log(`Tentative REST API Catastro: lat=${latitude}, lng=${longitude}`);

    // Création de l'URL avec paramètres
    const url = new URL(OVC_COORDENADAS_URL);
    url.searchParams.append('SRS', 'EPSG:4326');

    const longitudeStr = longitude.toString().replace(',', '.').trim();
    const latitudeStr = latitude.toString().replace(',', '.').trim();

    // Validation des limites de coordonnées pour l'Espagne
    const longitudeNum = parseFloat(longitudeStr);
    const latitudeNum = parseFloat(latitudeStr);

    if (longitudeNum < -10 || longitudeNum > 5) {
      throw new Error("Longitude hors des limites de l'Espagne");
    }
    if (latitudeNum < 35 || latitudeNum > 45) {
      throw new Error("Latitude hors des limites de l'Espagne");
    }

    url.searchParams.append('Coordenada_X', longitudeStr);
    url.searchParams.append('Coordenada_Y', latitudeStr);

    console.log(`Appel API REST Catastro: ${url.toString()}`);

    // Appel à l'API REST avec timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    try {
      const response = await fetch(url.toString(), {
        signal: controller.signal,
        headers: {
          Accept: 'application/json',
          'User-Agent': 'CertiCasaDoc/1.0',
        },
      });
      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`Erreur HTTP REST: ${response.status}`);
      }

      const data = await response.json();
      console.log('✓ Réponse API REST reçue:', data);

      const result = parseCoordinatesResponse(data);
      
      if (result.cadastralReference) {
        console.log(`✓ REST réussi - Référence: ${result.cadastralReference}`);
        return result;
      } else {
        console.log('⚠ REST sans référence cadastrale, tentative SOAP...');
        // Fallback vers SOAP si pas de référence cadastrale
        return await getCadastralDataByCoordinatesSOAP(latitude, longitude);
      }

    } catch (fetchError) {
      clearTimeout(timeoutId);
      console.log('✗ REST échoué, tentative SOAP...', fetchError);
      
      // Fallback vers SOAP en cas d'erreur REST
      return await getCadastralDataByCoordinatesSOAP(latitude, longitude);
    }

  } catch (error) {
    console.error('Erreur validation coordonnées:', error);
    
    // En dernier recours, essayer quand même SOAP
    try {
      console.log('Tentative SOAP malgré l\'erreur de validation...');
      return await getCadastralDataByCoordinatesSOAP(latitude, longitude);
    } catch (soapError) {
      console.error('SOAP également échoué:', soapError);
      
      return {
        cadastralReference: '',
        utmCoordinates: '',
        climateZone: '',
        apiSource: 'REST+SOAP_FAILED',
        error: `REST et SOAP échoués: ${error instanceof Error ? error.message : 'Erreur inconnue'}`
      };
    }
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

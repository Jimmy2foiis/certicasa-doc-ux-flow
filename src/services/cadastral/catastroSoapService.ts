
import { CatastroData } from '../catastroTypes';
import { createCoordinatesSoapEnvelope } from '../soapRequestService';
import { getFormattedUTMCoordinates } from '../geoCoordinatesService';

// Endpoint SOAP pour l'API Catastro
const CATASTRO_SOAP_ENDPOINT = 'https://ovc.catastro.meh.es/OVCServWeb/OVCWcfCallejero/COVCCoordenadas.svc/soap';

/**
 * Parser pour les réponses XML SOAP du Catastro
 */
const parseSoapResponse = (xmlResponse: string): Partial<CatastroData> => {
  try {
    // Créer un parser DOM pour le XML
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlResponse, 'text/xml');

    // Vérifier les erreurs de parsing
    const parseError = xmlDoc.querySelector('parsererror');
    if (parseError) {
      throw new Error(`Erreur de parsing XML: ${parseError.textContent}`);
    }

    // Extraire la référence cadastrale
    const refCadElement = xmlDoc.querySelector('refcat, RefCat, rc');
    const cadastralReference = refCadElement?.textContent?.trim() || '';

    // Extraire les coordonnées UTM
    const coordXElement = xmlDoc.querySelector('coordx, CoordX, x');
    const coordYElement = xmlDoc.querySelector('coordy, CoordY, y');
    
    let utmCoordinates = '';
    if (coordXElement && coordYElement) {
      const x = coordXElement.textContent?.trim();
      const y = coordYElement.textContent?.trim();
      if (x && y) {
        utmCoordinates = `X: ${x}, Y: ${y}`;
      }
    }

    // Extraire la province pour déterminer la zone climatique
    const provinciaElement = xmlDoc.querySelector('prov, Provincia, provincia');
    const provincia = provinciaElement?.textContent?.trim() || '';

    // Déterminer la zone climatique basique selon la province
    let climateZone = '';
    if (provincia) {
      // Zones climatiques approximatives par province
      const climateMapping: Record<string, string> = {
        'MADRID': 'D3',
        'BARCELONA': 'C2',
        'VALENCIA': 'B3',
        'SEVILLA': 'A3',
        'A CORUÑA': 'C1',
        'VIZCAYA': 'C1',
        'ALICANTE': 'B3',
        'MURCIA': 'B4',
        'ZARAGOZA': 'D2'
      };
      climateZone = climateMapping[provincia.toUpperCase()] || '';
    }

    console.log('Données extraites du XML SOAP:', {
      cadastralReference,
      utmCoordinates,
      climateZone,
      provincia
    });

    return {
      cadastralReference,
      utmCoordinates,
      climateZone,
      apiSource: 'SOAP'
    };
  } catch (error) {
    console.error('Erreur lors du parsing de la réponse SOAP:', error);
    return {
      apiSource: 'SOAP',
      error: `Erreur de parsing: ${error instanceof Error ? error.message : 'Erreur inconnue'}`
    };
  }
};

/**
 * Fonction pour obtenir des données cadastrales par coordonnées via SOAP
 */
export const getCadastralDataByCoordinatesSOAP = async (
  latitude: number,
  longitude: number
): Promise<CatastroData> => {
  try {
    // Validation des coordonnées
    if (isNaN(latitude) || isNaN(longitude) || !latitude || !longitude) {
      throw new Error('Coordonnées invalides ou manquantes');
    }

    console.log(`Appel API SOAP Catastro: lat=${latitude}, lng=${longitude}`);

    // Créer l'enveloppe SOAP
    const soapEnvelope = createCoordinatesSoapEnvelope(latitude, longitude);
    
    console.log('Enveloppe SOAP créée:', soapEnvelope);

    // Faire la requête SOAP
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000); // 15s timeout pour SOAP

    try {
      const response = await fetch(CATASTRO_SOAP_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'text/xml; charset=utf-8',
          'SOAPAction': 'http://www.catastro.hacienda.gob.es/Consulta_RCCOOR',
          'User-Agent': 'CertiCasaDoc/1.0'
        },
        body: soapEnvelope,
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`Erreur HTTP SOAP: ${response.status}`);
      }

      const xmlText = await response.text();
      console.log('Réponse SOAP brute:', xmlText);

      // Parser la réponse XML
      const parsedData = parseSoapResponse(xmlText);

      // Calculer les coordonnées UTM localement si pas dans la réponse
      if (!parsedData.utmCoordinates) {
        parsedData.utmCoordinates = getFormattedUTMCoordinates(latitude, longitude);
      }

      // Retourner les données formatées
      return {
        cadastralReference: parsedData.cadastralReference || '',
        utmCoordinates: parsedData.utmCoordinates || '',
        climateZone: parsedData.climateZone || '',
        apiSource: 'SOAP',
        error: parsedData.error
      };

    } catch (fetchError) {
      clearTimeout(timeoutId);
      if ((fetchError as Error).name === 'AbortError') {
        throw new Error("La requête SOAP a dépassé le délai d'attente");
      }
      throw fetchError;
    }

  } catch (error) {
    console.error('Erreur lors de la récupération des données cadastrales SOAP:', error);
    
    // Calculer au moins les coordonnées UTM en cas d'erreur
    const utmCoordinates = getFormattedUTMCoordinates(latitude, longitude);
    
    return {
      cadastralReference: '',
      utmCoordinates,
      climateZone: '',
      apiSource: 'SOAP',
      error: error instanceof Error ? error.message : 'Erreur inconnue'
    };
  }
};


import { CatastroData } from '../catastroTypes';
import { OVC_COORDENADAS_DISTANCIA_URL } from './catastroEndpoints';
import { parseCoordinatesResponse } from './catastroResponseParser';

/**
 * Interface pour les résultats de recherche par proximité
 */
export interface ProximityResult extends CatastroData {
  distance?: number;
  rank?: number;
}

/**
 * Fonction pour obtenir plusieurs références cadastrales par proximité
 * Utilise le service Consulta_RCCOOR_Distancia pour obtenir une liste triée par distance
 */
export const getCadastralDataByProximity = async (
  latitude: number,
  longitude: number,
  maxResults: number = 5
): Promise<ProximityResult[]> => {
  try {
    // Validation préliminaire des coordonnées
    if (isNaN(latitude) || isNaN(longitude) || !latitude || !longitude) {
      throw new Error('Coordonnées invalides ou manquantes');
    }

    // Validation des limites de coordonnées pour l'Espagne
    if (longitude < -10 || longitude > 5) {
      throw new Error("Longitude hors des limites de l'Espagne");
    }
    if (latitude < 35 || latitude > 45) {
      throw new Error("Latitude hors des limites de l'Espagne");
    }

    // Création de l'URL avec paramètres
    const url = new URL(OVC_COORDENADAS_DISTANCIA_URL);
    url.searchParams.append('SRS', 'EPSG:4326');
    url.searchParams.append('Coordenada_X', longitude.toString().replace(',', '.'));
    url.searchParams.append('Coordenada_Y', latitude.toString().replace(',', '.'));

    console.log(`Recherche par proximité Catastro: ${url.toString()}`);

    // Appel à l'API avec timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 12000); // 12s timeout pour proximité

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
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      const data = await response.json();
      console.log('Réponse API Catastro proximité (brute):', data);

      // Parser la réponse qui peut contenir plusieurs résultats
      const results: ProximityResult[] = [];
      
      // Si la réponse contient un tableau de coordonnées
      if (data.consulta_coordenadas && Array.isArray(data.consulta_coordenadas.coordenadas)) {
        const coordenadas = data.consulta_coordenadas.coordenadas;
        
        for (let i = 0; i < Math.min(coordenadas.length, maxResults); i++) {
          const coord = coordenadas[i];
          const parsedResult = parseCoordinatesResponse({ consulta_coordenadas: { coordenadas: coord } });
          
          if (parsedResult.cadastralReference) {
            results.push({
              ...parsedResult,
              distance: coord.distancia || i * 10, // Distance approximative si non fournie
              rank: i + 1
            });
          }
        }
      } 
      // Si c'est une réponse simple (un seul résultat)
      else {
        const parsedResult = parseCoordinatesResponse(data);
        if (parsedResult.cadastralReference) {
          results.push({
            ...parsedResult,
            distance: 0,
            rank: 1
          });
        }
      }

      console.log(`✓ ${results.length} références cadastrales trouvées par proximité`);
      return results;

    } catch (fetchError) {
      clearTimeout(timeoutId);
      if ((fetchError as Error).name === 'AbortError') {
        throw new Error("La requête de proximité a dépassé le délai d'attente");
      }
      throw fetchError;
    }

  } catch (error) {
    console.error('Erreur lors de la recherche par proximité:', error);
    return [];
  }
};

/**
 * Fonction pour obtenir la meilleure référence cadastrale parmi plusieurs résultats de proximité
 */
export const getBestCadastralDataByProximity = async (
  latitude: number,
  longitude: number
): Promise<CatastroData> => {
  try {
    const proximityResults = await getCadastralDataByProximity(latitude, longitude, 3);
    
    if (proximityResults.length === 0) {
      return {
        cadastralReference: '',
        utmCoordinates: '',
        climateZone: '',
        apiSource: 'PROXIMITY',
        error: 'Aucune référence cadastrale trouvée dans les environs'
      };
    }

    // Retourner le premier résultat (le plus proche)
    const bestResult = proximityResults[0];
    console.log(`✓ Meilleure référence cadastrale par proximité: ${bestResult.cadastralReference}`);
    
    return {
      ...bestResult,
      apiSource: 'PROXIMITY'
    };

  } catch (error) {
    console.error('Erreur lors de la recherche de la meilleure référence par proximité:', error);
    return {
      cadastralReference: '',
      utmCoordinates: '',
      climateZone: '',
      apiSource: 'PROXIMITY',
      error: error instanceof Error ? error.message : 'Erreur inconnue'
    };
  }
};

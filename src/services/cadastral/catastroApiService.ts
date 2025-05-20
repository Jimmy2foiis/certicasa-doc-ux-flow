
import { CatastroData } from "../catastroTypes";
import { OVC_COORDENADAS_URL, OVC_CALLEJERO_DNPLOC_URL } from "./catastroEndpoints";
import { parseAddress } from "./addressParser";
import { parseCoordinatesResponse, parseAddressResponse } from "./catastroResponseParser";

/**
 * Fonction pour obtenir des données cadastrales par coordonnées
 */
export const getCadastralDataByCoordinatesREST = async (
  latitude: number,
  longitude: number
): Promise<CatastroData> => {
  try {
    // Validation préliminaire des coordonnées
    if (isNaN(latitude) || isNaN(longitude) || !latitude || !longitude) {
      throw new Error("Coordonnées invalides ou manquantes");
    }
    
    // Création de l'URL avec paramètres
    const url = new URL(OVC_COORDENADAS_URL);
    
    // Important: Les paramètres doivent être strings et utiliser le format exact attendu par l'API
    // SRS est le système de référence spatial (EPSG:4326 = WGS84)
    url.searchParams.append("SRS", "EPSG:4326"); 
    
    // CORRECTION: S'assurer que les valeurs décimales utilisent le point comme séparateur et sont correctement formatées
    // Important: inverser latitude et longitude selon l'API Catastro
    const longitudeStr = longitude.toString().replace(',', '.').trim();
    const latitudeStr = latitude.toString().replace(',', '.').trim();
    
    // Vérifications de sécurité supplémentaires
    if (!longitudeStr || longitudeStr === "undefined" || longitudeStr === "null" || longitudeStr === "NaN") {
      throw new Error("La coordonnée X (longitude) est manquante ou invalide");
    }
    if (!latitudeStr || latitudeStr === "undefined" || latitudeStr === "null" || latitudeStr === "NaN") {
      throw new Error("La coordonnée Y (latitude) est manquante ou invalide");
    }
    
    // Validation des limites de coordonnées pour l'Espagne
    const longitudeNum = parseFloat(longitudeStr);
    const latitudeNum = parseFloat(latitudeStr);
    
    if (longitudeNum < -10 || longitudeNum > 5) {
      throw new Error("Longitude hors des limites de l'Espagne");
    }
    if (latitudeNum < 35 || latitudeNum > 45) {
      throw new Error("Latitude hors des limites de l'Espagne");
    }
    
    // Ajouter les paramètres à l'URL
    url.searchParams.append("Coordenada_X", longitudeStr);
    url.searchParams.append("Coordenada_Y", latitudeStr);
    
    // Logs pour le débogage
    console.log(`Appel API REST Catastro par coordonnées: ${url.toString()}`);
    console.log(`Paramètres envoyés: X=${longitudeStr}, Y=${latitudeStr}`);
    
    // Appel à l'API avec un timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout
    
    try {
      const response = await fetch(url.toString(), { 
        signal: controller.signal,
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'CertiCasaDoc/1.0'
        }
      });
      clearTimeout(timeoutId);
      
      // Vérifier le code de statut
      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }
      
      // Parser la réponse JSON
      const data = await response.json();
      console.log("Réponse API Catastro (brute):", data);
      
      // Parser et retourner les données cadastrales
      const result = parseCoordinatesResponse(data);
      
      // Logging final des résultats
      if (result.cadastralReference) {
        console.log(`✓ Référence cadastrale obtenue: ${result.cadastralReference}`);
      } else {
        console.log(`✗ Pas de référence cadastrale trouvée dans la réponse`);
        // Log supplémentaire pour le débogage
        console.log("Structure complète de la réponse Catastro:", JSON.stringify(data, null, 2));
      }
      
      if (result.climateZone) {
        console.log(`✓ Zone climatique obtenue: ${result.climateZone}`);
      }
      
      return result;
      
    } catch (fetchError) {
      clearTimeout(timeoutId);
      // Gérer les erreurs spécifiques au fetch
      if (fetchError.name === 'AbortError') {
        throw new Error("La requête a dépassé le délai d'attente");
      }
      throw fetchError;
    }
    
  } catch (error) {
    console.error("Erreur lors de la récupération des données cadastrales REST:", error);
    return {
      cadastralReference: "",
      utmCoordinates: "",
      climateZone: "",
      apiSource: "REST",
      error: error instanceof Error ? error.message : "Erreur inconnue"
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
      throw new Error("Adresse incomplète: province, municipalité et nom de rue sont requis");
    }
    
    // Création de l'URL avec paramètres
    const url = new URL(OVC_CALLEJERO_DNPLOC_URL);
    url.searchParams.append("Provincia", province);
    url.searchParams.append("Municipio", municipality);
    
    if (roadType) {
      url.searchParams.append("TipoVia", roadType);
    }
    
    url.searchParams.append("NombreVia", roadName);
    
    if (number) {
      url.searchParams.append("Numero", number);
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
          'Accept': 'application/json',
          'User-Agent': 'CertiCasaDoc/1.0'
        }
      });
      clearTimeout(timeoutId);
      
      // Vérifier le code de statut
      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }
      
      // Parser la réponse JSON
      const data = await response.json();
      console.log("Réponse API Catastro par adresse:", data);
      
      return parseAddressResponse(data, province);
      
    } catch (fetchError) {
      clearTimeout(timeoutId);
      // Gérer les erreurs spécifiques au fetch
      if (fetchError.name === 'AbortError') {
        throw new Error("La requête a dépassé le délai d'attente");
      }
      throw fetchError;
    }
    
  } catch (error) {
    console.error("Erreur lors de la récupération des données cadastrales REST par adresse:", error);
    return {
      cadastralReference: "",
      utmCoordinates: "",
      climateZone: "",
      apiSource: "REST",
      error: error instanceof Error ? error.message : "Erreur inconnue"
    };
  }
};


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
    // Création de l'URL avec paramètres
    const url = new URL(OVC_COORDENADAS_URL);
    
    // Important: Les paramètres doivent être strings et utiliser le format exact attendu par l'API
    // SRS est le système de référence spatial (EPSG:4326 = WGS84)
    url.searchParams.append("SRS", "EPSG:4326"); 
    
    // CORRECTION: Inversion des paramètres - X doit être longitude, Y latitude
    // Important: Les valeurs décimales doivent utiliser le point comme séparateur
    const longitudeStr = longitude.toString().replace(',', '.');
    const latitudeStr = latitude.toString().replace(',', '.');
    
    // CORRECTION: Vérifier que les coordonnées ne sont pas undefined ou null
    if (!longitudeStr || longitudeStr === "undefined" || longitudeStr === "null") {
      throw new Error("La coordonnée X (longitude) est manquante ou invalide");
    }
    if (!latitudeStr || latitudeStr === "undefined" || latitudeStr === "null") {
      throw new Error("La coordonnée Y (latitude) est manquante ou invalide");
    }
    
    url.searchParams.append("Coordenada_X", longitudeStr);
    url.searchParams.append("Coordenada_Y", latitudeStr);
    
    // Logs pour le débogage
    console.log(`Appel API REST Catastro par coordonnées: ${url.toString()}`);
    console.log(`Paramètres envoyés: X=${longitudeStr}, Y=${latitudeStr}`);
    
    // Appel à l'API
    const response = await fetch(url.toString());
    
    // Vérifier le code de statut
    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${response.status}`);
    }
    
    // Parser la réponse JSON
    const data = await response.json();
    console.log("Réponse API Catastro (brute):", data);
    
    // Extraction plus détaillée pour débogage
    if (data && data.coordenadas && data.coordenadas.coord && data.coordenadas.coord.length > 0) {
      const firstCoord = data.coordenadas.coord[0];
      console.log("Premier élément de coordonnées:", firstCoord);
      
      if (firstCoord.pc) {
        console.log("Référence cadastrale trouvée dans pc:", firstCoord.pc);
      }
      
      if (firstCoord.lrc) {
        console.log("Référence cadastrale trouvée dans lrc:", firstCoord.lrc);
      }
    }
    
    return parseCoordinatesResponse(data);
    
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
    
    // Création de l'URL avec paramètres
    const url = new URL(OVC_CALLEJERO_DNPLOC_URL);
    url.searchParams.append("Provincia", province);
    url.searchParams.append("Municipio", municipality);
    url.searchParams.append("TipoVia", roadType);
    url.searchParams.append("NombreVia", roadName);
    
    if (number) {
      url.searchParams.append("Numero", number);
    }
    
    // Appel à l'API
    console.log(`Appel API REST Catastro par adresse: ${url.toString()}`);
    const response = await fetch(url.toString());
    
    // Vérifier le code de statut
    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${response.status}`);
    }
    
    // Parser la réponse JSON
    const data = await response.json();
    console.log("Réponse API Catastro par adresse:", data);
    
    return parseAddressResponse(data, province);
    
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

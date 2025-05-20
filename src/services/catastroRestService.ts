
import { getClimateZoneByProvince } from "./climateZoneService";
import { CatastroData } from "./catastroService";

// URL du service REST du Catastro espagnol pour les demandes par coordonnées
const OVC_COORDENADAS_URL = 
  "https://ovc.catastro.meh.es/OVCServWeb/OVCWcfCallejero/COVCCoordenadas.svc/json/Consulta_RCCOOR";

// URL du service REST du Catastro pour les demandes par adresse structurée
const OVC_CALLEJERO_DNPLOC_URL = 
  "https://ovc.catastro.meh.es/OVCServWeb/OVCWcfCallejero/COVCCallejero.svc/json/Consulta_DNPLOC";

// URL du service REST du Catastro pour les demandes par référence cadastrale
const OVC_CALLEJERO_DNPRC_URL = 
  "https://ovc.catastro.meh.es/OVCServWeb/OVCWcfCallejero/COVCCallejero.svc/json/Consulta_DNPRC";

// Liste des types de voies courantes et leurs abréviations pour le Catastro
const ROAD_TYPES: Record<string, string> = {
  "CALLE": "CL",
  "AVENIDA": "AV",
  "PLAZA": "PZ",
  "PASEO": "PS",
  "RONDA": "RD",
  "CARRETERA": "CR",
  "TRAVESIA": "TR",
  "CUESTA": "CU",
  "PASAJE": "PJ",
  "CAMINO": "CM",
  // Versions courtes et variations
  "CL": "CL",
  "C/": "CL",
  "C.": "CL",
  "AV": "AV",
  "AVD": "AV",
  "AVDA": "AV",
  "PZ": "PZ",
  "PZA": "PZ",
  "PS": "PS",
  "PSO": "PS",
  "RD": "RD",
  "RDA": "RD",
  "CR": "CR",
  "CTRA": "CR",
  "TR": "TR",
  "TRAV": "TR",
};

// Normalise le nom de province pour le Catastro
const normalizeProvince = (provinceName: string): string => {
  const name = provinceName.toUpperCase().trim();
  
  // Mappings spécifiques pour certaines provinces
  const provinceMapping: Record<string, string> = {
    "ALAVA": "ARABA/ÁLAVA",
    "ÁLAVA": "ARABA/ÁLAVA",
    "ARABA": "ARABA/ÁLAVA",
    "BALEARES": "ILLES BALEARS",
    "ISLAS BALEARES": "ILLES BALEARS",
    "MALLORCA": "ILLES BALEARS",
    "ORENSE": "OURENSE",
    "LA CORUÑA": "A CORUÑA",
    "CORUÑA": "A CORUÑA",
    "GERONA": "GIRONA",
    "LERIDA": "LLEIDA"
  };
  
  return provinceMapping[name] || name;
};

// Extraction des composants d'adresse à partir d'une adresse complète
export const parseAddress = (address: string): { 
  province: string; 
  municipality: string; 
  roadType: string; 
  roadName: string; 
  number: string;
} => {
  // Normalisation de l'adresse
  address = address.trim()
    .replace(/\s+/g, ' ')
    .replace(/,\s*/g, ', ')
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, ""); // Enlève les accents
  
  // Extraction par analyse basique (peut être améliorée pour des cas spécifiques)
  let province = "MADRID"; // Par défaut, si non détecté
  let municipality = "MADRID"; // Par défaut, si non détecté
  let roadType = "CL"; // Par défaut CALLE
  let roadName = "";
  let number = "";
  
  // Séparation par virgules pour extraire la ville/province
  const parts = address.split(',');
  
  if (parts.length > 1) {
    // Dernière partie est généralement code postal + ville
    const lastPart = parts[parts.length - 1].trim();
    
    // Extraction du code postal et de la ville
    const postalCodeMatch = lastPart.match(/\d{5}/);
    if (postalCodeMatch) {
      const postalParts = lastPart.split(postalCodeMatch[0]);
      if (postalParts.length > 1) {
        // La municipalité est généralement après le code postal
        municipality = postalParts[1].trim().toUpperCase();
        province = municipality; // Par défaut, mais peut être ajusté selon le CP
      }
    } else {
      municipality = lastPart.toUpperCase();
      province = municipality;
    }
    
    // La rue est dans la première partie
    const streetPart = parts[0].trim();
    
    // Extraction du type de voie et du nom
    for (const [typeName, code] of Object.entries(ROAD_TYPES)) {
      if (streetPart.toUpperCase().startsWith(typeName)) {
        roadType = code;
        roadName = streetPart.substring(typeName.length).trim().toUpperCase();
        break;
      }
    }
    
    // Si aucun type de voie n'a été trouvé, on prend toute la rue
    if (!roadName) {
      roadName = streetPart.toUpperCase();
      // Extraction du numéro de rue si présent à la fin
      const numberMatch = roadName.match(/\s+(\d+)\s*$/);
      if (numberMatch) {
        number = numberMatch[1];
        roadName = roadName.substring(0, roadName.lastIndexOf(numberMatch[0])).trim();
      }
    } else {
      // Extraction du numéro de rue si déjà séparé
      const numberMatch = roadName.match(/\s+(\d+)\s*$/);
      if (numberMatch) {
        number = numberMatch[1];
        roadName = roadName.substring(0, roadName.lastIndexOf(numberMatch[0])).trim();
      }
    }
  } else {
    // Si pas de virgule, on essaie quand même d'analyser
    const streetPart = address.trim();
    
    for (const [typeName, code] of Object.entries(ROAD_TYPES)) {
      if (streetPart.toUpperCase().startsWith(typeName)) {
        roadType = code;
        roadName = streetPart.substring(typeName.length).trim().toUpperCase();
        break;
      }
    }
    
    if (!roadName) {
      roadName = streetPart.toUpperCase();
    }
    
    // Extraction du numéro
    const numberMatch = roadName.match(/\s+(\d+)\s*$/);
    if (numberMatch) {
      number = numberMatch[1];
      roadName = roadName.substring(0, roadName.lastIndexOf(numberMatch[0])).trim();
    }
  }
  
  return {
    province: normalizeProvince(province),
    municipality,
    roadType,
    roadName,
    number
  };
};

// Fonction pour obtenir des données cadastrales par coordonnées
export const getCadastralDataByCoordinatesREST = async (
  latitude: number,
  longitude: number
): Promise<CatastroData> => {
  try {
    // Création de l'URL avec paramètres
    const url = new URL(OVC_COORDENADAS_URL);
    url.searchParams.append("SRS", "EPSG:4326"); // WGS84 (GPS standard)
    url.searchParams.append("Coordenada_X", longitude.toString());
    url.searchParams.append("Coordenada_Y", latitude.toString());
    
    // Appel à l'API
    console.log(`Appel API REST Catastro par coordonnées: ${url.toString()}`);
    const response = await fetch(url.toString());
    
    // Vérifier le code de statut
    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${response.status}`);
    }
    
    // Parser la réponse JSON
    const data = await response.json();
    
    // Analyser les données de réponse
    if (data.consultaRccoorResult && data.consultaRccoorResult.coordenadas) {
      const coordInfo = data.consultaRccoorResult.coordenadas;
      let cadastralReference = "";
      let utmCoordinates = "";
      let province = "";
      
      // Récupération de la référence cadastrale
      if (coordInfo.coord && coordInfo.coord.pc) {
        cadastralReference = coordInfo.coord.pc.pc1 || "";
        if (coordInfo.coord.pc.pc2) {
          cadastralReference += coordInfo.coord.pc.pc2;
        }
      }
      
      // Récupération des coordonnées UTM
      if (coordInfo.coord && coordInfo.coord.geo) {
        const xUtm = coordInfo.coord.geo.xcen || "";
        const yUtm = coordInfo.coord.geo.ycen || "";
        if (xUtm && yUtm) {
          utmCoordinates = `X: ${xUtm}, Y: ${yUtm}`;
        }
      }
      
      // Récupération de la province si disponible
      if (coordInfo.lpro) {
        province = coordInfo.lpro;
      }
      
      // Zone climatique est définie par la province en Espagne
      const climateZone = getClimateZoneByProvince(province);
      
      return {
        cadastralReference,
        utmCoordinates,
        climateZone,
        apiSource: "REST",
        error: null
      };
    }
    
    // Gestion des erreurs de l'API
    if (data.consultaRccoorResult && data.consultaRccoorResult.lerr) {
      const errorCode = data.consultaRccoorResult.lerr.err.cod;
      const errorDesc = data.consultaRccoorResult.lerr.err.des;
      throw new Error(`Erreur Catastro (${errorCode}): ${errorDesc}`);
    }
    
    throw new Error("Format de réponse du Catastro non reconnu");
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

// Fonction pour obtenir des données cadastrales à partir d'une adresse structurée
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
    
    // Analyser les données de réponse
    if (data.consulta_dnplocResult && data.consulta_dnplocResult.lrcdnp) {
      const resultInfo = data.consulta_dnplocResult.lrcdnp;
      let cadastralReference = "";
      let utmCoordinates = "";
      
      // Récupération de la référence cadastrale
      if (resultInfo.rcdnp && resultInfo.rcdnp.pc) {
        cadastralReference = resultInfo.rcdnp.pc.pc1 || "";
        if (resultInfo.rcdnp.pc.pc2) {
          cadastralReference += resultInfo.rcdnp.pc.pc2;
        }
      }
      
      // Zone climatique est définie par la province en Espagne
      const climateZone = getClimateZoneByProvince(province);
      
      return {
        cadastralReference,
        utmCoordinates, // À compléter dans un autre appel si nécessaire
        climateZone,
        apiSource: "REST",
        error: null
      };
    }
    
    // Gestion des erreurs de l'API
    if (data.consulta_dnplocResult && data.consulta_dnplocResult.lerr) {
      const errorCode = data.consulta_dnplocResult.lerr.err.cod;
      const errorDesc = data.consulta_dnplocResult.lerr.err.des;
      throw new Error(`Erreur Catastro (${errorCode}): ${errorDesc}`);
    }
    
    throw new Error("Format de réponse du Catastro non reconnu");
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

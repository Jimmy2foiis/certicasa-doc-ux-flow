
// Normalize and parse Spanish addresses for the Catastro API

// Liste des types de voies courantes et leurs abréviations pour le Catastro
export const ROAD_TYPES: Record<string, string> = {
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
export const normalizeProvince = (provinceName: string): string => {
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

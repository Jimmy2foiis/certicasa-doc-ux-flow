
/**
 * Module de parsing d'adresses pour le Cadastre espagnol
 * Permet de structurer une adresse libre en composants compatibles avec l'API Catastro
 */

// Structure d'adresse analysée
export interface ParsedAddress {
  roadType: string;
  roadName: string;
  number: string;
  municipality: string;
  province: string;
}

// Mapping des types de voies en espagnol
const roadTypesMapping: Record<string, string> = {
  'CALLE': 'CL',
  'AVENIDA': 'AV',
  'PLAZA': 'PZ',
  'PASEO': 'PS',
  'CARRETERA': 'CR',
  'CAMINO': 'CM',
  'RAMBLA': 'RB',
  'GRAN VÍA': 'GV',
  'TRAVESÍA': 'TR',
  'VÍA': 'VI',
};

/**
 * Normaliser le nom de province pour qu'il soit conforme aux standards du Catastro
 */
export const normalizeProvince = (province: string): string => {
  // Table de correspondance pour les provinces communes
  const provinceMapping: Record<string, string> = {
    'MADRID': 'MADRID',
    'BARCELONA': 'BARCELONA',
    'VALENCIA': 'VALENCIA',
    'SEVILLA': 'SEVILLA',
    'ALICANTE': 'ALICANTE',
    'MÁLAGA': 'MALAGA',
    'MURCIA': 'MURCIA',
  };
  
  const normalizedProvince = province.normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")  // Retirer les accents
    .toUpperCase()
    .trim();
  
  return provinceMapping[normalizedProvince] || normalizedProvince;
};

/**
 * Parser complet d'adresses espagnoles
 * Extrait les composants structurés d'une adresse pour l'API Catastro
 */
export const parseAddress = (address: string): ParsedAddress => {
  // Normaliser l'adresse
  const normalizedAddress = address
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")  // Retirer les accents
    .toUpperCase()
    .trim();
  
  // Variables par défaut
  let roadType = "";
  let roadName = "";
  let number = "";
  let municipality = "";
  let province = "MADRID"; // Par défaut, si on ne trouve pas la province
  
  // Chercher une province dans l'adresse
  for (const provinceName in provinceMapping) {
    if (normalizedAddress.includes(provinceName)) {
      province = provinceMapping[provinceName];
      break;
    }
  }
  
  // Essayer de détecter la municipalité
  // Format typique: "..., 28006 MADRID, ESPAÑA"
  const postalCodeRegex = /\d{5}\s+([A-ZÀÁÂÄÃÅĄĆÈÉÊËĘÌÍÎÏŁŃÒÓÔÖÕØÙÚÛÜŸÝŻŹÑÇŠŽĆĐ\s]+)/i;
  const postalMatch = normalizedAddress.match(postalCodeRegex);
  
  if (postalMatch && postalMatch[1]) {
    municipality = postalMatch[1].split(',')[0].trim();
  }
  
  // Si pas de municipalité détectée, mais une province oui, utiliser comme municipalité
  if (!municipality && province) {
    municipality = province;
  }
  
  // Extraire le type de voie et le nom
  for (const typeKey in roadTypesMapping) {
    if (normalizedAddress.includes(typeKey)) {
      roadType = roadTypesMapping[typeKey];
      
      // Extraire le nom de la voie après le type
      const typeIndex = normalizedAddress.indexOf(typeKey);
      const afterType = normalizedAddress.substring(typeIndex + typeKey.length).trim();
      
      // Extraire jusqu'à la virgule, le numéro ou fin de chaîne
      const endNameIndex = Math.min(
        afterType.indexOf(',') > -1 ? afterType.indexOf(',') : Infinity,
        afterType.search(/\d+/) > -1 ? afterType.search(/\d+/) : Infinity
      );
      
      roadName = endNameIndex < Infinity 
        ? afterType.substring(0, endNameIndex).trim() 
        : afterType.trim();
      
      break;
    }
  }
  
  // Si aucun type n'est détecté, utiliser CL par défaut
  if (!roadType) {
    roadType = "CL";
    
    // Extraire le premier mot comme nom de voie
    const firstComma = normalizedAddress.indexOf(',');
    if (firstComma > -1) {
      roadName = normalizedAddress.substring(0, firstComma).trim();
    } else {
      roadName = normalizedAddress.trim();
    }
  }
  
  // Extraire le numéro (après le nom de rue)
  const numberMatch = normalizedAddress.match(/\b(\d+)\b/);
  if (numberMatch) {
    number = numberMatch[1];
  }
  
  return {
    roadType,
    roadName,
    number,
    municipality: municipality || "MADRID",
    province: province || "MADRID"
  };
};

// Table de correspondance pour les provinces
const provinceMapping: Record<string, string> = {
  'MADRID': 'MADRID',
  'BARCELONA': 'BARCELONA',
  'VALENCIA': 'VALENCIA',
  'SEVILLA': 'SEVILLA',
  'ALICANTE': 'ALICANTE',
  'MÁLAGA': 'MALAGA',
  'MURCIA': 'MURCIA',
  'ZARAGOZA': 'ZARAGOZA',
  'BILBAO': 'VIZCAYA',
  'VIZCAYA': 'VIZCAYA',
  'LA CORUÑA': 'A CORUÑA',
  'A CORUÑA': 'A CORUÑA',
  'PALMA': 'ILLES BALEARS',
  'MALLORCA': 'ILLES BALEARS',
  'ISLAS BALEARES': 'ILLES BALEARS',
  'ILLES BALEARS': 'ILLES BALEARS',
  'LAS PALMAS': 'LAS PALMAS',
  'GRAN CANARIA': 'LAS PALMAS',
  'TENERIFE': 'SANTA CRUZ DE TENERIFE',
  'SANTA CRUZ DE TENERIFE': 'SANTA CRUZ DE TENERIFE',
};

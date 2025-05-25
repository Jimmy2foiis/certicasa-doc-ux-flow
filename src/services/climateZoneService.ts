// Fonction pour normaliser les noms de province (suppression des accents, majuscules, etc.)
export const normalizeProvince = (province: string): string => {
  if (!province) return "";
  return province
    .toUpperCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, "")
    .replace(/\./g, '')
    .trim();
};

// Mapping des provinces espagnoles à leurs zones climatiques selon CTE (mis à jour avec les zones Certicasa)
export const provinceToClimateZone: Record<string, string> = {
  // Zone A3
  "ALMERIA": "A3",
  "CADIZ": "A3",
  "HUELVA": "A3",
  "MALAGA": "A3",
  "LAS PALMAS": "A3",
  "SANTA CRUZ DE TENERIFE": "A3",
  // Zone A4
  "MURCIA": "A4",
  "SEVILLA": "A4",
  // Zone B3
  "ALICANTE": "B3",
  "CASTELLON": "B3",
  "VALENCIA": "B3",
  // Zone B4
  "BADAJOZ": "B4",
  "CORDOBA": "B4",
  "GRANADA": "B4",
  "JAEN": "B4",
  // Zone C1
  "A CORUNA": "C1",
  "ASTURIAS": "C1",
  "CANTABRIA": "C1",
  "GUIPUZCOA": "C1",
  "PONTEVEDRA": "C1",
  "VIZCAYA": "C1",
  // Zone C2
  "BARCELONA": "C2",
  "GERONA": "C2",
  "GIRONA": "C2",
  "LUGO": "C2",
  "ORENSE": "C2",
  "OURENSE": "C2",
  "TARRAGONA": "C2",
  // Zone C3
  "ISLAS BALEARES": "C3",
  "ILLES BALEARS": "C3",
  // Zone C4
  "CACERES": "C4",
  "CIUDAD REAL": "C4",
  "TOLEDO": "C4",
  // Zone D1
  "ALAVA": "D1",
  "ARABA/ALAVA": "D1",
  "LLEIDA": "D1",
  "NAVARRA": "D1",
  "LA RIOJA": "D1",
  // Zone D2
  "HUESCA": "D2",
  "TERUEL": "D2",
  "ZARAGOZA": "D2",
  // Zone D3
  "MADRID": "D3",
  // Zone E1
  "AVILA": "E1",
  "BURGOS": "E1",
  "LEON": "E1",
  "PALENCIA": "E1",
  "SALAMANCA": "E1",
  "SEGOVIA": "E1",
  "SORIA": "E1",
  "VALLADOLID": "E1",
  "ZAMORA": "E1",
  "CUENCA": "E1",
  "GUADALAJARA": "E1",
};

// Fonction pour obtenir la zone climatique par province avec normalisation
export const getClimateZoneByProvince = (province: string): string => {
  if (!province) return "";
  
  // Normalisation du nom de province
  const normalizedProvince = normalizeProvince(province);
  
  // Essayer d'abord une correspondance exacte
  if (provinceToClimateZone[normalizedProvince]) {
    return provinceToClimateZone[normalizedProvince];
  }
  
  // Si pas de correspondance exacte, essayons de trouver une province qui contient la chaîne
  for (const key in provinceToClimateZone) {
    const normalizedKey = normalizeProvince(key);
    if (normalizedProvince.includes(normalizedKey) || normalizedKey.includes(normalizedProvince)) {
      return provinceToClimateZone[key];
    }
  }
  
  return "N/A";
};

// Fonction pour obtenir la zone climatique par adresse
export const getClimateZoneByAddress = (address: string): string => {
  if (!address) return "";
  
  // Normalisation de l'adresse
  const normalizedAddress = normalizeProvince(address);
  
  // Essayer de détecter une province dans l'adresse
  for (const province in provinceToClimateZone) {
    const normalizedProvince = normalizeProvince(province);
    if (normalizedAddress.includes(normalizedProvince)) {
      return provinceToClimateZone[province];
    }
  }
  
  // Si Madrid est mentionné dans l'adresse
  if (normalizedAddress.includes("MADRID")) {
    return "D3";
  }
  
  // Par défaut, retourner indéterminé
  return "N/A";
};

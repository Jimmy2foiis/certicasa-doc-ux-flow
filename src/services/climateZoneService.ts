
// Mapping des provinces espagnoles à leurs zones climatiques selon CTE
export const provinceToClimateZone: Record<string, string> = {
  // Zone α3
  "ALMERÍA": "α3",
  // Zone A3
  "CÁDIZ": "A3",
  "HUELVA": "A3",
  "MÁLAGA": "A3",
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
  "CÓRDOBA": "B4",
  "GRANADA": "B4",
  "JAÉN": "B4",
  // Zone C1
  "A CORUÑA": "C1",
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
  "ARABA/ÁLAVA": "D1",
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

// Fonction pour obtenir la zone climatique par province
export const getClimateZoneByProvince = (province: string): string => {
  if (!province) return "";
  
  // Normalisation du nom de province
  const normalizedProvince = province.toUpperCase().trim();
  
  return provinceToClimateZone[normalizedProvince] || "N/A";
};

// Fonction pour obtenir la zone climatique par adresse
export const getClimateZoneByAddress = (address: string): string => {
  if (!address) return "";
  
  // Détection simplifiée de la province dans l'adresse
  const normalizedAddress = address.toUpperCase().trim();
  
  for (const province in provinceToClimateZone) {
    if (normalizedAddress.includes(province)) {
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

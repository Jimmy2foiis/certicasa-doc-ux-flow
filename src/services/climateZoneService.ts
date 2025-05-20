
/**
 * Service pour la détermination des zones climatiques espagnoles
 * selon la réglementation CTE (Código Técnico de la Edificación)
 */

/**
 * Détermine la zone climatique en fonction de la province espagnole
 * @param provincia Le nom de la province
 * @returns Le code de la zone climatique
 */
export const getClimateZoneFromProvince = (provincia: string): string => {
  // Normaliser le nom de la province (majuscules)
  const normalizedProvince = provincia.toUpperCase();
  
  // Zones climatiques selon la réglementation CTE espagnole
  // Données complètes basées sur le document officiel CTE-DB-HE
  const climateZones: Record<string, string> = {
    // Andalucía
    "ALMERIA": "A4",
    "CADIZ": "A3",
    "CORDOBA": "B4",
    "GRANADA": "C3",
    "HUELVA": "B4",
    "JAEN": "C4",
    "MALAGA": "A3",
    "SEVILLA": "B4",
    
    // Aragón
    "HUESCA": "D2",
    "TERUEL": "D2",
    "ZARAGOZA": "D3",
    
    // Asturias
    "ASTURIAS": "C1",
    
    // Islas Baleares
    "PALMA": "B3",
    "MALLORCA": "B3",
    "MENORCA": "B3",
    "IBIZA": "B3",
    "FORMENTERA": "B3",
    "ILLES BALEARS": "B3",
    
    // Islas Canarias
    "LAS PALMAS": "A3",
    "SANTA CRUZ DE TENERIFE": "A2",
    "FUERTEVENTURA": "A3",
    "GRAN CANARIA": "A3",
    "LANZAROTE": "A3",
    "LA PALMA": "A2",
    "TENERIFE": "A2",
    "EL HIERRO": "A2",
    "LA GOMERA": "A2",
    
    // Cantabria
    "CANTABRIA": "C1",
    
    // Castilla-La Mancha
    "ALBACETE": "D3",
    "CIUDAD REAL": "D3",
    "CUENCA": "D2",
    "GUADALAJARA": "D3",
    "TOLEDO": "C4",
    
    // Castilla y León
    "AVILA": "E1",
    "BURGOS": "E1",
    "LEON": "E1",
    "PALENCIA": "D1",
    "SALAMANCA": "D2",
    "SEGOVIA": "D2",
    "SORIA": "E1",
    "VALLADOLID": "D2",
    "ZAMORA": "D2",
    
    // Cataluña
    "BARCELONA": "C2",
    "GIRONA": "D2",
    "LLEIDA": "D3",
    "TARRAGONA": "B3",
    
    // Extremadura
    "BADAJOZ": "C4",
    "CACERES": "C4",
    
    // Galicia
    "A CORUÑA": "C1",
    "LUGO": "D1",
    "OURENSE": "C2",
    "PONTEVEDRA": "C1",
    
    // La Rioja
    "LA RIOJA": "D2",
    
    // Madrid
    "MADRID": "D3",
    
    // Murcia
    "MURCIA": "B3",
    
    // Navarra
    "NAVARRA": "D1",
    
    // País Vasco
    "ALAVA": "D1",
    "VIZCAYA": "C1",
    "BIZKAIA": "C1",
    "GUIPUZCOA": "D1",
    "GIPUZKOA": "D1",
    
    // Valencia
    "ALICANTE": "B4",
    "CASTELLON": "B3",
    "VALENCIA": "B3",
    
    // Ciudades autónomas
    "CEUTA": "B3",
    "MELILLA": "A3"
  };
  
  return climateZones[normalizedProvince] || "C3"; // Zone par défaut
};


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
  const climateZones: Record<string, string> = {
    "MADRID": "D3",
    "BARCELONA": "C2",
    "SEVILLA": "B4",
    "VALENCIA": "B3",
    "MALAGA": "A3",
    "BILBAO": "C1",
    "ASTURIAS": "C1",
    "ZARAGOZA": "D3",
    "MURCIA": "B3",
    "PALMA": "B3",
    "LAS PALMAS": "A3",
    // Ajouter d'autres provinces si nécessaire
  };
  
  return climateZones[normalizedProvince] || "C3"; // Zone par défaut
};

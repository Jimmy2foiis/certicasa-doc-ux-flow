
/**
 * Service pour l'analyse des réponses XML de l'API Catastro
 */

// Interface pour les données de retour de l'API Catastro
export interface CatastroData {
  cadastralReference: string;
  address: string;
  utmCoordinates: string;
  climateZone: string;
  error?: string;
}

/**
 * Fonction pour analyser la réponse XML du Catastro
 */
export const parseCatastroResponse = (xmlString: string): CatastroData => {
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(xmlString, "text/xml");
  
  // Vérifier s'il y a une erreur
  const errorNode = xmlDoc.querySelector("Control codError");
  if (errorNode && errorNode.textContent !== "0") {
    const errorMsg = xmlDoc.querySelector("Control descripcion")?.textContent || "Erreur inconnue";
    return {
      cadastralReference: "",
      address: "",
      utmCoordinates: "",
      climateZone: "",
      error: errorMsg
    };
  }

  try {
    // Extraire la référence cadastrale
    const rcNode = xmlDoc.querySelector("rc");
    const cadastralReference = rcNode ? rcNode.textContent || "" : "";
    
    // Extraire l'adresse
    const direccionNode = xmlDoc.querySelector("ldt");
    const address = direccionNode ? direccionNode.textContent || "" : "";
    
    // Extraire les coordonnées UTM (si disponibles)
    const utmXNode = xmlDoc.querySelector("xcen");
    const utmYNode = xmlDoc.querySelector("ycen");
    const utmX = utmXNode ? utmXNode.textContent || "" : "";
    const utmY = utmYNode ? utmYNode.textContent || "" : "";
    const utmCoordinates = (utmX && utmY) ? `${utmX}, ${utmY}` : "";
    
    // Déterminer la zone climatique espagnole en fonction de la province
    const provinciaNode = xmlDoc.querySelector("np");
    const provincia = provinciaNode ? provinciaNode.textContent || "" : "";
    
    // Import dynamique pour éviter les imports circulaires
    const { getClimateZoneFromProvince } = require('./climateZoneService');
    const climateZone = getClimateZoneFromProvince(provincia);
    
    return {
      cadastralReference,
      address,
      utmCoordinates,
      climateZone,
      error: undefined
    };
  } catch (error) {
    console.error("Erreur lors de l'analyse de la réponse XML:", error);
    return {
      cadastralReference: "",
      address: "",
      utmCoordinates: "",
      climateZone: "",
      error: "Erreur lors de l'analyse de la réponse XML"
    };
  }
};

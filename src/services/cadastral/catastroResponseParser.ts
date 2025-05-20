
import { CatastroData } from "../catastroTypes";
import { getClimateZoneByProvince } from "../climateZoneService";

/**
 * Recherche récursive de la référence cadastrale dans un objet JSON
 * Cette fonction permet de trouver la référence même si sa position varie dans la structure JSON
 */
const findCadastralReferenceInObject = (obj: any, depth: number = 0, maxDepth: number = 3): string | null => {
  // Éviter les recherches trop profondes ou les objets null/undefined
  if (!obj || depth > maxDepth) return null;
  
  // Vérifier les noms de propriétés communs pour la référence cadastrale
  const possibleKeys = ['refcat', 'rc', 'pc', 'lrc', 'referencia', 'referencia_catastral'];
  
  // Cas 1: L'objet a directement une propriété qui est la référence cadastrale
  for (const key of possibleKeys) {
    if (obj[key] && typeof obj[key] === 'string' && obj[key].length > 5) {
      return obj[key];
    }
  }
  
  // Cas 2: Format pc1 + pc2 (format courant)
  if (obj.pc1 && obj.pc2) {
    return `${obj.pc1}${obj.pc2}`;
  }
  
  // Cas 3: Parcourir récursivement les propriétés de l'objet
  for (const key in obj) {
    if (obj[key] !== null && typeof obj[key] === 'object') {
      const result = findCadastralReferenceInObject(obj[key], depth + 1, maxDepth);
      if (result) return result;
    }
  }
  
  // Cas 4: Vérifier si l'objet est un tableau et parcourir ses éléments
  if (Array.isArray(obj)) {
    for (const item of obj) {
      const result = findCadastralReferenceInObject(item, depth + 1, maxDepth);
      if (result) return result;
    }
  }
  
  return null;
};

/**
 * Parse la réponse de l'API Catastro pour les requêtes par coordonnées
 */
export const parseCoordinatesResponse = (response: any): CatastroData => {
  const result: CatastroData = {
    cadastralReference: "",
    utmCoordinates: "",
    climateZone: "",
    apiSource: "REST"
  };

  try {
    // Log complet de la réponse pour débogage
    console.log("Réponse API Catastro complète:", JSON.stringify(response));
    
    // Vérifier si la réponse contient un code d'erreur
    if (response.control && response.control.cuerr) {
      const errorCode = response.control.cuerr;
      let errorMessage = "Erreur Catastro";
      
      // Messages d'erreur spécifiques
      if (errorCode === "76") {
        errorMessage = "Erreur Catastro (76): LA COORDENADA X OBLIGATORIA - La coordonnée X (longitude) est obligatoire";
      } else if (errorCode === "77") {
        errorMessage = "Erreur Catastro (77): LA COORDENADA Y OBLIGATORIA - La coordonnée Y (latitude) est obligatoire";
      } else if (errorCode === "78") {
        errorMessage = "Erreur Catastro (78): COORDENADA FUERA DE AMBITO - Coordonnée hors d'Espagne";
      } else {
        // Essayer de récupérer le message d'erreur s'il existe
        errorMessage = `Erreur Catastro (${errorCode}): ${response.control.dserr || "Erreur inconnue"}`;
      }
      
      result.error = errorMessage;
      return result;
    }
    
    // Recherche récursive de la référence cadastrale dans toute la structure JSON
    const cadastralReference = findCadastralReferenceInObject(response);
    if (cadastralReference) {
      console.log("Référence cadastrale trouvée par recherche récursive:", cadastralReference);
      result.cadastralReference = cadastralReference;
    } else {
      console.log("Aucune référence cadastrale trouvée par recherche récursive dans:", JSON.stringify(response));
    }
    
    // Extraction classique (méthode standard avec chemins connus)
    if (!result.cadastralReference && response.coordenadas && response.coordenadas.coord && response.coordenadas.coord.length > 0) {
      const firstResult = response.coordenadas.coord[0];
      
      // Extraire la référence cadastrale - Structure améliorée pour capturer toutes les variantes possibles
      if (firstResult.pc) {
        if (firstResult.pc.pc1 && firstResult.pc.pc2) {
          result.cadastralReference = `${firstResult.pc.pc1}${firstResult.pc.pc2}`;
        } else if (typeof firstResult.pc === 'string') {
          result.cadastralReference = firstResult.pc;
        }
      } else if (firstResult.lrc) {
        // Format alternatif de référence cadastrale
        result.cadastralReference = firstResult.lrc;
      } else if (response.lrc) {
        // Format de niveau supérieur
        result.cadastralReference = response.lrc;
      }
      
      // Vérifier également au niveau supérieur si aucune référence n'a été trouvée
      if (!result.cadastralReference && response.pc) {
        if (response.pc.pc1 && response.pc.pc2) {
          result.cadastralReference = `${response.pc.pc1}${response.pc.pc2}`;
        } else if (typeof response.pc === 'string') {
          result.cadastralReference = response.pc;
        }
      }
      
      // Extraire les coordonnées UTM si disponibles
      if (firstResult.geo && firstResult.geo.xcen && firstResult.geo.ycen) {
        result.utmCoordinates = `X: ${firstResult.geo.xcen}, Y: ${firstResult.geo.ycen}`;
      }
      
      // Tenter d'extraire la province pour déterminer la zone climatique
      let province = "";
      if (firstResult.ldt && firstResult.ldt.np) {
        province = firstResult.ldt.np;
      } else if (firstResult.ldt && firstResult.ldt.nm) {
        // Si pas de province mais commune disponible, essayer de déduire la province
        province = firstResult.ldt.nm;
      }
      
      if (province) {
        result.climateZone = getClimateZoneByProvince(province);
      }
    } else if (!result.cadastralReference && response.consulta_coordenadas_response) {
      // Structure alternative de l'API (format SOAP converti en JSON)
      const altResponse = response.consulta_coordenadas_response.consulta_coordenadas_result;
      
      if (altResponse && altResponse.refcat) {
        result.cadastralReference = altResponse.refcat;
      }
      
      if (altResponse && altResponse.xcen && altResponse.ycen) {
        result.utmCoordinates = `X: ${altResponse.xcen}, Y: ${altResponse.ycen}`;
      }
      
      // Essayer d'extraire la province ou municipalité pour la zone climatique
      if (altResponse && altResponse.nprov) {
        result.climateZone = getClimateZoneByProvince(altResponse.nprov);
      } else if (altResponse && altResponse.nmun) {
        result.climateZone = getClimateZoneByProvince(altResponse.nmun);
      }
    } else if (!result.cadastralReference && response.Consulta_RCCOORResult) {
      // Format alternatif parfois rencontré
      if (response.Consulta_RCCOORResult.refcat) {
        result.cadastralReference = response.Consulta_RCCOORResult.refcat;
      } else if (response.Consulta_RCCOORResult.rc) {
        result.cadastralReference = response.Consulta_RCCOORResult.rc;
      }
      
      // Extraire les coordonnées UTM
      if (response.Consulta_RCCOORResult.xcen && response.Consulta_RCCOORResult.ycen) {
        result.utmCoordinates = `X: ${response.Consulta_RCCOORResult.xcen}, Y: ${response.Consulta_RCCOORResult.ycen}`;
      }
      
      // Extraire la zone climatique
      if (response.Consulta_RCCOORResult.nprov) {
        result.climateZone = getClimateZoneByProvince(response.Consulta_RCCOORResult.nprov);
      }
    } else if (response.coordenadas && response.coordenadas.lerr) {
      // Erreur spécifique aux coordonnées
      result.error = `Erreur Catastro: ${response.coordenadas.lerr}`;
    }
    
    // Si malgré tout on n'a pas de zone climatique, essayer de déduire à partir des coordonnées
    if (!result.climateZone && response.geo) {
      // Approximation grossière basée sur coordonnées UTM
      const x = parseFloat(response.geo.xcen);
      const y = parseFloat(response.geo.ycen);
      
      // Logique d'approximation des zones climatiques par UTM
      // Cette section est une approximation et pourrait être affinée avec des données plus précises
      if (y > 4700000) { // Nord de l'Espagne
        if (x < 400000) result.climateZone = "C1";
        else if (x < 700000) result.climateZone = "D1";
        else result.climateZone = "C2";
      } else if (y > 4300000) { // Centre de l'Espagne
        if (x < 400000) result.climateZone = "C4";
        else if (x < 600000) result.climateZone = "D3";
        else result.climateZone = "D2";
      } else { // Sud de l'Espagne
        if (x < 300000) result.climateZone = "A3";
        else if (x < 500000) result.climateZone = "B4";
        else result.climateZone = "B3";
      }
    }

    return result;
    
  } catch (error) {
    console.error("Erreur lors du parsing de la réponse Catastro:", error);
    console.log("Réponse Catastro brute qui a causé l'erreur:", JSON.stringify(response));
    result.error = error instanceof Error ? error.message : "Erreur de parsing de la réponse";
    return result;
  }
};

/**
 * Parse la réponse de l'API Catastro pour les requêtes par adresse
 */
export const parseAddressResponse = (response: any, province: string): CatastroData => {
  const result: CatastroData = {
    cadastralReference: "",
    utmCoordinates: "",
    climateZone: "",
    apiSource: "REST"
  };
  
  try {
    // Log complet de la réponse pour débogage
    console.log("Réponse API Catastro par adresse complète:", JSON.stringify(response));
    
    // Recherche récursive de la référence cadastrale
    const cadastralReference = findCadastralReferenceInObject(response);
    if (cadastralReference) {
      console.log("Référence cadastrale trouvée par recherche récursive (adresse):", cadastralReference);
      result.cadastralReference = cadastralReference;
    }
    
    // Vérifier si la réponse contient des erreurs
    if (response.control && response.control.cuerr) {
      result.error = `Erreur Catastro (${response.control.cuerr}): ${response.control.dserr}`;
      return result;
    }
    
    // Extraire les données cadastrales si disponibles (si pas déjà trouvé par recherche récursive)
    if (!result.cadastralReference && response.callejero && response.callejero.inmuebles && response.callejero.inmuebles.length > 0) {
      const firstResult = response.callejero.inmuebles[0];
      
      // Extraire la référence cadastrale avec gestion des différents formats
      if (firstResult.rc) {
        if (firstResult.rc.pc1 && firstResult.rc.pc2) {
          result.cadastralReference = `${firstResult.rc.pc1}${firstResult.rc.pc2}`;
        } else if (typeof firstResult.rc === 'string') {
          result.cadastralReference = firstResult.rc;
        } else if (firstResult.rc.refcat) {
          // Format alternatif
          result.cadastralReference = firstResult.rc.refcat;
        }
      }
      
      // Pas de coordonnées UTM disponibles via adresse
      result.utmCoordinates = "N/A";
    } else if (!result.cadastralReference && !result.error) {
      result.error = "Aucun inmueble trouvé pour cette adresse.";
    }
    
    // Définir la zone climatique à partir de la province (toujours)
    result.climateZone = getClimateZoneByProvince(province);
    
    return result;
    
  } catch (error) {
    console.error("Erreur lors du parsing de la réponse Catastro par adresse:", error);
    console.log("Réponse Catastro brute qui a causé l'erreur:", JSON.stringify(response));
    result.error = error instanceof Error ? error.message : "Erreur de parsing de la réponse";
    return result;
  }
};

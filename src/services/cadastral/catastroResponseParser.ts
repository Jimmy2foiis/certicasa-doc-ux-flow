
import { CatastroData } from "../catastroTypes";
import { getClimateZoneByProvince } from "../climateZoneService";

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

    // Traiter les données cadastrales si disponibles
    if (response.coordenadas && response.coordenadas.coord && response.coordenadas.coord.length > 0) {
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
      
      // Log pour débogage
      console.log("Extraction référence cadastrale:", {
        foundRef: result.cadastralReference || "Non trouvée",
        responseStructure: JSON.stringify(response),
        firstCoord: firstResult
      });
      
      // Extraire les coordonnées UTM si disponibles
      if (firstResult.geo && firstResult.geo.xcen && firstResult.geo.ycen) {
        result.utmCoordinates = `X: ${firstResult.geo.xcen}, Y: ${firstResult.geo.ycen}`;
      }
      
      // Tenter d'extraire la province pour déterminer la zone climatique
      if (firstResult.ldt && firstResult.ldt.np) {
        const province = firstResult.ldt.np;
        result.climateZone = getClimateZoneByProvince(province);
      }
    } else if (response.consulta_coordenadas_response) {
      // Structure alternative de l'API (format SOAP converti en JSON)
      const altResponse = response.consulta_coordenadas_response.consulta_coordenadas_result;
      
      if (altResponse && altResponse.refcat) {
        result.cadastralReference = altResponse.refcat;
      }
      
      if (altResponse && altResponse.xcen && altResponse.ycen) {
        result.utmCoordinates = `X: ${altResponse.xcen}, Y: ${altResponse.ycen}`;
      }
      
    } else if (response.coordenadas && response.coordenadas.lerr) {
      // Erreur spécifique aux coordonnées
      result.error = `Erreur Catastro: ${response.coordenadas.lerr}`;
    }

    return result;
    
  } catch (error) {
    console.error("Erreur lors du parsing de la réponse Catastro:", error);
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
    // Vérifier si la réponse contient des erreurs
    if (response.control && response.control.cuerr) {
      result.error = `Erreur Catastro (${response.control.cuerr}): ${response.control.dserr}`;
      return result;
    }
    
    // Extraire les données cadastrales si disponibles
    if (response.callejero && response.callejero.inmuebles && response.callejero.inmuebles.length > 0) {
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
      
      // Définir la zone climatique à partir de la province
      result.climateZone = getClimateZoneByProvince(province);
    } else {
      result.error = "Aucun inmueble trouvé pour cette adresse.";
    }
    
    return result;
    
  } catch (error) {
    console.error("Erreur lors du parsing de la réponse Catastro par adresse:", error);
    result.error = error instanceof Error ? error.message : "Erreur de parsing de la réponse";
    return result;
  }
};

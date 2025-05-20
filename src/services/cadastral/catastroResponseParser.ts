
import { getClimateZoneByProvince } from "../climateZoneService";
import { CatastroData } from "../catastroService";

/**
 * Parse la réponse JSON de l'API Catastro obtenue par coordonnées
 */
export const parseCoordinatesResponse = (data: any): CatastroData => {
  console.log('Structure de réponse API Catastro:', JSON.stringify(data));
  
  // Vérifier si la réponse contient une erreur formattée
  if (data.Consulta_RCCOORResult && data.Consulta_RCCOORResult.control && data.Consulta_RCCOORResult.control.cuerr === 1) {
    // Format d'erreur spécifique
    if (data.Consulta_RCCOORResult.lerr && data.Consulta_RCCOORResult.lerr[0]) {
      const errorCode = data.Consulta_RCCOORResult.lerr[0].cod;
      const errorDesc = data.Consulta_RCCOORResult.lerr[0].des;
      throw new Error(`Erreur Catastro (${errorCode}): ${errorDesc}`);
    }
    throw new Error("Erreur non spécifiée dans la réponse du Catastro");
  }
  
  // Format attendu pour les données de coordonnées
  if (data.Consulta_RCCOORResult && data.Consulta_RCCOORResult.coordenadas) {
    const coordInfo = data.Consulta_RCCOORResult.coordenadas;
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
  
  // Aucun format reconnu
  throw new Error("Format de réponse du Catastro non reconnu");
};

/**
 * Parse la réponse JSON de l'API Catastro obtenue par adresse
 */
export const parseAddressResponse = (data: any, province: string): CatastroData => {
  console.log('Structure de réponse API Catastro par adresse:', JSON.stringify(data));
  
  // Vérifier si la réponse contient une erreur formattée
  if (data.consulta_dnplocResult && data.consulta_dnplocResult.control && data.consulta_dnplocResult.control.cuerr === 1) {
    // Format d'erreur spécifique
    if (data.consulta_dnplocResult.lerr && data.consulta_dnplocResult.lerr.err) {
      const errorCode = data.consulta_dnplocResult.lerr.err.cod;
      const errorDesc = data.consulta_dnplocResult.lerr.err.des;
      throw new Error(`Erreur Catastro (${errorCode}): ${errorDesc}`);
    }
    throw new Error("Erreur non spécifiée dans la réponse du Catastro");
  }
  
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
  
  // Aucun format reconnu
  throw new Error("Format de réponse du Catastro non reconnu");
};


import { getClimateZoneByProvince } from "../climateZoneService";
import { CatastroData } from "../catastroService";

/**
 * Parse la réponse JSON de l'API Catastro obtenue par coordonnées
 */
export const parseCoordinatesResponse = (data: any): CatastroData => {
  if (data.consultaRccoorResult && data.consultaRccoorResult.coordenadas) {
    const coordInfo = data.consultaRccoorResult.coordenadas;
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
  
  // Gestion des erreurs de l'API
  if (data.consultaRccoorResult && data.consultaRccoorResult.lerr) {
    const errorCode = data.consultaRccoorResult.lerr.err.cod;
    const errorDesc = data.consultaRccoorResult.lerr.err.des;
    throw new Error(`Erreur Catastro (${errorCode}): ${errorDesc}`);
  }
  
  throw new Error("Format de réponse du Catastro non reconnu");
};

/**
 * Parse la réponse JSON de l'API Catastro obtenue par adresse
 */
export const parseAddressResponse = (data: any, province: string): CatastroData => {
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
  
  // Gestion des erreurs de l'API
  if (data.consulta_dnplocResult && data.consulta_dnplocResult.lerr) {
    const errorCode = data.consulta_dnplocResult.lerr.err.cod;
    const errorDesc = data.consulta_dnplocResult.lerr.err.des;
    throw new Error(`Erreur Catastro (${errorCode}): ${errorDesc}`);
  }
  
  throw new Error("Format de réponse du Catastro non reconnu");
};


// API Endpoints for Spanish Catastro services

// URL du service REST du Catastro espagnol pour les demandes par coordonnées
export const OVC_COORDENADAS_URL = 
  "http://ovc.catastro.meh.es/OVCServWeb/OVCWcfCallejero/COVCCoordenadas.svc/json/Consulta_RCCOOR";

// URL du service REST du Catastro pour les demandes par proximité (nouveau)
export const OVC_COORDENADAS_DISTANCIA_URL = 
  "http://ovc.catastro.meh.es/OVCServWeb/OVCWcfCallejero/COVCCoordenadas.svc/json/Consulta_RCCOOR_Distancia";

// URL du service REST du Catastro pour les demandes par adresse structurée
export const OVC_CALLEJERO_DNPLOC_URL = 
  "http://ovc.catastro.meh.es/OVCServWeb/OVCWcfCallejero/COVCCallejero.svc/json/Consulta_DNPLOC";

// URL du service REST du Catastro pour les demandes par référence cadastrale
export const OVC_CALLEJERO_DNPRC_URL = 
  "http://ovc.catastro.meh.es/OVCServWeb/OVCWcfCallejero/COVCCallejero.svc/json/Consulta_DNPRC";

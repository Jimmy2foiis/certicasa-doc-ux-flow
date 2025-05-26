
/**
 * Service pour la création des requêtes SOAP pour l'API Catastro
 * Implémente différents templates pour les opérations disponibles
 * Documentation de référence: https://ovc.catastro.meh.es/ovcservweb/ovcswlocalizacionrc/ovccoordenadas.asmx
 */

/**
 * Génère une enveloppe SOAP pour la requête de consultation des coordonnées
 * @param lat Latitude
 * @param lng Longitude
 * @returns Chaîne XML formatée pour l'API Catastro
 */
export const createCoordinatesSoapEnvelope = (lat: number, lng: number): string => {
  return `
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" 
                  xmlns:cat="http://www.catastro.hacienda.gob.es/">
   <soapenv:Header/>
   <soapenv:Body>
      <cat:Consulta_RCCOOR>
         <cat:SRS>EPSG:4326</cat:SRS>
         <cat:Coordenada_X>${lng}</cat:Coordenada_X>
         <cat:Coordenada_Y>${lat}</cat:Coordenada_Y>
      </cat:Consulta_RCCOOR>
   </soapenv:Body>
</soapenv:Envelope>`;
};

/**
 * Génère une enveloppe SOAP pour la recherche par référence cadastrale
 * @param refCad Référence cadastrale
 * @returns Chaîne XML formatée pour l'API Catastro
 */
export const createReferenceSearchSoapEnvelope = (refCad: string): string => {
  return `
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" 
                  xmlns:cat="http://www.catastro.hacienda.gob.es/">
   <soapenv:Header/>
   <soapenv:Body>
      <cat:Consulta_DNP>
         <cat:Consulta_DNP>
            <cat:RC>${refCad}</cat:RC>
         </cat:Consulta_DNP>
      </cat:Consulta_DNP>
   </soapenv:Body>
</soapenv:Envelope>`;
};

/**
 * Génère une enveloppe SOAP pour la recherche par adresse
 * @param province Province (ex: "MADRID")
 * @param municipality Municipalité (ex: "MADRID")
 * @param street Nom de la rue
 * @param number Numéro de rue
 * @returns Chaîne XML formatée pour l'API Catastro
 */
export const createAddressSearchSoapEnvelope = (
  province: string,
  municipality: string,
  street: string,
  number: string
): string => {
  return `
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" 
                  xmlns:cat="http://www.catastro.hacienda.gob.es/">
   <soapenv:Header/>
   <soapenv:Body>
      <cat:Consulta_DNPLOC>
         <cat:Consulta_DNPLOC>
            <cat:Provincia>${province}</cat:Provincia>
            <cat:Municipio>${municipality}</cat:Municipio>
            <cat:Sigla>CL</cat:Sigla>
            <cat:Calle>${street}</cat:Calle>
            <cat:Numero>${number}</cat:Numero>
         </cat:Consulta_DNPLOC>
      </cat:Consulta_DNPLOC>
   </soapenv:Body>
</soapenv:Envelope>`;
};

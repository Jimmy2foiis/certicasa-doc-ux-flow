
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
    <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:cat="http://catastro.meh.es/">
      <soapenv:Header/>
      <soapenv:Body>
        <cat:Consulta_RCCOOR_DGC>
          <cat:coor>
            <cat:coord>
              <cat:latitud>${lat}</cat:latitud>
              <cat:longitud>${lng}</cat:longitud>
            </cat:coord>
          </cat:coor>
        </cat:Consulta_RCCOOR_DGC>
      </soapenv:Body>
    </soapenv:Envelope>
  `;
};

/**
 * Génère une enveloppe SOAP pour la recherche par référence cadastrale
 * @param refCad Référence cadastrale
 * @returns Chaîne XML formatée pour l'API Catastro
 */
export const createReferenceSearchSoapEnvelope = (refCad: string): string => {
  return `
    <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:cat="http://catastro.meh.es/">
      <soapenv:Header/>
      <soapenv:Body>
        <cat:Consulta_DNP>
          <cat:Consulta_DNP>
            <cat:RC>${refCad}</cat:RC>
          </cat:Consulta_DNP>
        </cat:Consulta_DNP>
      </soapenv:Body>
    </soapenv:Envelope>
  `;
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
    <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:cat="http://catastro.meh.es/">
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
    </soapenv:Envelope>
  `;
};

/**
 * Génère une enveloppe SOAP pour obtenir des informations complètes sur une parcelle
 * @param refCad Référence cadastrale
 * @returns Chaîne XML formatée pour l'API Catastro
 */
export const createParcelDataSoapEnvelope = (refCad: string): string => {
  return `
    <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:cat="http://catastro.meh.es/">
      <soapenv:Header/>
      <soapenv:Body>
        <cat:Consulta_DNPRC>
          <cat:Consulta_DNPRC>
            <cat:RC>${refCad}</cat:RC>
          </cat:Consulta_DNPRC>
        </cat:Consulta_DNPRC>
      </soapenv:Body>
    </soapenv:Envelope>
  `;
};

/**
 * Génère une enveloppe SOAP pour obtenir la liste des municipalités d'une province
 * @param province Nom de la province (ex: "MADRID")
 * @returns Chaîne XML formatée pour l'API Catastro
 */
export const createMunicipalitiesSoapEnvelope = (province: string): string => {
  return `
    <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:cat="http://catastro.meh.es/">
      <soapenv:Header/>
      <soapenv:Body>
        <cat:ConsultaMunicipio>
          <cat:Provincia>${province}</cat:Provincia>
        </cat:ConsultaMunicipio>
      </soapenv:Body>
    </soapenv:Envelope>
  `;
};

/**
 * Génère une enveloppe SOAP pour obtenir la liste des rues d'une municipalité
 * @param province Nom de la province (ex: "MADRID")
 * @param municipality Nom de la municipalité (ex: "MADRID")
 * @returns Chaîne XML formatée pour l'API Catastro
 */
export const createStreetsSoapEnvelope = (province: string, municipality: string): string => {
  return `
    <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:cat="http://catastro.meh.es/">
      <soapenv:Header/>
      <soapenv:Body>
        <cat:ConsultaVia>
          <cat:Provincia>${province}</cat:Provincia>
          <cat:Municipio>${municipality}</cat:Municipio>
        </cat:ConsultaVia>
      </soapenv:Body>
    </soapenv:Envelope>
  `;
};

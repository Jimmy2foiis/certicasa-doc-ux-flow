
/**
 * Service pour la création des requêtes SOAP pour l'API Catastro
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

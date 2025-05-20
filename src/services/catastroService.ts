
/**
 * Service pour interagir avec l'API officielle du Catastro Español (Sede Electrónica del Catastro)
 */

import { fetchViaProxy } from './proxyService';

// Interface pour les données de retour de l'API Catastro
interface CatastroData {
  cadastralReference: string;
  address: string;
  utmCoordinates: string;
  climateZone: string;
  error?: string;
}

// Interface pour les coordonnées géographiques
interface GeoCoordinates {
  lat: number;
  lng: number;
}

/**
 * Conversion de l'adresse en coordonnées géographiques via Google Maps Geocoding
 */
export const getCoordinatesFromAddress = async (address: string): Promise<GeoCoordinates | null> => {
  try {
    // Vérifier que l'API Google Maps est disponible
    if (!window.google || !window.google.maps || !window.google.maps.Geocoder) {
      console.error("Google Maps API non disponible");
      return null;
    }

    const geocoder = new window.google.maps.Geocoder();
    
    return new Promise((resolve, reject) => {
      geocoder.geocode({ address }, (results: any, status: any) => {
        if (status === "OK" && results && results.length > 0) {
          const location = results[0].geometry.location;
          resolve({
            lat: location.lat(),
            lng: location.lng(),
          });
        } else {
          console.error("Erreur de géocodage:", status);
          reject(null);
        }
      });
    });
  } catch (error) {
    console.error("Erreur lors de la conversion de l'adresse en coordonnées:", error);
    return null;
  }
};

/**
 * Formatage de la requête SOAP pour l'API Catastro
 */
const createSoapEnvelope = (lat: number, lng: number): string => {
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
 * Fonction pour analyser la réponse XML du Catastro
 */
const parseCatastroResponse = (xmlString: string): CatastroData => {
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
    
    const climateZone = climateZones[provincia.toUpperCase()] || "C3"; // Zone par défaut
    
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

/**
 * Interrogation de l'API Catastro à partir de coordonnées
 */
export const getCadastralInfoFromCoordinates = async (lat: number, lng: number): Promise<CatastroData> => {
  try {
    const soapEnvelope = createSoapEnvelope(lat, lng);
    const apiUrl = "https://ovc.catastro.meh.es/ovcservweb/OVCSWLocalizacionRC/OVCCoordenadas.asmx";
    
    const response = await fetchViaProxy(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "text/xml;charset=UTF-8",
        "SOAPAction": "http://catastro.meh.es/Consulta_RCCOOR_DGC"
      },
      body: soapEnvelope
    });
    
    const xmlText = await response.text();
    return parseCatastroResponse(xmlText);
  } catch (error) {
    console.error("Erreur lors de la communication avec l'API Catastro:", error);
    return {
      cadastralReference: "",
      address: "",
      utmCoordinates: "",
      climateZone: "",
      error: `Erreur de communication avec l'API Catastro: ${error instanceof Error ? error.message : String(error)}`
    };
  }
};

/**
 * Fonction principale pour obtenir les données cadastrales à partir d'une adresse
 */
export const getCadastralDataFromAddress = async (address: string): Promise<CatastroData> => {
  try {
    // 1. Obtenir les coordonnées géographiques à partir de l'adresse
    const coordinates = await getCoordinatesFromAddress(address);
    
    if (!coordinates) {
      return {
        cadastralReference: "",
        address: "",
        utmCoordinates: "",
        climateZone: "",
        error: "Impossible de géocoder l'adresse"
      };
    }
    
    // 2. Utiliser les coordonnées pour interroger l'API Catastro
    const cadastralData = await getCadastralInfoFromCoordinates(coordinates.lat, coordinates.lng);
    return {
      ...cadastralData,
      address: address, // Utiliser l'adresse originale pour plus de clarté
    };
  } catch (error) {
    console.error("Erreur lors de la récupération des données cadastrales:", error);
    return {
      cadastralReference: "",
      address: "",
      utmCoordinates: "",
      climateZone: "",
      error: `Erreur lors de la récupération des données cadastrales: ${error instanceof Error ? error.message : String(error)}`
    };
  }
};

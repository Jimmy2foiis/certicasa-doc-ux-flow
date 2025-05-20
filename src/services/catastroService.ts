/**
 * Service pour interagir avec l'API du Catastro Español (Sede Electrónica del Catastro)
 * Version modifiée pour simuler les données sans appel API direct
 */

// Conversion de l'adresse en coordonnées géographiques via Google Maps Geocoding
export const getCoordinatesFromAddress = async (address: string): Promise<{lat: number, lng: number} | null> => {
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

// Interface pour les données de retour de l'API Catastro
interface CatastroData {
  cadastralReference: string;
  address: string;
  utmCoordinates: string;
  climateZone: string;
  error?: string;
}

// Base de données simulée de références cadastrales par ville
const mockCadastralDatabase: Record<string, { reference: string, utmCoordinates: string, climateZone: string }> = {
  "madrid": {
    reference: "9872023VK4797B0001WX",
    utmCoordinates: "441234.56, 4478765.43",
    climateZone: "D3"
  },
  "barcelona": {
    reference: "0123456DF2802S0001PQ",
    utmCoordinates: "431234.78, 4581456.21",
    climateZone: "C2"
  },
  "sevilla": {
    reference: "5432109TG3453N0001ZR",
    utmCoordinates: "235678.12, 4141234.56",
    climateZone: "B4"
  },
  "valencia": {
    reference: "7654321YJ2775H0001LM",
    utmCoordinates: "725436.89, 4373210.45",
    climateZone: "B3"
  },
  "malaga": {
    reference: "2345678UF7624N0001SB",
    utmCoordinates: "354678.12, 4064532.78",
    climateZone: "A3"
  },
  "bilbao": {
    reference: "9876543VN0987F0001HG",
    utmCoordinates: "506789.34, 4789012.56",
    climateZone: "C1"
  },
  "zaragoza": {
    reference: "1234567XM7123A0001JK",
    utmCoordinates: "676543.21, 4612345.67",
    climateZone: "D3"
  },
  "default": {
    reference: "0000000XX0000X0000XX",
    utmCoordinates: "500000.00, 4500000.00",
    climateZone: "C3"
  }
};

/**
 * Fonction simulée pour obtenir les données cadastrales à partir d'une adresse
 * Cette fonction évite l'appel API direct qui échoue à cause des restrictions CORS
 */
export const getCadastralDataFromAddress = async (address: string): Promise<CatastroData> => {
  try {
    // Simuler un délai réseau
    await new Promise(resolve => setTimeout(resolve, 1200));
    
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
    
    // 2. Extraire la ville à partir de l'adresse pour la simulation
    let cityKey = "default";
    const lowerAddress = address.toLowerCase();
    
    // Détecter la ville mentionnée dans l'adresse
    for (const city of Object.keys(mockCadastralDatabase)) {
      if (lowerAddress.includes(city)) {
        cityKey = city;
        break;
      }
    }
    
    // 3. Simuler les données cadastrales basées sur la ville
    const mockData = mockCadastralDatabase[cityKey] || mockCadastralDatabase.default;
    
    // 4. Retourner les données simulées
    return {
      cadastralReference: mockData.reference,
      address: address,
      utmCoordinates: mockData.utmCoordinates,
      climateZone: mockData.climateZone,
      error: undefined
    };
  } catch (error) {
    console.error("Erreur lors de la simulation des données cadastrales:", error);
    return {
      cadastralReference: "",
      address: "",
      utmCoordinates: "",
      climateZone: "",
      error: `Erreur lors de la récupération des données cadastrales: ${error instanceof Error ? error.message : String(error)}`
    };
  }
};

// Les fonctions suivantes sont conservées pour référence mais ne sont pas utilisées
// dans cette version simulée pour éviter les problèmes CORS

// Formatage de la requête SOAP pour l'API Catastro (non utilisé)
const createSoapEnvelope = (lat: number, lng: number): string => {
  return `
    <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:cat="http://catastro.meh.es/">
      <soapenv:Header/>
      <soapenv:Body>
        <cat:Consulta_RCCOOR_DGC>
          <cat:coor>
            <cat:coord>
              <cat:latitud>${lat}</latitud>
              <cat:longitud>${lng}</longitud>
            </cat:coord>
          </cat:coor>
        </cat:Consulta_RCCOOR_DGC>
      </soapenv:Body>
    </soapenv:Envelope>
  `;
};

// Fonction pour analyser la réponse XML du Catastro (non utilisée)
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
    
    // Déterminer la zone climatique espagnole (simulation)
    // Cela devrait être déterminé par un service supplémentaire basé sur la province ou le code postal
    const provinciaNode = xmlDoc.querySelector("np");
    const provincia = provinciaNode ? provinciaNode.textContent || "" : "";
    
    // Simplification pour la démonstration - devrait être basé sur la réglementation CTE espagnole
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
    };
    
    const climateZone = climateZones[provincia] || "C3"; // Zone par défaut
    
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

// Interrogation de l'API Catastro à partir de coordonnées (non utilisée)
export const getCadastralInfoFromCoordinates = async (lat: number, lng: number): Promise<CatastroData> => {
  try {
    const soapEnvelope = createSoapEnvelope(lat, lng);
    const apiUrl = "https://ovc.catastro.meh.es/ovcservweb/OVCSWLocalizacionRC/OVCCoordenadas.asmx";
    
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "text/xml;charset=UTF-8",
        "SOAPAction": "http://catastro.meh.es/Consulta_RCCOOR_DGC"
      },
      body: soapEnvelope
    });
    
    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${response.status}`);
    }
    
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

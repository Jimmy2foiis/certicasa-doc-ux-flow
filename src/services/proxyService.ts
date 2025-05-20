
/**
 * Service de proxy pour contourner les restrictions CORS
 * Permet d'accéder aux API externes sécurisées
 */

const PROXY_URL = "https://corsproxy.io/?";

/**
 * Effectue une requête à travers un proxy CORS
 * @param url L'URL originale à appeler
 * @param options Options de la requête fetch
 * @returns La réponse de l'API
 */
export const fetchViaProxy = async (url: string, options: RequestInit = {}): Promise<Response> => {
  try {
    const proxyUrl = `${PROXY_URL}${encodeURIComponent(url)}`;
    const response = await fetch(proxyUrl, options);
    
    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${response.status}`);
    }
    
    return response;
  } catch (error) {
    console.error("Erreur lors de la requête via proxy:", error);
    throw error;
  }
};


/**
 * Fetch utilities with timeout support
 */
import { API_TIMEOUT } from '../config';

// Fonction pour gérer les timeouts des requêtes fetch
export const fetchWithTimeout = async (
  url: string, 
  options: RequestInit = {}, 
  timeout = API_TIMEOUT
): Promise<Response> => {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  
  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal
    });
    clearTimeout(id);
    return response;
  } catch (error) {
    clearTimeout(id);
    throw error;
  }
};

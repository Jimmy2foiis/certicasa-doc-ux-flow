/**
 * Client HTTP pour les appels API
 */
import { API_BASE_URL, API_TIMEOUT, DEFAULT_FETCH_OPTIONS } from './config';
import { ApiResponse } from './types';

// Helper to retrieve auth token from localStorage and return the Authorization header if available
const getAuthHeader = (): Record<string, string> => {
  if (typeof window === 'undefined') return {};
  const token = localStorage.getItem('auth_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Fonction pour gérer les timeouts des requêtes fetch
const fetchWithTimeout = async (url: string, options: RequestInit = {}, timeout = API_TIMEOUT): Promise<Response> => {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  
  const response = await fetch(url, {
    ...options,
    signal: controller.signal
  });
  
  clearTimeout(id);
  return response;
};

// Client HTTP générique
export const httpClient = {
  async get<T>(endpoint: string, customOptions: RequestInit = {}): Promise<ApiResponse<T>> {
    try {
      const url = `${API_BASE_URL}${endpoint}`;
      console.log(`HTTP GET: ${url}`);
      
      const options: RequestInit = {
        ...DEFAULT_FETCH_OPTIONS,
        ...customOptions,
        headers: {
          ...DEFAULT_FETCH_OPTIONS.headers,
          ...(customOptions.headers || {}),
          ...getAuthHeader(),
        },
        method: 'GET',
      };
      
      const response = await fetchWithTimeout(url, options);
      console.log(`Response status: ${response.status}`);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`HTTP Error ${response.status}:`, errorText);
        throw new Error(`Erreur HTTP: ${response.status} - ${errorText}`);
      }
      
      const data = await response.json();
      console.log('Response data type:', typeof data, Array.isArray(data) ? 'Array' : 'Object');
      console.log('Response data sample:', Array.isArray(data) ? `Array with ${data.length} items` : data);
      
      // Pour l'endpoint /prospects/, retourner directement les données
      if (endpoint === '/prospects/' && Array.isArray(data)) {
        return { success: true, data: data as T, message: 'Success' };
      }
      
      // Pour d'autres endpoints, vérifier si c'est déjà un ApiResponse
      if (data && typeof data === 'object' && 'success' in data) {
        return data;
      }
      
      // Sinon, wrapper les données dans un ApiResponse
      return { success: true, data: data as T, message: 'Success' };
      
    } catch (error) {
      console.error(`Erreur GET ${endpoint}:`, error);
      if (error instanceof Error && error.name === 'AbortError') {
        return { success: false, data: null, message: 'Timeout de la requête' };
      }
      return { success: false, data: null, message: error instanceof Error ? error.message : 'Erreur inconnue' };
    }
  },
  
  async post<T>(endpoint: string, body: any, customOptions: RequestInit = {}): Promise<ApiResponse<T>> {
    try {
      const url = `${API_BASE_URL}${endpoint}`;
      const options: RequestInit = {
        ...DEFAULT_FETCH_OPTIONS,
        ...customOptions,
        headers: {
          ...DEFAULT_FETCH_OPTIONS.headers,
          ...(customOptions.headers || {}),
          ...getAuthHeader(),
        },
        method: 'POST',
        body: JSON.stringify(body),
      };
      
      const response = await fetchWithTimeout(url, options);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || `Erreur HTTP: ${response.status}`);
      }
      
      return data;
    } catch (error) {
      console.error(`Erreur POST ${endpoint}:`, error);
      return { success: false, data: null, message: error instanceof Error ? error.message : 'Erreur inconnue' };
    }
  },
  
  async patch<T>(endpoint: string, body: any, customOptions: RequestInit = {}): Promise<ApiResponse<T>> {
    try {
      const url = `${API_BASE_URL}${endpoint}`;
      const options: RequestInit = {
        ...DEFAULT_FETCH_OPTIONS,
        ...customOptions,
        headers: {
          ...DEFAULT_FETCH_OPTIONS.headers,
          ...(customOptions.headers || {}),
          ...getAuthHeader(),
        },
        method: 'PATCH',
        body: JSON.stringify(body),
      };
      
      const response = await fetchWithTimeout(url, options);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || `Erreur HTTP: ${response.status}`);
      }
      
      return data;
    } catch (error) {
      console.error(`Erreur PATCH ${endpoint}:`, error);
      return { success: false, data: null, message: error instanceof Error ? error.message : 'Erreur inconnue' };
    }
  },
  
  async delete<T>(endpoint: string, customOptions: RequestInit = {}): Promise<ApiResponse<T>> {
    try {
      const url = `${API_BASE_URL}${endpoint}`;
      const options: RequestInit = {
        ...DEFAULT_FETCH_OPTIONS,
        ...customOptions,
        headers: {
          ...DEFAULT_FETCH_OPTIONS.headers,
          ...(customOptions.headers || {}),
          ...getAuthHeader(),
        },
        method: 'DELETE',
      };
      
      const response = await fetchWithTimeout(url, options);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Erreur HTTP: ${response.status}`);
      }
      
      return { success: true, data: null };
    } catch (error) {
      console.error(`Erreur DELETE ${endpoint}:`, error);
      return { success: false, data: null, message: error instanceof Error ? error.message : 'Erreur inconnue' };
    }
  }
};

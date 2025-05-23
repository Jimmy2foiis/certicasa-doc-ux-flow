
/**
 * Client HTTP pour les appels API
 */
import { API_BASE_URL, API_TIMEOUT, DEFAULT_FETCH_OPTIONS } from './config';
import { ApiResponse } from './types';

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
      const options = { ...DEFAULT_FETCH_OPTIONS, ...customOptions, method: 'GET' };
      
      const response = await fetchWithTimeout(url, options);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || `Erreur HTTP: ${response.status}`);
      }
      
      return data;
    } catch (error) {
      console.error(`Erreur GET ${endpoint}:`, error);
      return { success: false, data: null, message: error instanceof Error ? error.message : 'Erreur inconnue' };
    }
  },
  
  async post<T>(endpoint: string, body: any, customOptions: RequestInit = {}): Promise<ApiResponse<T>> {
    try {
      const url = `${API_BASE_URL}${endpoint}`;
      const options = {
        ...DEFAULT_FETCH_OPTIONS,
        ...customOptions,
        method: 'POST',
        body: JSON.stringify(body)
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
      const options = {
        ...DEFAULT_FETCH_OPTIONS,
        ...customOptions,
        method: 'PATCH',
        body: JSON.stringify(body)
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
      const options = { ...DEFAULT_FETCH_OPTIONS, ...customOptions, method: 'DELETE' };
      
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

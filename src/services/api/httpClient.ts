
/**
 * Client HTTP pour les appels API avec debug amélioré
 */
import { API_BASE_URL, API_TIMEOUT, DEFAULT_FETCH_OPTIONS } from './config';
import { ApiResponse } from './types';
import { apiDebugger } from './debug/apiDebugger';
import { 
  isDirectArrayResponse, 
  isApiResponseFormat, 
  wrapInApiResponse, 
  createErrorResponse,
  logResponseType 
} from './utils/responseUtils';

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

// Client HTTP générique avec debug amélioré
export const httpClient = {
  async get<T>(endpoint: string, customOptions: RequestInit = {}): Promise<ApiResponse<T>> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    // Construire les headers de manière sûre pour TypeScript
    const customHeaders = (customOptions.headers as Record<string, string>) || {};
    const authHeaders = getAuthHeader();
    const defaultHeaders = DEFAULT_FETCH_OPTIONS.headers as Record<string, string>;
    
    const headers: Record<string, string> = {
      ...defaultHeaders,
      ...customHeaders,
      ...authHeaders,
    };
    
    const options: RequestInit = {
      ...DEFAULT_FETCH_OPTIONS,
      ...customOptions,
      headers,
      method: 'GET',
    };

    try {
      // Log de la requête
      apiDebugger.logRequest({
        url,
        method: 'GET',
        headers,
      });

      const response = await fetchWithTimeout(url, options);
      
      if (!response.ok) {
        const errorText = await response.text();
        const error = new Error(`HTTP ${response.status}: ${errorText}`);
        
        apiDebugger.logRequest({
          url,
          method: 'GET',
          headers,
          responseStatus: response.status,
          error,
        });
        
        return createErrorResponse<T>(`Erreur HTTP: ${response.status} - ${errorText}`);
      }
      
      const data = await response.json();
      
      // Analyse détaillée de la réponse
      logResponseType(data, endpoint);
      
      // Log de la réponse réussie
      apiDebugger.logRequest({
        url,
        method: 'GET',
        headers,
        responseStatus: response.status,
        responseData: data,
      });
      
      // Gestion spécifique pour l'endpoint /prospects/
      if (endpoint === '/prospects/' && isDirectArrayResponse(data)) {
        console.log('✅ Detected direct array response for prospects endpoint');
        return wrapInApiResponse(data as T);
      }
      
      // Si c'est déjà un ApiResponse
      if (isApiResponseFormat(data)) {
        console.log('✅ Detected ApiResponse format');
        return data;
      }
      
      // Sinon, wrapper les données
      console.log('✅ Wrapping raw data in ApiResponse format');
      return wrapInApiResponse(data as T);
      
    } catch (error) {
      const err = error instanceof Error ? error : new Error('Unknown error');
      
      apiDebugger.logRequest({
        url,
        method: 'GET',
        headers,
        error: err,
      });
      
      if (err.name === 'AbortError') {
        return createErrorResponse<T>('Timeout de la requête');
      }
      
      return createErrorResponse<T>(err.message);
    }
  },
  
  async post<T>(endpoint: string, body: any, customOptions: RequestInit = {}): Promise<ApiResponse<T>> {
    try {
      const url = `${API_BASE_URL}${endpoint}`;
      
      // Construire les headers de manière sûre pour TypeScript
      const customHeaders = (customOptions.headers as Record<string, string>) || {};
      const authHeaders = getAuthHeader();
      const defaultHeaders = DEFAULT_FETCH_OPTIONS.headers as Record<string, string>;
      
      const headers: Record<string, string> = {
        ...defaultHeaders,
        ...customHeaders,
        ...authHeaders,
      };
      
      const options: RequestInit = {
        ...DEFAULT_FETCH_OPTIONS,
        ...customOptions,
        headers,
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
      
      // Construire les headers de manière sûre pour TypeScript
      const customHeaders = (customOptions.headers as Record<string, string>) || {};
      const authHeaders = getAuthHeader();
      const defaultHeaders = DEFAULT_FETCH_OPTIONS.headers as Record<string, string>;
      
      const headers: Record<string, string> = {
        ...defaultHeaders,
        ...customHeaders,
        ...authHeaders,
      };
      
      const options: RequestInit = {
        ...DEFAULT_FETCH_OPTIONS,
        ...customOptions,
        headers,
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
      
      // Construire les headers de manière sûre pour TypeScript
      const customHeaders = (customOptions.headers as Record<string, string>) || {};
      const authHeaders = getAuthHeader();
      const defaultHeaders = DEFAULT_FETCH_OPTIONS.headers as Record<string, string>;
      
      const headers: Record<string, string> = {
        ...defaultHeaders,
        ...customHeaders,
        ...authHeaders,
      };
      
      const options: RequestInit = {
        ...DEFAULT_FETCH_OPTIONS,
        ...customOptions,
        headers,
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

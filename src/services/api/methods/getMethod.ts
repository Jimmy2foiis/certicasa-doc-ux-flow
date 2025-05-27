
/**
 * GET method implementation for HTTP client
 */
import { API_BASE_URL } from '../config';
import { ApiResponse } from '../types';
import { apiDebugger } from '../debug/apiDebugger';
import { fetchWithTimeout } from '../utils/fetchUtils';
import { buildRequestOptions } from '../utils/requestUtils';
import { 
  isDirectArrayResponse, 
  isApiResponseFormat, 
  wrapInApiResponse, 
  createErrorResponse,
  logResponseType 
} from '../utils/responseUtils';

export async function get<T>(endpoint: string, customOptions: RequestInit = {}): Promise<ApiResponse<T>> {
  const url = `${API_BASE_URL}${endpoint}`;
  const options = buildRequestOptions(customOptions, 'GET');

  try {
    // Log de la requête
    apiDebugger.logRequest({
      url,
      method: 'GET',
      headers: options.headers as Record<string, string>,
    });

    const response = await fetchWithTimeout(url, options);
    
    if (!response.ok) {
      const errorText = await response.text();
      const error = new Error(`HTTP ${response.status}: ${errorText}`);
      
      apiDebugger.logRequest({
        url,
        method: 'GET',
        headers: options.headers as Record<string, string>,
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
      headers: options.headers as Record<string, string>,
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
      headers: options.headers as Record<string, string>,
      error: err,
    });
    
    if (err.name === 'AbortError') {
      return createErrorResponse<T>('Timeout de la requête');
    }
    
    return createErrorResponse<T>(err.message);
  }
}

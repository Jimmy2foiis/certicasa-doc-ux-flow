
/**
 * POST method implementation for HTTP client
 */
import { API_BASE_URL } from '../config';
import { ApiResponse } from '../types';
import { fetchWithTimeout } from '../utils/fetchUtils';
import { buildRequestOptions } from '../utils/requestUtils';

export async function post<T>(endpoint: string, body: any, customOptions: RequestInit = {}): Promise<ApiResponse<T>> {
  try {
    const url = `${API_BASE_URL}${endpoint}`;
    const options = buildRequestOptions(customOptions, 'POST', body);
    
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
}

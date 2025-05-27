
/**
 * DELETE method implementation for HTTP client
 */
import { API_BASE_URL } from '../config';
import { ApiResponse } from '../types';
import { fetchWithTimeout } from '../utils/fetchUtils';
import { buildRequestOptions } from '../utils/requestUtils';

export async function deleteMethod<T>(endpoint: string, customOptions: RequestInit = {}): Promise<ApiResponse<T>> {
  try {
    const url = `${API_BASE_URL}${endpoint}`;
    const options = buildRequestOptions(customOptions, 'DELETE');
    
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

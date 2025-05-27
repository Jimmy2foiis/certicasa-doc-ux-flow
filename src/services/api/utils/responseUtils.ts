
/**
 * Utilitaires pour la gestion des réponses API
 */
import { ApiResponse } from '../types';

export const isValidResponse = (response: any): boolean => {
  return response && typeof response === 'object';
};

export const isApiResponseFormat = (data: any): data is ApiResponse<any> => {
  return data && typeof data === 'object' && 'success' in data;
};

export const isDirectArrayResponse = (data: any): data is any[] => {
  return Array.isArray(data);
};

export const wrapInApiResponse = <T>(data: T, message = 'Success'): ApiResponse<T> => {
  return {
    success: true,
    data,
    message
  };
};

export const createErrorResponse = <T>(message: string): ApiResponse<T> => {
  return {
    success: false,
    data: null,
    message
  };
};

export const logResponseType = (data: any, endpoint: string) => {
  console.log(`🔍 Response analysis for ${endpoint}:`);
  console.log('- Type:', typeof data);
  console.log('- Is Array:', Array.isArray(data));
  console.log('- Has success property:', data && 'success' in data);
  console.log('- Has data property:', data && 'data' in data);
  
  if (Array.isArray(data)) {
    console.log('- Array length:', data.length);
    if (data.length > 0) {
      console.log('- First item:', data[0]);
    }
  }
};

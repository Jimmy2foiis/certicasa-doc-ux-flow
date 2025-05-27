
/**
 * Request building utilities
 */
import { DEFAULT_FETCH_OPTIONS } from '../config';
import { getAuthHeader } from './authUtils';

export const buildHeaders = (customOptions: RequestInit = {}): Record<string, string> => {
  // Construire les headers de manière sûre pour TypeScript
  const customHeaders = (customOptions.headers as Record<string, string>) || {};
  const authHeaders = getAuthHeader();
  const defaultHeaders = DEFAULT_FETCH_OPTIONS.headers as Record<string, string>;
  
  return {
    ...defaultHeaders,
    ...customHeaders,
    ...authHeaders,
  };
};

export const buildRequestOptions = (
  customOptions: RequestInit = {},
  method: string,
  body?: any
): RequestInit => {
  const headers = buildHeaders(customOptions);
  
  const options: RequestInit = {
    ...DEFAULT_FETCH_OPTIONS,
    ...customOptions,
    headers,
    method,
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  return options;
};

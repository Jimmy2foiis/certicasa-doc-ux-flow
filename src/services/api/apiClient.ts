
/**
 * Client API unifié pour toutes les opérations
 */
import { API_BASE_URL, DEFAULT_FETCH_OPTIONS, API_TIMEOUT } from './config';

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

class ApiClient {
  private baseUrl: string;
  private defaultOptions: RequestInit;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
    this.defaultOptions = DEFAULT_FETCH_OPTIONS;
  }

  private async request<T>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT);

    try {
      const url = `${this.baseUrl}${endpoint}`;
      const config: RequestInit = {
        ...this.defaultOptions,
        ...options,
        headers: {
          ...this.defaultOptions.headers,
          ...options.headers,
        },
        signal: controller.signal,
      };

      const response = await fetch(url, config);
      clearTimeout(timeoutId);

      if (!response.ok) {
        return {
          success: false,
          error: `HTTP ${response.status}: ${response.statusText}`,
        };
      }

      const data = await response.json();
      return {
        success: true,
        data,
      };
    } catch (error) {
      clearTimeout(timeoutId);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erreur inconnue',
      };
    }
  }

  async get<T>(endpoint: string, params?: Record<string, string>): Promise<ApiResponse<T>> {
    const queryString = params ? `?${new URLSearchParams(params).toString()}` : '';
    return this.request<T>(`${endpoint}${queryString}`);
  }

  async post<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async patch<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'DELETE',
    });
  }
}

export const apiClient = new ApiClient();

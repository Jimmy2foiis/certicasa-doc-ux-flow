
/**
 * Authentication utilities for API requests
 */

// Helper to retrieve auth token from localStorage and return the Authorization header if available
export const getAuthHeader = (): Record<string, string> => {
  if (typeof window === 'undefined') return {};
  const token = localStorage.getItem('auth_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

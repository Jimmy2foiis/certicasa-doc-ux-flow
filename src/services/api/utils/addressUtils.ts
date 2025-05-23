
/**
 * Utility functions for address handling
 */

/**
 * Extracts the postal code from an address string
 * @param address - The address string to parse
 * @returns The extracted postal code or empty string
 */
export const extractPostalCode = (address?: string): string => {
  if (!address) return "";
  const matches = address.match(/\b\d{5}\b/);
  return matches && matches[0] ? matches[0] : "";
};

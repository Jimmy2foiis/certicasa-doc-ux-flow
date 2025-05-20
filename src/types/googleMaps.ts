
/**
 * Type declarations for Google Maps API integration
 */

// Extend Window interface for Google Maps global objects
declare global {
  interface Window {
    google?: any;
    gm_authFailure?: () => void;
    initGoogleMapsAutocomplete?: () => void;
  }
}

// Coordinates object structure
export interface GoogleMapsCoordinates {
  lat: number;
  lng: number;
}

// Options for Google Maps Autocomplete
export interface GoogleMapsAutocompleteOptions {
  inputRef: React.RefObject<HTMLInputElement>;
  initialAddress: string;
  onAddressSelected: (address: string) => void;
  onCoordinatesSelected?: (coordinates: GoogleMapsCoordinates) => void;
}

// Return type for the useGoogleMapsAutocomplete hook
export interface GoogleMapsAutocompleteResult {
  isLoading: boolean;
  error: string | null;
  apiAvailable: boolean;
  initAutocomplete: () => void;
}

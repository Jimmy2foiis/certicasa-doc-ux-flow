
/**
 * Type declarations for Google Maps API integration
 */

// Extend Window interface for Google Maps global objects
declare global {
  interface Window {
    google: {
      maps: {
        places: {
          Autocomplete: typeof google.maps.places.Autocomplete;
        };
        LatLng: typeof google.maps.LatLng;
        Geocoder: typeof google.maps.Geocoder;
      };
    };
    gm_authFailure?: () => void;
    initGoogleMapsAutocomplete?: () => void;
  }
}

// Google Maps type definitions
export namespace GoogleMapsTypes {
  export interface PlaceResult {
    formatted_address?: string;
    geometry?: {
      location?: {
        lat: () => number;
        lng: () => number;
      };
    };
    address_components?: Array<{
      long_name: string;
      short_name: string;
      types: string[];
    }>;
    name?: string;
  }
}

// Coordinates object structure
export interface GoogleMapsCoordinates {
  lat: number;
  lng: number;
}

// Address components structure
export interface AddressComponents {
  postalCode?: string;
  city?: string;
  province?: string;
  community?: string;
  country?: string;
  route?: string;
  streetNumber?: string;
}

// Options for Google Maps Autocomplete
export interface GoogleMapsAutocompleteOptions {
  inputRef: React.RefObject<HTMLInputElement>;
  initialAddress: string;
  onAddressSelected: (address: string) => void;
  onCoordinatesSelected?: (coordinates: GoogleMapsCoordinates) => void;
  onAddressComponentsSelected?: (components: AddressComponents) => void;
}

// Return type for the useGoogleMapsAutocomplete hook
export interface GoogleMapsAutocompleteResult {
  isLoading: boolean;
  error: string | null;
  apiAvailable: boolean;
  initAutocomplete: () => void;
}

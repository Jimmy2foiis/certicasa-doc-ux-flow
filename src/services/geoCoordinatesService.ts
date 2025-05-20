
import { GoogleMapsCoordinates } from "@/types/googleMaps";

/**
 * Interface defining geographic coordinates and associated methods
 */
export interface GeoCoordinates {
  lat: number;
  lng: number;
}

/**
 * Cached geocoding results to minimize API calls
 */
const geocodingCache: Record<string, { coordinates: GeoCoordinates; timestamp: number }> = {};

/**
 * Cache duration in milliseconds (24 hours)
 */
const CACHE_DURATION = 24 * 60 * 60 * 1000;

/**
 * Get coordinates from a given address using Google Maps Geocoding API
 * @param address The address to geocode
 * @returns Promise resolving to the coordinates or null if geocoding failed
 */
export const getCoordinatesFromAddress = async (address: string): Promise<GeoCoordinates | null> => {
  // Check cache first to minimize API calls
  if (geocodingCache[address] && Date.now() - geocodingCache[address].timestamp < CACHE_DURATION) {
    console.log('Using cached coordinates for:', address);
    return geocodingCache[address].coordinates;
  }

  // Use Google Maps Geocoding API
  if (!window.google || !window.google.maps) {
    console.error('Google Maps API not loaded');
    return null;
  }

  try {
    return new Promise<GeoCoordinates | null>((resolve) => {
      const geocoder = new window.google.maps.Geocoder();
      
      geocoder.geocode({ address }, (results, status) => {
        if (status === 'OK' && results && results.length > 0 && results[0].geometry) {
          const location = results[0].geometry.location;
          const coordinates: GeoCoordinates = {
            lat: location.lat(),
            lng: location.lng()
          };
          
          // Cache the result
          geocodingCache[address] = {
            coordinates,
            timestamp: Date.now()
          };
          
          resolve(coordinates);
        } else {
          console.error('Geocoding failed:', status);
          resolve(null);
        }
      });
    });
  } catch (error) {
    console.error('Error in geocoding:', error);
    return null;
  }
};

/**
 * Get a formatted address from coordinates using reverse geocoding
 * @param coordinates The coordinates to reverse geocode
 * @returns Promise resolving to the formatted address or null if reverse geocoding failed
 */
export const getAddressFromCoordinates = async (coordinates: GeoCoordinates): Promise<string | null> => {
  if (!window.google || !window.google.maps) {
    console.error('Google Maps API not loaded');
    return null;
  }

  try {
    return new Promise<string | null>((resolve) => {
      const geocoder = new window.google.maps.Geocoder();
      const latLng = new window.google.maps.LatLng(coordinates.lat, coordinates.lng);
      
      geocoder.geocode({ location: latLng }, (results, status) => {
        if (status === 'OK' && results && results[0]) {
          resolve(results[0].formatted_address);
        } else {
          console.error('Reverse geocoding failed:', status);
          resolve(null);
        }
      });
    });
  } catch (error) {
    console.error('Error in reverse geocoding:', error);
    return null;
  }
};

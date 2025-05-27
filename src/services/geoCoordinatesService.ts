
import { GoogleMapsCoordinates } from "@/types/googleMaps";
import { GOOGLE_MAPS_API_KEY } from "@/config/googleMapsConfig";
import proj4 from 'proj4';

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

// Définir les systèmes de coordonnées pour proj4
// WGS84 (GPS coordinates)
const WGS84 = 'EPSG:4326';
// UTM Zone 30N (ETRS89 / UTM zone 30N) - système utilisé en Espagne
const UTM30N = '+proj=utm +zone=30 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs';

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

  // Check if Google Maps API is loaded and available
  if (!window.google || !window.google.maps) {
    if (!GOOGLE_MAPS_API_KEY) {
      console.error('Google Maps API key is missing. Please check your environment configuration.');
      return null;
    }
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
  // Check if Google Maps API is loaded and available
  if (!window.google || !window.google.maps) {
    if (!GOOGLE_MAPS_API_KEY) {
      console.error('Google Maps API key is missing. Please check your environment configuration.');
      return null;
    }
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

/**
 * Convert GPS coordinates (latitude/longitude) to UTM 30N format using proj4
 * Returns a formatted string representation of UTM coordinates
 * @param latitude - The latitude in decimal degrees
 * @param longitude - The longitude in decimal degrees
 * @returns Formatted UTM coordinates as a string or empty string if conversion fails
 */
export const getFormattedUTMCoordinates = (latitude: number, longitude: number): string => {
  try {
    if (!latitude || !longitude || isNaN(latitude) || isNaN(longitude)) {
      console.error("Coordonnées GPS invalides:", { latitude, longitude });
      return "";
    }
    
    console.log(`Conversion UTM pour les coordonnées GPS: ${latitude}, ${longitude}`);
    
    // Convertir les coordonnées WGS84 (GPS) vers UTM 30N
    const utmCoords = proj4(WGS84, UTM30N, [longitude, latitude]);
    
    if (!utmCoords || utmCoords.length < 2) {
      console.error("Échec de la conversion UTM");
      return "";
    }
    
    const easting = Math.round(utmCoords[0] * 1000) / 1000; // Arrondir à 3 décimales
    const northing = Math.round(utmCoords[1] * 1000) / 1000;
    
    const result = `UTM 30N E: ${easting} N: ${northing}`;
    console.log(`Coordonnées UTM calculées: ${result}`);
    
    return result;
  } catch (error) {
    console.error("Erreur lors de la conversion UTM avec proj4:", error);
    return "";
  }
};

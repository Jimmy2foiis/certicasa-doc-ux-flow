
/**
 * Configuration for Google Maps API
 */

// Google Maps API key - this is a publishable key so it's safe to be in the code
export const GOOGLE_MAPS_API_KEY = "AIzaSyBoHmcKb2Bgf1PUxNTnsTAjMa0RgYx-HoQ";

// Google Maps script loading configuration
export const GOOGLE_MAPS_SCRIPT_CONFIG = {
  url: `https://maps.googleapis.com/maps/api/js`,
  libraries: ['places'],
  version: 'weekly',
  callback: 'initGoogleMapsAutocomplete',
};

// Autocomplete configuration
export const AUTOCOMPLETE_OPTIONS = {
  types: ['address'],
  componentRestrictions: { country: 'es' }, // Spain only
  fields: ['formatted_address', 'geometry', 'place_id', 'address_components']
};


/**
 * Utility functions for Google Maps integration
 */

// Check if Google Maps API is loaded and available
export const isGoogleMapsApiLoaded = (): boolean => {
  return Boolean(
    window.google && 
    window.google.maps && 
    window.google.maps.places && 
    window.google.maps.places.Autocomplete
  );
};

// Create Google Maps script element with configurations
export const createGoogleMapsScript = (
  apiKey: string,
  libraries: string[],
  callback: string,
  version: string
): HTMLScriptElement => {
  const script = document.createElement('script');
  script.id = 'google-maps-script';
  
  // Build the URL with parameters
  const librariesParam = libraries.join(',');
  script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=${librariesParam}&callback=${callback}&v=${version}`;
  script.async = true;
  script.defer = true;
  
  return script;
};

// Check if an address is in Spain based on address components from Google Place result
export const isAddressInSpain = (addressComponents: any[]): boolean => {
  return addressComponents?.some((component: any) => 
    component.types.includes("country") && 
    (component.short_name === "ES" || 
     component.long_name.includes("Spain") || 
     component.long_name.includes("España"))
  );
};

// Extract coordinates from Google Place result
export const extractCoordinates = (geometry: any): { lat: number, lng: number } | null => {
  if (!geometry || !geometry.location) {
    return null;
  }
  
  return {
    lat: geometry.location.lat(),
    lng: geometry.location.lng()
  };
};

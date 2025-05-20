
import { GOOGLE_MAPS_API_KEY, GOOGLE_MAPS_SCRIPT_CONFIG, AUTOCOMPLETE_OPTIONS } from "@/config/googleMapsConfig";
import { createGoogleMapsScript, isGoogleMapsApiLoaded, isAddressInSpain, extractCoordinates } from "@/utils/googleMapsUtils";
import { GoogleMapsCoordinates } from "@/types/googleMaps";
import { toast } from "@/components/ui/use-toast";

/**
 * Service for Google Maps API functionality
 */
export class GoogleMapsService {
  private static instance: GoogleMapsService;
  private scriptLoaded = false;
  private autocompleteInstances: Map<string, any> = new Map();
  
  private constructor() {}
  
  // Singleton pattern
  public static getInstance(): GoogleMapsService {
    if (!GoogleMapsService.instance) {
      GoogleMapsService.instance = new GoogleMapsService();
    }
    return GoogleMapsService.instance;
  }
  
  // Check if script is already loaded
  public isScriptLoaded(): boolean {
    return this.scriptLoaded || isGoogleMapsApiLoaded();
  }
  
  // Set script loaded status
  public setScriptLoaded(status: boolean): void {
    this.scriptLoaded = status;
  }
  
  // Create autocomplete instance for an input element
  public createAutocomplete(
    inputElement: HTMLInputElement, 
    onPlaceSelected: (address: string, coordinates: GoogleMapsCoordinates | null) => void
  ): any {
    if (!isGoogleMapsApiLoaded()) {
      console.error("Google Maps API not available");
      return null;
    }
    
    try {
      // Clear existing instance if it exists
      const inputId = inputElement.id || `input-${Math.random().toString(36).substring(2, 9)}`;
      if (!inputElement.id) {
        inputElement.id = inputId;
      }
      
      if (this.autocompleteInstances.has(inputId)) {
        window.google.maps.event.clearInstanceListeners(this.autocompleteInstances.get(inputId));
      }
      
      // Create new instance
      const autocomplete = new window.google.maps.places.Autocomplete(
        inputElement,
        AUTOCOMPLETE_OPTIONS
      );
      
      // Add place_changed listener
      autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace();
        
        if (!place.geometry) {
          console.error("No geometry for selected place");
          return;
        }
        
        const address = place.formatted_address;
        const coordinates = extractCoordinates(place.geometry);
        
        // Check if address is in Spain
        if (place.address_components && !isAddressInSpain(place.address_components)) {
          toast({
            title: "Vérification",
            description: "L'adresse sélectionnée semble être en dehors de l'Espagne. Veuillez vérifier.",
            variant: "destructive", // Fix: changed from "warning" to "destructive"
          });
        }
        
        // Call callback with selected place info
        onPlaceSelected(address, coordinates);
      });
      
      // Store instance for future cleanup
      this.autocompleteInstances.set(inputId, autocomplete);
      return autocomplete;
    } catch (error) {
      console.error("Error creating autocomplete:", error);
      return null;
    }
  }
  
  // Load Google Maps script
  public loadScript(): Promise<void> {
    return new Promise((resolve, reject) => {
      // Return immediately if script is already loaded
      if (this.isScriptLoaded()) {
        resolve();
        return;
      }
      
      // Check if script element already exists
      if (document.getElementById('google-maps-script')) {
        document.getElementById('google-maps-script')?.remove();
      }
      
      // Create global callback function
      window.initGoogleMapsAutocomplete = () => {
        console.log("Google Maps script loaded successfully");
        this.setScriptLoaded(true);
        resolve();
      };
      
      // Create global error handler
      window.gm_authFailure = () => {
        console.error("Google Maps authentication failed");
        this.setScriptLoaded(false);
        toast({
          title: "Erreur Google Maps API",
          description: "Clé API non autorisée pour ce domaine. Veuillez vérifier votre configuration.",
          variant: "destructive",
          duration: 10000,
        });
        reject(new Error("Google Maps authentication failed"));
      };
      
      // Create and add script element
      const script = createGoogleMapsScript(
        GOOGLE_MAPS_API_KEY,
        [GOOGLE_MAPS_SCRIPT_CONFIG.libraries[0]],
        GOOGLE_MAPS_SCRIPT_CONFIG.callback,
        GOOGLE_MAPS_SCRIPT_CONFIG.version
      );
      
      // Handle load errors
      script.onerror = (error) => {
        console.error("Error loading Google Maps script:", error);
        this.setScriptLoaded(false);
        toast({
          title: "Erreur de chargement",
          description: "Google Maps n'a pas pu être chargé. Veuillez saisir l'adresse manuellement.",
          variant: "destructive",
        });
        reject(error);
      };
      
      document.head.appendChild(script);
    });
  }
  
  // Clean up instances and event listeners
  public cleanup(inputElement?: HTMLInputElement): void {
    if (inputElement && inputElement.id && this.autocompleteInstances.has(inputElement.id)) {
      if (window.google && window.google.maps) {
        window.google.maps.event.clearInstanceListeners(this.autocompleteInstances.get(inputElement.id));
      }
      this.autocompleteInstances.delete(inputElement.id);
    } else {
      // Clean up all instances if no input specified
      this.autocompleteInstances.forEach((instance) => {
        if (window.google && window.google.maps) {
          window.google.maps.event.clearInstanceListeners(instance);
        }
      });
      this.autocompleteInstances.clear();
    }
  }
}


import { useState, useEffect, useRef, useCallback } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { GoogleMapsService } from '@/services/googleMapsService';
import { GoogleMapsAutocompleteOptions, GoogleMapsAutocompleteResult } from '@/types/googleMaps';

/**
 * Hook for Google Maps address autocomplete functionality
 */
export function useGoogleMapsAutocomplete({
  inputRef,
  initialAddress,
  onAddressSelected,
  onCoordinatesSelected
}: GoogleMapsAutocompleteOptions): GoogleMapsAutocompleteResult {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [apiAvailable, setApiAvailable] = useState(false);
  const googleMapsService = useRef(GoogleMapsService.getInstance());
  const isInitializedRef = useRef(false);
  const { toast } = useToast();
  
  // Initialize autocomplete when input element is available
  const initAutocomplete = useCallback(() => {
    console.log("Initializing Google Maps autocomplete");
    
    if (!inputRef.current) {
      console.error("Input reference not available");
      return;
    }
    
    // If Google Maps API is not loaded, attempt to load it
    if (!googleMapsService.current.isScriptLoaded()) {
      console.log("Google Maps API not loaded, attempting to load");
      setError("Google Maps API not loaded. Loading...");
      
      googleMapsService.current.loadScript()
        .then(() => {
          console.log("Google Maps script loaded, initializing autocomplete");
          setApiAvailable(true);
          setError(null);
          createAutocompleteForInput();
        })
        .catch((err) => {
          console.error("Failed to load Google Maps script:", err);
          setApiAvailable(false);
          setError("Failed to load Google Maps API. Please enter address manually.");
        })
        .finally(() => {
          setIsLoading(false);
        });
      
      return;
    }
    
    // If API is loaded, create autocomplete instance directly
    createAutocompleteForInput();
  }, [inputRef, onAddressSelected, onCoordinatesSelected]);
  
  // Helper to create autocomplete for current input
  const createAutocompleteForInput = useCallback(() => {
    if (!inputRef.current) return;
    
    console.log("Creating autocomplete instance");
    
    // Cleanup existing instance first
    googleMapsService.current.cleanup(inputRef.current);
    
    // Create new instance
    const autocomplete = googleMapsService.current.createAutocomplete(
      inputRef.current,
      (address, coordinates) => {
        console.log("Place selected:", address, coordinates);
        
        // Call onAddressSelected callback
        onAddressSelected(address);
        
        // Call onCoordinatesSelected callback if it exists and coordinates were found
        if (coordinates && onCoordinatesSelected) {
          onCoordinatesSelected(coordinates);
        }
        
        // Clear any errors
        setError(null);
        
        // Show success toast
        toast({
          title: "Adresse sélectionnée",
          description: "L'adresse a été correctement sélectionnée",
          duration: 3000,
        });
      }
    );
    
    if (autocomplete) {
      isInitializedRef.current = true;
    } else {
      setError("Failed to initialize address autocomplete");
      isInitializedRef.current = false;
    }
  }, [inputRef, onAddressSelected, onCoordinatesSelected, toast]);
  
  // Load Google Maps script on mount
  useEffect(() => {
    setIsLoading(true);
    
    // If Google Maps API is already loaded, initialize autocomplete
    if (googleMapsService.current.isScriptLoaded()) {
      console.log("Google Maps API already loaded");
      setApiAvailable(true);
      setIsLoading(false);
      
      // Only attempt to initialize if input ref exists
      if (inputRef.current) {
        createAutocompleteForInput();
      }
    } else {
      // Load Google Maps script
      googleMapsService.current.loadScript()
        .then(() => {
          console.log("Google Maps script loaded");
          setApiAvailable(true);
          setError(null);
          
          // Notify user that API is loaded
          toast({
            title: "Google Maps",
            description: "Service de recherche d'adresse chargé avec succès.",
            duration: 3000,
          });
          
          // Only attempt to initialize if input ref exists
          if (inputRef.current) {
            createAutocompleteForInput();
          }
        })
        .catch((err) => {
          console.error("Failed to load Google Maps script:", err);
          setApiAvailable(false);
          setError("Failed to load Google Maps API. Please enter address manually.");
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
    
    // Clean up on unmount
    return () => {
      if (inputRef.current) {
        googleMapsService.current.cleanup(inputRef.current);
      }
    };
  }, [createAutocompleteForInput, inputRef, toast]);
  
  // Add event listeners to input element
  useEffect(() => {
    const currentInput = inputRef.current;
    
    if (currentInput && apiAvailable) {
      console.log("Adding event listeners to input element");
      
      const handleFocus = () => {
        console.log("Input focused");
        if (!isInitializedRef.current) {
          initAutocomplete();
        }
      };
      
      // Add focus event listener
      currentInput.addEventListener('focus', handleFocus);
      
      // Clean up event listener on unmount
      return () => {
        currentInput.removeEventListener('focus', handleFocus);
      };
    }
  }, [apiAvailable, initAutocomplete, inputRef]);
  
  return {
    isLoading,
    error,
    apiAvailable,
    initAutocomplete
  };
}

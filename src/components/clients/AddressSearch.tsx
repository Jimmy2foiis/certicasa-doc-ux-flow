
import { useState, useRef, useEffect } from "react";
import { AddressInput } from "@/components/address/AddressInput";
import { AddressError } from "@/components/ui/address-error";
import { ApiStatus } from "@/components/address/ApiStatus";
import { useGoogleMapsAutocomplete } from "@/hooks/googleMaps/useGoogleMapsAutocomplete";
import { GeoCoordinates } from "@/services/geoCoordinatesService";
import { useAddressSelection } from "@/hooks/useAddressSelection";
import { AddressComponents } from "@/types/googleMaps";

interface AddressSearchProps {
  initialAddress: string;
  onAddressChange: (address: string) => void;
  onCoordinatesChange?: (coordinates: GeoCoordinates) => void;
  onProcessingChange?: (isProcessing: boolean) => void;
  onAddressComponentsChange?: (components: AddressComponents) => void;
}

/**
 * Composant de recherche d'adresse avec autocomplétion Google Maps
 * Optimisé pour toujours fournir des coordonnées GPS avant l'appel à l'API Catastro
 */
const AddressSearch = ({
  initialAddress,
  onAddressChange,
  onCoordinatesChange,
  onProcessingChange,
  onAddressComponentsChange
}: AddressSearchProps) => {
  // Use our custom hook for address selection logic
  const {
    address, 
    isProcessing,
    localError,
    handleAddressSelected,
    handleInputChange,
    handleFocus,
    handleBlur,
    syncAddress,
    updateProcessingState,
    setAddressWasSelectedFromDropdown
  } = useAddressSelection({
    initialAddress,
    onAddressChange,
    onCoordinatesChange,
    onProcessingChange
  });
  
  const inputRef = useRef<HTMLInputElement>(null);
  const autocompleteInitialized = useRef(false);
  
  // Use Google Maps autocomplete hook
  const {
    isLoading: isLoadingGoogleMaps,
    error: googleMapsError,
    apiAvailable,
    initAutocomplete
  } = useGoogleMapsAutocomplete({
    inputRef,
    initialAddress,
    onAddressSelected: (selectedAddress) => {
      // Set flag to true when address is selected from dropdown
      setAddressWasSelectedFromDropdown(true);
      handleAddressSelected(selectedAddress);
    },
    onCoordinatesSelected: (coords) => {
      if (onCoordinatesChange) {
        onCoordinatesChange(coords);
        console.log("Coordonnées obtenues de l'autocomplete:", coords);
        updateProcessingState(false);
      }
    },
    onAddressComponentsSelected: (components) => {
      if (onAddressComponentsChange) {
        console.log("Composants d'adresse obtenus:", components);
        onAddressComponentsChange(components);
      }
    }
  });
  
  // Initialize autocomplete when component mounts or API becomes available
  useEffect(() => {
    if (inputRef.current && apiAvailable && !autocompleteInitialized.current) {
      console.log("AddressSearch: Initialisation de l'autocomplétion");
      initAutocomplete();
      autocompleteInitialized.current = true;
    }
  }, [apiAvailable, initAutocomplete]);
  
  // Update displayed address when initialAddress changes
  useEffect(() => {
    syncAddress();
  }, [initialAddress, syncAddress]);
  
  // Display Google Maps error or local error
  const errorToShow = googleMapsError || localError;
  
  return (
    <div className="space-y-2">
      <AddressInput
        ref={inputRef}
        type="text"
        value={address}
        onChange={handleInputChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        isLoading={isLoadingGoogleMaps}
        onClick={() => {
          console.log("Champ d'adresse cliqué");
          if (inputRef.current) {
            inputRef.current.focus();
            // Force autocomplete initialization on click
            if (apiAvailable && !autocompleteInitialized.current) {
              initAutocomplete();
              autocompleteInitialized.current = true;
            }
          }
        }}
        placeholder="Saisissez une adresse espagnole..."
        // L'input reste actif même si l'API Google Maps est indisponible
      />
      
      {errorToShow && <AddressError error={errorToShow} />}
      
      <ApiStatus 
        isLoading={isLoadingGoogleMaps} 
        apiAvailable={apiAvailable} 
        message={isProcessing ? "Géocodage de l'adresse en cours..." : undefined} 
      />

      {/* User information */}
      {!errorToShow && !isProcessing && address && (
        <p className="text-xs text-gray-500 italic">
          Pour de meilleurs résultats, sélectionnez une adresse dans les suggestions.
        </p>
      )}
    </div>
  );
};

export default AddressSearch;

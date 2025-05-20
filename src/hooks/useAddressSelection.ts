
import { useState, useCallback, useRef } from "react";
import { GeoCoordinates, getCoordinatesFromAddress } from "@/services/geoCoordinatesService";
import { useToast } from "@/hooks/use-toast";
import debounce from "lodash/debounce";

interface UseAddressSelectionProps {
  initialAddress: string;
  onAddressChange: (address: string) => void;
  onCoordinatesChange?: (coordinates: GeoCoordinates) => void;
  onProcessingChange?: (isProcessing: boolean) => void;
}

export function useAddressSelection({
  initialAddress,
  onAddressChange,
  onCoordinatesChange,
  onProcessingChange
}: UseAddressSelectionProps) {
  const [address, setAddress] = useState(initialAddress);
  const [isEditing, setIsEditing] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const [addressWasSelectedFromDropdown, setAddressWasSelectedFromDropdown] = useState(false);
  const { toast } = useToast();

  // Update processing state when it changes
  const updateProcessingState = useCallback((processing: boolean) => {
    setIsProcessing(processing);
    if (onProcessingChange) {
      onProcessingChange(processing);
    }
  }, [onProcessingChange]);

  // Handle address selection logic
  const handleAddressSelected = useCallback(async (selectedAddress: string) => {
    if (selectedAddress === address && !isEditing) return;
    
    setAddress(selectedAddress);
    setIsEditing(false);
    updateProcessingState(true);
    setLocalError(null);
    setAddressWasSelectedFromDropdown(true);
    
    try {
      // Check if address is in Spain
      if (!selectedAddress.toLowerCase().includes('espagne') && 
          !selectedAddress.toLowerCase().includes('spain') && 
          !selectedAddress.toLowerCase().includes('españa')) {
        console.log("Adresse potentiellement hors d'Espagne:", selectedAddress);
      }
      
      // Get coordinates from address
      console.log("Obtention des coordonnées pour l'adresse:", selectedAddress);
      const coordinates = await getCoordinatesFromAddress(selectedAddress);
      
      if (!coordinates) {
        throw new Error("Impossible d'obtenir les coordonnées GPS pour cette adresse.");
      }
      
      console.log("Coordonnées obtenues pour l'adresse:", coordinates);
      
      // Inform parent of address change
      onAddressChange(selectedAddress);
      
      // Send coordinates to parent
      if (onCoordinatesChange) {
        console.log("Transmission des coordonnées au composant parent:", coordinates);
        onCoordinatesChange(coordinates);
      }
      
      // Only show toast notification if address was selected from dropdown
      if (addressWasSelectedFromDropdown) {
        toast({
          title: "Adresse localisée",
          description: "Coordonnées GPS obtenues avec succès",
        });
      }
      
      updateProcessingState(false);
      
    } catch (error) {
      console.error("Erreur lors du géocodage de l'adresse:", error);
      setLocalError("Erreur de géolocalisation. Vérifiez que l'adresse est complète et en Espagne.");
      
      // Only show toast error if address was selected from dropdown
      if (addressWasSelectedFromDropdown) {
        toast({
          title: "Erreur de géolocalisation",
          description: "Impossible d'obtenir les coordonnées pour cette adresse",
          variant: "destructive",
        });
      }
      
      updateProcessingState(false);
    }
  }, [address, isEditing, onAddressChange, onCoordinatesChange, toast, updateProcessingState, addressWasSelectedFromDropdown]);
  
  // Debounced version to avoid too many API calls
  const debouncedHandleAddressSelected = useCallback(
    debounce(handleAddressSelected, 300),
    [handleAddressSelected]
  );

  // Input handler functions
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setAddress(newValue);
    setIsEditing(true);
    setLocalError(null);
    setAddressWasSelectedFromDropdown(false);
    
    if (!isProcessing) {
      onAddressChange(newValue);
    }
  }, [isProcessing, onAddressChange]);

  const handleFocus = useCallback(() => {
    setIsEditing(true);
  }, []);

  const handleBlur = useCallback(() => {
    if (address !== initialAddress && !isProcessing) {
      // Don't show notification on blur
      setAddressWasSelectedFromDropdown(false);
      debouncedHandleAddressSelected(address);
    }
    setIsEditing(false);
  }, [address, initialAddress, isProcessing, debouncedHandleAddressSelected]);

  // Update address when initialAddress changes
  const syncAddress = useCallback(() => {
    if (!isEditing && initialAddress !== address) {
      setAddress(initialAddress);
    }
  }, [initialAddress, isEditing, address]);

  return {
    address,
    setAddress,
    isEditing,
    isProcessing,
    localError,
    handleAddressSelected,
    debouncedHandleAddressSelected,
    handleInputChange,
    handleFocus,
    handleBlur,
    syncAddress,
    updateProcessingState,
    setAddressWasSelectedFromDropdown
  };
}

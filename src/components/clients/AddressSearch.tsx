
import { useState, useRef, useEffect } from "react";
import { AddressInput } from "@/components/address/AddressInput";
import { AddressError } from "@/components/ui/address-error";
import { ApiStatus } from "@/components/address/ApiStatus";
import { useGoogleMapsAutocomplete } from "@/hooks/useGoogleMapsAutocomplete";
import { GeoCoordinates, getCoordinatesFromAddress } from "@/services/geoCoordinatesService";
import { useToast } from "@/hooks/use-toast";

interface AddressSearchProps {
  initialAddress: string;
  onAddressChange: (address: string) => void;
  onCoordinatesChange?: (coordinates: GeoCoordinates) => void;
}

/**
 * Composant de recherche d'adresse avec autocomplétion Google Maps
 * Optimisé pour toujours fournir des coordonnées GPS avant l'appel à l'API Catastro
 */
const AddressSearch = ({ initialAddress, onAddressChange, onCoordinatesChange }: AddressSearchProps) => {
  const [address, setAddress] = useState(initialAddress);
  const [isEditing, setIsEditing] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  
  // Gestionnaire pour la sélection d'adresse finalisée
  const handleAddressSelected = async (selectedAddress: string) => {
    setAddress(selectedAddress);
    setIsEditing(false);
    setIsProcessing(true);
    setLocalError(null);
    
    try {
      // Toujours obtenir les coordonnées à partir de l'adresse
      const coordinates = await getCoordinatesFromAddress(selectedAddress);
      
      if (!coordinates) {
        throw new Error("Impossible d'obtenir les coordonnées GPS pour cette adresse.");
      }
      
      console.log("Coordonnées obtenues pour l'adresse:", coordinates);
      
      // Informer le parent du changement d'adresse
      onAddressChange(selectedAddress);
      
      // Transmettre immédiatement les coordonnées pour déclencher l'appel au Catastro
      if (onCoordinatesChange) {
        onCoordinatesChange(coordinates);
      }
      
      toast({
        title: "Adresse localisée",
        description: "Coordonnées GPS obtenues avec succès",
      });
      
    } catch (error) {
      console.error("Erreur lors du géocodage de l'adresse:", error);
      setLocalError("Erreur de géolocalisation. Vérifiez que l'adresse est complète et en Espagne.");
      
      toast({
        title: "Erreur de géolocalisation",
        description: "Impossible d'obtenir les coordonnées pour cette adresse",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };
  
  // Utiliser notre hook personnalisé pour Google Maps
  const { isLoading: isLoadingGoogleMaps, error: googleMapsError, apiAvailable } = useGoogleMapsAutocomplete({
    inputRef,
    initialAddress,
    onAddressSelected: handleAddressSelected,
    onCoordinatesSelected: (coords) => {
      if (onCoordinatesChange) {
        onCoordinatesChange(coords);
        console.log("Coordonnées obtenues de l'autocomplete:", coords);
      }
    }
  });
  
  // Mettre à jour l'adresse affichée quand initialAddress change
  useEffect(() => {
    if (!isEditing) {
      setAddress(initialAddress);
    }
  }, [initialAddress, isEditing]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAddress(e.target.value);
    setIsEditing(true);
    setLocalError(null); // Réinitialiser l'erreur quand l'utilisateur modifie l'adresse
  };
  
  const handleFocus = () => {
    setIsEditing(true);
  };
  
  const handleBlur = () => {
    // Quand l'utilisateur quitte le champ sans utiliser l'autocomplétion
    setTimeout(async () => {
      if (address !== initialAddress && !isProcessing) {
        // Appeler handleAddressSelected qui gérera le géocodage et la notification au parent
        await handleAddressSelected(address);
      }
      setIsEditing(false);
    }, 200);
  };

  // Afficher l'erreur de Google Maps ou l'erreur locale
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
        isLoading={isLoadingGoogleMaps || isProcessing}
      />
      
      {errorToShow && <AddressError error={errorToShow} />}
      
      <ApiStatus 
        isLoading={isLoadingGoogleMaps} 
        apiAvailable={apiAvailable} 
        message={isProcessing ? "Géocodage de l'adresse en cours..." : undefined} 
      />
    </div>
  );
};

export default AddressSearch;

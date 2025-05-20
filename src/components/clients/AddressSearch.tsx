
import { useState, useRef, useEffect } from "react";
import { AddressInput } from "@/components/address/AddressInput";
import { AddressError } from "@/components/ui/address-error";
import { ApiStatus } from "@/components/address/ApiStatus";
import { useGoogleMapsAutocomplete } from "@/hooks/useGoogleMapsAutocomplete";
import { GeoCoordinates, getCoordinatesFromAddress } from "@/services/geoCoordinatesService";
import { useToast } from "@/components/ui/use-toast";

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
      // Vérifier si l'adresse est en Espagne
      if (!selectedAddress.toLowerCase().includes('espagne') && 
          !selectedAddress.toLowerCase().includes('spain') && 
          !selectedAddress.toLowerCase().includes('españa')) {
        console.log("Adresse potentiellement hors d'Espagne:", selectedAddress);
        // On continue quand même, l'API pourra donner une erreur plus spécifique
      }
      
      // Toujours obtenir les coordonnées à partir de l'adresse
      console.log("Obtention des coordonnées pour l'adresse:", selectedAddress);
      const coordinates = await getCoordinatesFromAddress(selectedAddress);
      
      if (!coordinates) {
        throw new Error("Impossible d'obtenir les coordonnées GPS pour cette adresse.");
      }
      
      console.log("Coordonnées obtenues pour l'adresse:", coordinates);
      
      // Informer le parent du changement d'adresse
      onAddressChange(selectedAddress);
      
      // Transmettre immédiatement les coordonnées pour déclencher l'appel au Catastro
      if (onCoordinatesChange) {
        console.log("Transmission des coordonnées au composant parent:", coordinates);
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
  const { isLoading: isLoadingGoogleMaps, error: googleMapsError, apiAvailable, initAutocomplete } = useGoogleMapsAutocomplete({
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

  // Initialiser l'autocomplétion quand le composant est monté
  useEffect(() => {
    console.log("AddressSearch: Initialisation de l'autocomplétion");
    if (inputRef.current && apiAvailable) {
      initAutocomplete();
    }
  }, [apiAvailable, initAutocomplete]);
  
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
    // S'assurer que l'autocomplétion est activée
    if (inputRef.current && apiAvailable) {
      initAutocomplete();
    }
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
        onClick={() => {
          console.log("Champ d'adresse cliqué");
          if (inputRef.current) {
            inputRef.current.focus();
            // Forcer l'initialisation de l'autocomplétion au clic
            if (apiAvailable) {
              initAutocomplete();
            }
          }
        }}
        placeholder="Saisissez une adresse espagnole..."
      />
      
      {errorToShow && <AddressError error={errorToShow} />}
      
      <ApiStatus 
        isLoading={isLoadingGoogleMaps} 
        apiAvailable={apiAvailable} 
        message={isProcessing ? "Géocodage de l'adresse en cours..." : undefined} 
      />

      {/* Information pour l'utilisateur */}
      {!errorToShow && !isProcessing && address && (
        <p className="text-xs text-gray-500 italic">
          Pour de meilleurs résultats, assurez-vous que l'adresse est complète et inclut la ville, code postal et pays (Espagne).
        </p>
      )}
    </div>
  );
};

export default AddressSearch;

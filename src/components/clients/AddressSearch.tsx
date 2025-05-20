
import { useState, useRef, useEffect } from "react";
import { AddressInput } from "@/components/address/AddressInput";
import { AddressError } from "@/components/ui/address-error";
import { ApiStatus } from "@/components/address/ApiStatus";
import { useGoogleMapsAutocomplete } from "@/hooks/useGoogleMapsAutocomplete";
import { GeoCoordinates } from "@/services/geoCoordinatesService";

interface AddressSearchProps {
  initialAddress: string;
  onAddressChange: (address: string) => void;
  onCoordinatesChange?: (coordinates: GeoCoordinates) => void;
}

/**
 * Composant de recherche d'adresse avec autocomplétion Google Maps
 * Ce composant gère l'interaction avec l'API Google Maps et transmet les coordonnées 
 * géographiques obtenues au parent pour mise à jour des données cadastrales
 */
const AddressSearch = ({ initialAddress, onAddressChange, onCoordinatesChange }: AddressSearchProps) => {
  const [address, setAddress] = useState(initialAddress);
  const [isEditing, setIsEditing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Gestionnaire pour la sélection d'adresse finalisée
  const handleAddressSelected = (selectedAddress: string) => {
    setAddress(selectedAddress);
    setIsEditing(false);
    onAddressChange(selectedAddress);
  };
  
  // Utiliser notre hook personnalisé pour Google Maps
  const { isLoading, error, apiAvailable } = useGoogleMapsAutocomplete({
    inputRef,
    initialAddress,
    onAddressSelected: handleAddressSelected,
    onCoordinatesSelected: (coords) => {
      if (onCoordinatesChange) {
        onCoordinatesChange(coords);
        console.log("Coordonnées transmises au parent:", coords);
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
  };
  
  const handleFocus = () => {
    setIsEditing(true);
  };
  
  const handleBlur = () => {
    // Appeler onAddressChange quand l'utilisateur quitte le champ
    setTimeout(() => {
      if (address !== initialAddress) {
        onAddressChange(address);
      }
      setIsEditing(false);
    }, 200);
  };

  return (
    <div className="space-y-2">
      <AddressInput
        ref={inputRef}
        type="text"
        value={address}
        onChange={handleInputChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        isLoading={isLoading}
      />
      
      {error && <AddressError error={error} />}
      
      <ApiStatus isLoading={isLoading} apiAvailable={apiAvailable} />
    </div>
  );
};

export default AddressSearch;

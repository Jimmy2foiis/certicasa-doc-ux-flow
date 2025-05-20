
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

const AddressSearch = ({ initialAddress, onAddressChange, onCoordinatesChange }: AddressSearchProps) => {
  const [address, setAddress] = useState(initialAddress);
  const [isEditing, setIsEditing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Gestionnaire pour la sélection d'adresse finalisée
  const handleAddressSelected = (selectedAddress: string) => {
    setAddress(selectedAddress);
    setIsEditing(false);
  };
  
  // Utiliser notre hook personnalisé pour Google Maps
  const { isLoading, error, apiAvailable } = useGoogleMapsAutocomplete({
    inputRef,
    initialAddress,
    onAddressSelected: handleAddressSelected,
    onCoordinatesSelected: onCoordinatesChange
  });
  
  // Corrected: Using useEffect instead of useState to update address when initialAddress changes
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

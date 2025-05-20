
import { useState, useEffect, useRef, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { MapPin } from "lucide-react";

interface AddressSearchProps {
  initialAddress: string;
  onAddressChange: (address: string) => void;
}

declare global {
  interface Window {
    google: any;
    initGoogleMapsAutocomplete: () => void;
  }
}

const AddressSearch = ({ initialAddress, onAddressChange }: AddressSearchProps) => {
  const [address, setAddress] = useState(initialAddress);
  const inputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  
  // Mettre à jour l'adresse locale si l'initialAddress change
  useEffect(() => {
    if (!isEditing) {
      setAddress(initialAddress);
    }
  }, [initialAddress, isEditing]);
  
  const initAutocomplete = useCallback(() => {
    if (!window.google || !inputRef.current) return;
    
    // Créer l'objet autocomplete de Google Maps
    autocompleteRef.current = new window.google.maps.places.Autocomplete(
      inputRef.current,
      { types: ['address'] }
    );
    
    // Écouter les changements lorsqu'une adresse est sélectionnée
    autocompleteRef.current.addListener('place_changed', () => {
      const place = autocompleteRef.current.getPlace();
      
      if (!place.formatted_address) return;
      
      setAddress(place.formatted_address);
      onAddressChange(place.formatted_address);
      setIsEditing(false);
    });
  }, [onAddressChange]);
  
  // Initialiser l'autocomplete quand le script Google Maps est chargé
  useEffect(() => {
    if (window.google && window.google.maps && window.google.maps.places) {
      initAutocomplete();
    } else {
      // Définir une fonction globale que le script Google Maps appellera
      window.initGoogleMapsAutocomplete = initAutocomplete;
      
      // Vérifier si le script n'est pas déjà chargé
      if (!document.getElementById('google-maps-script')) {
        const script = document.createElement('script');
        script.id = 'google-maps-script';
        script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyB41DRUbKWJHPxaFjMAwdrzWzbVKartNGg&libraries=places&callback=initGoogleMapsAutocomplete`;
        script.async = true;
        script.defer = true;
        document.head.appendChild(script);
      }
    }
    
    return () => {
      if (autocompleteRef.current) {
        window.google.maps.event.clearInstanceListeners(autocompleteRef.current);
      }
    };
  }, [initAutocomplete]);
  
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
    <div className="relative">
      <MapPin className="absolute left-2.5 top-2.5 h-5 w-5 text-gray-400" />
      <Input
        ref={inputRef}
        type="text"
        value={address}
        onChange={handleInputChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        placeholder="Saisissez une adresse..."
        className="pl-10"
      />
    </div>
  );
};

export default AddressSearch;


import { useState, useEffect, useRef, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { MapPin, Loader2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

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

// Clé API Google Maps configurée pour cette application
const GOOGLE_MAPS_API_KEY = "AIzaSyBoHmcKb2Bgf1PUxNTnsTAjMa0RgYx-HoQ";

const AddressSearch = ({ initialAddress, onAddressChange }: AddressSearchProps) => {
  const [address, setAddress] = useState(initialAddress);
  const inputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Mettre à jour l'adresse locale si l'initialAddress change
  useEffect(() => {
    if (!isEditing) {
      setAddress(initialAddress);
    }
  }, [initialAddress, isEditing]);
  
  const initAutocomplete = useCallback(() => {
    if (!window.google || !window.google.maps || !window.google.maps.places || !inputRef.current) {
      setError("Impossible d'initialiser Google Maps. Vérifiez votre connexion internet.");
      return;
    }
    
    try {
      // Créer l'objet autocomplete de Google Maps
      autocompleteRef.current = new window.google.maps.places.Autocomplete(
        inputRef.current,
        { types: ['address'] }
      );
      
      // Écouter les changements lorsqu'une adresse est sélectionnée
      autocompleteRef.current.addListener('place_changed', () => {
        const place = autocompleteRef.current.getPlace();
        
        if (!place.formatted_address) {
          setError("Adresse incomplète. Veuillez sélectionner une adresse dans la liste.");
          return;
        }
        
        setAddress(place.formatted_address);
        onAddressChange(place.formatted_address);
        setIsEditing(false);
        setError(null);
      });
    } catch (err) {
      console.error("Erreur lors de l'initialisation de l'autocomplete:", err);
      setError("Erreur lors de l'initialisation de la recherche d'adresse.");
    }
  }, [onAddressChange]);
  
  // Initialiser l'autocomplete quand le script Google Maps est chargé
  useEffect(() => {
    const loadGoogleMapsScript = () => {
      setIsLoading(true);
      setError(null);
      
      // Définir une fonction globale que le script Google Maps appellera
      window.initGoogleMapsAutocomplete = () => {
        setIsLoading(false);
        initAutocomplete();
      };
      
      // Vérifier si le script n'est pas déjà chargé
      if (!document.getElementById('google-maps-script')) {
        const script = document.createElement('script');
        script.id = 'google-maps-script';
        script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places&callback=initGoogleMapsAutocomplete`;
        script.async = true;
        script.defer = true;
        
        // Gérer les erreurs de chargement du script
        script.onerror = () => {
          setIsLoading(false);
          setError("Impossible de charger l'API Google Maps. Vérifiez votre connexion internet ou votre clé API.");
        };
        
        document.head.appendChild(script);
      } else if (window.google && window.google.maps && window.google.maps.places) {
        // Si le script est déjà chargé, initialiser directement
        setIsLoading(false);
        initAutocomplete();
      }
    };
    
    loadGoogleMapsScript();
    
    return () => {
      if (autocompleteRef.current && window.google) {
        window.google.maps.event.clearInstanceListeners(autocompleteRef.current);
      }
    };
  }, [initAutocomplete]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAddress(e.target.value);
    setIsEditing(true);
    if (error) setError(null);
  };
  
  const handleFocus = () => {
    setIsEditing(true);
    if (error) setError(null);
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
      <div className="relative">
        <MapPin className="absolute left-2.5 top-2.5 h-5 w-5 text-gray-400" />
        {isLoading && <Loader2 className="absolute right-2.5 top-2.5 h-5 w-5 text-gray-400 animate-spin" />}
        <Input
          ref={inputRef}
          type="text"
          value={address}
          onChange={handleInputChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder="Saisissez une adresse..."
          className="pl-10"
          disabled={isLoading}
        />
      </div>
      
      {error && (
        <Alert variant="destructive" className="py-2">
          <AlertDescription className="text-xs">{error}</AlertDescription>
        </Alert>
      )}
      
      {isLoading && (
        <p className="text-xs text-gray-500">Chargement de la recherche d'adresse...</p>
      )}
    </div>
  );
};

export default AddressSearch;


import { useState, useEffect, useRef, useCallback } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { GeoCoordinates } from '@/services/geoCoordinatesService';

// Étendre l'interface Window pour inclure la fonction gm_authFailure
declare global {
  interface Window {
    google?: any;
    gm_authFailure?: () => void;
    initGoogleMapsAutocomplete?: () => void;
  }
}

// Clé API Google Maps configurée pour cette application
const GOOGLE_MAPS_API_KEY = "AIzaSyBoHmcKb2Bgf1PUxNTnsTAjMa0RgYx-HoQ";

interface UseGoogleMapsAutocompleteOptions {
  inputRef: React.RefObject<HTMLInputElement>;
  initialAddress: string;
  onAddressSelected: (address: string) => void;
  onCoordinatesSelected?: (coordinates: GeoCoordinates) => void;
}

interface UseGoogleMapsAutocompleteResult {
  isLoading: boolean;
  error: string | null;
  apiAvailable: boolean;
  initAutocomplete: () => void;
}

/**
 * Hook personnalisé pour l'autocomplétion d'adresses avec l'API Google Maps Places
 */
export const useGoogleMapsAutocomplete = ({
  inputRef,
  initialAddress,
  onAddressSelected,
  onCoordinatesSelected
}: UseGoogleMapsAutocompleteOptions): UseGoogleMapsAutocompleteResult => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [apiAvailable, setApiAvailable] = useState(true);
  const autocompleteRef = useRef<any>(null);
  const { toast } = useToast();

  const initAutocomplete = useCallback(() => {
    // Vérifier que l'API Google Maps et l'élément input sont disponibles
    if (!window.google || !window.google.maps || !window.google.maps.places) {
      console.error("L'API Google Maps n'est pas chargée correctement");
      setError("Impossible d'initialiser Google Maps. Vérifiez votre connexion internet.");
      return;
    }
    
    if (!inputRef.current) {
      console.error("Référence à l'élément input manquante");
      return;
    }
    
    try {
      console.log("Initialisation de l'autocomplétion Google Maps");
      
      // Pour gérer l'avertissement de dépréciation de Autocomplete, nous continuons à l'utiliser
      // mais nous sommes conscients qu'il faudra migrer vers PlaceAutocompleteElement à l'avenir
      autocompleteRef.current = new window.google.maps.places.Autocomplete(
        inputRef.current,
        { 
          types: ['address'],
          componentRestrictions: { country: 'es' }, // Restreindre aux adresses espagnoles
          fields: ['formatted_address', 'geometry', 'place_id', 'address_components'] // Optimisation pour ne récupérer que les champs nécessaires
        }
      );
      
      // Écouter les changements lorsqu'une adresse est sélectionnée
      autocompleteRef.current.addListener('place_changed', () => {
        const place = autocompleteRef.current.getPlace();
        
        if (!place.geometry) {
          // L'utilisateur n'a pas sélectionné une suggestion valide
          setError("Veuillez sélectionner une adresse dans la liste des suggestions");
          return;
        }
        
        if (!place.formatted_address) {
          setError("Adresse incomplète. Veuillez sélectionner une adresse dans la liste.");
          return;
        }
        
        // Récupérer les détails complets de l'adresse
        const fullAddress = place.formatted_address;
        console.log("Adresse formatée sélectionnée:", fullAddress);
        
        // Vérifier que l'adresse contient bien "España" ou "Spain"
        const addressContainsSpain = place.address_components?.some((component: any) => 
          component.types.includes("country") && 
          (component.short_name === "ES" || component.long_name.includes("Spain") || component.long_name.includes("España"))
        );
        
        if (!addressContainsSpain) {
          console.warn("L'adresse sélectionnée pourrait être en dehors de l'Espagne:", fullAddress);
        }
        
        // Récupérer les coordonnées précises
        if (place.geometry && place.geometry.location) {
          const lat = place.geometry.location.lat();
          const lng = place.geometry.location.lng();
          console.log(`Coordonnées obtenues: ${lat}, ${lng} pour l'adresse: ${fullAddress}`);
          
          // Transmettre les coordonnées au composant parent
          if (onCoordinatesSelected) {
            onCoordinatesSelected({ lat, lng });
          }
        }
        
        onAddressSelected(fullAddress);
        setError(null);
      });

      setApiAvailable(true);
    } catch (err) {
      console.error("Erreur lors de l'initialisation de l'autocomplete:", err);
      setError("Erreur lors de l'initialisation de la recherche d'adresse.");
      setApiAvailable(false);
    }
  }, [inputRef, onAddressSelected, onCoordinatesSelected]);
  
  // Initialiser l'autocomplete quand le script Google Maps est chargé
  useEffect(() => {
    const loadGoogleMapsScript = () => {
      setIsLoading(true);
      setError(null);
      
      // Définir une fonction globale que le script Google Maps appellera
      window.initGoogleMapsAutocomplete = () => {
        console.log("Le script Google Maps est chargé et prêt");
        setIsLoading(false);
        initAutocomplete();
      };
      
      // Gérer les erreurs d'API Google Maps
      window.gm_authFailure = () => {
        console.error("Erreur d'authentification Google Maps API");
        setApiAvailable(false);
        setError("L'API Google Maps n'est pas autorisée pour ce domaine. L'autocomplétion des adresses n'est pas disponible.");
        toast({
          title: "Erreur Google Maps API",
          description: "Clé API non autorisée pour ce domaine. Veuillez vérifier votre configuration dans la console Google Cloud.",
          variant: "destructive",
          duration: 10000,
        });
        setIsLoading(false);
      };
      
      // Vérifier si le script n'est pas déjà chargé
      if (!document.getElementById('google-maps-script')) {
        const script = document.createElement('script');
        script.id = 'google-maps-script';
        script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places&callback=initGoogleMapsAutocomplete&v=weekly`;
        script.async = true;
        script.defer = true;
        
        // Gérer les erreurs de chargement du script
        script.onerror = () => {
          console.error("Erreur lors du chargement du script Google Maps");
          setIsLoading(false);
          setApiAvailable(false);
          setError("Impossible de charger l'API Google Maps. Vérifiez votre connexion internet ou votre clé API.");
        };
        
        document.head.appendChild(script);
        console.log("Script Google Maps inséré dans le document");
      } else if (window.google && window.google.maps && window.google.maps.places) {
        // Si le script est déjà chargé, initialiser directement
        console.log("Google Maps déjà chargé, initialisation directe");
        setIsLoading(false);
        initAutocomplete();
      }
    };
    
    loadGoogleMapsScript();
    
    return () => {
      if (autocompleteRef.current && window.google) {
        window.google.maps.event.clearInstanceListeners(autocompleteRef.current);
      }
      
      // Nettoyer la fonction globale
      delete window.gm_authFailure;
      delete window.initGoogleMapsAutocomplete;
    };
  }, [initAutocomplete, toast]);

  return {
    isLoading,
    error,
    apiAvailable,
    initAutocomplete
  };
};

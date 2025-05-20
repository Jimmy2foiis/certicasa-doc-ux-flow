
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
  const [apiAvailable, setApiAvailable] = useState(false); // Commencez à false jusqu'à ce que l'API soit confirmée
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const autocompleteRef = useRef<any>(null);
  const { toast } = useToast();
  const isInitializedRef = useRef(false);

  // Cette fonction initialise l'autocomplétion Google Maps
  const initAutocomplete = useCallback(() => {
    // Si l'API n'est pas chargée, ne rien faire
    if (!window.google || !window.google.maps || !window.google.maps.places) {
      console.error("L'API Google Maps n'est pas chargée correctement");
      setError("Impossible d'initialiser Google Maps. Vérifiez votre connexion internet.");
      setApiAvailable(false);
      return;
    }

    // Si l'élément input n'est pas disponible, ne rien faire
    if (!inputRef.current) {
      console.error("Référence à l'élément input manquante");
      return;
    }
    
    // Si autocomplete est déjà initialisé pour cet input, ne pas le refaire
    if (isInitializedRef.current && autocompleteRef.current) {
      console.log("Autocomplete déjà initialisé pour cet élément");
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
        
        console.log("Place sélectionnée:", place);
        
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
      isInitializedRef.current = true;
    } catch (err) {
      console.error("Erreur lors de l'initialisation de l'autocomplete:", err);
      setError("Erreur lors de l'initialisation de la recherche d'adresse.");
      setApiAvailable(false);
    }
  }, [inputRef, onAddressSelected, onCoordinatesSelected]);
  
  // Charger le script Google Maps
  useEffect(() => {
    if (scriptLoaded) {
      return; // Le script est déjà chargé, pas besoin de continuer
    }

    const loadGoogleMapsScript = () => {
      // Si le script est déjà chargé
      if (window.google && window.google.maps && window.google.maps.places) {
        console.log("Google Maps déjà chargé, initialisation disponible");
        setIsLoading(false);
        setScriptLoaded(true);
        setApiAvailable(true);
        return;
      }

      setIsLoading(true);
      setError(null);
      
      // Définir une fonction globale que le script Google Maps appellera
      window.initGoogleMapsAutocomplete = () => {
        console.log("Le script Google Maps est chargé et prêt");
        setIsLoading(false);
        setScriptLoaded(true);
        setApiAvailable(true);
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
          setScriptLoaded(false);
          setError("Impossible de charger l'API Google Maps. Vérifiez votre connexion internet ou votre clé API.");
        };
        
        document.head.appendChild(script);
        console.log("Script Google Maps inséré dans le document");
      }
    };
    
    loadGoogleMapsScript();
    
  }, [scriptLoaded, toast]);

  // Tenter d'initialiser l'autocomplete lorsque le script est chargé et l'API disponible
  useEffect(() => {
    if (scriptLoaded && apiAvailable && inputRef.current && !isInitializedRef.current) {
      console.log("Script chargé et API disponible - initialisation de l'autocomplete");
      initAutocomplete();
    }
  }, [scriptLoaded, apiAvailable, inputRef, initAutocomplete]);

  // Nettoyer les écouteurs d'événements lors du démontage
  useEffect(() => {
    return () => {
      if (autocompleteRef.current && window.google && window.google.maps) {
        console.log("Nettoyage des écouteurs d'événements autocomplete");
        window.google.maps.event.clearInstanceListeners(autocompleteRef.current);
        isInitializedRef.current = false;
      }
    };
  }, []);

  return {
    isLoading,
    error,
    apiAvailable,
    initAutocomplete
  };
};


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
  const [apiAvailable, setApiAvailable] = useState(false); // Commencer à false jusqu'à ce que l'API soit confirmée
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const autocompleteRef = useRef<any>(null);
  const { toast } = useToast();
  const isInitializedRef = useRef(false);
  const lastAddressRef = useRef<string | null>(null);

  // Fonction pour déterminer si l'API Google Maps est bien chargée
  const isGoogleMapsLoaded = useCallback(() => {
    return Boolean(
      window.google && 
      window.google.maps && 
      window.google.maps.places && 
      window.google.maps.places.Autocomplete
    );
  }, []);

  // Cette fonction initialise l'autocomplétion Google Maps
  const initAutocomplete = useCallback(() => {
    console.log("Tentative d'initialisation de l'autocomplétion...");

    // Si l'élément input n'est pas disponible, ne rien faire
    if (!inputRef.current) {
      console.error("Référence à l'élément input manquante");
      return;
    }

    // Si l'API n'est pas chargée, ne rien faire et afficher une erreur
    if (!isGoogleMapsLoaded()) {
      console.error("L'API Google Maps n'est pas chargée correctement");
      setError("Google Maps API non disponible. Vérifiez votre connexion internet.");
      setApiAvailable(false);
      
      // Afficher un toast pour informer l'utilisateur que l'API n'est pas chargée
      toast({
        title: "Problème avec Google Maps",
        description: "L'API Google Maps n'est pas correctement chargée. L'autocomplétion d'adresse ne fonctionnera pas.",
        variant: "destructive",
        duration: 5000,
      });
      return;
    }

    try {
      console.log("API Google Maps disponible, initialisation de l'autocomplétion...");
      setApiAvailable(true);

      // Si autocomplete est déjà initialisé pour cet input, le nettoyer d'abord
      if (autocompleteRef.current) {
        console.log("Nettoyage de l'instance d'autocomplétion existante...");
        window.google.maps.event.clearInstanceListeners(autocompleteRef.current);
        autocompleteRef.current = null;
        isInitializedRef.current = false;
      }
      
      // Créer une nouvelle instance d'autocomplétion
      autocompleteRef.current = new window.google.maps.places.Autocomplete(
        inputRef.current,
        { 
          types: ['address'],
          componentRestrictions: { country: 'es' }, // Restreindre aux adresses espagnoles
          fields: ['formatted_address', 'geometry', 'place_id', 'address_components'] // Optimisation pour ne récupérer que les champs nécessaires
        }
      );

      console.log("Instance d'autocomplétion créée avec succès");
      
      // Écouter les changements lorsqu'une adresse est sélectionnée
      autocompleteRef.current.addListener('place_changed', () => {
        const place = autocompleteRef.current.getPlace();
        
        console.log("Place sélectionnée:", place);
        
        if (!place.geometry) {
          // L'utilisateur n'a pas sélectionné une suggestion valide
          console.error("Adresse invalide sélectionnée (pas de géométrie)");
          setError("Veuillez sélectionner une adresse dans la liste des suggestions");
          return;
        }
        
        if (!place.formatted_address) {
          console.error("Adresse incomplète (pas d'adresse formatée)");
          setError("Adresse incomplète. Veuillez sélectionner une adresse dans la liste.");
          return;
        }
        
        // Récupérer les détails complets de l'adresse
        const fullAddress = place.formatted_address;
        console.log("Adresse formatée sélectionnée:", fullAddress);
        lastAddressRef.current = fullAddress;
        
        // Vérifier que l'adresse contient bien "España" ou "Spain"
        const addressContainsSpain = place.address_components?.some((component: any) => 
          component.types.includes("country") && 
          (component.short_name === "ES" || component.long_name.includes("Spain") || component.long_name.includes("España"))
        );
        
        if (!addressContainsSpain) {
          console.warn("L'adresse sélectionnée pourrait être en dehors de l'Espagne:", fullAddress);
          toast({
            title: "Vérification",
            description: "L'adresse sélectionnée semble être en dehors de l'Espagne. Veuillez vérifier.",
            variant: "warning",
          });
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
        
        // Notification visuelle de confirmation
        toast({
          title: "Adresse sélectionnée",
          description: "L'adresse a été correctement sélectionnée et enregistrée.",
          duration: 3000,
        });
      });

      isInitializedRef.current = true;
      console.log("Écouteurs d'événements d'autocomplétion configurés avec succès");
      
    } catch (err) {
      console.error("Erreur lors de l'initialisation de l'autocomplete:", err);
      setError(`Erreur d'initialisation: ${err instanceof Error ? err.message : String(err)}`);
      setApiAvailable(false);
      
      toast({
        title: "Erreur d'autocomplétion",
        description: "Impossible d'initialiser Google Maps. Essayez de saisir l'adresse manuellement.",
        variant: "destructive",
      });
    }
  }, [inputRef, onAddressSelected, onCoordinatesSelected, isGoogleMapsLoaded, toast]);
  
  // Charger le script Google Maps
  useEffect(() => {
    if (scriptLoaded && isGoogleMapsLoaded()) {
      console.log("Google Maps déjà chargé et disponible");
      setApiAvailable(true);
      return; // Le script est déjà chargé et l'API est disponible
    }

    const loadGoogleMapsScript = () => {
      // Si le script est déjà chargé
      if (isGoogleMapsLoaded()) {
        console.log("Google Maps déjà chargé, initialisation disponible");
        setIsLoading(false);
        setScriptLoaded(true);
        setApiAvailable(true);
        return;
      }

      console.log("Chargement du script Google Maps...");
      setIsLoading(true);
      setError(null);
      
      // Définir une fonction globale que le script Google Maps appellera
      window.initGoogleMapsAutocomplete = () => {
        console.log("Le script Google Maps est chargé et prêt");
        setIsLoading(false);
        setScriptLoaded(true);
        setApiAvailable(true);
        
        // Notifier l'utilisateur que l'API est chargée
        toast({
          title: "Google Maps",
          description: "Service de recherche d'adresse chargé avec succès.",
          duration: 3000,
        });
      };
      
      // Gérer les erreurs d'API Google Maps
      window.gm_authFailure = () => {
        console.error("Erreur d'authentification Google Maps API");
        setApiAvailable(false);
        setError("L'API Google Maps n'est pas autorisée pour ce domaine. L'autocomplétion des adresses n'est pas disponible.");
        toast({
          title: "Erreur Google Maps API",
          description: "Clé API non autorisée pour ce domaine. Veuillez vérifier votre configuration ou saisir l'adresse manuellement.",
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
          
          toast({
            title: "Erreur de chargement",
            description: "Google Maps n'a pas pu être chargé. Veuillez saisir l'adresse manuellement.",
            variant: "destructive",
          });
        };
        
        document.head.appendChild(script);
        console.log("Script Google Maps inséré dans le document");
      }
    };
    
    loadGoogleMapsScript();
    
  }, [scriptLoaded, isGoogleMapsLoaded, toast]);

  // Tenter d'initialiser l'autocomplete lorsque le script est chargé et l'API disponible
  useEffect(() => {
    if (scriptLoaded && apiAvailable && inputRef.current && !isInitializedRef.current) {
      console.log("Script chargé et API disponible - initialisation de l'autocomplete");
      initAutocomplete();
    }
  }, [scriptLoaded, apiAvailable, inputRef, initAutocomplete]);

  // Ajouter des écouteurs d'événements pour l'élément input
  useEffect(() => {
    const currentInputElement = inputRef.current;
    
    if (currentInputElement && apiAvailable) {
      console.log("Ajout des écouteurs d'événements pour l'input");
      
      const handleFocusEvent = () => {
        console.log("Input a reçu le focus");
        // Réinitialiser l'autocomplétion si nécessaire
        if (!isInitializedRef.current && isGoogleMapsLoaded()) {
          console.log("Réinitialisation de l'autocomplétion au focus");
          initAutocomplete();
        }
      };
      
      // Ajouter l'écouteur de focus
      currentInputElement.addEventListener('focus', handleFocusEvent);
      
      // Nettoyage de l'écouteur lors du démontage
      return () => {
        currentInputElement.removeEventListener('focus', handleFocusEvent);
      };
    }
  }, [inputRef, apiAvailable, initAutocomplete, isGoogleMapsLoaded]);

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

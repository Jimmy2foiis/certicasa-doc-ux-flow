
import { useState, useEffect } from 'react';
import { GoogleMapsAutocompleteOptions, GoogleMapsAutocompleteResult, GoogleMapsTypes } from '@/types/googleMaps';
import { loadGoogleMapsApi, isGoogleMapsLoaded } from '@/services/googleMapsService';
import { GOOGLE_MAPS_API_KEY, DEFAULT_AUTOCOMPLETE_OPTIONS } from '@/config/googleMapsConfig';

/**
 * Hook personnalisé pour l'autocomplétion Google Maps
 * Gère le chargement de l'API, l'initialisation de l'autocomplete et la gestion des erreurs
 */
export function useGoogleMapsAutocomplete({
  inputRef,
  initialAddress,
  onAddressSelected,
  onCoordinatesSelected,
  onAddressComponentsSelected
}: GoogleMapsAutocompleteOptions): GoogleMapsAutocompleteResult {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [apiAvailable, setApiAvailable] = useState(isGoogleMapsLoaded());
  const [autocomplete, setAutocomplete] = useState<google.maps.places.Autocomplete | null>(null);

  /**
   * Vérifie la disponibilité de l'API Google Maps et charge l'API si nécessaire
   */
  useEffect(() => {
    let isMounted = true;

    const checkApiAvailability = async () => {
      if (!GOOGLE_MAPS_API_KEY) {
        console.error('Clé API Google Maps non disponible');
        if (isMounted) {
          setApiAvailable(false);
          setError('Clé API Google Maps non disponible');
          setIsLoading(false);
        }
        return;
      }

      try {
        setIsLoading(true);
        await loadGoogleMapsApi();
        if (isMounted) {
          setApiAvailable(true);
          setIsLoading(false);
          setError(null);
        }
      } catch (error) {
        console.error('Erreur lors du chargement de l\'API Google Maps:', error);
        if (isMounted) {
          setApiAvailable(false);
          setError('Impossible de charger l\'API Google Maps');
          setIsLoading(false);
        }
      }
    };

    if (!isGoogleMapsLoaded()) {
      checkApiAvailability();
    } else {
      setApiAvailable(true);
    }

    return () => {
      isMounted = false;
    };
  }, []);

  /**
   * Parse les composants d'adresse Google Maps
   */
  const parseAddressComponents = (addressComponents: GoogleMapsTypes.PlaceResult['address_components']) => {
    if (!addressComponents) return {};

    const components: any = {};

    addressComponents.forEach((component) => {
      const types = component.types;
      
      if (types.includes('postal_code')) {
        components.postalCode = component.long_name;
      }
      if (types.includes('locality')) {
        components.city = component.long_name;
      }
      if (types.includes('administrative_area_level_2')) {
        components.province = component.long_name;
      }
      if (types.includes('administrative_area_level_1')) {
        components.community = component.long_name;
      }
      if (types.includes('country')) {
        components.country = component.long_name;
      }
      if (types.includes('route')) {
        components.route = component.long_name;
      }
      if (types.includes('street_number')) {
        components.streetNumber = component.long_name;
      }
    });

    return components;
  };

  /**
   * Initialise l'autocomplétion Google Maps
   */
  const initAutocomplete = () => {
    if (!inputRef.current || !window.google || !window.google.maps || !window.google.maps.places) {
      console.error('API Google Maps ou élément de référence non disponible');
      setError('API Google Maps non disponible pour l\'autocomplétion');
      return;
    }

    console.log('Initialisation de l\'autocomplétion Google Maps');

    try {
      // Créer une nouvelle instance d'autocomplétion avec les champs requis
      const newAutocomplete = new window.google.maps.places.Autocomplete(
        inputRef.current,
        {
          ...DEFAULT_AUTOCOMPLETE_OPTIONS,
          fields: ['address_components', 'formatted_address', 'geometry', 'name']
        }
      );

      // Gestionnaire d'événement pour les sélections d'adresse
      newAutocomplete.addListener('place_changed', () => {
        const place = newAutocomplete.getPlace() as GoogleMapsTypes.PlaceResult;
        
        if (!place.geometry || !place.formatted_address) {
          console.error('Pas de données de géométrie pour cette adresse');
          setError('Données d\'adresse incomplètes - essayez une autre adresse');
          return;
        }

        // Récupérer l'adresse complète formatée
        const address = place.formatted_address;
        console.log('Adresse sélectionnée:', address);
        onAddressSelected(address);

        // Récupérer les coordonnées GPS
        if (place.geometry.location && onCoordinatesSelected) {
          const coordinates = {
            lat: place.geometry.location.lat(),
            lng: place.geometry.location.lng()
          };
          console.log('Coordonnées GPS:', coordinates);
          onCoordinatesSelected(coordinates);
        }

        // Parser et transmettre les composants d'adresse
        if (place.address_components && onAddressComponentsSelected) {
          const parsedComponents = parseAddressComponents(place.address_components);
          console.log('Composants d\'adresse parsés:', parsedComponents);
          onAddressComponentsSelected(parsedComponents);
        }

        setError(null);
      });

      setAutocomplete(newAutocomplete);
    } catch (error) {
      console.error('Erreur lors de l\'initialisation de l\'autocomplétion:', error);
      setError('Erreur lors de l\'initialisation de l\'autocomplétion');
    }
  };

  return {
    isLoading,
    error,
    apiAvailable,
    initAutocomplete
  };
}

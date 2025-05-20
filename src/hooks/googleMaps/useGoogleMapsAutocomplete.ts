
import { useState, useEffect } from 'react';
import { GoogleMapsAutocompleteOptions, GoogleMapsAutocompleteResult } from '@/types/googleMaps';
import { loadGoogleMapsApi } from '@/services/googleMapsService';
import { GOOGLE_MAPS_API_KEY } from '@/config/googleMapsConfig';

/**
 * Hook personnalisé pour l'autocomplétion Google Maps
 * Gère le chargement de l'API, l'initialisation de l'autocomplete et la gestion des erreurs
 */
export function useGoogleMapsAutocomplete({
  inputRef,
  initialAddress,
  onAddressSelected,
  onCoordinatesSelected
}: GoogleMapsAutocompleteOptions): GoogleMapsAutocompleteResult {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [apiAvailable, setApiAvailable] = useState(true);
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

    checkApiAvailability();

    return () => {
      isMounted = false;
    };
  }, []);

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
      // Créer une nouvelle instance d'autocomplétion
      const options = {
        componentRestrictions: { country: 'es' }, // Limiter aux adresses en Espagne
        fields: ['address_components', 'formatted_address', 'geometry', 'name'],
        types: ['address']
      };

      const newAutocomplete = new window.google.maps.places.Autocomplete(
        inputRef.current,
        options
      );

      // Gestionnaire d'événement pour les sélections d'adresse
      newAutocomplete.addListener('place_changed', () => {
        const place = newAutocomplete.getPlace();
        
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


import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { AddressInput } from "@/components/address/AddressInput";
import { ApiStatus } from "@/components/address/ApiStatus";
import { Control } from "react-hook-form";
import { ClientFormValues } from "../schemas/clientSchema";
import { useEffect, useRef } from "react";
import { useGoogleMapsAutocomplete } from "@/hooks/useGoogleMapsAutocomplete";

interface AddressFieldProps {
  control: Control<ClientFormValues>;
  inputRef?: React.RefObject<HTMLInputElement>;
  isLoading?: boolean;
  apiAvailable?: boolean;
  error?: string | null;
  onAddressSelected?: (address: string) => void;
  onCoordinatesSelected?: (coordinates: {lat: number, lng: number}) => void;
}

export const AddressField = ({ 
  control, 
  inputRef: externalInputRef,
  isLoading = false, 
  apiAvailable = true, 
  error = null,
  onAddressSelected,
  onCoordinatesSelected
}: AddressFieldProps) => {
  // Créer une référence interne si aucune n'est fournie
  const internalInputRef = useRef<HTMLInputElement>(null);
  const actualInputRef = externalInputRef || internalInputRef;
  
  // Utiliser le hook pour l'autocomplétion Google Maps directement dans le composant
  const { isLoading: isLoadingAutocomplete, error: autocompleteError, apiAvailable: isApiAvailable, initAutocomplete } = 
    useGoogleMapsAutocomplete({
      inputRef: actualInputRef,
      initialAddress: "",
      onAddressSelected: (address) => {
        if (onAddressSelected) {
          onAddressSelected(address);
        }
      },
      onCoordinatesSelected: onCoordinatesSelected
    });

  // Initialiser l'autocomplétion quand le composant est monté
  useEffect(() => {
    if (actualInputRef.current && isApiAvailable) {
      console.log("AddressField: Initialisation de l'autocomplétion");
      initAutocomplete();
    }
  }, [isApiAvailable, initAutocomplete]);

  // Combiner les états de chargement et d'erreur
  const combinedLoading = isLoading || isLoadingAutocomplete;
  const combinedError = error || autocompleteError;

  return (
    <FormField
      control={control}
      name="address"
      render={({ field }) => (
        <FormItem className="relative">
          <FormLabel>Adresse</FormLabel>
          <FormControl>
            <div className="relative">
              <AddressInput
                ref={actualInputRef}
                {...field}
                isLoading={combinedLoading}
                placeholder="Saisissez une adresse espagnole..."
                value={field.value || ""}
                onChange={(e) => {
                  field.onChange(e);
                  field.value = e.target.value;
                }}
                onClick={() => {
                  console.log("Champ d'adresse cliqué");
                  if (actualInputRef.current) {
                    actualInputRef.current.focus();
                  }
                }}
              />
            </div>
          </FormControl>
          {combinedError && (
            <div className="text-red-500 text-xs mt-1">{combinedError}</div>
          )}
          <ApiStatus 
            isLoading={combinedLoading}
            apiAvailable={isApiAvailable}
            className="mt-1"
            message={combinedLoading ? "Chargement de la recherche d'adresse..." : undefined}
          />
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

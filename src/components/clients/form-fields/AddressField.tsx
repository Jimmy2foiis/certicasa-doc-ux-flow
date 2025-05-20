
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { AddressInput } from "@/components/address/AddressInput";
import { ApiStatus } from "@/components/address/ApiStatus";
import { useEffect, useRef, useState } from "react";
import { useGoogleMapsAutocomplete } from "@/hooks/googleMaps/useGoogleMapsAutocomplete";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { Control } from "react-hook-form";
import { ClientFormValues } from "../schemas/clientSchema";

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
  const [initCount, setInitCount] = useState(0);
  const { toast } = useToast();
  
  // Utiliser le hook pour l'autocomplétion Google Maps directement dans le composant
  const { isLoading: isLoadingAutocomplete, error: autocompleteError, apiAvailable: isApiAvailable, initAutocomplete } = 
    useGoogleMapsAutocomplete({
      inputRef: actualInputRef,
      initialAddress: "",
      onAddressSelected: (address) => {
        console.log("AddressField: Adresse sélectionnée:", address);
        if (onAddressSelected) {
          onAddressSelected(address);
        }
      },
      onCoordinatesSelected: (coordinates) => {
        console.log("AddressField: Coordonnées sélectionnées:", coordinates);
        if (onCoordinatesSelected) {
          onCoordinatesSelected(coordinates);
        }
      }
    });

  // Initialiser l'autocomplétion quand le composant est monté
  useEffect(() => {
    if (actualInputRef.current && isApiAvailable) {
      console.log("AddressField: Initialisation de l'autocomplétion au montage");
      try {
        initAutocomplete();
      } catch (error) {
        console.error("Erreur lors de l'initialisation de l'autocomplétion:", error);
        toast({
          title: "Erreur d'autocomplétion",
          description: "Impossible d'initialiser l'autocomplétion Google Maps. Essayez de saisir manuellement.",
          variant: "destructive",
        });
      }
    }
  }, [isApiAvailable, initAutocomplete, toast]);

  // Forcer la réinitialisation de l'autocomplétion
  const handleForceInit = () => {
    console.log("Force réinitialisation de l'autocomplétion");
    try {
      initAutocomplete();
      setInitCount(prev => prev + 1);
      toast({
        title: "Réinitialisation",
        description: "Service d'autocomplétion d'adresse réinitialisé",
        duration: 2000,
      });
    } catch (error) {
      console.error("Erreur lors de la réinitialisation de l'autocomplétion:", error);
    }
  };

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
                  console.log("AddressField: Valeur changée:", e.target.value);
                }}
                onFocus={() => {
                  console.log("Champ d'adresse focus");
                  if (actualInputRef.current && isApiAvailable) {
                    // Forcer l'initialisation de l'autocomplétion au focus
                    try {
                      initAutocomplete();
                    } catch (error) {
                      console.error("Erreur lors de l'initialisation de l'autocomplétion au focus:", error);
                    }
                  }
                }}
                onClick={() => {
                  console.log("Champ d'adresse cliqué");
                  if (actualInputRef.current) {
                    actualInputRef.current.focus();
                    // Forcer l'initialisation de l'autocomplétion au clic
                    if (isApiAvailable) {
                      try {
                        initAutocomplete();
                      } catch (error) {
                        console.error("Erreur lors de l'initialisation de l'autocomplétion au clic:", error);
                      }
                    }
                  }
                }}
              />
              <Button 
                type="button" 
                size="sm" 
                variant="ghost" 
                className="absolute right-1 top-1/2 -translate-y-1/2" 
                onClick={handleForceInit}
                title="Réinitialiser l'autocomplétion"
              >
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
          </FormControl>
          {combinedError && (
            <div className="text-red-500 text-xs mt-1">{combinedError}</div>
          )}
          <div className="flex items-center justify-between mt-1">
            <ApiStatus 
              isLoading={combinedLoading}
              apiAvailable={isApiAvailable}
              message={combinedLoading ? "Chargement de la recherche d'adresse..." : undefined}
            />
            {initCount > 0 && (
              <div className="text-xs text-muted-foreground">
                (Service réinitialisé {initCount} fois)
              </div>
            )}
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

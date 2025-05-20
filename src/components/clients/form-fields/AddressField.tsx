
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { AddressInput } from "@/components/address/AddressInput";
import { ApiStatus } from "@/components/address/ApiStatus";
import { Control } from "react-hook-form";
import { ClientFormValues } from "../schemas/clientSchema";

interface AddressFieldProps {
  control: Control<ClientFormValues>;
  inputRef: React.RefObject<HTMLInputElement>;
  isLoading: boolean;
  apiAvailable: boolean;
  error: string | null;
}

export const AddressField = ({ 
  control, 
  inputRef, 
  isLoading, 
  apiAvailable, 
  error 
}: AddressFieldProps) => {
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
                ref={inputRef}
                {...field}
                isLoading={isLoading}
                placeholder="Saisissez une adresse espagnole..."
              />
            </div>
          </FormControl>
          {error && (
            <div className="text-red-500 text-xs mt-1">{error}</div>
          )}
          <ApiStatus 
            isLoading={isLoading}
            apiAvailable={apiAvailable}
            className="mt-1"
            message={isLoading ? "Chargement de la recherche d'adresse..." : undefined}
          />
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

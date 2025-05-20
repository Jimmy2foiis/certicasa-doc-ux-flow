
import { FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Control } from "react-hook-form";
import { ClientFormValues } from "../schemas/clientSchema";
import AddressSearch from "@/components/clients/AddressSearch";
import { GeoCoordinates } from "@/services/geoCoordinatesService";
import { useCoordinates } from "@/hooks/useCoordinates";
import { useState } from "react";

interface AddressFieldProps {
  control: Control<ClientFormValues>;
  onAddressSelected?: (address: string) => void;
  onCoordinatesSelected?: (coordinates: {lat: number, lng: number}) => void;
}

export const AddressField = ({ 
  control,
  onAddressSelected,
  onCoordinatesSelected
}: AddressFieldProps) => {
  const { setClientCoordinates } = useCoordinates();
  const [isProcessing, setIsProcessing] = useState(false);
  
  return (
    <FormField
      control={control}
      name="address"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Adresse</FormLabel>
          <AddressSearch
            initialAddress={field.value || ""}
            onAddressChange={(address) => {
              if (!isProcessing) {
                field.onChange(address);
                if (onAddressSelected) {
                  onAddressSelected(address);
                }
              }
            }}
            onCoordinatesChange={(coords: GeoCoordinates) => {
              setClientCoordinates(coords);
              if (onCoordinatesSelected) {
                onCoordinatesSelected(coords);
              }
              setIsProcessing(false);
            }}
            onProcessingChange={setIsProcessing}
          />
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

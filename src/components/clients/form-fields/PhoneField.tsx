
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Control } from "react-hook-form";
import { ClientFormValues } from "../schemas/clientSchema";

interface PhoneFieldProps {
  control: Control<ClientFormValues>;
}

export const PhoneField = ({ control }: PhoneFieldProps) => {
  return (
    <FormField
      control={control}
      name="phone"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Téléphone</FormLabel>
          <FormControl>
            <Input {...field} placeholder="Ex: +34 612 345 678" />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};


import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Control } from "react-hook-form";
import { ClientFormValues } from "../schemas/clientSchema";

interface NifFieldProps {
  control: Control<ClientFormValues>;
}

export const NifField = ({ control }: NifFieldProps) => {
  return (
    <FormField
      control={control}
      name="nif"
      render={({ field }) => (
        <FormItem>
          <FormLabel>NIF</FormLabel>
          <FormControl>
            <Input {...field} placeholder="Ex: A12345678" />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

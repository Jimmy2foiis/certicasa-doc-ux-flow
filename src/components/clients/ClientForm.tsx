
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRef, useEffect, useState } from "react";
import { Form } from "@/components/ui/form";
import { useGoogleMapsAutocomplete } from "@/hooks/useGoogleMapsAutocomplete";
import { useCoordinates } from "@/hooks/useCoordinates";
import { clientSchema, ClientFormValues } from "./schemas/clientSchema";
import { Client } from "@/services/supabaseService";

// Import form field components
import { NameField } from "./form-fields/NameField";
import { EmailField } from "./form-fields/EmailField";
import { PhoneField } from "./form-fields/PhoneField";
import { AddressField } from "./form-fields/AddressField";
import { ClientIdFields } from "./form-fields/ClientIdFields";
import { FormActions } from "./form-fields/FormActions";

interface ClientFormProps {
  onSubmit: (data: Client) => Promise<void>;
  onCancel: () => void;
  initialValues?: Partial<ClientFormValues>;
  isSubmitting?: boolean;
}

export const ClientForm = ({ onSubmit, onCancel, initialValues, isSubmitting = false }: ClientFormProps) => {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const addressInputRef = useRef<HTMLInputElement>(null);
  const { coordinates, setClientCoordinates } = useCoordinates();
  
  // Initialize form with react-hook-form and zod validation
  const form = useForm<ClientFormValues>({
    resolver: zodResolver(clientSchema),
    defaultValues: {
      name: initialValues?.name || "",
      email: initialValues?.email || "",
      phone: initialValues?.phone || "",
      address: initialValues?.address || "",
      nif: initialValues?.nif || "",
      type: initialValues?.type || "010"
    }
  });

  // Handle address selection from Google Maps autocomplete
  const handleAddressSelected = (address: string) => {
    form.setValue("address", address);
    form.trigger("address");
    setShowSuggestions(false);
  };
  
  // Initialize Google Maps Autocomplete
  const { isLoading, error, apiAvailable, initAutocomplete } = useGoogleMapsAutocomplete({
    inputRef: addressInputRef,
    initialAddress: form.getValues("address"),
    onAddressSelected: handleAddressSelected,
    onCoordinatesSelected: setClientCoordinates
  });

  // Initialize autocomplete when component mounts
  useEffect(() => {
    if (addressInputRef.current && apiAvailable) {
      initAutocomplete();
    }
  }, [apiAvailable, initAutocomplete]);

  const handleCreateClient = async (data: ClientFormValues) => {
    try {
      // Create a Client object ensuring name is not undefined
      const clientData: Client = {
        name: data.name, // This is required and validated by zod
        email: data.email || undefined,
        phone: data.phone || undefined,
        address: data.address || undefined,
        nif: data.nif || undefined,
        type: data.type || "010",
      };
      
      await onSubmit(clientData);
    } catch (error) {
      console.error("Erreur lors de la création du client:", error);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleCreateClient)} className="space-y-4 py-2">
        <NameField control={form.control} />
        <EmailField control={form.control} />
        <PhoneField control={form.control} />
        
        <AddressField 
          control={form.control}
          inputRef={addressInputRef}
          isLoading={isLoading}
          apiAvailable={apiAvailable}
          error={error}
        />
        
        <ClientIdFields control={form.control} />
        
        <FormActions 
          onCancel={onCancel}
          isSubmitting={isSubmitting}
        />
      </form>
    </Form>
  );
};

export default ClientForm;

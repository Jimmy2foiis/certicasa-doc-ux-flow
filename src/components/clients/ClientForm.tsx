
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRef, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { AddressInput } from "@/components/address/AddressInput";
import { ApiStatus } from "@/components/address/ApiStatus";
import { useGoogleMapsAutocomplete } from "@/hooks/useGoogleMapsAutocomplete";
import { useCoordinates } from "@/hooks/useCoordinates";
import { clientSchema, ClientFormValues } from "./schemas/clientSchema";
import { DialogFooter } from "@/components/ui/dialog";
import { Client } from "@/services/supabaseService";

interface ClientFormProps {
  onSubmit: (data: Client) => Promise<void>;
  onCancel: () => void;
  initialValues?: Partial<ClientFormValues>;
}

export const ClientForm = ({ onSubmit, onCancel, initialValues }: ClientFormProps) => {
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
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Nom <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
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
        
        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem className="relative">
              <FormLabel>Adresse</FormLabel>
              <FormControl>
                <div className="relative">
                  <AddressInput
                    ref={addressInputRef}
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
        
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
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
          
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Type</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <DialogFooter className="pt-4">
          <Button variant="outline" type="button" onClick={onCancel}>
            Annuler
          </Button>
          <Button type="submit">
            Créer le client
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
};

export default ClientForm;

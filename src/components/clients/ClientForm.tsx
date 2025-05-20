
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRef, useEffect, useState } from "react";
import { Form } from "@/components/ui/form";
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
import { useToast } from "@/components/ui/use-toast";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface ClientFormProps {
  onSubmit: (data: Client) => Promise<void>;
  onCancel: () => void;
  initialValues?: Partial<ClientFormValues>;
  isSubmitting?: boolean;
}

export const ClientForm = ({ onSubmit, onCancel, initialValues, isSubmitting = false }: ClientFormProps) => {
  const addressInputRef = useRef<HTMLInputElement>(null);
  const { coordinates, setClientCoordinates } = useCoordinates();
  const { toast } = useToast();
  const [addressSelected, setAddressSelected] = useState(false);
  const [addressWarning, setAddressWarning] = useState<string | null>(null);
  
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

  console.log("Valeurs initiales du formulaire:", initialValues);
  console.log("État actuel des coordonnées:", coordinates);

  // Si une adresse initiale existe, considérer qu'elle a été sélectionnée
  useEffect(() => {
    if (initialValues?.address) {
      setAddressSelected(true);
    }
  }, [initialValues?.address]);

  // Handle address selection from Google Maps autocomplete
  const handleAddressSelected = (address: string) => {
    console.log("Adresse sélectionnée:", address);
    form.setValue("address", address, { shouldValidate: true, shouldDirty: true });
    form.trigger("address");
    setAddressSelected(true);
    setAddressWarning(null);
    
    // Notification visuelle pour confirmer la sélection
    toast({
      title: "Adresse sélectionnée",
      description: `Adresse sélectionnée: ${address}`,
      duration: 3000,
    });
  };
  
  const handleCoordinatesSelected = (coords: {lat: number, lng: number}) => {
    console.log("Coordonnées sélectionnées:", coords);
    setClientCoordinates(coords);
    
    // Notification visuelle pour confirmer les coordonnées
    toast({
      title: "Localisation",
      description: "Coordonnées de l'adresse enregistrées avec succès",
      duration: 3000,
    });
  };

  const handleCreateClient = async (data: ClientFormValues) => {
    try {
      console.log("Données du formulaire soumises:", data);
      
      // Vérifier si l'adresse a été sélectionnée via Google Maps
      if (data.address && !addressSelected) {
        setAddressWarning("Pour une meilleure précision, veuillez sélectionner une adresse dans les suggestions Google Maps.");
        toast({
          title: "Attention",
          description: "L'adresse n'a pas été sélectionnée dans les suggestions. Les coordonnées pourraient ne pas être précises.",
          variant: "destructive", // Fixed: Changed from "warning" to "destructive"
          duration: 5000,
        });
      }
      
      // Create a Client object ensuring name is not undefined
      const clientData: Client = {
        name: data.name, // This is required and validated by zod
        email: data.email || undefined,
        phone: data.phone || undefined,
        address: data.address || undefined,
        nif: data.nif || undefined,
        type: data.type || "010",
      };
      
      if (!clientData.address && data.address) {
        clientData.address = data.address;
      }
      
      console.log("Données client à envoyer:", clientData);
      console.log("Coordonnées à enregistrer:", coordinates);
      
      await onSubmit(clientData);
      
      toast({
        title: "Client enregistré",
        description: clientData.address 
          ? `Client enregistré avec l'adresse: ${clientData.address}` 
          : "Client enregistré sans adresse",
      });
    } catch (error) {
      console.error("Erreur lors de la création du client:", error);
      toast({
        title: "Erreur",
        description: "Impossible d'enregistrer le client",
        variant: "destructive",
      });
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
          onAddressSelected={handleAddressSelected}
          onCoordinatesSelected={handleCoordinatesSelected}
        />
        
        {addressWarning && (
          <Alert variant="destructive" className="py-2">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="text-xs">
              {addressWarning}
            </AlertDescription>
          </Alert>
        )}
        
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

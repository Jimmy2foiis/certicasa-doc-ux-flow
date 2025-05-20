
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
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
  onSubmit?: (data: Client) => Promise<void>;
  onCancel?: () => void;
  initialValues?: Partial<ClientFormValues>;
  isSubmitting?: boolean;
  clientId?: string;
  client?: any;
  onSubmitSuccess?: () => void;
  submitButtonText?: string;
}

export const ClientForm = ({ 
  onSubmit, 
  onCancel, 
  initialValues, 
  isSubmitting = false, 
  clientId,
  client,
  onSubmitSuccess,
  submitButtonText 
}: ClientFormProps) => {
  const { coordinates, setClientCoordinates } = useCoordinates();
  const { toast } = useToast();
  const [addressSelected, setAddressSelected] = useState(false);
  const [addressWarning, setAddressWarning] = useState<string | null>(null);
  const [isAddressProcessing, setIsAddressProcessing] = useState(false);
  
  // Use client prop if provided, otherwise use initialValues
  const formInitialValues = client || initialValues;
  
  // Initialize form with react-hook-form and zod validation
  const form = useForm<ClientFormValues>({
    resolver: zodResolver(clientSchema),
    defaultValues: {
      name: formInitialValues?.name || "",
      email: formInitialValues?.email || "",
      phone: formInitialValues?.phone || "",
      address: formInitialValues?.address || "",
      nif: formInitialValues?.nif || "",
      type: formInitialValues?.type || "010"
    }
  });

  console.log("Valeurs initiales du formulaire:", formInitialValues);
  console.log("État actuel des coordonnées:", coordinates);

  // Si une adresse initiale existe, considérer qu'elle a été sélectionnée
  useEffect(() => {
    if (formInitialValues?.address) {
      setAddressSelected(true);
    }
  }, [formInitialValues?.address]);

  // Handle address selection from Google Maps autocomplete
  const handleAddressSelected = (address: string) => {
    console.log("Adresse sélectionnée:", address);
    if (!isAddressProcessing) {
      setAddressSelected(true);
      setAddressWarning(null);
    }
  };
  
  const handleCoordinatesSelected = (coords: {lat: number, lng: number}) => {
    console.log("Coordonnées sélectionnées:", coords);
    setClientCoordinates(coords);
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
          variant: "destructive",
          duration: 5000,
        });
      }
      
      // Empêcher la soumission si traitement d'adresse en cours
      if (isAddressProcessing) {
        toast({
          title: "Traitement en cours",
          description: "Veuillez attendre que le géocodage de l'adresse soit terminé.",
          variant: "destructive",
        });
        return;
      }
      
      // Create a Client object ensuring name is not undefined
      const clientData: Client = {
        name: data.name,
        email: data.email || undefined,
        phone: data.phone || undefined,
        address: data.address || undefined,
        nif: data.nif || undefined,
        type: data.type || "010",
      };
      
      console.log("Données client à envoyer:", clientData);
      console.log("Coordonnées à enregistrer:", coordinates);
      
      // If onSubmit is provided, call it with client data
      if (onSubmit) {
        await onSubmit(clientData);
      }
      
      // If onSubmitSuccess is provided, call it
      if (onSubmitSuccess) {
        onSubmitSuccess();
      }
      
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
          isSubmitting={isSubmitting || isAddressProcessing}
          submitText={submitButtonText}
        />
      </form>
    </Form>
  );
};

export default ClientForm;

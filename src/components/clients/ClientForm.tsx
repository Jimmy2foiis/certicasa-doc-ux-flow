
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Client } from "@/services/api/types";
import { useToast } from "@/hooks/use-toast";
import { Form } from "@/components/ui/form";
import { clientSchema, ClientFormValues } from "./schemas/clientSchema";
import { NameField } from "./form-fields/NameField";
import { EmailField } from "./form-fields/EmailField";
import { PhoneField } from "./form-fields/PhoneField";
import { AddressField } from "./form-fields/AddressField";
import { ClientIdFields } from "./form-fields/ClientIdFields";
import { ClientTypeFields } from "./form-fields/ClientTypeFields";
import { FormActions } from "./form-fields/FormActions";
import { updateClientRecord } from "@/services/api";

interface ClientFormProps {
  clientId: string;
  initialData?: Client;
  onSuccess: () => void;
  onCancel: () => void;
}

export const ClientForm = ({ clientId, initialData, onSuccess, onCancel }: ClientFormProps) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  // Initialize the form with React Hook Form and zod validation
  const form = useForm<ClientFormValues>({
    resolver: zodResolver(clientSchema),
    defaultValues: {
      name: initialData?.name || "",
      email: initialData?.email || "",
      phone: initialData?.phone || "",
      address: initialData?.address || "",
      nif: initialData?.nif || "",
      type: initialData?.type || ""
    }
  });

  // Handle form submission
  const onSubmit = async (data: ClientFormValues) => {
    setIsSubmitting(true);

    try {
      const updatedClient = await updateClientRecord(clientId, data);
      
      if (updatedClient) {
        toast({
          title: "Client mis à jour",
          description: "Les informations du client ont été mises à jour avec succès.",
        });
        onSuccess();
      } else {
        toast({
          title: "Erreur",
          description: "Impossible de mettre à jour les informations du client.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour du client:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la mise à jour du client.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Personal Information */}
          <NameField control={form.control} />
          <EmailField control={form.control} />
          <PhoneField control={form.control} />
          <AddressField control={form.control} />
          
          {/* Client Identification */}
          <ClientIdFields control={form.control} />
          
          {/* Type Information */}
          <ClientTypeFields 
            control={form.control} 
            initialData={initialData}
          />
        </div>
        
        {/* Form Actions */}
        <FormActions 
          onCancel={onCancel}
          isSubmitting={isSubmitting}
          submitText={clientId ? "Mettre à jour" : "Créer le client"}
        />
      </form>
    </Form>
  );
};

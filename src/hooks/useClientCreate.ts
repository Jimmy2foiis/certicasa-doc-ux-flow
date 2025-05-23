
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { createClientRecord, Client } from "@/services/api"; // Importation depuis la nouvelle API

interface UseClientCreateOptions {
  onClientCreated: () => Promise<void>;
  onSuccess?: () => void;
}

export const useClientCreate = ({ onClientCreated, onSuccess }: UseClientCreateOptions) => {
  const [isCreating, setIsCreating] = useState(false);
  const { toast } = useToast();

  const createClient = async (clientData: Client) => {
    setIsCreating(true);
    try {
      const createdClient = await createClientRecord(clientData);
      
      if (createdClient) {
        toast({
          title: "Client créé",
          description: `Le client ${createdClient.name} a été créé avec succès.`,
        });
        
        // Reload client list
        await onClientCreated();
        
        // Call additional success callback if provided
        if (onSuccess) {
          onSuccess();
        }

        return createdClient;
      }
      return null;
    } catch (error) {
      console.error("Erreur lors de la création du client:", error);
      toast({
        title: "Erreur",
        description: "Impossible de créer le client. Veuillez réessayer.",
        variant: "destructive",
      });
      return null;
    } finally {
      setIsCreating(false);
    }
  };

  return {
    createClient,
    isCreating
  };
};

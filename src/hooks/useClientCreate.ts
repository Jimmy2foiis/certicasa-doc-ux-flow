
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";

interface Client {
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  nif?: string;
  type?: string;
  status?: string;
}

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
      // Adapter les données client au format attendu par l'API externe
      const formattedData = {
        prenom: clientData.name.split(' ')[0] || "",
        nom: clientData.name.split(' ').slice(1).join(' ') || "",
        email: clientData.email || null,
        tel: clientData.phone || null,
        adresse: clientData.address || "",
        cadastralReference: clientData.nif || null,
        status: clientData.status || "DONNEE_RECUPEREE",
        // Ajoutez d'autres champs nécessaires
      };

      // Appel à l'API externe pour créer un client
      const response = await fetch("https://certicasa.mitain.com/api/prospects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formattedData)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const createdClient = await response.json();
      
      toast({
        title: "Client créé",
        description: `Le client ${clientData.name} a été créé avec succès.`,
      });
      
      // Reload client list
      await onClientCreated();
      
      // Call additional success callback if provided
      if (onSuccess) {
        onSuccess();
      }

      return createdClient;
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

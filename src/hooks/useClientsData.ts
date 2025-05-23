
import { useState, useCallback } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Client } from "@/types/clientTypes";
import { fetchClients, deleteClient } from "@/lib/api-client";

export const useClientsData = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const loadClients = async () => {
    setLoading(true);
    try {
      const clientsData = await fetchClients();
      setClients(clientsData);
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de charger les clients",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClient = async (clientId: string): Promise<void> => {
    try {
      await deleteClient(clientId);
      toast({
        title: "Client supprimé",
        description: "Le client a été supprimé avec succès",
      });
      
      // Reload the clients list after deletion
      await loadClients();
      
      return Promise.resolve();
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le client",
        variant: "destructive",
      });
      return Promise.reject(error);
    }
  };

  const handleDeleteConfirmation = (clientId: string) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce client ?")) {
      handleDeleteClient(clientId);
    }
  };

  return {
    clients,
    loading,
    loadClients,
    handleDeleteConfirmation,
    handleDeleteClient
  };
};

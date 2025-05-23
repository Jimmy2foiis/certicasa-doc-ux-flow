
import { useState, useEffect, useCallback } from "react";
import { 
  getClientById,
  getProjectsForClient,
  updateClientRecord,
  Project,
  Client
} from "@/services/supabaseService";
import { useToast } from "@/components/ui/use-toast";

export const useClientInfo = (clientId: string) => {
  const { toast } = useToast();
  
  // État pour le client
  const [client, setClient] = useState<Client | null>(null);
  
  // États pour les données de l'API
  const [projects, setProjects] = useState<Project[]>([]);
  
  // État pour stocker l'adresse du client actuelle
  const [clientAddress, setClientAddress] = useState("");
  
  // Fonction pour charger les données du client depuis l'API
  const loadClientFromApi = useCallback(async () => {
    try {
      const clientData = await getClientById(clientId);
      if (clientData) {
        console.log("Client chargé depuis l'API:", clientData);
        setClient(clientData);
        setClientAddress(clientData.address || "");
      } else {
        console.error("Client introuvable dans l'API");
        toast({
          title: "Erreur",
          description: "Client introuvable. Veuillez réessayer.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Erreur lors du chargement du client depuis l'API:", error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les données client.",
        variant: "destructive",
      });
    }
  }, [clientId, toast]);
  
  // Fonction pour charger les projets du client depuis l'API
  const loadProjectsFromApi = useCallback(async () => {
    try {
      const projectsData = await getProjectsForClient(clientId);
      if (projectsData && projectsData.length > 0) {
        console.log("Projets chargés depuis l'API:", projectsData);
        setProjects(projectsData);
      }
    } catch (error) {
      console.error("Erreur lors du chargement des projets depuis l'API:", error);
    }
  }, [clientId]);

  // Fonction pour mettre à jour l'adresse du client
  const updateClientAddress = useCallback(async (newAddress: string) => {
    if (!client || newAddress === client.address) return;
    
    console.log("Mise à jour de l'adresse client:", newAddress);
    setClientAddress(newAddress);
    
    try {
      // Mettre à jour l'adresse dans l'API
      const updatedClient = await updateClientRecord(clientId, { address: newAddress });
      if (updatedClient) {
        setClient((prev) => prev ? {...prev, address: newAddress} : null);
        toast({
          title: "Adresse mise à jour",
          description: "L'adresse du client a été mise à jour avec succès.",
        });
      } else {
        toast({
          title: "Erreur",
          description: "Impossible de mettre à jour l'adresse.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour de l'adresse client:", error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour l'adresse.",
        variant: "destructive",
      });
    }
  }, [client, clientId, toast]);

  // Charger le client et les projets au montage du composant
  useEffect(() => {
    const loadApiData = async () => {
      // Charger le client
      await loadClientFromApi();
      
      // Charger les projets
      await loadProjectsFromApi();
    };
    
    loadApiData();
  }, [clientId, loadClientFromApi, loadProjectsFromApi]);

  return {
    client,
    clientAddress,
    setClientAddress: updateClientAddress,
    projects,
    loadProjectsFromApi
  };
};


import { useState, useEffect, useCallback } from "react";
import { useToast } from "@/components/ui/use-toast";
import { getClientById } from "@/services/api/clients/getClientById";

export interface Project {
  id: string;
  name: string;
  type: string;
  status: string;
  created_at: string;
}

export const useClientInfo = (clientId: string) => {
  const { toast } = useToast();
  
  // État pour le client
  const [client, setClient] = useState<any | null>(null);
  
  // États pour les données de l'API
  const [projects, setProjects] = useState<Project[]>([]);
  
  // État pour stocker l'adresse du client actuelle
  const [clientAddress, setClientAddress] = useState("");
  
  // Fonction pour charger les données du client depuis l'API
  const loadClientFromApi = useCallback(async () => {
    try {
      console.log("Chargement du client:", clientId);
      const clientData = await getClientById(clientId);
      
      if (clientData) {
        console.log("Client chargé avec succès:", clientData);
        setClient(clientData);
        setClientAddress(clientData.address || "");
        
        // Only show success toast if it's not a default/error client
        if (!clientData.name.includes("par défaut") && !clientData.name.includes("Erreur")) {
          toast({
            title: "Client chargé",
            description: "Données récupérées avec succès",
          });
        } else {
          toast({
            title: "Client chargé",
            description: "Client créé par défaut - certaines données peuvent être manquantes",
            variant: "default",
          });
        }
        
      } else {
        console.error("Aucun client retourné par l'API");
        setClient(null);
        setClientAddress("");
        
        toast({
          title: "Erreur",
          description: "Impossible de charger le client",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Erreur lors du chargement du client:", error);
      
      setClient(null);
      setClientAddress("");
      
      toast({
        title: "Erreur de chargement",
        description: "Impossible de charger le client",
        variant: "destructive",
      });
    }
  }, [clientId, toast]);
  
  // Fonction pour charger les projets du client
  const loadProjectsFromApi = useCallback(async () => {
    try {
      // Créer un projet par défaut basé sur les données du client
      const defaultProject: Project = {
        id: `project-${clientId}`,
        name: "Réhabilitation Énergétique",
        type: "RES010",
        status: "En cours",
        created_at: new Date().toISOString()
      };
      
      setProjects([defaultProject]);
      console.log("Projet par défaut créé");
    } catch (error) {
      console.error("Erreur lors du chargement des projets:", error);
      setProjects([]);
    }
  }, [clientId]);

  // Fonction pour mettre à jour l'adresse du client
  const updateClientAddress = useCallback(async (newAddress: string) => {
    if (!client || newAddress === client.address) return;
    
    console.log("Mise à jour de l'adresse client:", newAddress);
    setClientAddress(newAddress);
    setClient((prev: any) => prev ? {...prev, address: newAddress} : null);
    
    toast({
      title: "Adresse mise à jour",
      description: "L'adresse du client a été mise à jour localement.",
    });
  }, [client, toast]);

  // Charger le client et les projets au montage du composant
  useEffect(() => {
    if (clientId) {
      const loadApiData = async () => {
        await loadClientFromApi();
        await loadProjectsFromApi();
      };
      
      loadApiData();
    }
  }, [clientId, loadClientFromApi, loadProjectsFromApi]);

  return {
    client,
    clientAddress,
    setClientAddress: updateClientAddress,
    projects,
    loadProjectsFromApi
  };
};

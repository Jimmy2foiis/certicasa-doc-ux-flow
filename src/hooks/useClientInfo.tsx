
import { useState, useEffect, useCallback } from "react";
import { useToast } from "@/components/ui/use-toast";
import { prospectsAPI } from "@/services/api.service";

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
      console.log("Tentative de chargement du client:", clientId);
      const clientData = await prospectsAPI.getByToken(clientId);
      
      if (clientData) {
        console.log("Client chargé depuis l'API:", clientData);
        
        // Transformer les données du prospect en format client
        const transformedClient = {
          id: clientData.id,
          name: `${clientData.prenom} ${clientData.nom}`.trim(),
          email: clientData.email,
          phone: clientData.tel,
          address: clientData.adresse,
          nif: clientData.beetoolToken,
          type: "RES010",
          status: clientData.status === "INITIALISATION_DONE_WAITING_FOR_CEE" 
            ? "Initialisation terminée - En attente CEE" 
            : "En cours",
          projects: 1,
          created_at: clientData.createdAt,
          postalCode: clientData.codePostal,
          ficheType: "RES010",
          climateZone: "C3",
          isolatedArea: 85,
          isolationType: "Combles",
          floorType: "Béton",
          installationDate: new Date().toISOString().split('T')[0],
          lotNumber: null,
          depositStatus: "Non déposé",
          community: clientData.ville || "",
          teleprospector: "Carmen Rodríguez",
          confirmer: "Miguel Torres",
          installationTeam: "Équipe Nord",
          delegate: "Ana García",
          depositDate: undefined,
          entryChannel: "API Import"
        };
        
        setClient(transformedClient);
        setClientAddress(transformedClient.address || "");
        
        toast({
          title: "Client chargé",
          description: "Données récupérées depuis l'API",
        });
        
      } else {
        throw new Error("Client non trouvé dans l'API");
      }
    } catch (error) {
      console.error("Erreur lors du chargement du client depuis l'API:", error);
      
      setClient(null);
      setClientAddress("");
      
      toast({
        title: "Erreur de chargement",
        description: "Impossible de charger le client depuis l'API",
        variant: "destructive",
      });
    }
  }, [clientId, toast]);
  
  // Fonction pour charger les projets du client depuis l'API
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
    
    try {
      // Essayer de mettre à jour l'adresse dans l'API
      const updatedClient = await prospectsAPI.update(clientId, { adresse: newAddress });
      if (updatedClient) {
        setClient((prev: any) => prev ? {...prev, address: newAddress} : null);
        toast({
          title: "Adresse mise à jour",
          description: "L'adresse du client a été mise à jour avec succès.",
        });
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour de l'adresse:", error);
      // Même en cas d'erreur API, on garde le changement local
      setClient((prev: any) => prev ? {...prev, address: newAddress} : null);
      toast({
        title: "Erreur de mise à jour",
        description: "Impossible de mettre à jour l'adresse dans l'API",
        variant: "destructive",
      });
    }
  }, [client, clientId, toast]);

  // Charger le client et les projets au montage du composant
  useEffect(() => {
    const loadApiData = async () => {
      await loadClientFromApi();
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

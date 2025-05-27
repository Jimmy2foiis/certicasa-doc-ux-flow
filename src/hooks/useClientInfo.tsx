
import { useState, useEffect, useCallback } from "react";
import { useToast } from "@/components/ui/use-toast";
import { prospectsService, ProspectData } from "@/services/api/prospects";
import { useApiClient } from "./useApiClient";

export interface Project {
  id: string;
  name: string;
  type: string;
  status: string;
  created_at: string;
}

export interface ClientInfo {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  nif: string;
  type: string;
  status: string;
  projects: number;
  created_at: string;
  postalCode: string;
  ficheType: string;
  climateZone: string;
  isolatedArea: number;
  isolationType: string;
  floorType: string;
  installationDate: string;
  lotNumber: string | null;
  depositStatus: string;
  community: string;
  teleprospector: string;
  confirmer: string;
  installationTeam: string;
  delegate: string;
  depositDate?: string;
  entryChannel: string;
}

const createFallbackClient = (clientId: string): ClientInfo => ({
  id: clientId,
  name: "Client Demo",
  email: "client.demo@example.com",
  phone: "+34 123 456 789",
  address: "Calle Serrano 120, 28006 Madrid",
  nif: "12345678Z",
  type: "RES010",
  status: "En cours",
  projects: 1,
  created_at: new Date().toISOString(),
  postalCode: "28006",
  ficheType: "RES010",
  climateZone: "C3",
  isolatedArea: 85,
  isolationType: "Combles",
  floorType: "Béton",
  installationDate: new Date().toISOString().split('T')[0],
  lotNumber: null,
  depositStatus: "Non déposé",
  community: "Madrid",
  teleprospector: "Carmen Rodríguez",
  confirmer: "Miguel Torres",
  installationTeam: "Équipe Nord",
  delegate: "Ana García",
  depositDate: undefined,
  entryChannel: "Demo"
});

const transformProspectToClient = (prospect: ProspectData): ClientInfo => ({
  id: prospect.id,
  name: `${prospect.prenom} ${prospect.nom}`.trim(),
  email: prospect.email,
  phone: prospect.tel,
  address: prospect.adresse,
  nif: prospect.beetoolToken,
  type: "RES010",
  status: prospect.status === "INITIALISATION_DONE_WAITING_FOR_CEE" 
    ? "Initialisation terminée - En attente CEE" 
    : "En cours",
  projects: 1,
  created_at: prospect.createdAt,
  postalCode: prospect.codePostal,
  ficheType: "RES010",
  climateZone: "C3",
  isolatedArea: 85,
  isolationType: "Combles",
  floorType: "Béton",
  installationDate: new Date().toISOString().split('T')[0],
  lotNumber: null,
  depositStatus: "Non déposé",
  community: prospect.ville || "Madrid",
  teleprospector: "Carmen Rodríguez",
  confirmer: "Miguel Torres",
  installationTeam: "Équipe Nord",
  delegate: "Ana García",
  depositDate: undefined,
  entryChannel: "API Import"
});

export const useClientInfo = (clientId: string) => {
  const { toast } = useToast();
  const { execute } = useApiClient<ProspectData>();
  
  const [client, setClient] = useState<ClientInfo | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [clientAddress, setClientAddress] = useState("");

  const loadClient = useCallback(async () => {
    const prospectData = await execute(() => prospectsService.getByToken(clientId));
    
    if (prospectData) {
      const transformedClient = transformProspectToClient(prospectData);
      setClient(transformedClient);
      setClientAddress(transformedClient.address || "");
      
      toast({
        title: "Client chargé",
        description: "Données récupérées depuis l'API",
      });
    } else {
      const fallbackClient = createFallbackClient(clientId);
      setClient(fallbackClient);
      setClientAddress(fallbackClient.address || "");
      
      toast({
        title: "Mode démo",
        description: "Utilisation des données de démonstration",
        variant: "default",
      });
    }
  }, [clientId, execute, toast]);

  const updateClientAddress = useCallback(async (newAddress: string) => {
    if (!client || newAddress === client.address) return;
    
    setClientAddress(newAddress);
    
    const updatedData = await execute(() => 
      prospectsService.update(clientId, { adresse: newAddress })
    );
    
    if (updatedData) {
      setClient(prev => prev ? {...prev, address: newAddress} : null);
      toast({
        title: "Adresse mise à jour",
        description: "L'adresse du client a été mise à jour avec succès.",
      });
    } else {
      setClient(prev => prev ? {...prev, address: newAddress} : null);
      toast({
        title: "Adresse mise à jour localement",
        description: "Changement sauvegardé en local.",
      });
    }
  }, [client, clientId, execute, toast]);

  const loadProjects = useCallback(() => {
    const defaultProject: Project = {
      id: `project-${clientId}`,
      name: "Réhabilitation Énergétique",
      type: "RES010",
      status: "En cours",
      created_at: new Date().toISOString()
    };
    
    setProjects([defaultProject]);
  }, [clientId]);

  useEffect(() => {
    loadClient();
    loadProjects();
  }, [loadClient, loadProjects]);

  return {
    client,
    clientAddress,
    setClientAddress: updateClientAddress,
    projects,
    loadProjectsFromApi: loadProjects
  };
};


import { useState, useEffect, useCallback } from "react";
import { clientsData } from "@/data/mock"; // Pour la transition, on garde temporairement les données mock
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
  
  // États pour les données de Supabase
  const [projects, setProjects] = useState<Project[]>([]);
  
  // État pour stocker l'adresse du client actuelle
  const [clientAddress, setClientAddress] = useState("");
  
  // Fonction pour charger les données du client depuis Supabase
  const loadClientFromSupabase = useCallback(async () => {
    try {
      const clientData = await getClientById(clientId);
      if (clientData) {
        console.log("Client chargé depuis Supabase:", clientData);
        setClient(clientData);
        setClientAddress(clientData.address || "");
      } else {
        // Fallback aux données mock si le client n'est pas trouvé dans Supabase
        const mockClient = clientsData.find(c => c.id === clientId);
        if (mockClient) {
          console.log("Client chargé depuis les données mock:", mockClient);
          setClient(mockClient as unknown as Client);
          setClientAddress((mockClient as any).address || "");
        } else {
          console.error("Client non trouvé dans Supabase ni dans les données mock");
          toast({
            title: "Erreur",
            description: "Client introuvable. Veuillez réessayer.",
            variant: "destructive",
          });
        }
      }
    } catch (error) {
      console.error("Erreur lors du chargement du client depuis Supabase:", error);
      // Fallback aux données mock en cas d'erreur
      const mockClient = clientsData.find(c => c.id === clientId);
      if (mockClient) {
        console.log("Client chargé depuis les données mock (fallback):", mockClient);
        setClient(mockClient as unknown as Client);
        setClientAddress((mockClient as any).address || "");
      }
    }
  }, [clientId, toast]);
  
  // Fonction pour charger les projets du client depuis Supabase
  const loadProjectsFromSupabase = useCallback(async () => {
    try {
      const projectsData = await getProjectsForClient(clientId);
      if (projectsData && projectsData.length > 0) {
        console.log("Projets chargés depuis Supabase:", projectsData);
        setProjects(projectsData);
      }
    } catch (error) {
      console.error("Erreur lors du chargement des projets depuis Supabase:", error);
    }
  }, [clientId]);

  // Fonction pour mettre à jour l'adresse du client
  const updateClientAddress = useCallback(async (newAddress: string) => {
    if (!client || newAddress === client.address) return;
    
    console.log("Mise à jour de l'adresse client:", newAddress);
    setClientAddress(newAddress);
    
    try {
      // Mettre à jour l'adresse dans Supabase
      const updatedClient = await updateClientRecord(clientId, { address: newAddress });
      if (updatedClient) {
        setClient((prev) => prev ? {...prev, address: newAddress} : null);
        toast({
          title: "Adresse mise à jour",
          description: "L'adresse du client a été mise à jour avec succès.",
        });
      } else {
        toast({
          title: "Avertissement",
          description: "L'adresse a été mise à jour localement mais pas dans la base de données.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour de l'adresse client:", error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour l'adresse dans la base de données.",
        variant: "destructive",
      });
    }
  }, [client, clientId, toast]);

  // Charger le client et les projets au montage du composant
  useEffect(() => {
    const loadSupabaseData = async () => {
      // Charger le client
      await loadClientFromSupabase();
      
      // Charger les projets
      await loadProjectsFromSupabase();
    };
    
    loadSupabaseData();
  }, [clientId, loadClientFromSupabase, loadProjectsFromSupabase]);

  return {
    client,
    clientAddress,
    setClientAddress: updateClientAddress,
    projects,
    loadProjectsFromSupabase
  };
};


import { useState, useEffect, useMemo } from "react";
import { useToast } from "@/components/ui/use-toast";
import { prospectsAPI } from "@/services/api.service";

export interface Client {
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

export interface ClientFilters {
  search: string;
  status: string | null;
  ficheType: string | null;
  climateZone: string | null;
  isolationType: string | null;
  floorType: string | null;
  depositStatus: string | null;
  community: string | null;
}

// Fonction pour créer des clients de démonstration
const createDemoClients = (): Client[] => {
  return [
    {
      id: "08dcadda-838d-4262-be31-d7c1f2924e2c",
      name: "Juan García López",
      email: "juan.garcia@email.com",
      phone: "+34 666 123 456",
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
      entryChannel: "Demo"
    },
    {
      id: "demo-client-2",
      name: "María Fernández",
      email: "maria.fernandez@email.com",
      phone: "+34 666 789 012",
      address: "Calle Alcalá 45, 28014 Madrid",
      nif: "87654321Y",
      type: "RES010",
      status: "Initialisation terminée - En attente CEE",
      projects: 1,
      created_at: new Date().toISOString(),
      postalCode: "28014",
      ficheType: "RES010",
      climateZone: "C3",
      isolatedArea: 120,
      isolationType: "Murs",
      floorType: "Carrelage",
      installationDate: new Date().toISOString().split('T')[0],
      lotNumber: "LOT-2024-002",
      depositStatus: "Déposé",
      community: "Madrid",
      teleprospector: "Pedro Sánchez",
      confirmer: "Ana Ruiz",
      installationTeam: "Équipe Sud",
      delegate: "Carlos Martín",
      entryChannel: "Demo"
    }
  ];
};

export const useClients = () => {
  const { toast } = useToast();
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<ClientFilters>({
    search: "",
    status: null,
    ficheType: null,
    climateZone: null,
    isolationType: null,
    floorType: null,
    depositStatus: null,
    community: null
  });

  const loadClients = async () => {
    try {
      setLoading(true);
      console.log("Chargement des clients...");
      
      // Essayer de charger depuis l'API
      try {
        const prospectsData = await prospectsAPI.getAll();
        
        if (prospectsData && prospectsData.length > 0) {
          // Transformer les prospects en clients
          const transformedClients = prospectsData.map((prospect: any) => ({
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
          }));
          
          setClients(transformedClients);
          
          toast({
            title: "Clients chargés",
            description: `${transformedClients.length} client(s) récupéré(s) depuis l'API`,
          });
          
          return;
        }
      } catch (apiError) {
        console.error("Erreur API:", apiError);
      }
      
      // Si l'API échoue, utiliser les données de démo
      console.log("Utilisation des données de démonstration");
      const demoClients = createDemoClients();
      setClients(demoClients);
      
      toast({
        title: "Mode démonstration",
        description: `${demoClients.length} client(s) de démonstration chargés`,
      });
      
    } catch (error) {
      console.error("Erreur lors du chargement des clients:", error);
      
      // En dernier recours, utiliser les données de démo
      const demoClients = createDemoClients();
      setClients(demoClients);
      
      toast({
        title: "Mode démo",
        description: "Utilisation des données de test",
        variant: "default",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadClients();
  }, []);

  // Filtrer les clients selon les critères
  const filteredClients = useMemo(() => {
    return clients.filter(client => {
      // Filtre de recherche textuelle
      if (filters.search) {
        const searchTermLower = filters.search.toLowerCase();
        const matchesSearch = 
          (client.name?.toLowerCase().includes(searchTermLower)) ||
          (client.email?.toLowerCase().includes(searchTermLower)) ||
          (client.nif?.toLowerCase().includes(searchTermLower));
        
        if (!matchesSearch) return false;
      }
      
      // Filtre par statut du dossier
      if (filters.status && client.status !== filters.status) {
        return false;
      }
      
      // Filtre par type de fiche
      if (filters.ficheType && client.ficheType !== filters.ficheType) {
        return false;
      }
      
      // Filtre par zone climatique
      if (filters.climateZone && client.climateZone !== filters.climateZone) {
        return false;
      }
      
      // Filtre par type d'isolation
      if (filters.isolationType && client.isolationType !== filters.isolationType) {
        return false;
      }
      
      // Filtre par type de plancher
      if (filters.floorType && client.floorType !== filters.floorType) {
        return false;
      }
      
      // Filtre par statut de dépôt
      if (filters.depositStatus && client.depositStatus !== filters.depositStatus) {
        return false;
      }
      
      // Filtre par communauté autonome
      if (filters.community && (!client.community || !client.community.includes(filters.community))) {
        return false;
      }
      
      return true;
    });
  }, [clients, filters]);

  return {
    clients,
    filteredClients,
    filters,
    setFilters,
    loading,
    refreshClients: loadClients
  };
};

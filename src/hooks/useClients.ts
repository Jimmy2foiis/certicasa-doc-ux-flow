
import { useState, useEffect, useMemo } from "react";
import { useToast } from "@/components/ui/use-toast";
import { prospectsService, ProspectData } from "@/services/api/prospects";
import { useApiClient } from "./useApiClient";
import { ClientInfo } from "./useClientInfo";

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

const createDemoClients = (): ClientInfo[] => [
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

export const useClients = () => {
  const { toast } = useToast();
  const { execute } = useApiClient<ProspectData[]>();
  
  const [clients, setClients] = useState<ClientInfo[]>([]);
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
    setLoading(true);
    
    const prospectsData = await execute(() => prospectsService.getAll());
    
    if (prospectsData && prospectsData.length > 0) {
      const transformedClients = prospectsData.map(transformProspectToClient);
      setClients(transformedClients);
      
      toast({
        title: "Clients chargés",
        description: `${transformedClients.length} client(s) récupéré(s) depuis l'API`,
      });
    } else {
      const demoClients = createDemoClients();
      setClients(demoClients);
      
      toast({
        title: "Mode démonstration",
        description: `${demoClients.length} client(s) de démonstration chargés`,
      });
    }
    
    setLoading(false);
  };

  useEffect(() => {
    loadClients();
  }, []);

  const filteredClients = useMemo(() => {
    return clients.filter(client => {
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        const matchesSearch = 
          client.name?.toLowerCase().includes(searchTerm) ||
          client.email?.toLowerCase().includes(searchTerm) ||
          client.nif?.toLowerCase().includes(searchTerm);
        
        if (!matchesSearch) return false;
      }
      
      if (filters.status && client.status !== filters.status) return false;
      if (filters.ficheType && client.ficheType !== filters.ficheType) return false;
      if (filters.climateZone && client.climateZone !== filters.climateZone) return false;
      if (filters.isolationType && client.isolationType !== filters.isolationType) return false;
      if (filters.floorType && client.floorType !== filters.floorType) return false;
      if (filters.depositStatus && client.depositStatus !== filters.depositStatus) return false;
      if (filters.community && (!client.community || !client.community.includes(filters.community))) return false;
      
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

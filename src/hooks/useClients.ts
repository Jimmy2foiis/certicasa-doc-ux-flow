
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

// Client mocké pour les tests
const getMockedClient = (): Client => ({
  id: 'client_test_001',
  name: 'Sophie Martínez García',
  email: 'sophie.martinez@email.com',
  phone: '0634567890',
  address: 'Calle Mayor 123, 28001 Madrid',
  nif: 'X1234567Z',
  type: 'RES010',
  status: 'Initialisation terminée - En attente CEE',
  projects: 1,
  created_at: '2025-05-28T10:00:00.000Z',
  postalCode: '28001',
  ficheType: 'RES010',
  climateZone: 'D3',
  isolatedArea: 95,
  isolationType: 'Combles perdues',
  floorType: 'Béton',
  installationDate: '2025-06-15',
  lotNumber: 'LOT-2025-001',
  depositStatus: 'Non déposé',
  community: 'Madrid',
  teleprospector: 'Carmen Rodríguez',
  confirmer: 'Miguel Torres',
  installationTeam: 'Équipe Centre',
  delegate: 'Ana García',
  depositDate: undefined,
  entryChannel: 'Téléprospection'
});

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
      console.log("Chargement des clients depuis l'API...");
      
      // Ajouter le client mocké en premier
      const mockedClient = getMockedClient();
      let allClients = [mockedClient];
      
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
            community: prospect.ville || "",
            teleprospector: "Carmen Rodríguez",
            confirmer: "Miguel Torres",
            installationTeam: "Équipe Nord",
            delegate: "Ana García",
            depositDate: undefined,
            entryChannel: "API Import"
          }));
          
          // Ajouter les clients de l'API après le client mocké
          allClients = [mockedClient, ...transformedClients];
        }
      } catch (apiError) {
        console.warn("Erreur API, utilisation du client mocké uniquement:", apiError);
      }
      
      setClients(allClients);
      
      toast({
        title: "Clients chargés",
        description: `${allClients.length} client(s) disponible(s) (dont 1 client test)`,
      });
      
    } catch (error) {
      console.error("Erreur lors du chargement des clients:", error);
      // En cas d'erreur, utiliser au moins le client mocké
      const mockedClient = getMockedClient();
      setClients([mockedClient]);
      
      toast({
        title: "Mode hors ligne",
        description: "Affichage du client test uniquement",
        variant: "destructive",
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

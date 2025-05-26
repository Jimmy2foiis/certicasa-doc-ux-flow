
import { useState, useEffect, useMemo } from "react";
import { getClients, Client } from "@/services/api";
import { useToast } from "@/components/ui/use-toast";

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

export const useClients = () => {
  const { toast } = useToast();
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
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
      setError(null);
      
      const data = await getClients();
      
      if (data.length === 0) {
        setError("Aucune donnée client disponible");
        toast({
          title: "Aucune donnée",
          description: "Aucun client trouvé dans l'API",
          variant: "destructive",
        });
      } else {
        setClients(data);
        toast({
          title: "Clients chargés",
          description: `${data.length} client(s) récupéré(s) depuis l'API`,
        });
      }
    } catch (error) {
      console.error("Erreur lors du chargement des clients:", error);
      setError("Erreur lors du chargement des clients");
      toast({
        title: "Erreur de chargement",
        description: "Impossible de charger les clients depuis l'API",
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
      
      // Autres filtres
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
    error,
    refreshClients: loadClients
  };
};

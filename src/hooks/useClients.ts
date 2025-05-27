
import { useState, useEffect, useMemo } from "react";
import { getClients, Client } from "@/services/api";
import { useToast } from "@/hooks/use-toast";

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
    setLoading(true);
    setError(null);
    
    try {
      console.log('🔄 Starting to fetch clients...');
      const data = await getClients();
      
      setClients(data);
      
      if (data.length > 0) {
        toast({
          title: "Clients chargés",
          description: `${data.length} client(s) récupéré(s) avec succès`,
        });
      } else {
        console.warn('⚠️ No clients found');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
      console.error("❌ Erreur lors du chargement des clients:", error);
      setError(errorMessage);
      setClients([]);
      
      toast({
        title: "Erreur de chargement",
        description: "Impossible de charger les clients. Vérifiez votre connexion.",
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
    error,
    refreshClients: loadClients
  };
};

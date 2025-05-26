
import { useState, useEffect, useMemo } from "react";
import { getClients, getClientsByTokens, Client } from "@/services/api";
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
  const [knownTokens, setKnownTokens] = useState<string[]>([]);
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

  // Fonction pour ajouter un beetoolToken à la liste des tokens connus
  const addKnownToken = (token: string) => {
    setKnownTokens(prev => {
      if (!prev.includes(token)) {
        const newTokens = [...prev, token];
        localStorage.setItem('knownBeetoolTokens', JSON.stringify(newTokens));
        return newTokens;
      }
      return prev;
    });
  };

  // Charger les tokens connus depuis le localStorage au démarrage
  useEffect(() => {
    const savedTokens = localStorage.getItem('knownBeetoolTokens');
    if (savedTokens) {
      try {
        setKnownTokens(JSON.parse(savedTokens));
      } catch (error) {
        console.error('Erreur lors du chargement des tokens sauvegardés:', error);
      }
    }
  }, []);

  const loadClients = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Essayer d'abord l'endpoint global (qui retournera probablement une liste vide)
      let data = await getClients();
      
      // Si pas de données et qu'on a des tokens connus, les charger individuellement
      if (data.length === 0 && knownTokens.length > 0) {
        console.log('Chargement des clients via les tokens connus:', knownTokens);
        data = await getClientsByTokens(knownTokens);
      }
      
      if (data.length === 0) {
        setError("Aucun prospect trouvé. Utilisez l'option 'Nouveau Client' pour ajouter des prospects.");
        toast({
          title: "Aucun prospect",
          description: "Aucun prospect trouvé. Ajoutez-en un avec le bouton 'Nouveau Client'.",
          variant: "default",
        });
      } else {
        setClients(data);
        toast({
          title: "Prospects chargés",
          description: `${data.length} prospect(s) récupéré(s) depuis l'API`,
        });
      }
    } catch (error) {
      console.error("Erreur lors du chargement des clients:", error);
      setError("Erreur lors de la connexion à l'API. Vérifiez votre connexion.");
      toast({
        title: "Erreur de connexion",
        description: "Impossible de se connecter à l'API. Vérifiez votre connexion internet.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadClients();
  }, [knownTokens]);

  // Filtrer les clients selon les critères
  const filteredClients = useMemo(() => {
    return clients.filter(client => {
      // Filtre de recherche textuelle
      if (filters.search) {
        const searchTermLower = filters.search.toLowerCase();
        const matchesSearch = 
          (client.name?.toLowerCase().includes(searchTermLower)) ||
          (client.email?.toLowerCase().includes(searchTermLower)) ||
          (client.beetoolToken?.toLowerCase().includes(searchTermLower)) ||
          (client.tel?.includes(searchTermLower)) ||
          (client.phone?.includes(searchTermLower));
        
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
    refreshClients: loadClients,
    addKnownToken // Exposer cette fonction pour ajouter de nouveaux tokens
  };
};

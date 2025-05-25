
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

// Cache pour éviter les re-générations aléatoires
const CLIENTS_CACHE_KEY = 'enriched_clients_cache';
const CACHE_DURATION = 30 * 60 * 1000; // 30 minutes

interface CachedClientsData {
  clients: Client[];
  timestamp: number;
}

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
      
      // Vérifier le cache d'abord
      const cached = getCachedClients();
      if (cached) {
        console.log('📂 Clients chargés depuis le cache:', cached.length);
        setClients(cached);
        setLoading(false);
        return;
      }
      
      console.log('🔄 Chargement des clients depuis l\'API...');
      const data = await getClients();
      
      // Enrichir une seule fois et mettre en cache
      const enrichedClients = enrichClientsData(data);
      setCachedClients(enrichedClients);
      setClients(enrichedClients);
      
      if (enrichedClients.length > 0) {
        toast({
          title: "Clients chargés",
          description: `${enrichedClients.length} client(s) récupéré(s) avec succès`,
        });
      }
    } catch (error) {
      console.error("Erreur lors du chargement des clients:", error);
      toast({
        title: "Avertissement",
        description: "Certaines données clients peuvent ne pas être disponibles",
        variant: "default",
      });
    } finally {
      setLoading(false);
    }
  };

  // Fonction pour enrichir les données (une seule fois)
  const enrichClientsData = (rawClients: Client[]): Client[] => {
    const communities = [
      'Andalucía', 'Aragón', 'Asturias', 'Baleares', 'Canarias', 'Cantabria',
      'Castilla-La Mancha', 'Castilla y León', 'Cataluña', 'Extremadura',
      'Galicia', 'Madrid', 'Murcia', 'Navarra', 'País Vasco', 'La Rioja', 'Valencia'
    ];
    
    return rawClients.map((client, index) => ({
      ...client,
      postalCode: client.postalCode || extractPostalCode(client.address),
      ficheType: client.ficheType || client.type || 'RES010',
      climateZone: client.climateZone || 'C',
      isolatedArea: client.isolatedArea || (20 + (index * 3) % 80), // Déterministe basé sur l'index
      isolationType: client.isolationType || (index % 2 === 0 ? 'Combles' : 'Rampants'),
      floorType: client.floorType || (index % 2 === 0 ? 'Bois' : 'Béton'),
      depositStatus: client.depositStatus || 'Non déposé',
      installationDate: client.installationDate || getDateFromIndex(index),
      lotNumber: client.lotNumber || (index % 5 === 0 ? `LOT-${index + 100}` : null),
      community: client.community || (index % 4 !== 0 ? communities[index % communities.length] : undefined)
    }));
  };

  // Gestion du cache
  const getCachedClients = (): Client[] | null => {
    try {
      const cached = localStorage.getItem(CLIENTS_CACHE_KEY);
      if (cached) {
        const data: CachedClientsData = JSON.parse(cached);
        const now = Date.now();
        
        if (now - data.timestamp < CACHE_DURATION) {
          return data.clients;
        } else {
          localStorage.removeItem(CLIENTS_CACHE_KEY);
        }
      }
    } catch (error) {
      console.error('Erreur lecture cache clients:', error);
    }
    return null;
  };

  const setCachedClients = (clients: Client[]) => {
    try {
      const data: CachedClientsData = {
        clients,
        timestamp: Date.now()
      };
      localStorage.setItem(CLIENTS_CACHE_KEY, JSON.stringify(data));
    } catch (error) {
      console.error('Erreur sauvegarde cache clients:', error);
    }
  };

  useEffect(() => {
    loadClients();
  }, []); // Une seule fois au montage

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
      
      // Filtres spécifiques
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

// Fonctions utilitaires déterministes
const extractPostalCode = (address: string | undefined): string => {
  if (!address) return '';
  const match = address.match(/\b\d{5}\b/);
  return match ? match[0] : '';
};

const getDateFromIndex = (index: number): string => {
  const baseDate = new Date('2024-01-01');
  baseDate.setDate(baseDate.getDate() + (index * 2)); // Date déterministe
  return baseDate.toISOString().split('T')[0];
};

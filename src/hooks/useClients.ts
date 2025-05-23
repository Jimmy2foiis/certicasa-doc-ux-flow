
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
      const data = await getClients();
      
      // Communautés autonomes espagnoles pour les exemples
      const communities = [
        'Andalucía', 
        'Aragón', 
        'Asturias', 
        'Baleares', 
        'Canarias', 
        'Cantabria',
        'Castilla-La Mancha', 
        'Castilla y León', 
        'Cataluña', 
        'Extremadura',
        'Galicia', 
        'Madrid', 
        'Murcia', 
        'Navarra', 
        'País Vasco', 
        'La Rioja',
        'Valencia'
      ];
      
      // Enrichir les données avec des valeurs par défaut pour les nouveaux champs requis
      const enrichedClients = data.map(client => ({
        ...client,
        postalCode: client.postalCode || extractPostalCode(client.address),
        ficheType: client.type || 'RES010',
        climateZone: client.climateZone || 'C',
        isolatedArea: client.isolatedArea || Math.floor(Math.random() * 100) + 20, // Temporaire pour la démo
        isolationType: client.isolationType || (Math.random() > 0.5 ? 'Combles' : 'Rampants'),
        floorType: client.floorType || (Math.random() > 0.5 ? 'Bois' : 'Béton'),
        depositStatus: client.depositStatus || 'Non déposé',
        installationDate: client.installationDate || getRandomPastDate(),
        lotNumber: client.lotNumber || (Math.random() > 0.7 ? `LOT-${Math.floor(Math.random() * 100)}` : null),
        community: client.community || (Math.random() > 0.3 ? communities[Math.floor(Math.random() * communities.length)] : undefined)
      }));
      
      setClients(enrichedClients);
    } catch (error) {
      console.error("Erreur lors du chargement des clients:", error);
      toast({
        title: "Erreur",
        description: "Impossible de charger la liste des clients",
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

// Fonctions utilitaires
const extractPostalCode = (address: string | undefined): string => {
  if (!address) return '';
  
  // Essaie de trouver un code postal à 5 chiffres dans l'adresse
  const match = address.match(/\b\d{5}\b/);
  return match ? match[0] : '';
};

const getRandomPastDate = (): string => {
  const today = new Date();
  const pastDate = new Date(today);
  pastDate.setDate(today.getDate() - Math.floor(Math.random() * 90));
  
  return pastDate.toISOString().split('T')[0]; // Format YYYY-MM-DD
};

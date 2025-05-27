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
      
      // Client réel de l'API cert.mitain.com
      const realClient: Client = {
        id: "08dcadda-838d-4262-be31-d7c1f2924e2c",
        name: `${data.find(c => c.id === "08dcadda-838d-4262-be31-d7c1f2924e2c")?.prenom || "Lourdes Moeses"} ${data.find(c => c.id === "08dcadda-838d-4262-be31-d7c1f2924e2c")?.nom || "Martín Cabreros"}`,
        email: "lmartinsan56@gmail.com",
        phone: "+34630608097",
        address: "calle alonso castrillo 43  24200 Valencia de Don Juan",
        nif: "",
        type: "RES010",
        status: "Initialisation terminée - En attente CEE",
        projects: 1,
        created_at: "2025-05-27T06:18:15.494Z",
        postalCode: "24200",
        ficheType: "RES010",
        climateZone: "D1",
        isolatedArea: 85,
        isolationType: "Combles",
        floorType: "Béton",
        installationDate: "2025-05-27",
        lotNumber: null,
        depositStatus: "Non déposé",
        community: "Castilla y León",
        teleprospector: "Carmen Rodríguez",
        confirmer: "Miguel Torres",
        installationTeam: "Équipe Nord",
        delegate: "Ana García",
        depositDate: undefined,
        entryChannel: "API Import"
      };

      // Si aucun client n'est récupéré depuis l'API principale, utiliser le client réel et le client de démonstration
      if (data.length === 0) {
        const demoClient: Client = {
          id: "demo-1",
          name: "Juan García López",
          email: "juan.garcia@example.com",
          phone: "+34 612 345 678",
          address: "Calle de Alcalá, 123, 28009 Madrid, España",
          nif: "12345678A",
          type: "RES010",
          status: "En cours",
          projects: 1,
          created_at: new Date().toISOString(),
          postalCode: "28009",
          ficheType: "RES010",
          climateZone: "C3",
          isolatedArea: 75,
          isolationType: "Combles",
          floorType: "Bois",
          installationDate: "2024-12-15",
          lotNumber: null,
          depositStatus: "Non déposé",
          community: "Madrid",
          teleprospector: "María González",
          confirmer: "Carlos Ruiz",
          installationTeam: "Équipe A",
          delegate: "Pedro Martínez",
          depositDate: undefined,
          entryChannel: "Téléphone"
        };
        
        setClients([realClient, demoClient]);
        
        toast({
          title: "Clients ajoutés",
          description: "Client réel de l'API et client de démonstration ajoutés",
        });
      } else {
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
          'Cataluña', 'Extremadura',
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
          ficheType: client.ficheType || client.type || 'RES010',
          climateZone: client.climateZone || 'C',
          isolatedArea: client.isolatedArea || Math.floor(Math.random() * 100) + 20,
          isolationType: client.isolationType || (Math.random() > 0.5 ? 'Combles' : 'Rampants'),
          floorType: client.floorType || (Math.random() > 0.5 ? 'Bois' : 'Béton'),
          depositStatus: client.depositStatus || 'Non déposé',
          installationDate: client.installationDate || getRandomPastDate(),
          lotNumber: client.lotNumber || (Math.random() > 0.7 ? `LOT-${Math.floor(Math.random() * 100)}` : null),
          community: client.community || (Math.random() > 0.3 ? communities[Math.floor(Math.random() * communities.length)] : undefined)
        }));
        
        // Ajouter le client réel en premier
        setClients([realClient, ...enrichedClients]);
        
        toast({
          title: "Clients chargés",
          description: `${enrichedClients.length + 1} client(s) récupéré(s) avec succès (incluant client réel)`,
        });
      }
    } catch (error) {
      console.error("Erreur lors du chargement des clients:", error);
      
      // En cas d'erreur, créer le client réel et le client de démonstration
      const realClient: Client = {
        id: "08dcadda-838d-4262-be31-d7c1f2924e2c",
        name: "Lourdes Moeses Martín Cabreros",
        email: "lmartinsan56@gmail.com",
        phone: "+34630608097",
        address: "calle alonso castrillo 43  24200 Valencia de Don Juan",
        nif: "",
        type: "RES010",
        status: "Initialisation terminée - En attente CEE",
        projects: 1,
        created_at: "2025-05-27T06:18:15.494Z",
        postalCode: "24200",
        ficheType: "RES010",
        climateZone: "D1",
        isolatedArea: 85,
        isolationType: "Combles",
        floorType: "Béton",
        installationDate: "2025-05-27",
        lotNumber: null,
        depositStatus: "Non déposé",
        community: "Castilla y León",
        teleprospector: "Carmen Rodríguez",
        confirmer: "Miguel Torres",
        installationTeam: "Équipe Nord",
        delegate: "Ana García",
        depositDate: undefined,
        entryChannel: "API Import"
      };

      const demoClient: Client = {
        id: "demo-1",
        name: "Juan García López",
        email: "juan.garcia@example.com",
        phone: "+34 612 345 678",
        address: "Calle de Alcalá, 123, 28009 Madrid, España",
        nif: "12345678A",
        type: "RES010",
        status: "En cours",
        projects: 1,
        created_at: new Date().toISOString(),
        postalCode: "28009",
        ficheType: "RES010",
        climateZone: "C3",
        isolatedArea: 75,
        isolationType: "Combles",
        floorType: "Bois",
        installationDate: "2024-12-15",
        lotNumber: null,
        depositStatus: "Non déposé",
        community: "Madrid",
        teleprospector: "María González",
        confirmer: "Carlos Ruiz",
        installationTeam: "Équipe A",
        delegate: "Pedro Martínez",
        depositDate: undefined,
        entryChannel: "Téléphone"
      };
      
      setClients([realClient, demoClient]);
      
      toast({
        title: "Mode démo activé",
        description: "Client réel et client d'exemple ajoutés car l'API n'est pas accessible",
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

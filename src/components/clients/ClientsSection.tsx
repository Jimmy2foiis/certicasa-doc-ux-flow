
import { useState, useEffect } from "react";
import { 
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { getClients, deleteClientRecord, Client } from "@/services/supabaseService";
import ClientDetails from "@/components/clients/ClientDetails";
import ClientCreateDialog from "@/components/clients/ClientCreateDialog";
import ClientFilters from "@/components/clients/ClientFilters";
import ClientsTable from "@/components/clients/ClientsTable";

const ClientsSection = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedClient, setSelectedClient] = useState<string | null>(null);
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  
  // Charger les clients depuis l'API externe
  const loadClients = async () => {
    try {
      setLoading(true);
      
      // Obtenir tous les clients depuis l'API REST
      const allClients = await getClients();
      
      setClients(allClients);
      console.log("Clients chargés depuis l'API:", allClients);
    } catch (error) {
      console.error("Erreur lors du chargement des clients:", error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les clients. Veuillez réessayer.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Charger les clients au montage du composant
  useEffect(() => {
    loadClients();
  }, []);

  // Filtrer les clients selon le terme de recherche
  const filteredClients = clients.filter(client => 
    client.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.phone?.includes(searchTerm)
  );

  // Gérer la suppression d'un client
  const handleDeleteClient = async (clientId: string) => {
    try {
      const success = await deleteClientRecord(clientId);
      
      if (success) {
        toast({
          title: "Client supprimé",
          description: "Le client a été supprimé avec succès.",
        });
        
        // Recharger la liste des clients
        await loadClients();
      } else {
        toast({
          title: "Erreur",
          description: "Impossible de supprimer le client.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Erreur lors de la suppression du client:", error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le client. Veuillez réessayer.",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      {selectedClient ? (
        <ClientDetails 
          clientId={selectedClient} 
          onBack={() => setSelectedClient(null)} 
        />
      ) : (
        <Card>
          <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-2 sm:space-y-0 pb-4">
            <CardTitle className="text-xl font-semibold">Clients</CardTitle>
            <ClientCreateDialog onClientCreated={loadClients} />
          </CardHeader>
          <CardContent>
            <ClientFilters 
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
            />
            <ClientsTable
              clients={clients}
              filteredClients={filteredClients}
              searchTerm={searchTerm}
              loading={loading}
              onClientSelect={setSelectedClient}
              onDeleteClient={handleDeleteClient}
              onOpenCreateDialog={() => ({})}
            />
          </CardContent>
        </Card>
      )}
    </>
  );
};

export default ClientsSection;

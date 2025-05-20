
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
  const [openDialog, setOpenDialog] = useState(false);
  const { toast } = useToast();
  
  // Charger les clients depuis Supabase et le stockage local
  const loadClients = async () => {
    try {
      setLoading(true);
      
      // Charger depuis Supabase
      const remoteClients = await getClients();
      
      // Charger depuis le stockage local
      const localClientsString = localStorage.getItem('local_clients');
      const localClients = localClientsString ? JSON.parse(localClientsString) : [];
      
      // Combiner les deux sources
      const allClients = [...remoteClients, ...localClients];
      
      setClients(allClients);
      console.log("Clients chargés:", allClients);
    } catch (error) {
      console.error("Erreur lors du chargement des clients:", error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les clients depuis la base de données.",
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
      // Si c'est un client local
      if (clientId.startsWith('local_')) {
        const localClientsString = localStorage.getItem('local_clients');
        if (localClientsString) {
          const localClients = JSON.parse(localClientsString);
          const updatedClients = localClients.filter((c: Client) => c.id !== clientId);
          localStorage.setItem('local_clients', JSON.stringify(updatedClients));
          
          toast({
            title: "Client supprimé",
            description: "Le client a été supprimé avec succès.",
          });
          
          // Recharger la liste des clients
          await loadClients();
        }
        return;
      }
      
      // Si c'est un client dans Supabase
      const success = await deleteClientRecord(clientId);
      
      if (success) {
        toast({
          title: "Client supprimé",
          description: "Le client a été supprimé avec succès.",
        });
        
        // Recharger la liste des clients
        await loadClients();
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
              onOpenCreateDialog={() => setOpenDialog(true)}
            />
          </CardContent>
        </Card>
      )}
    </>
  );
};

export default ClientsSection;

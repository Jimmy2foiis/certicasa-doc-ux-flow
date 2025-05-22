
import { useState } from "react";
import { 
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import ClientDetails from "@/components/clients/ClientDetails";
import ClientCreateDialog from "@/components/clients/ClientCreateDialog";
import ClientFilters from "@/components/clients/ClientFilters";
import ClientsTable from "@/components/clients/ClientsTable";
import { useClients } from "@/hooks/useClients";
import { Skeleton } from "@/components/ui/skeleton";

const ClientsSection = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedClient, setSelectedClient] = useState<string | null>(null);
  const { toast } = useToast();
  const { clients, loading, error } = useClients();
  
  // Filtrer les clients selon le terme de recherche
  const filteredClients = clients.filter(client => 
    `${client.prenom} ${client.nom}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.tel?.includes(searchTerm)
  );

  // Convertir les données au format attendu par le composant ClientsTable
  const formattedClients = filteredClients.map(client => ({
    id: client.id,
    name: `${client.prenom} ${client.nom}`,
    email: client.email || "",
    phone: client.tel || "",
    projects: client._count.File,
    status: client.status
  }));

  // Gérer la suppression d'un client - appel direct à l'API externe
  const handleDeleteClient = async (clientId: string): Promise<void> => {
    try {
      const response = await fetch(`https://certicasa.mitain.com/api/prospects/${clientId}`, {
        method: 'DELETE',
        headers: {
          "Content-Type": "application/json",
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      toast({
        title: "Client supprimé",
        description: "Le client a été supprimé avec succès.",
      });
      
      return Promise.resolve();
    } catch (error) {
      console.error("Erreur lors de la suppression du client:", error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le client. Veuillez réessayer.",
        variant: "destructive",
      });
      
      return Promise.reject(error);
    }
  };

  // Afficher un message d'erreur si la récupération des clients a échoué
  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-semibold">Clients</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="p-4 bg-red-50 text-red-800 rounded-md">
            <p className="font-semibold">Erreur lors du chargement des clients</p>
            <p className="text-sm">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="mt-2 px-3 py-1 bg-red-100 hover:bg-red-200 rounded text-sm"
            >
              Réessayer
            </button>
          </div>
        </CardContent>
      </Card>
    );
  }

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
            <ClientCreateDialog onClientCreated={() => window.location.reload()} />
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-4">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-96 w-full" />
              </div>
            ) : (
              <>
                <ClientFilters 
                  searchTerm={searchTerm}
                  onSearchChange={setSearchTerm}
                />
                <ClientsTable
                  clients={formattedClients}
                  filteredClients={formattedClients}
                  searchTerm={searchTerm}
                  loading={loading}
                  onClientSelect={setSelectedClient}
                  onDeleteClient={handleDeleteClient}
                  onOpenCreateDialog={() => {}} 
                />
              </>
            )}
          </CardContent>
        </Card>
      )}
    </>
  );
};

export default ClientsSection;

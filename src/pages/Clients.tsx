
import { useState } from "react";
import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import ClientsTable from "@/components/clients/ClientsTable";
import ClientsFilters from "@/components/clients/ClientsFilters";
import ClientsActions from "@/components/clients/ClientsActions";
import ClientsFloatingBar from "@/components/clients/ClientsFloatingBar";
import { useClients } from "@/hooks/useClients";
import { useToast } from "@/components/ui/use-toast";

const Clients = () => {
  const [selectedClients, setSelectedClients] = useState<string[]>([]);
  const { toast } = useToast();
  const { 
    clients,
    filteredClients,
    filters,
    setFilters,
    loading,
    refreshClients
  } = useClients();
  
  const handleSelectClient = (clientId: string, isSelected: boolean) => {
    if (isSelected) {
      setSelectedClients(prev => [...prev, clientId]);
    } else {
      setSelectedClients(prev => prev.filter(id => id !== clientId));
    }
  };

  const handleSelectAll = (isSelected: boolean) => {
    if (isSelected) {
      setSelectedClients(filteredClients.map(client => client.id || '').filter(Boolean));
    } else {
      setSelectedClients([]);
    }
  };

  const clearSelection = () => {
    setSelectedClients([]);
  };

  const handleCreateBatch = () => {
    toast({
      title: "Création de lot",
      description: `Lot créé avec ${selectedClients.length} client(s)`,
    });
    // Ici, vous pourriez rediriger vers la page de création de lot
    console.log("Création d'un lot avec les clients:", selectedClients);
  };

  const handleAddToExistingBatch = () => {
    toast({
      title: "Ajout au lot",
      description: `${selectedClients.length} client(s) ajouté(s) au lot existant`,
    });
    console.log("Ajout à un lot existant des clients:", selectedClients);
  };

  const handleDownloadZip = () => {
    toast({
      title: "Téléchargement",
      description: `Préparation du téléchargement pour ${selectedClients.length} client(s)`,
    });
    console.log("Téléchargement ZIP des clients:", selectedClients);
  };

  const handleDeleteClient = async (clientId: string) => {
    try {
      // Simulation de suppression (à remplacer par l'appel API réel)
      await new Promise(resolve => setTimeout(resolve, 500));
      
      toast({
        title: "Client supprimé",
        description: "Le client a été supprimé avec succès",
      });
      
      // Rafraîchir la liste des clients
      await refreshClients();
      
      // Si le client supprimé était sélectionné, le retirer de la sélection
      if (selectedClients.includes(clientId)) {
        setSelectedClients(prev => prev.filter(id => id !== clientId));
      }
    } catch (error) {
      console.error("Erreur lors de la suppression du client:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la suppression du client",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-4">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-semibold">Gestion des Clients</h1>
          </div>
          
          <ClientsFilters 
            filters={filters} 
            setFilters={setFilters} 
          />
          
          <ClientsActions 
            onClientCreated={refreshClients}
            selectedCount={selectedClients.length}
            onCreateBatch={handleCreateBatch}
            onExportSelection={handleDownloadZip}
          />
          
          <ClientsTable 
            clients={filteredClients}
            loading={loading}
            selectedClients={selectedClients}
            onSelectClient={handleSelectClient}
            onSelectAll={handleSelectAll}
            onDeleteClient={handleDeleteClient}
            onOpenCreateDialog={() => {
              // Ouvrir la modal de création via référence (à implémenter si nécessaire)
            }}
          />
          
          {selectedClients.length > 0 && (
            <ClientsFloatingBar 
              selectedCount={selectedClients.length} 
              onClearSelection={clearSelection}
              selectedClientIds={selectedClients}
              onCreateBatch={handleCreateBatch}
              onAddToExistingBatch={handleAddToExistingBatch}
              onDownloadZip={handleDownloadZip}
            />
          )}
        </main>
      </div>
    </div>
  );
};

export default Clients;

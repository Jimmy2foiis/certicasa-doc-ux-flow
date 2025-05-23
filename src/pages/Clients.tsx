
import { useState } from "react";
import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import ClientsTable from "@/components/clients/ClientsTable";
import ClientDetails from "@/components/clients/ClientDetails";
import { useClients } from "@/hooks/useClients";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Search, UserPlus, Package, Download, UploadIcon, Trash2, RefreshCcw, Filter } from "lucide-react";
import ClientForm from "@/components/clients/ClientForm";
import ClientsFloatingBar from "@/components/clients/ClientsFloatingBar";

const Clients = () => {
  const [selectedClients, setSelectedClients] = useState<string[]>([]);
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
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

  const handleClientSelect = (clientId: string) => {
    setSelectedClientId(clientId);
  };

  const handleBackFromDetails = () => {
    setSelectedClientId(null);
  };

  const handleCreateClient = async (data: any) => {
    // Simulation de création client
    await new Promise(resolve => setTimeout(resolve, 500));
    
    toast({
      title: "Client créé",
      description: "Le nouveau client a été ajouté avec succès",
    });
    
    setShowCreateDialog(false);
    refreshClients();
  };

  const handleCreateBatch = () => {
    toast({
      title: "Création de lot",
      description: `Lot créé avec ${selectedClients.length} client(s)`,
    });
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

  // Si un client est sélectionné, afficher ses détails
  if (selectedClientId) {
    return (
      <div className="flex h-screen bg-gray-50">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header />
          <main className="flex-1 overflow-y-auto p-4">
            <ClientDetails clientId={selectedClientId} onBack={handleBackFromDetails} />
          </main>
        </div>
      </div>
    );
  }

  // Sinon, afficher la liste des clients
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-6">
          {/* Header avec recherche et actions */}
          <div className="sticky top-0 z-10 bg-gray-50 pb-4">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-semibold text-gray-900">Clients</h1>
              <div className="flex gap-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Rechercher un client..."
                    className="pl-9 w-64 bg-white"
                    value={filters.search}
                    onChange={(e) => setFilters({...filters, search: e.target.value})}
                  />
                </div>
                <Button 
                  onClick={() => setShowCreateDialog(true)} 
                  className="bg-green-600 hover:bg-green-700"
                >
                  <UserPlus className="h-4 w-4 mr-2" />
                  Nouveau client
                </Button>
              </div>
            </div>
            
            {/* Boutons d'action principale */}
            <div className="flex justify-between items-center mb-4">
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  className="flex items-center gap-1 text-sm h-9 border-gray-300"
                  disabled={selectedClients.length === 0}
                  onClick={handleCreateBatch}
                >
                  <UploadIcon className="h-4 w-4" />
                  <span>Créer un lot</span>
                </Button>
                <Button 
                  variant="outline" 
                  className="flex items-center gap-1 text-sm h-9 border-gray-300"
                  disabled={selectedClients.length === 0}
                  onClick={handleAddToExistingBatch}
                >
                  <Package className="h-4 w-4" />
                  <span>Ajouter à un lot</span>
                </Button>
                <Button 
                  variant="outline" 
                  className="flex items-center gap-1 text-sm h-9 border-gray-300"
                  disabled={selectedClients.length === 0}
                  onClick={handleDownloadZip}
                >
                  <Download className="h-4 w-4" />
                  <span>Exporter sélection</span>
                </Button>
              </div>
              <div className="flex gap-2">
                <Button 
                  variant="ghost" 
                  className="flex items-center gap-1 h-9 text-gray-600"
                  onClick={refreshClients}
                >
                  <RefreshCcw className="h-4 w-4" />
                  <span>Actualiser</span>
                </Button>
                <Button 
                  variant="ghost" 
                  className="flex items-center gap-1 h-9 text-gray-600"
                >
                  <Filter className="h-4 w-4" />
                  <span>Enregistrer filtre</span>
                </Button>
              </div>
            </div>
          </div>
          
          {/* Tableau des clients */}
          <div className="mb-16">
            <ClientsTable 
              clients={filteredClients}
              loading={loading}
              selectedClients={selectedClients}
              onSelectClient={handleSelectClient}
              onSelectAll={handleSelectAll}
              onDeleteClient={handleDeleteClient}
              onClientSelect={handleClientSelect}
              onOpenCreateDialog={() => setShowCreateDialog(true)}
            />
          </div>
          
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

      {/* Dialog pour créer un client */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <ClientForm 
            onSubmit={handleCreateClient}
            onCancel={() => setShowCreateDialog(false)}
            isSubmitting={false}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Clients;

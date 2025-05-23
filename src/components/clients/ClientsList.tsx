
import { useState } from 'react';
import ClientsTable from '@/components/clients/ClientsTable';
import ClientsFloatingBar from '@/components/clients/ClientsFloatingBar';
import { Client } from '@/services/api/types';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import ClientForm from '@/components/clients/ClientForm';
import ClientsHeader from './ClientsHeader';

interface ClientsListProps {
  clients: Client[];
  filteredClients: Client[];
  filters: { search: string };
  setFilters: (filters: any) => void;
  loading: boolean;
  selectedClients: string[];
  onSelectClient: (clientId: string, isSelected: boolean) => void;
  onSelectAll: (isSelected: boolean) => void;
  onDeleteClient: (clientId: string) => Promise<boolean>;
  onClientSelect: (clientId: string) => void;
  refreshClients: () => Promise<void>;
  handleCreateClient: (data: any) => Promise<boolean>;
  handleCreateBatch: (selectedClients: string[]) => void;
  handleAddToExistingBatch: (selectedClients: string[]) => void;
  handleDownloadZip: (selectedClients: string[]) => void;
  clearSelection: () => void;
}

const ClientsList = ({
  clients,
  filteredClients,
  filters,
  setFilters,
  loading,
  selectedClients,
  onSelectClient,
  onSelectAll,
  onDeleteClient,
  onClientSelect,
  refreshClients,
  handleCreateClient,
  handleCreateBatch,
  handleAddToExistingBatch,
  handleDownloadZip,
  clearSelection
}: ClientsListProps) => {
  const [showCreateDialog, setShowCreateDialog] = useState(false);

  const handleOpenCreateDialog = () => {
    setShowCreateDialog(true);
  };

  const handleSubmitCreate = async (data: any) => {
    const success = await handleCreateClient(data);
    if (success) {
      setShowCreateDialog(false);
    }
  };

  return (
    <>
      <ClientsHeader 
        searchTerm={filters.search}
        onSearchChange={(value) => setFilters({...filters, search: value})}
        onCreateClient={handleOpenCreateDialog}
        onCreateBatch={() => handleCreateBatch(selectedClients)}
        onAddToExistingBatch={() => handleAddToExistingBatch(selectedClients)}
        onDownloadZip={() => handleDownloadZip(selectedClients)}
        onRefresh={refreshClients}
        selectedClientsCount={selectedClients.length}
      />
      
      {/* Tableau des clients */}
      <div className="mb-16">
        <ClientsTable 
          clients={filteredClients}
          loading={loading}
          selectedClients={selectedClients}
          onSelectClient={onSelectClient}
          onSelectAll={onSelectAll}
          onDeleteClient={onDeleteClient}
          onClientSelect={onClientSelect}
          onOpenCreateDialog={handleOpenCreateDialog}
        />
      </div>
      
      {selectedClients.length > 0 && (
        <ClientsFloatingBar 
          selectedCount={selectedClients.length} 
          onClearSelection={clearSelection}
          selectedClientIds={selectedClients}
          onCreateBatch={() => handleCreateBatch(selectedClients)}
          onAddToExistingBatch={() => handleAddToExistingBatch(selectedClients)}
          onDownloadZip={() => handleDownloadZip(selectedClients)}
        />
      )}

      {/* Dialog pour créer un client */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <ClientForm 
            onSubmit={handleSubmitCreate}
            onCancel={() => setShowCreateDialog(false)}
            isSubmitting={false}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ClientsList;

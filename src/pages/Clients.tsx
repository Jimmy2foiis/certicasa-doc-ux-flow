
import { useState } from "react";
import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import ClientsList from "@/components/clients/ClientsList";
import ClientDetails from "@/components/clients/ClientDetails";
import { useClients } from "@/hooks/useClients";
import { useClientSelection } from "@/hooks/useClientSelection";
import { useClientActions } from "@/hooks/useClientActions";

const Clients = () => {
  const { 
    clients,
    filteredClients,
    filters,
    setFilters,
    loading,
    refreshClients
  } = useClients();
  
  const {
    selectedClients,
    selectedClientId,
    handleSelectClient,
    handleSelectAll,
    clearSelection,
    handleClientSelect,
    handleBackFromDetails
  } = useClientSelection();

  const {
    handleCreateClient,
    handleCreateBatch,
    handleAddToExistingBatch,
    handleDownloadZip,
    handleDeleteClient
  } = useClientActions(refreshClients);

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
          <ClientsList 
            clients={clients}
            filteredClients={filteredClients}
            filters={filters}
            setFilters={setFilters}
            loading={loading}
            selectedClients={selectedClients}
            onSelectClient={handleSelectClient}
            onSelectAll={(isSelected) => handleSelectAll(filteredClients, isSelected)}
            onDeleteClient={handleDeleteClient}
            onClientSelect={handleClientSelect}
            refreshClients={refreshClients}
            handleCreateClient={handleCreateClient}
            handleCreateBatch={handleCreateBatch}
            handleAddToExistingBatch={handleAddToExistingBatch}
            handleDownloadZip={handleDownloadZip}
            clearSelection={clearSelection}
          />
        </main>
      </div>
    </div>
  );
};

export default Clients;

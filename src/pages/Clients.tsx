
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
    error,
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
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <h3 className="text-red-800 font-medium">Erreur de chargement</h3>
              <p className="text-red-600 text-sm mt-1">{error}</p>
              <button 
                onClick={refreshClients}
                className="mt-2 px-3 py-1 bg-red-100 text-red-800 rounded text-sm hover:bg-red-200"
              >
                Réessayer
              </button>
            </div>
          )}
          
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

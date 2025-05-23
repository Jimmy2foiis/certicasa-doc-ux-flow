
import { useState } from "react";
import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import ClientsTable from "@/components/clients/ClientsTable";
import ClientsFilters from "@/components/clients/ClientsFilters";
import ClientsActions from "@/components/clients/ClientsActions";
import ClientsFloatingBar from "@/components/clients/ClientsFloatingBar";
import { useClients } from "@/hooks/useClients";

const Clients = () => {
  const [selectedClients, setSelectedClients] = useState<string[]>([]);
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
          />
          
          <ClientsTable 
            clients={filteredClients}
            loading={loading}
            selectedClients={selectedClients}
            onSelectClient={handleSelectClient}
            onSelectAll={handleSelectAll}
          />
          
          {selectedClients.length > 0 && (
            <ClientsFloatingBar 
              selectedCount={selectedClients.length} 
              onClearSelection={clearSelection}
              selectedClientIds={selectedClients}
            />
          )}
        </main>
      </div>
    </div>
  );
};

export default Clients;

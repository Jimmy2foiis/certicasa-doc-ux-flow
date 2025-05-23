
import React, { useState, useEffect } from "react";
import { Client } from "@/types/clientTypes";
import ClientsTable from "./table/ClientsTable";
import ClientFormDialog from "./dialogs/ClientFormDialog";
import ClientDetailsDialog from "./dialogs/ClientDetailsDialog";
import { useClientsData } from "@/hooks/useClientsData";

const ClientsSection = () => {
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [clientToEdit, setClientToEdit] = useState<Client | null>(null);
  const { clients, loading, loadClients, handleDeleteConfirmation } = useClientsData();

  useEffect(() => {
    loadClients();
  }, []);

  const handleViewDetails = (client: Client) => {
    setSelectedClient(client);
    setIsDetailsOpen(true);
  };

  const handleEditClient = (client: Client) => {
    setClientToEdit(client);
    setIsFormOpen(true);
  };

  const handleClientUpdated = () => {
    loadClients();
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Liste des Clients</h2>
        <ClientFormDialog 
          isOpen={isFormOpen}
          onOpenChange={setIsFormOpen}
          client={clientToEdit}
          onClientUpdated={handleClientUpdated}
          triggerButton={true}
        />
      </div>
      
      <ClientsTable 
        clients={clients}
        loading={loading}
        onViewDetails={handleViewDetails}
        onEditClient={handleEditClient}
        onDeleteConfirmation={handleDeleteConfirmation}
      />

      <ClientDetailsDialog 
        client={selectedClient}
        isOpen={isDetailsOpen}
        onOpenChange={setIsDetailsOpen}
      />
    </div>
  );
};

export default ClientsSection;

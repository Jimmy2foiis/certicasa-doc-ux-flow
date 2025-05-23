
import { useState } from "react";
import { Client } from "@/services/api/types";

export function useClientSelection() {
  const [selectedClients, setSelectedClients] = useState<string[]>([]);
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);

  const handleSelectClient = (clientId: string, isSelected: boolean) => {
    if (isSelected) {
      setSelectedClients(prev => [...prev, clientId]);
    } else {
      setSelectedClients(prev => prev.filter(id => id !== clientId));
    }
  };

  const handleSelectAll = (clients: Client[], isSelected: boolean) => {
    if (isSelected) {
      setSelectedClients(clients.map(client => client.id || '').filter(Boolean));
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

  return {
    selectedClients,
    selectedClientId,
    handleSelectClient,
    handleSelectAll,
    clearSelection,
    handleClientSelect,
    handleBackFromDetails
  };
}

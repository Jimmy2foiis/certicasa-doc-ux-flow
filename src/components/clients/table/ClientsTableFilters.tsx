
import { useMemo } from 'react';
import { Client } from '@/services/api/types';

interface TableFilters {
  name: string;
  ficheType: string;
  status: string;
  depositStatus: string;
  lotNumber: string;
  installationDate: string;
  isolatedArea: string;
  isolationType: string;
  floorType: string;
  climateZone: string;
}

export const useClientFilters = (clients: Client[], columnFilters: TableFilters, filteredClients?: Client[]) => {
  const displayClients = filteredClients ?? clients;
  
  // Apply column filters to already filtered clients
  const filteredByColumns = useMemo(() => {
    return displayClients.filter(client => {
      return (
        (!columnFilters.name || (client.name?.toLowerCase().includes(columnFilters.name.toLowerCase()))) &&
        (!columnFilters.ficheType || client.ficheType === columnFilters.ficheType) &&
        (!columnFilters.status || client.status === columnFilters.status) &&
        (!columnFilters.depositStatus || client.depositStatus === columnFilters.depositStatus) &&
        (!columnFilters.lotNumber || (client.lotNumber?.includes(columnFilters.lotNumber))) &&
        (!columnFilters.installationDate || (client.installationDate?.includes(columnFilters.installationDate))) &&
        (!columnFilters.isolatedArea || (client.isolatedArea?.toString().includes(columnFilters.isolatedArea))) &&
        (!columnFilters.isolationType || client.isolationType === columnFilters.isolationType) &&
        (!columnFilters.floorType || client.floorType === columnFilters.floorType) &&
        (!columnFilters.climateZone || client.climateZone === columnFilters.climateZone)
      );
    });
  }, [displayClients, columnFilters]);

  // Extract unique values for filter dropdowns
  const uniqueFicheTypes = [...new Set(clients.map(client => client.ficheType).filter(Boolean) as string[])];
  const uniqueStatuses = [...new Set(clients.map(client => client.status).filter(Boolean) as string[])];
  const uniqueDepositStatuses = [...new Set(clients.map(client => client.depositStatus).filter(Boolean) as string[])];
  const uniqueLots = [...new Set(clients.map(client => client.lotNumber).filter(Boolean) as string[])];
  const uniqueIsolationTypes = [...new Set(clients.map(client => client.isolationType).filter(Boolean) as string[])];
  const uniqueFloorTypes = [...new Set(clients.map(client => client.floorType).filter(Boolean) as string[])];
  const uniqueClimateZones = [...new Set(clients.map(client => client.climateZone).filter(Boolean) as string[])];
  
  return {
    filteredByColumns,
    uniqueFicheTypes,
    uniqueStatuses,
    uniqueDepositStatuses,
    uniqueLots,
    uniqueIsolationTypes,
    uniqueFloorTypes,
    uniqueClimateZones
  };
};

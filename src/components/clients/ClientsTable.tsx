
import { useState } from 'react';
import type { Client } from '@/services/api/types';
import {
  Table,
  TableBody,
} from '@/components/ui/table';
import { Loader2 } from 'lucide-react';
import ClientsTableHeader from './table/ClientsTableHeader';
import ClientsTableRow from './table/ClientsTableRow';
import EmptyState from './table/EmptyState';
import { useClientFilters } from './table/ClientsTableFilters';

interface ClientsTableProps {
  clients: Client[];
  filteredClients?: Client[];
  searchTerm?: string;
  loading: boolean;
  onClientSelect?: (clientId: string) => void;
  onDeleteClient?: (clientId: string) => void;
  onOpenCreateDialog?: () => void;
  selectedClients?: string[];
  onSelectClient?: (clientId: string, isSelected: boolean) => void;
  onSelectAll?: (isSelected: boolean) => void;
}

const ClientsTable = ({
  clients,
  filteredClients,
  searchTerm,
  loading,
  onClientSelect,
  onDeleteClient,
  onOpenCreateDialog,
  selectedClients = [],
  onSelectClient,
  onSelectAll,
}: ClientsTableProps) => {
  // Column filtering state
  const [columnFilters, setColumnFilters] = useState<{
    name: string;
    ficheType: string;
    status: string;
    depositStatus: string;
    lotNumber: string;
    climateZone: string;
    community: string;
    installationDate: string;
    isolatedArea: string;
    isolationType: string;
    floorType: string;
  }>({
    name: '',
    ficheType: '',
    status: '',
    depositStatus: '',
    lotNumber: '',
    climateZone: '',
    community: '',
    installationDate: '',
    isolatedArea: '',
    isolationType: '',
    floorType: '',
  });

  // Assurons-nous que filteredClients est un tableau
  const clientsToFilter = Array.isArray(filteredClients) ? filteredClients : (Array.isArray(clients) ? clients : []);

  const {
    filteredByColumns,
    uniqueFicheTypes,
    uniqueStatuses,
    uniqueDepositStatuses,
    uniqueLots,
    uniqueIsolationTypes,
    uniqueFloorTypes,
    uniqueClimateZones,
    uniqueCommunities
  } = useClientFilters(clients, columnFilters, clientsToFilter);

  // Calculate if all clients are selected
  const allSelected = filteredByColumns.length > 0 && selectedClients.length === filteredByColumns.length;

  const handleSelectAll = () => {
    if (onSelectAll) {
      onSelectAll(!allSelected);
    }
  };

  // Determine if we should show selection column
  const showSelectionColumn = !!onSelectClient;
  
  // Calculate colspan for empty state
  const colSpan = showSelectionColumn ? 13 : 12;

  // Sécurité pour éviter de rendre si les données ne sont pas valides
  if (!Array.isArray(filteredByColumns)) {
    console.error("filteredByColumns n'est pas un tableau:", filteredByColumns);
    return <div>Erreur de chargement des données</div>;
  }
  
  return (
    <div className="rounded-md border border-gray-200 shadow-sm bg-white overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <ClientsTableHeader 
            columnFilters={columnFilters}
            setColumnFilters={setColumnFilters}
            uniqueFicheTypes={uniqueFicheTypes}
            uniqueStatuses={uniqueStatuses}
            uniqueDepositStatuses={uniqueDepositStatuses}
            uniqueLots={uniqueLots}
            uniqueIsolationTypes={uniqueIsolationTypes}
            uniqueFloorTypes={uniqueFloorTypes}
            uniqueClimateZones={uniqueClimateZones}
            uniqueCommunities={uniqueCommunities}
            allSelected={allSelected}
            handleSelectAll={handleSelectAll}
            showSelectionColumn={showSelectionColumn}
          />
          <TableBody>
            <EmptyState 
              loading={loading}
              hasClients={filteredByColumns.length > 0}
              searchTerm={searchTerm}
              onOpenCreateDialog={onOpenCreateDialog}
              colSpan={colSpan}
            />
            
            {!loading && filteredByColumns.length > 0 && filteredByColumns.map((client) => (
              <ClientsTableRow
                key={client.id}
                client={client}
                selectedClients={selectedClients}
                onSelectClient={onSelectClient}
                onClientSelect={onClientSelect}
                onDeleteClient={onDeleteClient}
                showSelectionColumn={showSelectionColumn}
              />
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default ClientsTable;

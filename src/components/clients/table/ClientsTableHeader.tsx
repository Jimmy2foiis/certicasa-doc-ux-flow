
import {
  TableHead,
  TableRow,
  TableHeader,
} from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import ColumnFilterDropdown from './ColumnFilterDropdown';
import FilteredColumnHeader from './headers/FilteredColumnHeader';
import TextFilterInput from './headers/TextFilterInput';
import SimpleColumnHeader from './headers/SimpleColumnHeader';

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

interface ClientsTableHeaderProps {
  columnFilters: TableFilters;
  setColumnFilters: (filters: TableFilters) => void;
  uniqueFicheTypes: string[];
  uniqueStatuses: string[];
  uniqueDepositStatuses: string[];
  uniqueLots: string[];
  uniqueIsolationTypes: string[];
  uniqueFloorTypes: string[];
  uniqueClimateZones: string[];
  allSelected: boolean;
  handleSelectAll: () => void;
  showSelectionColumn: boolean;
}

const ClientsTableHeader = ({
  columnFilters,
  setColumnFilters,
  uniqueFicheTypes,
  uniqueStatuses,
  uniqueDepositStatuses,
  uniqueLots,
  uniqueIsolationTypes,
  uniqueFloorTypes,
  uniqueClimateZones,
  allSelected,
  handleSelectAll,
  showSelectionColumn,
}: ClientsTableHeaderProps) => {
  const handleFilterChange = (key: string, value: string) => {
    setColumnFilters({
      ...columnFilters,
      [key]: value
    });
  };

  return (
    <TableHeader>
      <TableRow className="bg-gray-50 border-b border-gray-200">
        {/* 1. Checkbox for bulk actions */}
        {showSelectionColumn && (
          <TableHead className="w-12 sticky left-0 bg-gray-50 border-r border-gray-100">
            <Checkbox 
              checked={allSelected}
              onCheckedChange={handleSelectAll}
              aria-label="Sélectionner tous les clients"
            />
          </TableHead>
        )}
        
        {/* 2. Nom & Prénom */}
        <TableHead>
          <FilteredColumnHeader title="Nom & Prénom">
            <TextFilterInput
              placeholder="Filtrer par nom..."
              value={columnFilters.name}
              onChange={(value) => handleFilterChange('name', value)}
            />
          </FilteredColumnHeader>
        </TableHead>
        
        {/* 3. Type de fiche */}
        <TableHead className="w-28">
          <FilteredColumnHeader title="Type de fiche">
            <ColumnFilterDropdown 
              title="Type" 
              options={uniqueFicheTypes} 
              filterKey="ficheType"
              value={columnFilters.ficheType}
              onChange={handleFilterChange}
            />
          </FilteredColumnHeader>
        </TableHead>
        
        {/* 4. Statut du dossier */}
        <TableHead className="w-36">
          <FilteredColumnHeader title="Statut dossier">
            <ColumnFilterDropdown 
              title="Statut" 
              options={uniqueStatuses} 
              filterKey="status"
              value={columnFilters.status}
              onChange={handleFilterChange}
            />
          </FilteredColumnHeader>
        </TableHead>
        
        {/* 5. Statut de dépôt */}
        <TableHead className="w-32">
          <FilteredColumnHeader title="Statut dépôt">
            <ColumnFilterDropdown 
              title="Dépôt" 
              options={uniqueDepositStatuses} 
              filterKey="depositStatus"
              value={columnFilters.depositStatus}
              onChange={handleFilterChange}
            />
          </FilteredColumnHeader>
        </TableHead>
        
        {/* 6. Nom du lot */}
        <TableHead className="w-32">
          <FilteredColumnHeader title="Lot">
            <ColumnFilterDropdown 
              title="Lot" 
              options={uniqueLots} 
              filterKey="lotNumber"
              value={columnFilters.lotNumber}
              onChange={handleFilterChange}
            />
          </FilteredColumnHeader>
        </TableHead>
        
        {/* 7. Date de pose */}
        <TableHead className="w-28">
          <FilteredColumnHeader title="Date de pose">
            <TextFilterInput
              placeholder="JJ/MM/AAAA"
              value={columnFilters.installationDate}
              onChange={(value) => handleFilterChange('installationDate', value)}
            />
          </FilteredColumnHeader>
        </TableHead>
        
        {/* 8. Surface isolée */}
        <TableHead className="text-right w-24">
          <FilteredColumnHeader title="Surface (m²)">
            <TextFilterInput
              placeholder="m²"
              value={columnFilters.isolatedArea}
              onChange={(value) => handleFilterChange('isolatedArea', value)}
            />
          </FilteredColumnHeader>
        </TableHead>
        
        {/* 9. Type isolation */}
        <TableHead className="w-32">
          <FilteredColumnHeader title="Type isolation">
            <ColumnFilterDropdown 
              title="Isolation" 
              options={uniqueIsolationTypes} 
              filterKey="isolationType"
              value={columnFilters.isolationType}
              onChange={handleFilterChange}
            />
          </FilteredColumnHeader>
        </TableHead>
        
        {/* 10. Type plancher */}
        <TableHead className="w-32">
          <FilteredColumnHeader title="Type plancher">
            <ColumnFilterDropdown 
              title="Plancher" 
              options={uniqueFloorTypes} 
              filterKey="floorType"
              value={columnFilters.floorType}
              onChange={handleFilterChange}
            />
          </FilteredColumnHeader>
        </TableHead>
        
        {/* 11. Zone climatique */}
        <TableHead className="w-28">
          <FilteredColumnHeader title="Zone climat.">
            <ColumnFilterDropdown 
              title="Zone" 
              options={uniqueClimateZones} 
              filterKey="climateZone"
              value={columnFilters.climateZone}
              onChange={handleFilterChange}
            />
          </FilteredColumnHeader>
        </TableHead>
        
        {/* 12. Actions */}
        <TableHead className="text-right w-20">
          <SimpleColumnHeader title="Actions" />
        </TableHead>
      </TableRow>
    </TableHeader>
  );
};

export default ClientsTableHeader;

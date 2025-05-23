
import { Input } from '@/components/ui/input';
import {
  TableHead,
  TableRow,
  TableHeader,
} from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import ColumnFilterDropdown from './ColumnFilterDropdown';

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
          <div className="flex flex-col gap-1">
            <span className="text-xs font-semibold text-gray-700">Nom & Prénom</span>
            <div>
              <Input 
                placeholder="Filtrer par nom..."
                className="h-7 text-xs"
                value={columnFilters.name}
                onChange={(e) => handleFilterChange('name', e.target.value)}
              />
            </div>
          </div>
        </TableHead>
        
        {/* 3. Type de fiche */}
        <TableHead className="w-28">
          <div className="flex flex-col gap-1">
            <span className="text-xs font-semibold text-gray-700">Type de fiche</span>
            <ColumnFilterDropdown 
              title="Type" 
              options={uniqueFicheTypes} 
              filterKey="ficheType"
              value={columnFilters.ficheType}
              onChange={handleFilterChange}
            />
          </div>
        </TableHead>
        
        {/* 4. Statut du dossier */}
        <TableHead className="w-36">
          <div className="flex flex-col gap-1">
            <span className="text-xs font-semibold text-gray-700">Statut dossier</span>
            <ColumnFilterDropdown 
              title="Statut" 
              options={uniqueStatuses} 
              filterKey="status"
              value={columnFilters.status}
              onChange={handleFilterChange}
            />
          </div>
        </TableHead>
        
        {/* 5. Statut de dépôt */}
        <TableHead className="w-32">
          <div className="flex flex-col gap-1">
            <span className="text-xs font-semibold text-gray-700">Statut dépôt</span>
            <ColumnFilterDropdown 
              title="Dépôt" 
              options={uniqueDepositStatuses} 
              filterKey="depositStatus"
              value={columnFilters.depositStatus}
              onChange={handleFilterChange}
            />
          </div>
        </TableHead>
        
        {/* 6. Nom du lot */}
        <TableHead className="w-32">
          <div className="flex flex-col gap-1">
            <span className="text-xs font-semibold text-gray-700">Lot</span>
            <ColumnFilterDropdown 
              title="Lot" 
              options={uniqueLots} 
              filterKey="lotNumber"
              value={columnFilters.lotNumber}
              onChange={handleFilterChange}
            />
          </div>
        </TableHead>
        
        {/* 7. Date de pose */}
        <TableHead className="w-28">
          <div className="flex flex-col gap-1">
            <span className="text-xs font-semibold text-gray-700">Date de pose</span>
            <Input 
              placeholder="JJ/MM/AAAA"
              className="h-7 text-xs"
              value={columnFilters.installationDate}
              onChange={(e) => handleFilterChange('installationDate', e.target.value)}
            />
          </div>
        </TableHead>
        
        {/* 8. Surface isolée */}
        <TableHead className="text-right w-24">
          <div className="flex flex-col gap-1">
            <span className="text-xs font-semibold text-gray-700">Surface (m²)</span>
            <Input 
              placeholder="m²"
              className="h-7 text-xs"
              value={columnFilters.isolatedArea}
              onChange={(e) => handleFilterChange('isolatedArea', e.target.value)}
            />
          </div>
        </TableHead>
        
        {/* 9. Type isolation */}
        <TableHead className="w-32">
          <div className="flex flex-col gap-1">
            <span className="text-xs font-semibold text-gray-700">Type isolation</span>
            <ColumnFilterDropdown 
              title="Isolation" 
              options={uniqueIsolationTypes} 
              filterKey="isolationType"
              value={columnFilters.isolationType}
              onChange={handleFilterChange}
            />
          </div>
        </TableHead>
        
        {/* 10. Type plancher */}
        <TableHead className="w-32">
          <div className="flex flex-col gap-1">
            <span className="text-xs font-semibold text-gray-700">Type plancher</span>
            <ColumnFilterDropdown 
              title="Plancher" 
              options={uniqueFloorTypes} 
              filterKey="floorType"
              value={columnFilters.floorType}
              onChange={handleFilterChange}
            />
          </div>
        </TableHead>
        
        {/* 11. Zone climatique */}
        <TableHead className="w-28">
          <div className="flex flex-col gap-1">
            <span className="text-xs font-semibold text-gray-700">Zone climat.</span>
            <ColumnFilterDropdown 
              title="Zone" 
              options={uniqueClimateZones} 
              filterKey="climateZone"
              value={columnFilters.climateZone}
              onChange={handleFilterChange}
            />
          </div>
        </TableHead>
        
        {/* 12. Actions */}
        <TableHead className="text-right w-20">
          <span className="text-xs font-semibold text-gray-700">Actions</span>
        </TableHead>
      </TableRow>
    </TableHeader>
  );
};

export default ClientsTableHeader;

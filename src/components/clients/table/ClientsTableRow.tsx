
import { Client } from '@/services/api/types';
import { TableRow, TableCell } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { formatDate } from './utils/statusUtils';
import StatusCell from './cells/StatusCell';
import DepositStatusCell from './cells/DepositStatusCell';
import FicheTypeCell from './cells/FicheTypeCell';
import LotNumberCell from './cells/LotNumberCell';
import IsolationTypeCell from './cells/IsolationTypeCell';
import FloorTypeCell from './cells/FloorTypeCell';
import ClimateZoneCell from './cells/ClimateZoneCell';
import ClientActionsCell from './cells/ClientActionsCell';
import CommunityCell from './cells/CommunityCell';

interface ClientsTableRowProps {
  client: Client;
  selectedClients?: string[];
  onSelectClient?: (clientId: string, isSelected: boolean) => void;
  onClientSelect?: (clientId: string) => void;
  onDeleteClient?: (clientId: string) => void;
  showSelectionColumn: boolean;
}

const ClientsTableRow = ({
  client,
  selectedClients = [],
  onSelectClient,
  onClientSelect,
  onDeleteClient,
  showSelectionColumn,
}: ClientsTableRowProps) => {
  const handleRowClick = () => {
    if (client.id && onClientSelect) {
      onClientSelect(client.id);
    }
  };

  return (
    <TableRow
      className="cursor-pointer hover:bg-gray-50 transition-colors h-14"
      onClick={handleRowClick}
    >
      {/* 1. Checkbox */}
      {showSelectionColumn && (
        <TableCell className="w-12 sticky left-0 bg-white border-r border-gray-100" onClick={(e) => e.stopPropagation()}>
          <Checkbox 
            checked={client.id ? selectedClients.includes(client.id) : false}
            onCheckedChange={() => client.id && onSelectClient && onSelectClient(client.id, !selectedClients.includes(client.id))}
            aria-label={`Sélectionner ${client.name}`}
          />
        </TableCell>
      )}
      
      {/* 2. Nom & Prénom */}
      <TableCell className="font-medium text-gray-900">{client.name}</TableCell>
      
      {/* 3. Type de fiche */}
      <TableCell>
        <FicheTypeCell type={client.ficheType} />
      </TableCell>
      
      {/* 4. Statut du dossier */}
      <TableCell>
        <StatusCell status={client.status} />
      </TableCell>
      
      {/* 5. Statut de dépôt */}
      <TableCell>
        <DepositStatusCell status={client.depositStatus} />
      </TableCell>
      
      {/* 6. Nom du lot */}
      <TableCell>
        <LotNumberCell lotNumber={client.lotNumber} />
      </TableCell>
      
      {/* 7. Zone climatique (déplacée à côté du lot) */}
      <TableCell>
        <ClimateZoneCell zone={client.climateZone} />
      </TableCell>
      
      {/* 8. Communauté autonome (nouvelle colonne) */}
      <TableCell>
        <CommunityCell community={client.community} />
      </TableCell>
      
      {/* 9. Date de pose */}
      <TableCell className="text-sm text-gray-600">{formatDate(client.installationDate)}</TableCell>
      
      {/* 10. Surface isolée */}
      <TableCell className={`text-right ${Number(client.isolatedArea) >= 80 ? 'font-medium' : ''}`}>
        {client.isolatedArea} m²
      </TableCell>
      
      {/* 11. Type isolation */}
      <TableCell>
        <IsolationTypeCell type={client.isolationType} />
      </TableCell>
      
      {/* 12. Type plancher */}
      <TableCell>
        <FloorTypeCell type={client.floorType} />
      </TableCell>
      
      {/* 13. Actions */}
      <TableCell className="text-right">
        <ClientActionsCell 
          clientId={client.id} 
          onClientSelect={onClientSelect} 
          onDeleteClient={onDeleteClient} 
        />
      </TableCell>
    </TableRow>
  );
};

export default ClientsTableRow;

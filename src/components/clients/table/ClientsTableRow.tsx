
import { Client } from '@/services/api/types';
import { Badge } from '@/components/ui/badge';
import { 
  TableRow, 
  TableCell 
} from '@/components/ui/table';
import { 
  MoreHorizontal, 
  Edit, 
  Trash2,
  Eye,
  Circle,
  CheckCircle
} from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';

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
  // Fonction pour formater la date au format JJ/MM/AAAA
  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR');
  };

  // Fonction pour déterminer la variante du badge selon le statut
  const getStatusVariant = (status?: string) => {
    switch (status) {
      case 'En cours': return 'outline';
      case 'Prêt à déposer': return 'secondary';
      case 'Déposé': return 'default';
      case 'Validé': return 'success';
      case 'Rejeté': return 'destructive';
      case 'Blocage': return 'destructive';
      default: return 'outline';
    }
  };

  // Fonction pour déterminer la variante du badge selon le statut de dépôt
  const getDepositVariant = (status?: string) => {
    switch (status) {
      case 'Non déposé': return 'outline';
      case 'Déposé': return 'default';
      case 'Accepté': return 'success';
      case 'Rejeté': return 'destructive';
      default: return 'outline';
    }
  };

  // Fonction pour déterminer la variante du badge selon le type de fiche
  const getFicheTypeVariant = (type?: string) => {
    return type === 'RES010' ? 'secondary' : 'outline';
  };

  // Fonction pour déterminer le type d'icône selon le type d'isolation
  const getIsolationTypeIcon = (type?: string) => {
    return type === 'Combles' ? '🧱' : '🏠';
  };
  
  // Fonction pour déterminer le type d'icône selon le type de plancher
  const getFloorTypeIcon = (type?: string) => {
    return type === 'Bois' ? '🪵' : '🧱';
  };

  // Fonction pour afficher le statut du dossier avec un point coloré
  const getStatusDot = (status?: string) => {
    switch (status) {
      case 'En cours': 
        return <Circle className="h-2 w-2 text-blue-400 fill-blue-400 mr-1.5" />;
      case 'Prêt à déposer': 
        return <Circle className="h-2 w-2 text-amber-400 fill-amber-400 mr-1.5" />;
      case 'Déposé': 
        return <Circle className="h-2 w-2 text-indigo-400 fill-indigo-400 mr-1.5" />;
      case 'Validé': 
        return <CheckCircle className="h-2 w-2 text-green-500 fill-green-500 mr-1.5" />;
      case 'Rejeté': 
      case 'Blocage': 
        return <Circle className="h-2 w-2 text-red-400 fill-red-400 mr-1.5" />;
      default: 
        return <Circle className="h-2 w-2 text-gray-300 fill-gray-300 mr-1.5" />;
    }
  };

  const handleRowClick = () => {
    if (client.id && onClientSelect) {
      onClientSelect(client.id);
    }
  };

  const handleClientSelect = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onSelectClient && client.id) {
      const isSelected = client.id && selectedClients.includes(client.id);
      onSelectClient(client.id, !isSelected);
    }
  };

  const handleDeleteClient = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce client ?")) {
      try {
        if (onDeleteClient && client.id) {
          await onDeleteClient(client.id);
        }
      } catch (error) {
        console.error("Erreur lors de la suppression du client:", error);
      }
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
        <Badge variant={getFicheTypeVariant(client.ficheType)} className="font-normal bg-opacity-20">
          {client.ficheType || 'RES010'}
        </Badge>
      </TableCell>
      
      {/* 4. Statut du dossier */}
      <TableCell>
        <div className="flex items-center">
          {getStatusDot(client.status)}
          <span className="text-sm">{client.status || 'En cours'}</span>
        </div>
      </TableCell>
      
      {/* 5. Statut de dépôt */}
      <TableCell>
        <Badge variant={getDepositVariant(client.depositStatus)} className="bg-opacity-20 font-normal">
          {client.depositStatus || 'Non déposé'}
        </Badge>
      </TableCell>
      
      {/* 6. Nom du lot */}
      <TableCell>
        {client.lotNumber ? (
          <span className="text-blue-600 hover:underline cursor-pointer">
            {client.lotNumber}
          </span>
        ) : (
          <span className="text-gray-400 text-sm">Non assigné</span>
        )}
      </TableCell>
      
      {/* 7. Date de pose */}
      <TableCell className="text-sm text-gray-600">{formatDate(client.installationDate)}</TableCell>
      
      {/* 8. Surface isolée */}
      <TableCell className={`text-right ${Number(client.isolatedArea) >= 80 ? 'font-medium' : ''}`}>
        {client.isolatedArea} m²
      </TableCell>
      
      {/* 9. Type isolation */}
      <TableCell>
        <span className="flex items-center">
          <span className="mr-1">{getIsolationTypeIcon(client.isolationType)}</span>
          <span className="text-sm text-gray-600">{client.isolationType || 'Combles'}</span>
        </span>
      </TableCell>
      
      {/* 10. Type plancher */}
      <TableCell>
        <span className="flex items-center">
          <span className="mr-1">{getFloorTypeIcon(client.floorType)}</span>
          <span className="text-sm text-gray-600">{client.floorType || 'Bois'}</span>
        </span>
      </TableCell>
      
      {/* 11. Zone climatique */}
      <TableCell>
        <Badge variant="outline" className="py-0 px-2 text-xs bg-gray-50">
          {client.climateZone || 'C'}
        </Badge>
      </TableCell>
      
      {/* 12. Actions */}
      <TableCell className="text-right">
        <DropdownMenu>
          <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-white z-50">
            <DropdownMenuItem 
              className="flex items-center cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                client.id && onClientSelect && onClientSelect(client.id);
              }}
            >
              <Eye className="mr-2 h-4 w-4" />
              <span>Voir détails</span>
            </DropdownMenuItem>
            <DropdownMenuItem 
              className="flex items-center cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                // Actions d'édition à implémenter
              }}
            >
              <Edit className="mr-2 h-4 w-4" />
              <span>Modifier</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="flex items-center text-red-600 cursor-pointer"
              onClick={handleDeleteClient}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              <span>Supprimer</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
};

export default ClientsTableRow;

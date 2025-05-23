
import { useState, useMemo } from 'react';
import type { Client } from '@/services/api/types';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  MoreHorizontal, 
  Edit, 
  Trash2, 
  Search, 
  Filter, 
  Eye,
  Circle,
  CheckCircle,
  Loader2
} from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';

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
  const displayClients = filteredClients ?? clients;
  const allSelected = displayClients.length > 0 && selectedClients.length === displayClients.length;

  // Column filtering state
  const [columnFilters, setColumnFilters] = useState<{
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
  }>({
    name: '',
    ficheType: '',
    status: '',
    depositStatus: '',
    lotNumber: '',
    installationDate: '',
    isolatedArea: '',
    isolationType: '',
    floorType: '',
    climateZone: '',
  });

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

  const handleSelectAll = () => {
    if (onSelectAll) {
      onSelectAll(!allSelected);
    }
  };

  const handleRowClick = (clientId: string) => {
    if (clientId && onClientSelect) {
      onClientSelect(clientId);
    }
  };

  const handleClientSelect = (e: React.MouseEvent, clientId: string) => {
    e.stopPropagation();
    if (onSelectClient) {
      const isSelected = selectedClients.includes(clientId);
      onSelectClient(clientId, !isSelected);
    }
  };

  const handleDeleteClient = async (e: React.MouseEvent, clientId: string) => {
    e.stopPropagation();
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce client ?")) {
      try {
        if (onDeleteClient) {
          await onDeleteClient(clientId);
        }
      } catch (error) {
        console.error("Erreur lors de la suppression du client:", error);
      }
    }
  };

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

  // Fix for TypeScript errors: Filter out undefined values
  const uniqueFicheTypes = [...new Set(clients.map(client => client.ficheType).filter(Boolean) as string[])];
  const uniqueStatuses = [...new Set(clients.map(client => client.status).filter(Boolean) as string[])];
  const uniqueDepositStatuses = [...new Set(clients.map(client => client.depositStatus).filter(Boolean) as string[])];
  const uniqueLots = [...new Set(clients.map(client => client.lotNumber).filter(Boolean) as string[])];
  const uniqueIsolationTypes = [...new Set(clients.map(client => client.isolationType).filter(Boolean) as string[])];
  const uniqueFloorTypes = [...new Set(clients.map(client => client.floorType).filter(Boolean) as string[])];
  const uniqueClimateZones = [...new Set(clients.map(client => client.climateZone).filter(Boolean) as string[])];

  // Create Column Filter Dropdown
  const ColumnFilterDropdown = ({ 
    title, 
    options, 
    filterKey 
  }: { 
    title: string; 
    options: string[]; 
    filterKey: keyof typeof columnFilters;
  }) => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className="data-[state=open]:bg-gray-100">
        <Button variant="ghost" size="sm" className="h-7 px-2 flex gap-1 items-center">
          <Filter className="h-3.5 w-3.5 text-gray-400" />
          <span className="text-sm">{columnFilters[filterKey] || title}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="bg-white shadow-lg border rounded-md w-52 z-50">
        <div className="p-2">
          <Input
            placeholder="Filtrer..."
            className="h-8 text-xs"
            value={columnFilters[filterKey]}
            onChange={(e) => setColumnFilters({...columnFilters, [filterKey]: e.target.value})}
          />
        </div>
        <DropdownMenuSeparator />
        {options.map(option => (
          <DropdownMenuItem
            key={option}
            onClick={() => setColumnFilters({...columnFilters, [filterKey]: option})}
            className="cursor-pointer text-sm flex items-center justify-between"
          >
            {option}
            {columnFilters[filterKey] === option && (
              <span className="ml-2 h-4 w-4 text-green-600">•</span>
            )}
          </DropdownMenuItem>
        ))}
        {columnFilters[filterKey] && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              onClick={() => setColumnFilters({...columnFilters, [filterKey]: ''})}
              className="cursor-pointer text-sm text-red-600"
            >
              Effacer le filtre
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
  
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
  
  return (
    <div className="rounded-md border border-gray-200 shadow-sm bg-white overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50 border-b border-gray-200">
              {/* 1. Checkbox for bulk actions */}
              {onSelectClient && (
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
                      onChange={(e) => setColumnFilters({...columnFilters, name: e.target.value})}
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
                    onChange={(e) => setColumnFilters({...columnFilters, installationDate: e.target.value})}
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
                    onChange={(e) => setColumnFilters({...columnFilters, isolatedArea: e.target.value})}
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
                  />
                </div>
              </TableHead>
              
              {/* 12. Actions */}
              <TableHead className="text-right w-20">
                <span className="text-xs font-semibold text-gray-700">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={onSelectClient ? 12 : 11} className="text-center py-10">
                  <div className="flex justify-center items-center">
                    <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                    <span className="ml-2 text-gray-500">Chargement des clients...</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : filteredByColumns.length === 0 ? (
              <TableRow>
                <TableCell colSpan={onSelectClient ? 12 : 11} className="text-center py-10">
                  <p className="text-gray-500">Aucun client trouvé</p>
                  {searchTerm ? (
                    <p className="text-sm text-gray-400 mt-1">
                      Essayez avec un autre terme de recherche
                    </p>
                  ) : (
                    <Button variant="outline" className="mt-4" onClick={() => onOpenCreateDialog?.()}>
                      <span>Ajouter un client</span>
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ) : (
              filteredByColumns.map((client) => (
                <TableRow
                  key={client.id}
                  className="cursor-pointer hover:bg-gray-50 transition-colors h-14"
                  onClick={() => client.id && handleRowClick(client.id)}
                >
                  {/* 1. Checkbox */}
                  {onSelectClient && (
                    <TableCell className="w-12 sticky left-0 bg-white border-r border-gray-100" onClick={(e) => e.stopPropagation()}>
                      <Checkbox 
                        checked={client.id ? selectedClients.includes(client.id) : false}
                        onCheckedChange={() => client.id && onSelectClient(client.id, !selectedClients.includes(client.id))}
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
                            client.id && handleRowClick(client.id);
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
                          onClick={(e) => {
                            client.id && handleDeleteClient(e, client.id);
                          }}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          <span>Supprimer</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default ClientsTable;

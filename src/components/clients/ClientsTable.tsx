
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
  UserPlus, 
  Loader2, 
  ChevronDown, 
  Search, 
  Filter, 
  Eye 
} from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/components/ui/use-toast';
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
  const { toast } = useToast();
  const displayClients = filteredClients ?? clients;
  const allSelected = displayClients.length > 0 && selectedClients.length === displayClients.length;

  // Column filtering state
  const [columnFilters, setColumnFilters] = useState<{
    name: string;
    email: string;
    phone: string;
    postalCode: string;
    ficheType: string;
    climateZone: string;
    status: string;
    depositStatus: string;
    isolationType: string;
    floorType: string;
  }>({
    name: '',
    email: '',
    phone: '',
    postalCode: '',
    ficheType: '',
    climateZone: '',
    status: '',
    depositStatus: '',
    isolationType: '',
    floorType: '',
  });

  // Apply column filters to already filtered clients
  const filteredByColumns = useMemo(() => {
    return displayClients.filter(client => {
      return (
        (!columnFilters.name || (client.name?.toLowerCase().includes(columnFilters.name.toLowerCase()))) &&
        (!columnFilters.email || (client.email?.toLowerCase().includes(columnFilters.email.toLowerCase()))) &&
        (!columnFilters.phone || (client.phone?.includes(columnFilters.phone))) &&
        (!columnFilters.postalCode || (client.postalCode?.includes(columnFilters.postalCode))) &&
        (!columnFilters.ficheType || client.ficheType === columnFilters.ficheType) &&
        (!columnFilters.climateZone || client.climateZone === columnFilters.climateZone) &&
        (!columnFilters.status || client.status === columnFilters.status) &&
        (!columnFilters.depositStatus || client.depositStatus === columnFilters.depositStatus) &&
        (!columnFilters.isolationType || client.isolationType === columnFilters.isolationType) &&
        (!columnFilters.floorType || client.floorType === columnFilters.floorType)
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
        toast({
          title: "Erreur",
          description: "Une erreur est survenue lors de la suppression du client",
          variant: "destructive"
        });
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

  // Unique values for dropdowns
  const uniqueFicheTypes = [...new Set(clients.map(client => client.ficheType).filter(Boolean))];
  const uniqueClimateZones = [...new Set(clients.map(client => client.climateZone).filter(Boolean))];
  const uniqueStatuses = [...new Set(clients.map(client => client.status).filter(Boolean))];
  const uniqueDepositStatuses = [...new Set(clients.map(client => client.depositStatus).filter(Boolean))];
  const uniqueIsolationTypes = [...new Set(clients.map(client => client.isolationType).filter(Boolean))];
  const uniqueFloorTypes = [...new Set(clients.map(client => client.floorType).filter(Boolean))];

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
          <Filter className="h-3.5 w-3.5 text-gray-500" />
          <span>{columnFilters[filterKey] || title}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="bg-white shadow-lg border rounded-md w-52">
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

  return (
    <div className="rounded-lg border shadow-sm bg-white overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              {onSelectClient && (
                <TableHead className="w-12">
                  <Checkbox 
                    checked={allSelected}
                    onCheckedChange={handleSelectAll}
                    aria-label="Sélectionner tous les clients"
                  />
                </TableHead>
              )}
              <TableHead>
                <div className="flex flex-col gap-1">
                  <span>Nom</span>
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
              <TableHead>
                <div className="flex flex-col gap-1">
                  <span>Email</span>
                  <div>
                    <Input 
                      placeholder="Filtrer par email..."
                      className="h-7 text-xs"
                      value={columnFilters.email}
                      onChange={(e) => setColumnFilters({...columnFilters, email: e.target.value})}
                    />
                  </div>
                </div>
              </TableHead>
              <TableHead>
                <div className="flex flex-col gap-1">
                  <span>Téléphone</span>
                  <div>
                    <Input 
                      placeholder="Filtrer par tél..."
                      className="h-7 text-xs"
                      value={columnFilters.phone}
                      onChange={(e) => setColumnFilters({...columnFilters, phone: e.target.value})}
                    />
                  </div>
                </div>
              </TableHead>
              <TableHead>
                <div className="flex flex-col gap-1">
                  <span>Code postal</span>
                  <div>
                    <Input 
                      placeholder="CP..."
                      className="h-7 text-xs"
                      value={columnFilters.postalCode}
                      onChange={(e) => setColumnFilters({...columnFilters, postalCode: e.target.value})}
                    />
                  </div>
                </div>
              </TableHead>
              <TableHead>
                <div className="flex flex-col gap-1">
                  <span>Type de fiche</span>
                  <ColumnFilterDropdown 
                    title="Type" 
                    options={uniqueFicheTypes} 
                    filterKey="ficheType" 
                  />
                </div>
              </TableHead>
              <TableHead>
                <div className="flex flex-col gap-1">
                  <span>Zone climat.</span>
                  <ColumnFilterDropdown 
                    title="Zone" 
                    options={uniqueClimateZones} 
                    filterKey="climateZone" 
                  />
                </div>
              </TableHead>
              <TableHead>Surface (m²)</TableHead>
              <TableHead>
                <div className="flex flex-col gap-1">
                  <span>Type isolation</span>
                  <ColumnFilterDropdown 
                    title="Isolation" 
                    options={uniqueIsolationTypes} 
                    filterKey="isolationType" 
                  />
                </div>
              </TableHead>
              <TableHead>
                <div className="flex flex-col gap-1">
                  <span>Type plancher</span>
                  <ColumnFilterDropdown 
                    title="Plancher" 
                    options={uniqueFloorTypes} 
                    filterKey="floorType" 
                  />
                </div>
              </TableHead>
              <TableHead>
                <div className="flex flex-col gap-1">
                  <span>Statut dossier</span>
                  <ColumnFilterDropdown 
                    title="Statut" 
                    options={uniqueStatuses} 
                    filterKey="status" 
                  />
                </div>
              </TableHead>
              <TableHead>Date de pose</TableHead>
              <TableHead>Lot</TableHead>
              <TableHead>
                <div className="flex flex-col gap-1">
                  <span>Statut dépôt</span>
                  <ColumnFilterDropdown 
                    title="Dépôt" 
                    options={uniqueDepositStatuses} 
                    filterKey="depositStatus" 
                  />
                </div>
              </TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={onSelectClient ? 15 : 14} className="text-center py-10">
                  <div className="flex justify-center items-center">
                    <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                    <span className="ml-2 text-gray-500">Chargement des clients...</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : filteredByColumns.length === 0 ? (
              <TableRow>
                <TableCell colSpan={onSelectClient ? 15 : 14} className="text-center py-10">
                  <p className="text-gray-500">Aucun client trouvé</p>
                  {searchTerm ? (
                    <p className="text-sm text-gray-400 mt-1">
                      Essayez avec un autre terme de recherche
                    </p>
                  ) : (
                    <Button variant="outline" className="mt-4" onClick={() => onOpenCreateDialog?.()}>
                      <UserPlus className="h-4 w-4 mr-2" />
                      <span>Ajouter un client</span>
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ) : (
              filteredByColumns.map((client) => (
                <TableRow
                  key={client.id}
                  className="cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => client.id && handleRowClick(client.id)}
                >
                  {onSelectClient && (
                    <TableCell className="w-12" onClick={(e) => e.stopPropagation()}>
                      <Checkbox 
                        checked={client.id ? selectedClients.includes(client.id) : false}
                        onCheckedChange={() => client.id && onSelectClient(client.id, !selectedClients.includes(client.id))}
                        aria-label={`Sélectionner ${client.name}`}
                      />
                    </TableCell>
                  )}
                  <TableCell className="font-medium">{client.name}</TableCell>
                  <TableCell>{client.email}</TableCell>
                  <TableCell>{client.phone}</TableCell>
                  <TableCell>{client.postalCode}</TableCell>
                  <TableCell>
                    <Badge variant={getFicheTypeVariant(client.ficheType)}>
                      {client.ficheType || 'RES010'}
                    </Badge>
                  </TableCell>
                  <TableCell>{client.climateZone || 'C'}</TableCell>
                  <TableCell>{client.isolatedArea} m²</TableCell>
                  <TableCell>{client.isolationType || 'Combles'}</TableCell>
                  <TableCell>{client.floorType || 'Bois'}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusVariant(client.status)}>
                      {client.status || 'En cours'}
                    </Badge>
                  </TableCell>
                  <TableCell>{formatDate(client.installationDate)}</TableCell>
                  <TableCell>
                    {client.lotNumber ? `Oui - ${client.lotNumber}` : 'Non'}
                  </TableCell>
                  <TableCell>
                    <Badge variant={getDepositVariant(client.depositStatus)}>
                      {client.depositStatus || 'Non déposé'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-white">
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


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
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MoreHorizontal, Edit, Trash2, UserPlus, Loader2, Check, X } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/components/ui/use-toast';

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

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            {onSelectClient && (
              <TableHead className="w-12">
                <Checkbox 
                  checked={allSelected}
                  onCheckedChange={handleSelectAll}
                  aria-label="Sélectionner tous les clients"
                />
              </TableHead>
            )}
            <TableHead>Nom</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Téléphone</TableHead>
            <TableHead>Projets</TableHead>
            <TableHead>Statut</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={onSelectClient ? 7 : 6} className="text-center py-10">
                <div className="flex justify-center items-center">
                  <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                  <span className="ml-2 text-gray-500">Chargement des clients...</span>
                </div>
              </TableCell>
            </TableRow>
          ) : displayClients.length === 0 ? (
            <TableRow>
              <TableCell colSpan={onSelectClient ? 7 : 6} className="text-center py-10">
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
            displayClients.map((client) => (
              <TableRow
                key={client.id}
                className="cursor-pointer hover:bg-gray-50"
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
                <TableCell>{client.projects || 0}</TableCell>
                <TableCell>
                  <Badge
                    variant={
                      client.status === 'Actif' || client.status === 'Activo'
                        ? 'default'
                        : 'outline'
                    }
                  >
                    {client.status === 'Activo' ? 'Actif' : client.status || 'Actif'}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem 
                        className="flex items-center"
                        onClick={(e) => {
                          e.stopPropagation();
                          client.id && handleRowClick(client.id);
                        }}
                      >
                        <Edit className="mr-2 h-4 w-4" />
                        <span>Voir détails</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="flex items-center text-red-600"
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
  );
};

export default ClientsTable;

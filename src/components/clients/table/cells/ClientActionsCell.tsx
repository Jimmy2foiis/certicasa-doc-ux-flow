
import React from 'react';
import { 
  MoreHorizontal, 
  Edit, 
  Trash2,
  Eye 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface ClientActionsCellProps {
  clientId?: string;
  onClientSelect?: (clientId: string) => void;
  onDeleteClient?: (clientId: string) => void;
}

const ClientActionsCell = ({ 
  clientId, 
  onClientSelect, 
  onDeleteClient 
}: ClientActionsCellProps) => {
  const handleDeleteClient = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!clientId || !onDeleteClient) return;
    
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce client ?")) {
      try {
        await onDeleteClient(clientId);
      } catch (error) {
        console.error("Erreur lors de la suppression du client:", error);
      }
    }
  };

  return (
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
            clientId && onClientSelect && onClientSelect(clientId);
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
  );
};

export default ClientActionsCell;

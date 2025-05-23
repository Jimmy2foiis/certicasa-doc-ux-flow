
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { TableRow, TableCell } from "@/components/ui/table";

interface EmptyStateProps {
  loading: boolean;
  hasClients: boolean;
  searchTerm?: string;
  onOpenCreateDialog?: () => void;
  colSpan: number;
}

const EmptyState = ({
  loading,
  hasClients,
  searchTerm,
  onOpenCreateDialog,
  colSpan
}: EmptyStateProps) => {
  if (loading) {
    return (
      <TableRow>
        <TableCell colSpan={colSpan} className="text-center py-10">
          <div className="flex justify-center items-center">
            <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
            <span className="ml-2 text-gray-500">Chargement des clients...</span>
          </div>
        </TableCell>
      </TableRow>
    );
  }

  if (!hasClients) {
    return (
      <TableRow>
        <TableCell colSpan={colSpan} className="text-center py-10">
          <p className="text-gray-500">Aucun client trouvé</p>
          {searchTerm ? (
            <p className="text-sm text-gray-400 mt-1">
              Essayez avec un autre terme de recherche
            </p>
          ) : (
            <Button variant="outline" className="mt-4" onClick={onOpenCreateDialog}>
              <span>Ajouter un client</span>
            </Button>
          )}
        </TableCell>
      </TableRow>
    );
  }

  return null;
};

export default EmptyState;


import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit, Eye, Trash2 } from "lucide-react";
import { GridColDef } from "@mui/x-data-grid";
import { Client } from "@/types/clientTypes";

interface ClientsTableColumnsProps {
  onViewDetails: (client: Client) => void;
  onEditClient: (client: Client) => void;
  onDeleteConfirmation: (clientId: string) => void;
}

export const getClientsTableColumns = ({
  onViewDetails,
  onEditClient,
  onDeleteConfirmation,
}: ClientsTableColumnsProps): GridColDef[] => {
  return [
    { field: "id", headerName: "ID", width: 90 },
    { field: "name", headerName: "Nom", width: 200, editable: true },
    { field: "email", headerName: "Email", width: 200, editable: true },
    {
      field: "phone",
      headerName: "Téléphone",
      width: 150,
      editable: true,
    },
    {
      field: "type",
      headerName: "Type",
      width: 120,
      editable: true,
    },
    {
      field: "status",
      headerName: "Statut",
      width: 120,
      editable: true,
      renderCell: (params) => (
        <Badge variant="secondary">{params.value}</Badge>
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 200,
      renderCell: (params) => (
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => onViewDetails(params.row as Client)}
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => onEditClient(params.row as Client)}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="destructive"
            size="icon"
            onClick={() => onDeleteConfirmation(params.row.id || "")}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];
};

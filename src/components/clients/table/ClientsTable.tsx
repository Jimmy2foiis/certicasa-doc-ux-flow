
import { DataGrid } from "@mui/x-data-grid";
import { Client } from "@/types/clientTypes";
import { getClientsTableColumns } from "./ClientsTableColumns";

interface ClientsTableProps {
  clients: Client[];
  loading: boolean;
  onViewDetails: (client: Client) => void;
  onEditClient: (client: Client) => void;
  onDeleteConfirmation: (clientId: string) => void;
}

const ClientsTable = ({
  clients,
  loading,
  onViewDetails,
  onEditClient,
  onDeleteConfirmation,
}: ClientsTableProps) => {
  const columns = getClientsTableColumns({
    onViewDetails,
    onEditClient,
    onDeleteConfirmation,
  });

  return (
    <div style={{ height: 400, width: "100%" }}>
      <DataGrid
        rows={clients}
        columns={columns}
        loading={loading}
        getRowId={(row) => row.id || ""}
        disableRowSelectionOnClick
      />
    </div>
  );
};

export default ClientsTable;

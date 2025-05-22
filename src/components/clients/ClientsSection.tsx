
import React, { useState, useEffect, useCallback } from "react";
import { DataGrid, GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import { Client } from "@/types/clientTypes";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, Eye, Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import ClientForm from "./ClientForm";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import ClientDetails from "./ClientDetails";
import { Badge } from "@/components/ui/badge";
import { fetchClients, deleteClient } from "@/lib/api-client";

const ClientsSection = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const { toast } = useToast();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [clientToEdit, setClientToEdit] = useState<Client | null>(null);

  const columns: GridColDef[] = [
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
      renderCell: (params: GridRenderCellParams) => (
        <Badge
          variant="secondary"
        >
          {params.value}
        </Badge>
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 200,
      renderCell: (params: GridRenderCellParams<Client>) => (
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => handleViewDetails(params.row)}
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => handleEditClient(params.row)}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="destructive"
            size="icon"
            onClick={() => handleDeleteConfirmation(params.row.id || "")}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  useEffect(() => {
    loadClients();
  }, []);

  const loadClients = async () => {
    setLoading(true);
    try {
      const clientsData = await fetchClients();
      setClients(clientsData);
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de charger les clients",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (client: Client) => {
    setSelectedClient(client);
    setIsDetailsOpen(true);
  };

  const handleCloseDetails = () => {
    setIsDetailsOpen(false);
  };

  const handleEditClient = (client: Client) => {
    setClientToEdit(client);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setClientToEdit(null);
  };

  const handleDeleteConfirmation = (clientId: string) => {
    // Show a confirmation dialog or use a state to manage confirmation
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce client ?")) {
      handleDeleteClient(clientId);
    }
  };

  // In the ClientsSection component
  const handleDeleteClient = async (clientId: string): Promise<void> => {
    try {
      await deleteClient(clientId);
      toast({
        title: "Client supprimé",
        description: "Le client a été supprimé avec succès",
      });
      // Load updated clients list
      loadClients();
      // Return a resolved promise
      return Promise.resolve();
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le client",
        variant: "destructive",
      });
      // Return a rejected promise
      return Promise.reject(error);
    }
  };

  const handleClientUpdated = useCallback(() => {
    loadClients();
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Liste des Clients</h2>
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Ajouter un Client
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[625px]">
            <DialogHeader>
              <DialogTitle>{clientToEdit ? "Modifier Client" : "Ajouter un Client"}</DialogTitle>
              <DialogDescription>
                {clientToEdit ? "Modifiez les informations du client." : "Entrez les informations du nouveau client ici."}
              </DialogDescription>
            </DialogHeader>
            <ClientForm
              client={clientToEdit}
              onClientUpdated={handleClientUpdated}
              onClose={handleCloseForm}
            />
          </DialogContent>
        </Dialog>
      </div>
      <div style={{ height: 400, width: "100%" }}>
        <DataGrid
          rows={clients}
          columns={columns}
          loading={loading}
          getRowId={(row) => row.id || ""}
          disableRowSelectionOnClick
        />
      </div>

      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="sm:max-w-[625px]">
          <DialogHeader>
            <DialogTitle>Détails du Client</DialogTitle>
            <DialogDescription>
              Informations complètes sur le client sélectionné.
            </DialogDescription>
          </DialogHeader>
          <ClientDetails client={selectedClient} onClose={handleCloseDetails} />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ClientsSection;

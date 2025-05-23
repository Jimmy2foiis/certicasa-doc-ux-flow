
import { Link } from "react-router-dom";
import { Client } from "@/services/api/types";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Loader2 } from "lucide-react";

interface ClientsTableProps {
  clients: Client[];
  loading: boolean;
  selectedClients: string[];
  onSelectClient: (clientId: string, isSelected: boolean) => void;
  onSelectAll: (isSelected: boolean) => void;
}

const ClientsTable = ({
  clients,
  loading,
  selectedClients,
  onSelectClient,
  onSelectAll,
}: ClientsTableProps) => {
  const isAllSelected = clients.length > 0 && clients.every(client => 
    client.id && selectedClients.includes(client.id)
  );

  const getStatusBadge = (status?: string) => {
    if (!status) return <Badge variant="outline">Inconnu</Badge>;
    
    switch (status) {
      case "En cours":
        return <Badge variant="outline" className="bg-blue-100 text-blue-800">En cours</Badge>;
      case "Prêt à déposer":
        return <Badge variant="outline" className="bg-amber-100 text-amber-800">Prêt à déposer</Badge>;
      case "Déposé":
        return <Badge variant="outline" className="bg-purple-100 text-purple-800">Déposé</Badge>;
      case "Validé":
        return <Badge variant="success">Validé</Badge>;
      case "Rejeté":
        return <Badge variant="destructive">Rejeté</Badge>;
      case "Blocage":
        return <Badge variant="outline" className="bg-red-100 text-red-800">Blocage</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getDepositStatusBadge = (status?: string) => {
    if (!status) return <Badge variant="outline">Non défini</Badge>;
    
    switch (status) {
      case "Non déposé":
        return <Badge variant="outline" className="bg-gray-100 text-gray-800">Non déposé</Badge>;
      case "Déposé":
        return <Badge variant="outline" className="bg-blue-100 text-blue-800">Déposé</Badge>;
      case "Accepté":
        return <Badge variant="success">Accepté</Badge>;
      case "Rejeté":
        return <Badge variant="destructive">Rejeté</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getFicheTypeBadge = (type?: string) => {
    if (!type) return <Badge variant="outline">Inconnu</Badge>;
    
    switch (type) {
      case "RES010":
        return <Badge className="bg-violet-100 text-violet-800 border-violet-200">RES010</Badge>;
      case "RES020":
        return <Badge className="bg-indigo-100 text-indigo-800 border-indigo-200">RES020</Badge>;
      default:
        return <Badge variant="outline">{type}</Badge>;
    }
  };

  return (
    <div className="rounded-md border bg-white overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12">
              <Checkbox 
                checked={isAllSelected}
                onCheckedChange={(checked) => onSelectAll(!!checked)}
              />
            </TableHead>
            <TableHead>Nom complet</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Téléphone</TableHead>
            <TableHead>Code postal</TableHead>
            <TableHead>Type de fiche</TableHead>
            <TableHead>Zone climatique</TableHead>
            <TableHead>Superficie isolée (m²)</TableHead>
            <TableHead>Type d'isolation</TableHead>
            <TableHead>Type de plancher</TableHead>
            <TableHead>Statut dossier</TableHead>
            <TableHead>Date de pose</TableHead>
            <TableHead>Déposé dans un lot ?</TableHead>
            <TableHead>Statut de dépôt</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={14} className="h-24 text-center">
                <div className="flex justify-center items-center">
                  <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                  <span className="ml-2 text-gray-500">Chargement des clients...</span>
                </div>
              </TableCell>
            </TableRow>
          ) : clients.length === 0 ? (
            <TableRow>
              <TableCell colSpan={14} className="h-24 text-center text-gray-500">
                Aucun client trouvé
              </TableCell>
            </TableRow>
          ) : (
            clients.map((client) => {
              const isSelected = client.id ? selectedClients.includes(client.id) : false;
              
              return (
                <TableRow 
                  key={client.id}
                  className={isSelected ? 'bg-blue-50' : ''}
                >
                  <TableCell>
                    <Checkbox 
                      checked={isSelected}
                      onCheckedChange={(checked) => {
                        if (client.id) {
                          onSelectClient(client.id, !!checked);
                        }
                      }}
                    />
                  </TableCell>
                  <TableCell className="font-medium">
                    <Link to={`/clients/${client.id}`} className="text-blue-600 hover:underline">
                      {client.name}
                    </Link>
                  </TableCell>
                  <TableCell>{client.email || '-'}</TableCell>
                  <TableCell>{client.phone || '-'}</TableCell>
                  <TableCell>{client.postalCode || '-'}</TableCell>
                  <TableCell>{getFicheTypeBadge(client.ficheType)}</TableCell>
                  <TableCell>{client.climateZone || '-'}</TableCell>
                  <TableCell>{client.isolatedArea || '-'}</TableCell>
                  <TableCell>{client.isolationType || '-'}</TableCell>
                  <TableCell>{client.floorType || '-'}</TableCell>
                  <TableCell>{getStatusBadge(client.status)}</TableCell>
                  <TableCell>{client.installationDate || '-'}</TableCell>
                  <TableCell>
                    {client.lotNumber ? (
                      <Badge className="bg-green-100 text-green-800 border-green-200">
                        Oui - {client.lotNumber}
                      </Badge>
                    ) : (
                      <Badge variant="outline">Non</Badge>
                    )}
                  </TableCell>
                  <TableCell>{getDepositStatusBadge(client.depositStatus)}</TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>

      {/* Pagination */}
      <div className="flex items-center justify-between px-4 py-2 border-t">
        <div className="text-sm text-gray-500">
          {clients.length} résultat{clients.length !== 1 ? 's' : ''}
        </div>
        {/* La pagination sera implémentée plus tard */}
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-500">Page 1 sur 1</span>
        </div>
      </div>
    </div>
  );
};

export default ClientsTable;

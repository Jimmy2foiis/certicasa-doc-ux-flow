
import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Eye, Download } from "lucide-react";
import { formatCurrency } from "@/utils/formatters";

interface ClientInvoicesTabProps {
  selectedMonth: string;
  selectedStatuses: string[];
  searchTerm: string;
}

const ClientInvoicesTab: React.FC<ClientInvoicesTabProps> = ({
  selectedMonth,
  selectedStatuses,
  searchTerm,
}) => {
  // Données mockées pour l'exemple
  const mockInvoices = [
    {
      id: "1",
      clientName: "Jean Dupont",
      ficheType: "RES010",
      ficheNumber: "CERT-00145",
      surface: 72,
      caeKwh: 2340,
      amount: 654,
      generationDate: "2025-04-24",
      status: "generated",
    },
    {
      id: "2",
      clientName: "Marie Martin",
      ficheType: "RES020",
      ficheNumber: "CERT-00146",
      surface: 85,
      caeKwh: 2850,
      amount: 780,
      generationDate: "2025-04-23",
      status: "generated",
    },
    {
      id: "3",
      clientName: "Pierre Durand",
      ficheType: "RES010",
      ficheNumber: "CERT-00147",
      surface: 65,
      caeKwh: 2120,
      amount: 590,
      generationDate: "2025-04-22",
      status: "missing",
    },
  ];

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "generated":
        return "Générée";
      case "missing":
        return "Manquante";
      case "error":
        return "Erreur";
      default:
        return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "generated":
        return "text-green-600 bg-green-50";
      case "missing":
        return "text-orange-600 bg-orange-50";
      case "error":
        return "text-red-600 bg-red-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  return (
    <div className="space-y-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nom du client</TableHead>
            <TableHead>Type de fiche</TableHead>
            <TableHead>Numéro de fiche</TableHead>
            <TableHead className="text-right">Surface isolée</TableHead>
            <TableHead className="text-right">CAE kWh/an</TableHead>
            <TableHead className="text-right">Montant TTC</TableHead>
            <TableHead>Date de génération</TableHead>
            <TableHead>Statut</TableHead>
            <TableHead className="text-center">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {mockInvoices.map((invoice) => (
            <TableRow key={invoice.id}>
              <TableCell className="font-medium">{invoice.clientName}</TableCell>
              <TableCell>{invoice.ficheType}</TableCell>
              <TableCell>{invoice.ficheNumber}</TableCell>
              <TableCell className="text-right">{invoice.surface} m²</TableCell>
              <TableCell className="text-right font-medium">{invoice.caeKwh.toLocaleString()} kWh/an</TableCell>
              <TableCell className="text-right">{formatCurrency(invoice.amount)}</TableCell>
              <TableCell>{new Date(invoice.generationDate).toLocaleDateString("fr-FR")}</TableCell>
              <TableCell>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(invoice.status)}`}>
                  {getStatusLabel(invoice.status)}
                </span>
              </TableCell>
              <TableCell className="text-center">
                <div className="flex items-center justify-center gap-2">
                  <Button variant="ghost" size="sm">
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ClientInvoicesTab;

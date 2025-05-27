
import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Eye, Download, FileText } from "lucide-react";
import { formatCurrency } from "@/utils/formatters";

interface DelegateInvoicesTabProps {
  selectedMonth: string;
  selectedStatuses: string[];
  searchTerm: string;
}

const DelegateInvoicesTab: React.FC<DelegateInvoicesTabProps> = ({
  selectedMonth,
  selectedStatuses,
  searchTerm,
}) => {
  // Aucune donnée mockée - utilisation des vraies APIs
  const delegateInvoices: any[] = [];

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "generated":
        return "Générée";
      case "not-generated":
        return "Non générée";
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
      case "not-generated":
        return "text-orange-600 bg-orange-50";
      case "error":
        return "text-red-600 bg-red-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  if (delegateInvoices.length === 0) {
    return (
      <div className="flex items-center justify-center py-8">
        <p className="text-gray-500">Aucune facture délégataire disponible. Connectez l'API pour voir les données.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Numéro de lot</TableHead>
            <TableHead>Délégataire</TableHead>
            <TableHead className="text-center">Nombre de clients</TableHead>
            <TableHead className="text-right">CAE Total kWh/an</TableHead>
            <TableHead className="text-right">Montant total</TableHead>
            <TableHead>Date de dépôt</TableHead>
            <TableHead>Statut facture</TableHead>
            <TableHead className="text-center">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {delegateInvoices.map((invoice) => (
            <TableRow key={invoice.id}>
              <TableCell className="font-medium">{invoice.lotNumber}</TableCell>
              <TableCell>{invoice.delegate}</TableCell>
              <TableCell className="text-center">{invoice.clientCount}</TableCell>
              <TableCell className="text-right font-medium">{invoice.totalCaeKwh.toLocaleString()} kWh/an</TableCell>
              <TableCell className="text-right">{formatCurrency(invoice.totalAmount)}</TableCell>
              <TableCell>{new Date(invoice.depositDate).toLocaleDateString("fr-FR")}</TableCell>
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
                  {invoice.status === "not-generated" && (
                    <Button variant="ghost" size="sm">
                      <FileText className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default DelegateInvoicesTab;

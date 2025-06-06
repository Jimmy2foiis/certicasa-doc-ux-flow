
import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Eye, Download, RotateCcw } from "lucide-react";
import { formatCurrency } from "@/utils/formatters";

interface CreditNotesTabProps {
  selectedMonth: string;
  selectedStatuses: string[];
  searchTerm: string;
}

const CreditNotesTab: React.FC<CreditNotesTabProps> = ({
  selectedMonth,
  selectedStatuses,
  searchTerm,
}) => {
  // Aucune donnée mockée - utilisation des vraies APIs
  const creditNotes: any[] = [];

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

  if (creditNotes.length === 0) {
    return (
      <div className="flex items-center justify-center py-8">
        <p className="text-gray-500">Aucune note de crédit disponible. Connectez l'API pour voir les données.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nom du client</TableHead>
            <TableHead>Numéro fiche</TableHead>
            <TableHead className="text-right">CAE kWh/an</TableHead>
            <TableHead className="text-right">CAE global (€)</TableHead>
            <TableHead className="text-right">Montant note de crédit</TableHead>
            <TableHead>Date génération</TableHead>
            <TableHead>Statut</TableHead>
            <TableHead className="text-center">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {creditNotes.map((note) => (
            <TableRow key={note.id}>
              <TableCell className="font-medium">{note.clientName}</TableCell>
              <TableCell>{note.ficheNumber}</TableCell>
              <TableCell className="text-right font-medium">{note.caeKwh.toLocaleString()} kWh/an</TableCell>
              <TableCell className="text-right">{formatCurrency(note.caeGlobalAmount)}</TableCell>
              <TableCell className="text-right">{formatCurrency(note.creditNoteAmount)}</TableCell>
              <TableCell>{new Date(note.generationDate).toLocaleDateString("fr-FR")}</TableCell>
              <TableCell>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(note.status)}`}>
                  {getStatusLabel(note.status)}
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
                  <Button variant="ghost" size="sm">
                    <RotateCcw className="h-4 w-4" />
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

export default CreditNotesTab;

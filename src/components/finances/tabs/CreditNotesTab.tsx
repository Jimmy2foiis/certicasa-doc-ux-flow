
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
  // Données mockées pour l'exemple
  const mockCreditNotes = [
    {
      id: "1",
      clientName: "Jean Dupont",
      ficheNumber: "CERT-00145",
      caeKwh: 2340,
      caeGlobalAmount: 6540,
      creditNoteAmount: 654,
      generationDate: "2025-04-25",
      status: "generated",
    },
    {
      id: "2",
      clientName: "Marie Martin",
      ficheNumber: "CERT-00146",
      caeKwh: 2850,
      caeGlobalAmount: 7980,
      creditNoteAmount: 798,
      generationDate: "2025-04-24",
      status: "generated",
    },
    {
      id: "3",
      clientName: "Pierre Durand",
      ficheNumber: "CERT-00147",
      caeKwh: 2120,
      caeGlobalAmount: 5936,
      creditNoteAmount: 594,
      generationDate: "2025-04-23",
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
          {mockCreditNotes.map((note) => (
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

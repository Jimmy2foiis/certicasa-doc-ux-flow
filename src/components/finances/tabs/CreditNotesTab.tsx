
import React, { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import DocumentStatusBadge from "@/features/documents/DocumentStatusBadge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Eye, Download, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { formatCurrency } from "@/utils/formatters";

// Types pour les données des notes de crédit
interface CreditNote {
  id: string;
  clientName: string;
  projectNumber: string;
  caeValue: number;
  creditAmount: number;
  generationDate: string;
  status: string;
}

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
  const [selectedNotes, setSelectedNotes] = useState<string[]>([]);
  const { toast } = useToast();

  // Données mockées pour l'exemple
  const mockNotes: CreditNote[] = [
    {
      id: "note-1",
      clientName: "Jean Dupont",
      projectNumber: "CERT-00145",
      caeValue: 6540,
      creditAmount: 654,
      generationDate: "2025-05-25",
      status: "generated",
    },
    {
      id: "note-2",
      clientName: "Marie Martin",
      projectNumber: "CERT-00146",
      caeValue: 4985,
      creditAmount: 498.5,
      generationDate: "2025-05-23",
      status: "generated",
    },
    {
      id: "note-3",
      clientName: "Thomas Legrand",
      projectNumber: "CERT-00147",
      caeValue: 10800,
      creditAmount: 1080,
      generationDate: "2025-05-21",
      status: "missing",
    },
    {
      id: "note-4",
      clientName: "Sophie Petit",
      projectNumber: "CERT-00148",
      caeValue: 7650,
      creditAmount: 765,
      generationDate: "2025-05-19",
      status: "missing",
    },
  ];

  // Filtrage des notes de crédit selon les critères
  const filteredNotes = mockNotes.filter((note) => {
    const matchesMonth = note.generationDate.startsWith(selectedMonth);
    const matchesStatus =
      selectedStatuses.length === 0 || selectedStatuses.includes(note.status);
    const matchesSearch =
      searchTerm === "" ||
      note.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.projectNumber.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesMonth && matchesStatus && matchesSearch;
  });

  // Gestion de la sélection
  const handleSelectAll = (checked: boolean) => {
    setSelectedNotes(checked ? filteredNotes.map((n) => n.id) : []);
  };

  const handleSelectNote = (noteId: string, checked: boolean) => {
    if (checked) {
      setSelectedNotes([...selectedNotes, noteId]);
    } else {
      setSelectedNotes(selectedNotes.filter((id) => id !== noteId));
    }
  };

  // Actions sur les documents
  const handleViewNote = (note: CreditNote) => {
    toast({
      title: "Visualisation",
      description: `Ouverture de la note de crédit pour ${note.clientName}...`,
    });
  };

  const handleDownloadNote = (note: CreditNote) => {
    toast({
      title: "Téléchargement",
      description: `Téléchargement de la note de crédit pour ${note.clientName}...`,
    });
  };

  const handleRegenerateNote = (note: CreditNote) => {
    toast({
      title: "Régénération",
      description: `Régénération de la note de crédit pour ${note.clientName}...`,
    });
  };

  return (
    <div className="space-y-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-10">
              <Checkbox
                checked={
                  filteredNotes.length > 0 &&
                  selectedNotes.length === filteredNotes.length
                }
                onCheckedChange={handleSelectAll}
              />
            </TableHead>
            <TableHead>Nom du client</TableHead>
            <TableHead>Numéro fiche</TableHead>
            <TableHead className="text-right">CAE global (€)</TableHead>
            <TableHead className="text-right">Montant note de crédit</TableHead>
            <TableHead>Date génération</TableHead>
            <TableHead>Statut</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredNotes.length > 0 ? (
            filteredNotes.map((note) => (
              <TableRow key={note.id}>
                <TableCell>
                  <Checkbox
                    checked={selectedNotes.includes(note.id)}
                    onCheckedChange={(checked) =>
                      handleSelectNote(note.id, checked as boolean)
                    }
                  />
                </TableCell>
                <TableCell className="font-medium">{note.clientName}</TableCell>
                <TableCell>{note.projectNumber}</TableCell>
                <TableCell className="text-right">{formatCurrency(note.caeValue)}</TableCell>
                <TableCell className="text-right">{formatCurrency(note.creditAmount)}</TableCell>
                <TableCell>
                  {new Date(note.generationDate).toLocaleDateString("fr-FR")}
                </TableCell>
                <TableCell>
                  <DocumentStatusBadge
                    status={note.status as any}
                    customLabel={
                      note.status === "generated"
                        ? "Générée"
                        : "Manquante"
                    }
                  />
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end space-x-2">
                    {note.status === "generated" ? (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewNote(note)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDownloadNote(note)}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                      </>
                    ) : null}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleRegenerateNote(note)}
                    >
                      <RefreshCw className="h-4 w-4" />
                      {note.status === "generated" ? "" : " Générer"}
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={8} className="text-center py-8">
                <p className="text-gray-500">Aucune note de crédit trouvée pour cette période</p>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {filteredNotes.length > 0 && (
        <div className="flex justify-between items-center pt-4">
          <div className="text-sm text-gray-500">
            {selectedNotes.length} sur {filteredNotes.length} notes de crédit sélectionnées
          </div>
          <Button
            variant="outline"
            disabled={selectedNotes.length === 0}
            onClick={() => {
              toast({
                title: "Export groupé",
                description: `Téléchargement de ${selectedNotes.length} notes de crédit...`,
              });
            }}
          >
            <Download className="h-4 w-4 mr-2" />
            Télécharger la sélection
          </Button>
        </div>
      )}
    </div>
  );
};

export default CreditNotesTab;

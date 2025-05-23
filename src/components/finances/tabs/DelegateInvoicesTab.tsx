
import React, { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import DocumentStatusBadge from "@/features/documents/DocumentStatusBadge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Eye, Download, FileText, FileUp } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { formatCurrency } from "@/utils/formatters";

// Types pour les données des factures délégataires
interface DelegateInvoice {
  id: string;
  lotNumber: string;
  delegateName: string;
  clientCount: number;
  totalAmount: number;
  depositDate: string;
  status: string;
}

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
  const [selectedInvoices, setSelectedInvoices] = useState<string[]>([]);
  const { toast } = useToast();

  // Données mockées pour l'exemple
  const mockInvoices: DelegateInvoice[] = [
    {
      id: "delegate-1",
      lotNumber: "LOT-42",
      delegateName: "SOLATEC",
      clientCount: 7,
      totalAmount: 4354,
      depositDate: "2025-04-18",
      status: "generated",
    },
    {
      id: "delegate-2",
      lotNumber: "LOT-43",
      delegateName: "ISOCONFORT",
      clientCount: 12,
      totalAmount: 7890,
      depositDate: "2025-04-25",
      status: "not-generated",
    },
    {
      id: "delegate-3",
      lotNumber: "LOT-44",
      delegateName: "SOLATEC",
      clientCount: 5,
      totalAmount: 3450,
      depositDate: "2025-05-10",
      status: "generated",
    },
    {
      id: "delegate-4",
      lotNumber: "LOT-45",
      delegateName: "THERMIBLOC",
      clientCount: 9,
      totalAmount: 5670,
      depositDate: "2025-05-15",
      status: "generated",
    },
  ];

  // Filtrage des factures selon les critères
  const filteredInvoices = mockInvoices.filter((invoice) => {
    const matchesMonth = invoice.depositDate.startsWith(selectedMonth);
    const matchesStatus =
      selectedStatuses.length === 0 || selectedStatuses.includes(invoice.status);
    const matchesSearch =
      searchTerm === "" ||
      invoice.delegateName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.lotNumber.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesMonth && matchesStatus && matchesSearch;
  });

  // Gestion de la sélection
  const handleSelectAll = (checked: boolean) => {
    setSelectedInvoices(checked ? filteredInvoices.map((i) => i.id) : []);
  };

  const handleSelectInvoice = (invoiceId: string, checked: boolean) => {
    if (checked) {
      setSelectedInvoices([...selectedInvoices, invoiceId]);
    } else {
      setSelectedInvoices(selectedInvoices.filter((id) => id !== invoiceId));
    }
  };

  // Actions sur les documents
  const handleViewInvoice = (invoice: DelegateInvoice) => {
    toast({
      title: "Visualisation",
      description: `Ouverture de la facture ${invoice.lotNumber} pour ${invoice.delegateName}...`,
    });
  };

  const handleDownloadInvoice = (invoice: DelegateInvoice) => {
    toast({
      title: "Téléchargement",
      description: `Téléchargement de la facture ${invoice.lotNumber} pour ${invoice.delegateName}...`,
    });
  };

  const handleGenerateInvoice = (invoice: DelegateInvoice) => {
    toast({
      title: "Génération",
      description: `Génération de la facture pour le lot ${invoice.lotNumber}...`,
    });
  };

  const handleExportLotDetails = (invoice: DelegateInvoice) => {
    toast({
      title: "Export Excel",
      description: `Export des détails du lot ${invoice.lotNumber} (${invoice.clientCount} clients)...`,
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
                  filteredInvoices.length > 0 &&
                  selectedInvoices.length === filteredInvoices.length
                }
                onCheckedChange={handleSelectAll}
              />
            </TableHead>
            <TableHead>Numéro de lot</TableHead>
            <TableHead>Délégataire</TableHead>
            <TableHead className="text-center">Nombre de clients</TableHead>
            <TableHead className="text-right">Montant total</TableHead>
            <TableHead>Date de dépôt</TableHead>
            <TableHead>Statut facture</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredInvoices.length > 0 ? (
            filteredInvoices.map((invoice) => (
              <TableRow key={invoice.id}>
                <TableCell>
                  <Checkbox
                    checked={selectedInvoices.includes(invoice.id)}
                    onCheckedChange={(checked) =>
                      handleSelectInvoice(invoice.id, checked as boolean)
                    }
                  />
                </TableCell>
                <TableCell className="font-medium">{invoice.lotNumber}</TableCell>
                <TableCell>{invoice.delegateName}</TableCell>
                <TableCell className="text-center">{invoice.clientCount}</TableCell>
                <TableCell className="text-right">{formatCurrency(invoice.totalAmount)}</TableCell>
                <TableCell>
                  {new Date(invoice.depositDate).toLocaleDateString("fr-FR")}
                </TableCell>
                <TableCell>
                  <DocumentStatusBadge
                    status={invoice.status as any}
                    customLabel={
                      invoice.status === "generated"
                        ? "Générée"
                        : "Non générée"
                    }
                  />
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end space-x-2">
                    {invoice.status === "generated" ? (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewInvoice(invoice)}
                          title="Voir"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDownloadInvoice(invoice)}
                          title="Télécharger"
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleExportLotDetails(invoice)}
                          title="Exporter détails lot"
                        >
                          <FileText className="h-4 w-4" />
                        </Button>
                      </>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleGenerateInvoice(invoice)}
                        title="Générer facture"
                      >
                        <FileUp className="h-4 w-4 mr-1" />
                        Générer
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={8} className="text-center py-8">
                <p className="text-gray-500">Aucune facture délégataire trouvée pour cette période</p>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {filteredInvoices.length > 0 && (
        <div className="flex justify-between items-center pt-4">
          <div className="text-sm text-gray-500">
            {selectedInvoices.length} sur {filteredInvoices.length} factures délégataires sélectionnées
          </div>
          <Button
            variant="outline"
            disabled={selectedInvoices.length === 0}
            onClick={() => {
              toast({
                title: "Export groupé",
                description: `Téléchargement de ${selectedInvoices.length} factures...`,
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

export default DelegateInvoicesTab;

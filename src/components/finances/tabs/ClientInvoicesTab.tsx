
import React, { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import DocumentStatusBadge from "@/features/documents/DocumentStatusBadge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Eye, Download, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { formatCurrency } from "@/utils/formatters";

// Types pour les données des factures
interface ClientInvoice {
  id: string;
  clientName: string;
  projectType: string;
  projectNumber: string;
  surface: number;
  totalAmount: number;
  generationDate: string;
  status: string;
}

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
  const [selectedInvoices, setSelectedInvoices] = useState<string[]>([]);
  const { toast } = useToast();

  // Données mockées pour l'exemple
  const mockInvoices: ClientInvoice[] = [
    {
      id: "invoice-1",
      clientName: "Jean Dupont",
      projectType: "RES020",
      projectNumber: "CERT-00145",
      surface: 72,
      totalAmount: 654,
      generationDate: "2025-05-24",
      status: "generated",
    },
    {
      id: "invoice-2",
      clientName: "Marie Martin",
      projectType: "RES010",
      projectNumber: "CERT-00146",
      surface: 55,
      totalAmount: 498.5,
      generationDate: "2025-05-22",
      status: "generated",
    },
    {
      id: "invoice-3",
      clientName: "Thomas Legrand",
      projectType: "RES020",
      projectNumber: "CERT-00147",
      surface: 120,
      totalAmount: 1080,
      generationDate: "2025-05-20",
      status: "error",
    },
    {
      id: "invoice-4",
      clientName: "Sophie Petit",
      projectType: "RES010",
      projectNumber: "CERT-00148",
      surface: 85,
      totalAmount: 765,
      generationDate: "2025-05-18",
      status: "missing",
    },
  ];

  // Filtrage des factures selon les critères
  const filteredInvoices = mockInvoices.filter((invoice) => {
    const matchesMonth = invoice.generationDate.startsWith(selectedMonth);
    const matchesStatus =
      selectedStatuses.length === 0 || selectedStatuses.includes(invoice.status);
    const matchesSearch =
      searchTerm === "" ||
      invoice.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.projectNumber.toLowerCase().includes(searchTerm.toLowerCase());

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
  const handleViewInvoice = (invoice: ClientInvoice) => {
    toast({
      title: "Visualisation",
      description: `Ouverture de la facture de ${invoice.clientName}...`,
    });
  };

  const handleDownloadInvoice = (invoice: ClientInvoice) => {
    toast({
      title: "Téléchargement",
      description: `Téléchargement de la facture de ${invoice.clientName}...`,
    });
  };

  const handleRegenerateInvoice = (invoice: ClientInvoice) => {
    toast({
      title: "Régénération",
      description: `Régénération de la facture de ${invoice.clientName}...`,
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
            <TableHead>Nom du client</TableHead>
            <TableHead>Type de fiche</TableHead>
            <TableHead>Numéro de fiche</TableHead>
            <TableHead>Surface isolée</TableHead>
            <TableHead className="text-right">Montant TTC</TableHead>
            <TableHead>Date de génération</TableHead>
            <TableHead>Statut</TableHead>
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
                <TableCell className="font-medium">{invoice.clientName}</TableCell>
                <TableCell>{invoice.projectType}</TableCell>
                <TableCell>{invoice.projectNumber}</TableCell>
                <TableCell>{invoice.surface} m²</TableCell>
                <TableCell className="text-right">{formatCurrency(invoice.totalAmount)}</TableCell>
                <TableCell>
                  {new Date(invoice.generationDate).toLocaleDateString("fr-FR")}
                </TableCell>
                <TableCell>
                  <DocumentStatusBadge
                    status={invoice.status as any}
                    customLabel={
                      invoice.status === "generated"
                        ? "Générée"
                        : invoice.status === "missing"
                        ? "Manquante"
                        : "Erreur"
                    }
                  />
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end space-x-2">
                    {invoice.status === "generated" && (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewInvoice(invoice)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDownloadInvoice(invoice)}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleRegenerateInvoice(invoice)}
                    >
                      <RefreshCw className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={9} className="text-center py-8">
                <p className="text-gray-500">Aucune facture client trouvée pour cette période</p>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {filteredInvoices.length > 0 && (
        <div className="flex justify-between items-center pt-4">
          <div className="text-sm text-gray-500">
            {selectedInvoices.length} sur {filteredInvoices.length} factures sélectionnées
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

export default ClientInvoicesTab;

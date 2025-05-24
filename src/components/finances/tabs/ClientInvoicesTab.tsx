
import React, { useState, useMemo } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Eye, Download, RotateCcw } from "lucide-react";
import { formatCurrency } from "@/utils/formatters";
import { useToast } from "@/hooks/use-toast";
import InvoicePreviewModal from "../modals/InvoicePreviewModal";

interface ClientInvoicesTabProps {
  selectedMonth: string;
  selectedStatuses: string[];
  searchTerm: string;
}

interface Invoice {
  id: string;
  clientName: string;
  ficheType: string;
  ficheNumber: string;
  surface: number;
  caeKwh: number;
  amount: number;
  generationDate: string;
  status: string;
}

const ClientInvoicesTab: React.FC<ClientInvoicesTabProps> = ({
  selectedMonth,
  selectedStatuses,
  searchTerm,
}) => {
  const [selectedInvoices, setSelectedInvoices] = useState<string[]>([]);
  const [previewInvoice, setPreviewInvoice] = useState<Invoice | null>(null);
  const { toast } = useToast();

  // Données mockées pour l'exemple
  const mockInvoices: Invoice[] = [
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
    {
      id: "4",
      clientName: "Sophie Bernard",
      ficheType: "RES020",
      ficheNumber: "CERT-00148",
      surface: 95,
      caeKwh: 3100,
      amount: 850,
      generationDate: "2025-04-21",
      status: "error",
    },
  ];

  // Filtrage des factures
  const filteredInvoices = useMemo(() => {
    return mockInvoices.filter((invoice) => {
      // Filtre par mois
      const invoiceMonth = invoice.generationDate.slice(0, 7);
      if (selectedMonth && invoiceMonth !== selectedMonth) return false;

      // Filtre par statut
      if (selectedStatuses.length > 0 && !selectedStatuses.includes(invoice.status)) return false;

      // Filtre par recherche
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        return (
          invoice.clientName.toLowerCase().includes(searchLower) ||
          invoice.ficheNumber.toLowerCase().includes(searchLower)
        );
      }

      return true;
    });
  }, [mockInvoices, selectedMonth, selectedStatuses, searchTerm]);

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

  const handleSelectInvoice = (invoiceId: string) => {
    setSelectedInvoices(prev => 
      prev.includes(invoiceId) 
        ? prev.filter(id => id !== invoiceId)
        : [...prev, invoiceId]
    );
  };

  const handleSelectAll = () => {
    if (selectedInvoices.length === filteredInvoices.length) {
      setSelectedInvoices([]);
    } else {
      setSelectedInvoices(filteredInvoices.map(invoice => invoice.id));
    }
  };

  const handleViewInvoice = (invoice: Invoice) => {
    if (invoice.status === "generated") {
      setPreviewInvoice(invoice);
    } else {
      toast({
        title: "Facture indisponible",
        description: "Cette facture n'est pas encore générée.",
        variant: "destructive",
      });
    }
  };

  const handleDownloadInvoice = (invoice: Invoice) => {
    if (invoice.status === "generated") {
      toast({
        title: "Téléchargement en cours",
        description: `Téléchargement de la facture ${invoice.ficheNumber}...`,
      });
      // Logique de téléchargement à implémenter
    } else {
      toast({
        title: "Téléchargement impossible",
        description: "Cette facture n'est pas disponible au téléchargement.",
        variant: "destructive",
      });
    }
  };

  const handleRegenerateInvoice = (invoice: Invoice) => {
    toast({
      title: "Régénération en cours",
      description: `Régénération de la facture ${invoice.ficheNumber}...`,
    });
    // Logique de régénération à implémenter
  };

  const handleDownloadSelected = () => {
    if (selectedInvoices.length === 0) {
      toast({
        title: "Aucune sélection",
        description: "Veuillez sélectionner au moins une facture.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Export en cours",
      description: `Préparation de l'export de ${selectedInvoices.length} facture(s)...`,
    });
    // Logique d'export multiple à implémenter
  };

  const isActionDisabled = (status: string) => {
    return status === "missing" || status === "error";
  };

  return (
    <div className="space-y-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12">
              <Checkbox
                checked={selectedInvoices.length === filteredInvoices.length && filteredInvoices.length > 0}
                onCheckedChange={handleSelectAll}
              />
            </TableHead>
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
          {filteredInvoices.map((invoice) => (
            <TableRow key={invoice.id}>
              <TableCell>
                <Checkbox
                  checked={selectedInvoices.includes(invoice.id)}
                  onCheckedChange={() => handleSelectInvoice(invoice.id)}
                />
              </TableCell>
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
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => handleViewInvoice(invoice)}
                    disabled={isActionDisabled(invoice.status)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => handleDownloadInvoice(invoice)}
                    disabled={isActionDisabled(invoice.status)}
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => handleRegenerateInvoice(invoice)}
                  >
                    <RotateCcw className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Barre de sélection fixe en bas */}
      {selectedInvoices.length > 0 && (
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-white border border-gray-200 rounded-lg shadow-lg p-4 flex items-center gap-4 z-50">
          <span className="text-sm font-medium">
            {selectedInvoices.length} sur {filteredInvoices.length} factures sélectionnées
          </span>
          <Button onClick={handleDownloadSelected} className="bg-green-600 hover:bg-green-700">
            <Download className="h-4 w-4 mr-2" />
            Télécharger la sélection
          </Button>
          <Button 
            variant="outline" 
            onClick={() => setSelectedInvoices([])}
          >
            Annuler
          </Button>
        </div>
      )}

      {/* Modal d'aperçu */}
      {previewInvoice && (
        <InvoicePreviewModal
          invoice={previewInvoice}
          isOpen={!!previewInvoice}
          onClose={() => setPreviewInvoice(null)}
        />
      )}
    </div>
  );
};

export default ClientInvoicesTab;

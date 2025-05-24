
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Download, X } from "lucide-react";
import { formatCurrency } from "@/utils/formatters";

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

interface InvoicePreviewModalProps {
  invoice: Invoice;
  isOpen: boolean;
  onClose: () => void;
}

const InvoicePreviewModal: React.FC<InvoicePreviewModalProps> = ({
  invoice,
  isOpen,
  onClose,
}) => {
  const handleDownload = () => {
    // Logique de téléchargement à implémenter
    console.log("Téléchargement de la facture:", invoice.ficheNumber);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            Aperçu - Facture {invoice.ficheNumber}
            <div className="flex gap-2">
              <Button onClick={handleDownload} size="sm">
                <Download className="h-4 w-4 mr-2" />
                Télécharger
              </Button>
              <Button variant="outline" size="sm" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </DialogTitle>
          <DialogDescription>
            Client: {invoice.clientName} - Type: {invoice.ficheType}
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 border border-gray-200 rounded-lg bg-gray-50 p-6 overflow-auto">
          {/* Simulation d'un aperçu de facture */}
          <div className="bg-white p-8 shadow-sm rounded-lg max-w-2xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-gray-800">FACTURE</h1>
              <p className="text-gray-600">N° {invoice.ficheNumber}</p>
            </div>

            <div className="grid grid-cols-2 gap-8 mb-8">
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Émetteur</h3>
                <p className="text-gray-600">
                  CertiCasa<br />
                  123 Rue de l'Efficacité<br />
                  75001 Paris<br />
                  France
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Client</h3>
                <p className="text-gray-600">
                  {invoice.clientName}<br />
                  Adresse du client<br />
                  Code postal Ville<br />
                  France
                </p>
              </div>
            </div>

            <div className="mb-8">
              <h3 className="font-semibold text-gray-800 mb-4">Détails de la prestation</h3>
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border border-gray-300 p-2 text-left">Description</th>
                    <th className="border border-gray-300 p-2 text-right">Surface</th>
                    <th className="border border-gray-300 p-2 text-right">CAE kWh/an</th>
                    <th className="border border-gray-300 p-2 text-right">Montant HT</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-gray-300 p-2">
                      Certificat d'Économie d'Énergie - {invoice.ficheType}
                    </td>
                    <td className="border border-gray-300 p-2 text-right">{invoice.surface} m²</td>
                    <td className="border border-gray-300 p-2 text-right">{invoice.caeKwh.toLocaleString()}</td>
                    <td className="border border-gray-300 p-2 text-right">{formatCurrency(invoice.amount * 0.833)}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="text-right">
              <div className="inline-block">
                <div className="flex justify-between mb-2">
                  <span className="mr-8">Sous-total HT:</span>
                  <span>{formatCurrency(invoice.amount * 0.833)}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="mr-8">TVA (20%):</span>
                  <span>{formatCurrency(invoice.amount * 0.167)}</span>
                </div>
                <div className="flex justify-between font-bold text-lg border-t pt-2">
                  <span className="mr-8">Total TTC:</span>
                  <span>{formatCurrency(invoice.amount)}</span>
                </div>
              </div>
            </div>

            <div className="mt-8 text-sm text-gray-600">
              <p>Date de génération: {new Date(invoice.generationDate).toLocaleDateString("fr-FR")}</p>
              <p className="mt-2">
                Cette facture concerne les Certificats d'Économie d'Énergie (CEE) 
                générés dans le cadre de travaux de rénovation énergétique.
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default InvoicePreviewModal;


import { useState } from "react";
import { Receipt, FileText, Download, RefreshCw, PlusCircle, Eye } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import DocumentStatusBadge from "@/features/documents/DocumentStatusBadge";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface BillingTabProps {
  clientId: string;
}

// Mock project data - would be replaced with actual client data in production
const mockProjectData = {
  surface: 72, // m²
  productName: "URSA TERRA 32",
  productPrice: 7, // € HT / m²
  caeValue: 4200, // CAE value in € (example)
};

const calculateInvoiceData = (data: typeof mockProjectData) => {
  const { surface, productPrice, caeValue } = data;
  
  // Calculate all invoice values
  const productTotal = surface * productPrice;
  const laborUnitPrice = ((caeValue * 0.1 / 1.21) / surface) - productPrice;
  const laborTotal = laborUnitPrice * surface;
  const subtotal = productTotal + laborTotal;
  const tva = subtotal * 0.21;
  const totalTTC = caeValue * 0.1;
  
  return {
    productTotal,
    laborUnitPrice,
    laborTotal,
    subtotal,
    tva,
    totalTTC
  };
};

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(value);
};

type DocumentType = "invoice" | "creditNote";
type DocumentStatus = "generated" | "missing" | "error" | "not-generated";

interface BillingDocument {
  id: string;
  type: DocumentType;
  name: string;
  status: DocumentStatus;
  date?: string;
  downloadUrl?: string;
}

const BillingTab = ({ clientId }: BillingTabProps) => {
  const { toast } = useToast();
  const [documents, setDocuments] = useState<BillingDocument[]>([
    {
      id: "invoice-1",
      type: "invoice",
      name: "Facture client",
      status: "generated",
      date: "15/05/2025",
    },
    {
      id: "credit-note-1",
      type: "creditNote",
      name: "Note de crédit ITP",
      status: "not-generated",
    },
  ]);
  
  // Calculate invoice data
  const invoiceData = calculateInvoiceData(mockProjectData);
  
  const handleViewDocument = (doc: BillingDocument) => {
    if (doc.status !== "generated") {
      toast({
        title: "Document non disponible",
        description: "Ce document n'est pas encore généré ou une erreur s'est produite.",
        variant: "destructive",
      });
      return;
    }
    
    toast({
      title: "Aperçu du document",
      description: `Ouverture de l'aperçu de ${doc.name}...`,
    });
    
    // Here you would implement document preview functionality
  };
  
  const handleDownloadDocument = (doc: BillingDocument) => {
    if (doc.status !== "generated") {
      toast({
        title: "Document non disponible",
        description: "Ce document n'est pas encore généré ou une erreur s'est produite.",
        variant: "destructive",
      });
      return;
    }
    
    toast({
      title: "Téléchargement",
      description: `Téléchargement de ${doc.name}...`,
    });
    
    // Here you would implement document download functionality
  };
  
  const handleGenerateDocument = (docType: DocumentType) => {
    toast({
      title: "Génération en cours",
      description: docType === "invoice" 
        ? "Génération de la facture en cours..." 
        : "Génération de la note de crédit ITP en cours...",
    });
    
    // Simulate document generation
    setTimeout(() => {
      setDocuments(prev => 
        prev.map(doc => 
          doc.type === docType 
            ? { ...doc, status: "generated", date: new Date().toLocaleDateString('fr-FR') } 
            : doc
        )
      );
      
      toast({
        title: "Génération réussie",
        description: docType === "invoice" 
          ? "La facture a été générée avec succès." 
          : "La note de crédit ITP a été générée avec succès.",
      });
    }, 1500);
  };
  
  // Helper to get status badge component
  const getStatusBadge = (status: DocumentStatus) => {
    switch(status) {
      case "generated":
        return <DocumentStatusBadge status="generated" customLabel="Généré" />;
      case "missing":
        return <DocumentStatusBadge status="missing" customLabel="Manquant" />;
      case "error":
        return <DocumentStatusBadge status="error" customLabel="Erreur" />;
      case "not-generated":
        return <DocumentStatusBadge status="missing" customLabel="Non généré" />;
      default:
        return <DocumentStatusBadge status="missing" customLabel="Statut inconnu" />;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Facturation</CardTitle>
        <CardDescription>
          Gestion de la facturation du client avec TVA à 21%
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Tableau de calcul de la facture */}
        <div>
          <h3 className="text-lg font-medium mb-3">Tableau de calcul - Facture</h3>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Description</TableHead>
                <TableHead className="text-right">Quantité</TableHead>
                <TableHead className="text-right">Prix unitaire</TableHead>
                <TableHead className="text-right">Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {/* Ligne Produit */}
              <TableRow>
                <TableCell className="font-medium">
                  {mockProjectData.productName} (Produit)
                </TableCell>
                <TableCell className="text-right">
                  {mockProjectData.surface} m²
                </TableCell>
                <TableCell className="text-right">
                  {formatCurrency(mockProjectData.productPrice)}
                </TableCell>
                <TableCell className="text-right">
                  {formatCurrency(invoiceData.productTotal)}
                </TableCell>
              </TableRow>
              
              {/* Ligne Main d'œuvre */}
              <TableRow>
                <TableCell className="font-medium">
                  Main d'œuvre
                </TableCell>
                <TableCell className="text-right">
                  {mockProjectData.surface} m²
                </TableCell>
                <TableCell className="text-right">
                  {formatCurrency(invoiceData.laborUnitPrice)}
                </TableCell>
                <TableCell className="text-right">
                  {formatCurrency(invoiceData.laborTotal)}
                </TableCell>
              </TableRow>
              
              {/* Ligne Sous-total HT */}
              <TableRow>
                <TableCell colSpan={3} className="font-medium text-right">
                  Sous-total HT
                </TableCell>
                <TableCell className="text-right font-medium">
                  {formatCurrency(invoiceData.subtotal)}
                </TableCell>
              </TableRow>
              
              {/* Ligne TVA */}
              <TableRow>
                <TableCell colSpan={3} className="text-right">
                  TVA (21%)
                </TableCell>
                <TableCell className="text-right">
                  {formatCurrency(invoiceData.tva)}
                </TableCell>
              </TableRow>
              
              {/* Ligne Total TTC */}
              <TableRow className="border-t-2">
                <TableCell colSpan={3} className="font-bold text-right">
                  Total TTC
                </TableCell>
                <TableCell className="text-right font-bold">
                  {formatCurrency(invoiceData.totalTTC)}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
          <div className="mt-2 text-sm text-gray-500">
            <p>Le total TTC correspond à 10% de la valeur CAE ({formatCurrency(mockProjectData.caeValue)})</p>
          </div>
        </div>
        
        {/* Documents associés */}
        <div className="mt-8">
          <h3 className="text-lg font-medium mb-3">Documents associés</h3>
          
          <div className="space-y-4">
            {documents.map((doc) => (
              <div 
                key={doc.id} 
                className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-md"
              >
                <div className="flex items-center mb-3 sm:mb-0">
                  <FileText className="h-5 w-5 text-blue-500 mr-3" />
                  <div>
                    <h4 className="font-medium">{doc.name}</h4>
                    {doc.date && <p className="text-sm text-gray-500">Date: {doc.date}</p>}
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-2">
                  {/* Status Badge */}
                  <div className="mb-2 sm:mb-0 sm:mr-2">
                    {getStatusBadge(doc.status)}
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex space-x-2">
                    {doc.status === "generated" ? (
                      <>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleViewDocument(doc)}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          Voir
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleDownloadDocument(doc)}
                        >
                          <Download className="h-4 w-4 mr-1" />
                          Télécharger
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleGenerateDocument(doc.type)}
                        >
                          <RefreshCw className="h-4 w-4 mr-1" />
                          Régénérer
                        </Button>
                      </>
                    ) : (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleGenerateDocument(doc.type)}
                      >
                        <PlusCircle className="h-4 w-4 mr-1" />
                        Générer
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Info about VAT */}
        <Alert>
          <AlertDescription>
            Tous les calculs sont effectués avec un taux de TVA de 21%. La note de crédit ITP reprend les mêmes données que la facture.
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
};

export default BillingTab;

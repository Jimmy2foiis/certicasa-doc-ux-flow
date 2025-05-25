import { useState } from "react";
import { Receipt, FileText, Download, RefreshCw, PlusCircle, Eye, Calculator } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import DocumentStatusBadge from "@/features/documents/DocumentStatusBadge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import AutomaticBillingGenerator from "@/components/billing/AutomaticBillingGenerator";
import { useSavedCalculations } from "@/hooks/useSavedCalculations";
import { useClientInfo } from "@/hooks/useClientInfo";
import InvoicePreviewModal from "@/components/finances/modals/InvoicePreviewModal";

interface BillingTabProps {
  clientId: string;
}

type DocumentType = "invoice" | "creditNote";
type DocumentStatus = "generated" | "missing" | "error" | "not-generated";

interface BillingDocument {
  id: string;
  type: DocumentType;
  name: string;
  status: DocumentStatus;
  date?: string;
  downloadUrl?: string;
  amount?: number;
  ficheNumber?: string;
  surface?: number;
  caeKwh?: number;
}

const BillingTab = ({ clientId }: BillingTabProps) => {
  const { toast } = useToast();
  const [showBillingDialog, setShowBillingDialog] = useState(false);
  const [previewDocument, setPreviewDocument] = useState<BillingDocument | null>(null);
  const [documents, setDocuments] = useState<BillingDocument[]>([
    {
      id: "invoice-1",
      type: "invoice",
      name: "Facture client (CERT-XXXXX)",
      status: "not-generated",
      ficheNumber: "CERT-2024-001",
      amount: 1250,
      surface: 120,
      caeKwh: 15500
    },
    {
      id: "credit-note-1",
      type: "creditNote",
      name: "Note de crédit ITP (NC-XXXXX)",
      status: "not-generated",
      ficheNumber: "NC-2024-001",
      amount: 1250,
      surface: 120,
      caeKwh: 15500
    }
  ]);

  // Use the updated hook with real-time updates
  const { client, loading } = useClientInfo(clientId);
  const { savedCalculations } = useSavedCalculations(clientId);

  // Find the most recent calculation for this client
  const latestCalculation = savedCalculations && savedCalculations.length > 0 
    ? savedCalculations[savedCalculations.length - 1] 
    : null;
  const calculationData = latestCalculation?.calculationData;

  console.log('BillingTab - Calculs trouvés:', savedCalculations?.length || 0);
  console.log('BillingTab - Dernier calcul:', latestCalculation);

  const handleViewDocument = (doc: BillingDocument) => {
    if (doc.status !== "generated") {
      toast({
        title: "Document non disponible",
        description: "Ce document n'est pas encore généré ou une erreur s'est produite.",
        variant: "destructive"
      });
      return;
    }

    const invoiceData = {
      id: doc.id,
      clientName: client?.name || 'Client',
      ficheType: doc.type === "invoice" ? "RES010" : "NC-ITP",
      ficheNumber: doc.ficheNumber || doc.name,
      surface: doc.surface || 120,
      caeKwh: doc.caeKwh || 15500,
      amount: doc.amount || 1250,
      generationDate: doc.date || new Date().toISOString(),
      status: doc.status
    };
    setPreviewDocument(doc);
    toast({
      title: "Aperçu du document",
      description: `Ouverture de l'aperçu de ${doc.name}...`
    });
  };

  const handleDownloadDocument = (doc: BillingDocument) => {
    if (doc.status !== "generated") {
      toast({
        title: "Document non disponible",
        description: "Ce document n'est pas encore généré ou une erreur s'est produite.",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Téléchargement",
      description: `Téléchargement de ${doc.name}...`
    });

    setTimeout(() => {
      const element = document.createElement('a');
      const fileContent = `Document: ${doc.name}\nClient: ${client?.name}\nDate: ${doc.date}`;
      const file = new Blob([fileContent], { type: 'text/plain' });
      element.href = URL.createObjectURL(file);
      element.download = `${doc.ficheNumber || doc.name}.pdf`;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
      toast({
        title: "Téléchargement terminé",
        description: `${doc.name} a été téléchargé avec succès.`
      });
    }, 1000);
  };

  const handleGenerateDocument = (docType: DocumentType) => {
    if (!calculationData) {
      toast({
        title: "Erreur",
        description: "Aucun calcul disponible pour générer le document.",
        variant: "destructive"
      });
      return;
    }
    
    toast({
      title: "Génération en cours",
      description: docType === "invoice" ? "Génération de la facture en cours..." : "Génération de la note de crédit ITP en cours..."
    });

    setTimeout(() => {
      setDocuments(prev => prev.map(doc => doc.type === docType ? {
        ...doc,
        status: "generated",
        date: new Date().toLocaleDateString('fr-FR'),
        surface: parseFloat(calculationData.surfaceArea) || 120,
        amount: parseFloat(calculationData.surfaceArea) * 10.5 || 1250
      } : doc));
      
      toast({
        title: "Génération réussie",
        description: docType === "invoice" ? "La facture a été générée avec succès." : "La note de crédit ITP a été générée avec succès."
      });
    }, 1500);
  };

  const getStatusBadge = (status: DocumentStatus) => {
    switch (status) {
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

  const clientData = {
    name: client?.name || 'Client',
    nif: client?.nif || '',
    address: client?.address || '',
    phone: client?.phone || '',
    email: client?.email || ''
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Receipt className="h-5 w-5" />
            Facturation CEE
            {loading && <Badge variant="outline">Chargement...</Badge>}
          </div>
          
          {calculationData ? (
            <Dialog open={showBillingDialog} onOpenChange={setShowBillingDialog}>
              <DialogTrigger asChild>
                <Button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md flex items-center gap-2">
                  <Calculator className="h-4 w-4 mr-2" />
                  Générer Facturation CEE
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <Calculator className="h-5 w-5" />
                    Système de Facturation Automatique CEE
                  </DialogTitle>
                </DialogHeader>
                <AutomaticBillingGenerator 
                  calculationData={calculationData} 
                  clientData={clientData} 
                />
              </DialogContent>
            </Dialog>
          ) : (
            <Button variant="outline" disabled>
              <Calculator className="h-4 w-4 mr-2" />
              {loading ? "Chargement..." : "Aucun calcul disponible"}
            </Button>
          )}
        </CardTitle>
        <CardDescription>
          Génération automatique des factures et notes de crédit selon les calculs CEE
          {savedCalculations && savedCalculations.length > 0 && (
            <span className="text-green-600 font-medium">
              {" "} • {savedCalculations.length} calcul(s) disponible(s)
            </span>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        
        {/* Calculation data information */}
        {calculationData ? (
          <Alert>
            <Calculator className="h-4 w-4" />
            <AlertDescription>
              <strong>Données de calcul détectées :</strong><br />
              - Surface isolée : {calculationData.surfaceArea} m²<br />
              - Zone climatique : {calculationData.climateZone}<br />
              - Amélioration : {calculationData.improvementPercent?.toFixed(1)}%<br />
              - Matériau principal : {calculationData.afterLayers?.find(layer => layer.name?.includes('SOUFL'))?.name || 'Standard'}<br />
              - Date sauvegarde : {latestCalculation?.date}
            </AlertDescription>
          </Alert>
        ) : (
          <Alert>
            <AlertDescription>
              {loading 
                ? "Recherche des calculs thermiques en cours..."
                : "Aucun calcul thermique trouvé pour ce client. Veuillez d'abord effectuer un calcul dans l'onglet \"Calculs\" pour pouvoir générer une facturation."
              }
            </AlertDescription>
          </Alert>
        )}
        
        {/* Associated documents */}
        <div className="mt-8">
          <h3 className="text-lg font-medium mb-3 flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Documents de facturation
          </h3>
          
          <div className="space-y-4">
            {documents.map(doc => (
              <div key={doc.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-md hover:bg-gray-50">
                <div className="flex items-center mb-3 sm:mb-0">
                  <FileText className="h-5 w-5 text-blue-500 mr-3" />
                  <div>
                    <h4 className="font-medium">{doc.name}</h4>
                    {doc.date && <p className="text-sm text-gray-500">Date: {doc.date}</p>}
                    {doc.status === "generated" && (
                      <p className="text-sm text-green-600">
                        Surface: {doc.surface}m² • Montant: {doc.amount}€ • CAE: {doc.caeKwh?.toLocaleString()} kWh/an
                      </p>
                    )}
                    <p className="text-xs text-gray-400">
                      {doc.type === "invoice" ? "Facture avec calcul CEE automatique" : "Note de crédit pour transfert ITP"}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-2">
                  <div className="mb-2 sm:mb-0 sm:mr-2">
                    {getStatusBadge(doc.status)}
                  </div>
                  
                  <div className="flex space-x-2">
                    {doc.status === "generated" ? (
                      <>
                        <Button variant="outline" size="sm" onClick={() => handleViewDocument(doc)}>
                          <Eye className="h-4 w-4 mr-1" />
                          Voir
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleDownloadDocument(doc)}>
                          <Download className="h-4 w-4 mr-1" />
                          Télécharger
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleGenerateDocument(doc.type)}>
                          <RefreshCw className="h-4 w-4 mr-1" />
                          Régénérer
                        </Button>
                      </>
                    ) : (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleGenerateDocument(doc.type)} 
                        disabled={!calculationData}
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
        
        {/* Process information */}
        <Alert>
          <AlertDescription>
            <strong>Processus de facturation CEE :</strong><br />
            1. Les calculs thermiques sont récupérés automatiquement depuis l'onglet "Calculs"<br />
            2. Les CAE sont calculés selon la formule : FP × (Ui - Uf) × Surface × G(zone)<br />
            3. La facture est générée avec matériel (7€/m²) + main d'œuvre ajustée<br />
            4. La note de crédit reprend les mêmes données pour le transfert ITP
          </AlertDescription>
        </Alert>
      </CardContent>

      {/* Preview modal */}
      {previewDocument && (
        <InvoicePreviewModal 
          invoice={{
            id: previewDocument.id,
            clientName: client?.name || 'Client',
            ficheType: previewDocument.type === "invoice" ? "RES010" : "NC-ITP",
            ficheNumber: previewDocument.ficheNumber || previewDocument.name,
            surface: previewDocument.surface || 120,
            caeKwh: previewDocument.caeKwh || 15500,
            amount: previewDocument.amount || 1250,
            generationDate: previewDocument.date || new Date().toISOString(),
            status: previewDocument.status
          }} 
          isOpen={!!previewDocument} 
          onClose={() => setPreviewDocument(null)} 
        />
      )}
    </Card>
  );
};

export default BillingTab;

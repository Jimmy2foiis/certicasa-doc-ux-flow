import { useState } from "react";
import { Receipt, FileText, Download, RefreshCw, PlusCircle, Eye, Calculator, AlertTriangle } from "lucide-react";
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

  // Récupération des données client et calculs
  const { client } = useClientInfo(clientId);
  const { savedCalculations, loading } = useSavedCalculations(clientId);

  // Trouver le calcul le plus récent pour ce client
  const latestCalculation = savedCalculations && savedCalculations.length > 0 
    ? savedCalculations[savedCalculations.length - 1] 
    : null;
  const calculationData = latestCalculation?.calculationData;

  // Vérifier si les données de calcul sont suffisantes pour la facturation
  const hasValidCalculationData = calculationData && 
    calculationData.surfaceArea && 
    parseFloat(calculationData.surfaceArea) > 0 &&
    calculationData.uValueBefore > 0 &&
    calculationData.uValueAfter > 0 &&
    calculationData.improvementPercent > 0;

  console.log('🔍 BillingTab - Données de calcul:', {
    calculationsCount: savedCalculations?.length || 0,
    latestCalculation: latestCalculation,
    hasValidData: hasValidCalculationData,
    surfaceArea: calculationData?.surfaceArea,
    improvement: calculationData?.improvementPercent
  });

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
    if (!hasValidCalculationData) {
      toast({
        title: "Erreur",
        description: "Données de calcul insuffisantes pour générer le document. Veuillez effectuer un calcul thermique complet.",
        variant: "destructive"
      });
      return;
    }
    
    toast({
      title: "Génération en cours",
      description: docType === "invoice" ? "Génération de la facture CEE en cours..." : "Génération de la note de crédit ITP en cours..."
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
        description: docType === "invoice" ? "La facture CEE a été générée avec succès." : "La note de crédit ITP a été générée avec succès."
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
    email: client?.email || '',
    climateZone: client?.climateZone || calculationData?.climateZone || 'C3'
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Receipt className="h-5 w-5" />
            Facturation CEE - Liaison Module Calculs
            {loading && <Badge variant="outline">Chargement...</Badge>}
          </div>
          
          {hasValidCalculationData ? (
            <Dialog open={showBillingDialog} onOpenChange={setShowBillingDialog}>
              <DialogTrigger asChild>
                <Button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md flex items-center gap-2">
                  <Calculator className="h-4 w-4 mr-2" />
                  Générer Facturation CEE Automatique
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <Calculator className="h-5 w-5" />
                    Système de Facturation Automatique CEE - Liaison Calculs
                  </DialogTitle>
                </DialogHeader>
                <AutomaticBillingGenerator 
                  calculationData={calculationData} 
                  clientData={clientData} 
                />
              </DialogContent>
            </Dialog>
          ) : (
            <Button variant="outline" disabled className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-orange-500" />
              {loading ? "Chargement..." : "Calculs requis"}
            </Button>
          )}
        </CardTitle>
        <CardDescription>
          <div className="space-y-1">
            <p>Génération automatique des factures et notes de crédit basée sur les calculs thermiques CEE</p>
            {savedCalculations && savedCalculations.length > 0 ? (
              <p className="text-green-600 font-medium">
                ✅ {savedCalculations.length} calcul(s) disponible(s) - Liaison active avec le module de calculs
              </p>
            ) : (
              <p className="text-orange-600 font-medium">
                ⚠️ Aucun calcul détecté - Veuillez effectuer un calcul dans l'onglet "Calculs"
              </p>
            )}
          </div>
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        
        {/* Informations sur la liaison avec les calculs */}
        {hasValidCalculationData ? (
          <Alert className="border-green-200 bg-green-50">
            <Calculator className="h-4 w-4 text-green-600" />
            <AlertDescription>
              <div className="text-green-800">
                <strong>✅ Liaison active avec le module de calculs :</strong>
                <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                  <div>• Surface isolée : <strong>{calculationData.surfaceArea} m²</strong></div>
                  <div>• Zone climatique : <strong>{calculationData.climateZone}</strong></div>
                  <div>• Amélioration : <strong>{calculationData.improvementPercent?.toFixed(1)}%</strong></div>
                  <div>• U avant : <strong>{calculationData.uValueBefore?.toFixed(3)} W/m².K</strong></div>
                  <div>• U après : <strong>{calculationData.uValueAfter?.toFixed(3)} W/m².K</strong></div>
                  <div>• Matériau : <strong>{calculationData.afterLayers?.find(layer => layer.name?.includes('SOUFL'))?.name || 'Standard'}</strong></div>
                </div>
                <div className="mt-2 text-xs text-green-600">
                  📅 Dernière sauvegarde : {latestCalculation?.date} | 🔄 Mise à jour automatique des calculs CEE
                </div>
              </div>
            </AlertDescription>
          </Alert>
        ) : (
          <Alert className="border-orange-200 bg-orange-50">
            <AlertTriangle className="h-4 w-4 text-orange-600" />
            <AlertDescription>
              <div className="text-orange-800">
                <strong>⚠️ Liaison avec le module de calculs requise :</strong>
                <div className="mt-2">
                  {loading 
                    ? "🔍 Recherche des calculs thermiques en cours..."
                    : savedCalculations?.length === 0
                    ? "❌ Aucun calcul thermique trouvé pour ce client."
                    : "❌ Données de calcul incomplètes ou invalides."
                  }
                </div>
                <div className="mt-2 text-sm">
                  💡 <strong>Pour activer la facturation CEE :</strong>
                  <ol className="list-decimal list-inside mt-1 ml-4 space-y-1">
                    <li>Allez dans l'onglet "Calculs"</li>
                    <li>Effectuez un calcul thermique complet</li>
                    <li>Sauvegardez le calcul</li>
                    <li>Revenez ici pour générer la facturation automatiquement</li>
                  </ol>
                </div>
              </div>
            </AlertDescription>
          </Alert>
        )}
        
        {/* Documents de facturation */}
        <div className="mt-8">
          <h3 className="text-lg font-medium mb-3 flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Documents de facturation CEE
            {hasValidCalculationData && <Badge variant="outline" className="bg-green-50 text-green-700">Prêt</Badge>}
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
                      {doc.type === "invoice" 
                        ? "🔗 Facture CEE avec liaison automatique aux calculs thermiques" 
                        : "🔗 Note de crédit CEE pour transfert ITP avec données calculées"
                      }
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
                        disabled={!hasValidCalculationData}
                        className={!hasValidCalculationData ? "opacity-50 cursor-not-allowed" : ""}
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
        
        {/* Informations sur le processus CEE avec liaison */}
        <Alert>
          <AlertDescription>
            <strong>🔗 Processus de facturation CEE avec liaison automatique :</strong><br />
            1. <strong>Récupération automatique :</strong> Les calculs thermiques sont récupérés depuis l'onglet "Calculs"<br />
            2. <strong>Calcul CEE :</strong> CAE = FP × (Ui - Uf) × Surface × G(zone climatique)<br />
            3. <strong>Génération facture :</strong> Matériel détecté + main d'œuvre calculée automatiquement<br />
            4. <strong>Note de crédit :</strong> Données identiques pour le transfert ITP<br />
            5. <strong>Mise à jour temps réel :</strong> Toute modification des calculs met à jour la facturation
          </AlertDescription>
        </Alert>
      </CardContent>

      {/* Modal d'aperçu */}
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

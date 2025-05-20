
import { useState } from "react";
import { Download } from "lucide-react";
import { 
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import DocumentStatusBadge, { DocumentStatus } from "@/components/documents/DocumentStatusBadge";
import DocumentActionButtons from "@/components/documents/DocumentActionButtons";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface DocumentsTabContentProps {
  clientId?: string;
  clientName?: string;
  projectType?: string;
}

// Type pour représenter un document administratif
interface AdministrativeDocument {
  id: string;
  name: string;
  type: string; // Identifiant unique pour le type (ex: "ficha", "anexo", etc.)
  description: string;
  status: DocumentStatus;
  statusLabel?: string;
  order: number;
}

const DocumentsTabContent = ({ clientId, clientName = "Client", projectType = "RES010" }: DocumentsTabContentProps) => {
  const { toast } = useToast();
  
  // État des documents administratifs
  // Dans une implémentation réelle, ceux-ci viendraient d'une API ou d'un hook
  const [adminDocuments, setAdminDocuments] = useState<AdministrativeDocument[]>([
    {
      id: "1",
      name: `Ficha ${projectType}`,
      type: "ficha",
      description: "Document principal du dossier",
      status: "generated",
      order: 1
    },
    {
      id: "2",
      name: "Anexo I DR Subvenciones",
      type: "anexo",
      description: "Annexe pour les subventions",
      status: "ready",
      order: 2
    },
    {
      id: "3",
      name: "Factura",
      type: "factura",
      description: "Facture client",
      status: "pending",
      statusLabel: "En attente CAE",
      order: 3
    },
    {
      id: "4",
      name: "Rapport Photos (4-Fotos)",
      type: "fotos",
      description: "Photos de l'installation",
      status: "action-required",
      statusLabel: "Photos manquantes",
      order: 4
    },
    {
      id: "5",
      name: "Certificado Instalador (+ Calcul Coef.)",
      type: "certificado",
      description: "Certificat d'installation et calcul",
      status: "pending",
      statusLabel: "En attente CEE POST.",
      order: 5
    },
    {
      id: "6",
      name: "CEEE (Inicial & Final)",
      type: "ceee",
      description: "Certificats énergétiques",
      status: "missing",
      order: 6
    },
    {
      id: "7",
      name: "Modelo Cesión Ahorros",
      type: "modelo",
      description: "Modèle de cession",
      status: "ready",
      order: 7
    },
    {
      id: "8",
      name: "DNI Client",
      type: "dni",
      description: "Document d'identité",
      status: "linked",
      statusLabel: "Fichier lié",
      order: 8
    },
  ]);

  // Fonction pour gérer les actions sur les documents
  const handleDocumentAction = (documentId: string, action: string) => {
    const document = adminDocuments.find(doc => doc.id === documentId);
    if (!document) return;
    
    // Actions spécifiques selon le type d'action
    switch (action) {
      case "view":
        toast({
          title: `Visualisation: ${document.name}`,
          description: "Ouverture du document...",
        });
        break;
      case "download":
        toast({
          title: `Téléchargement: ${document.name}`,
          description: "Le document est en cours de téléchargement...",
        });
        break;
      case "generate":
        toast({
          title: `Génération: ${document.name}`,
          description: "Le document est en cours de génération...",
        });
        // Simuler la génération réussie
        setTimeout(() => {
          setAdminDocuments(prev => prev.map(doc => 
            doc.id === documentId ? {...doc, status: "generated" as DocumentStatus} : doc
          ));
          toast({
            title: "Document généré avec succès",
            description: `${document.name} a été généré et ajouté au dossier client.`,
          });
        }, 1500);
        break;
      case "regenerate":
        toast({
          title: `Régénération: ${document.name}`,
          description: "Le document est en cours de régénération...",
        });
        break;
      case "refresh-ocr":
        toast({
          title: `Mise à jour OCR: ${document.name}`,
          description: "Relance de l'analyse OCR en cours...",
        });
        break;
      case "update-cee":
        toast({
          title: `Mise à jour CEE: ${document.name}`,
          description: "Récupération des nouvelles données CEE...",
        });
        break;
      case "link-files":
      case "link-photos":
      case "link-dni":
        toast({
          title: `Liaison de fichiers: ${document.name}`,
          description: "Veuillez sélectionner les fichiers à lier...",
        });
        break;
    }
  };

  // Fonction pour exporter tous les documents
  const handleExportAll = () => {
    toast({
      title: "Export du dossier complet",
      description: `Préparation de l'archive ZIP contenant tous les documents de ${clientName}...`,
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Suivi des Documents Administratifs : {clientName} - {projectType}</CardTitle>
        <CardDescription>
          Statut des 8 documents obligatoires pour le dossier client
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50%]">Document</TableHead>
              <TableHead className="w-[20%]">Statut</TableHead>
              <TableHead className="w-[30%]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {adminDocuments
              .sort((a, b) => a.order - b.order)
              .map((document) => (
                <TableRow key={document.id}>
                  <TableCell className="font-medium">
                    {document.order}. {document.name}
                    <div className="text-xs text-muted-foreground mt-1">{document.description}</div>
                  </TableCell>
                  <TableCell>
                    <DocumentStatusBadge 
                      status={document.status} 
                      customLabel={document.statusLabel} 
                    />
                  </TableCell>
                  <TableCell>
                    <DocumentActionButtons 
                      documentType={document.type} 
                      status={document.status}
                      onAction={(action) => handleDocumentAction(document.id, action)}
                    />
                  </TableCell>
                </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button 
          variant="outline" 
          className="flex items-center" 
          onClick={handleExportAll}
        >
          <Download className="mr-2 h-4 w-4" />
          Exporter Dossier Complet (ZIP)
        </Button>
      </CardFooter>
    </Card>
  );
};

export default DocumentsTabContent;

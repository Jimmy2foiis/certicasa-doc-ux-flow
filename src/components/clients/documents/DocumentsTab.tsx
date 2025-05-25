import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, Info } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useClientDocuments } from "@/hooks/documents/useClientDocuments";
import DocumentUploadDialog from './DocumentUploadDialog';
import { DocumentsWithDragDrop } from './DocumentsWithDragDrop';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import type { AdministrativeDocument, DocumentStatus } from '@/types/documents';

interface DocumentsTabProps {
  clientId: string;
}

const DocumentsTab = ({ clientId }: DocumentsTabProps) => {
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [requiredDocuments, setRequiredDocuments] = useState<AdministrativeDocument[]>([]);
  const { toast } = useToast();

  // Use the client documents hook - now with refreshDocuments function
  const { 
    adminDocuments: documents,
    isLoading: loading,
    handleDocumentAction,
    refreshDocuments
  } = useClientDocuments(clientId);

  // Préparer les documents requis avec leur ordre correct
  useEffect(() => {
    console.log('🔄 Documents from Supabase:', documents.length);
    
    // Définir les 8 documents obligatoires
    const requiredDocsList = [
      { 
        id: "doc-1", 
        name: "Ficha", 
        description: "Document principal CEE", 
        reference: "Ficha RES020.pdf", 
        order: 1,
        type: "ficha"
      },
      { 
        id: "doc-2", 
        name: "Anexo I", 
        description: "Annexe I des fiches", 
        reference: "Anexo I de las fichas_DR subvenciones.pdf", 
        order: 2,
        type: "anexo"
      },
      { 
        id: "doc-3", 
        name: "Factura", 
        description: "Facture des travaux", 
        reference: "Factura.png", 
        order: 3,
        type: "factura"
      },
      { 
        id: "doc-4", 
        name: "Informe fotográfico", 
        description: "Rapport photographique", 
        reference: "4-Fotos.docx", 
        order: 4,
        type: "fotos"
      },
      { 
        id: "doc-5", 
        name: "Certificado de obra", 
        description: "Certificat d'installation", 
        reference: "Certificado Instalador RES020.docx", 
        order: 5,
        type: "certificado"
      },
      { 
        id: "doc-6", 
        name: "CEEE", 
        description: "Certificats d'efficacité énergétique", 
        reference: "CEEE inicial.pdf + CEEE final.pdf", 
        order: 6,
        type: "ceee"
      },
      { 
        id: "doc-7", 
        name: "Acuerdo cesión de ahorros", 
        description: "Accord sur la cession d'économies", 
        reference: "Modelo ACUERDO SOBRE CESION AHORROS.docx", 
        order: 7,
        type: "acuerdo"
      },
      { 
        id: "doc-8", 
        name: "DNI CLIENTE", 
        description: "Document d'identité du client", 
        reference: "DNI NOM_CLIENT.jpeg", 
        order: 8,
        type: "dni"
      },
    ];

    // Mapping amélioré avec correspondance exacte par type et nom
    const mappedDocuments: AdministrativeDocument[] = requiredDocsList.map(reqDoc => {
      console.log(`🔍 Mapping ${reqDoc.name} (${reqDoc.type})...`);
      
      const existingDoc = documents.find(doc => {
        // Correspondance exacte par type
        const typeMatch = doc.type?.toLowerCase() === reqDoc.type.toLowerCase();
        
        // Correspondance par nom (flexible)
        const nameMatch = doc.name?.toLowerCase().includes(reqDoc.name.toLowerCase()) ||
                          reqDoc.name.toLowerCase().includes(doc.name?.toLowerCase() || '');
        
        // Cas spécial pour "fotos" et "Informe fotográfico"
        const fotosMatch = (reqDoc.type === 'fotos' && 
          (doc.name?.toLowerCase().includes('fotográfico') || 
           doc.name?.toLowerCase().includes('informe') ||
           doc.name?.toLowerCase().includes('fotos') || 
           doc.type?.toLowerCase() === 'fotos'));
           
        const match = typeMatch || nameMatch || fotosMatch;
        
        if (match) {
          console.log(`✅ ${reqDoc.name}: TROUVÉ ->`, doc.name, `(status: ${doc.status})`);
        }
        
        return match;
      });

      if (existingDoc) {
        return {
          ...reqDoc,
          id: existingDoc.id,
          status: existingDoc.status,
          statusLabel: existingDoc.statusLabel,
          created_at: existingDoc.created_at,
          content: existingDoc.content,
          file_path: existingDoc.file_path
        };
      } else {
        console.log(`❌ ${reqDoc.name}: MANQUANT`);
        return {
          ...reqDoc,
          status: "missing" as DocumentStatus,
          statusLabel: "Document manquant",
          created_at: new Date().toISOString()
        };
      }
    });

    console.log('📋 Final mapped documents:', mappedDocuments.map(d => `${d.name}: ${d.status}`));
    setRequiredDocuments(mappedDocuments);
  }, [documents]);

  // Handle document actions
  const handleDocAction = (documentId: string, action: string) => {
    handleDocumentAction(documentId, action);
  };

  // Handle uploading a document
  const handleUploadDocument = (file: File, documentType: string) => {
    toast({
      title: "Upload en cours",
      description: `Upload de ${file.name}...`,
    });

    // Generate a temporary ID for the new document
    const tempId = Math.random().toString(36).substring(2);
    
    // Call handleDocumentAction with 'upload' action and additional data
    handleDocumentAction(tempId, 'upload', {
      file: file,
      name: file.name,
      type: documentType
    });
    
    // Close the dialog
    setShowUploadDialog(false);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Documents</CardTitle>
            <CardDescription>
              Gestion des 8 documents obligatoires du dossier - Cliquez sur une ligne pour voir l'aperçu
            </CardDescription>
          </div>
          <Button 
            onClick={() => setShowUploadDialog(true)}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md flex items-center gap-2"
          >
            <Upload className="h-4 w-4" />
            Ajouter un document
          </Button>
        </CardHeader>
        <CardContent>
          <Alert className="mb-4">
            <Info className="h-4 w-4" />
            <AlertTitle>Documents réglementaires</AlertTitle>
            <AlertDescription>
              8 documents sont obligatoires pour la validation du dossier CEE. Cliquez sur chaque ligne pour voir l'aperçu et les actions disponibles.
            </AlertDescription>
          </Alert>

          <DocumentsWithDragDrop 
            documents={requiredDocuments}
            isLoading={loading}
            onAction={handleDocAction}
            onRefresh={refreshDocuments}
          />
        </CardContent>

        {/* Dialog for document upload */}
        <DocumentUploadDialog 
          open={showUploadDialog} 
          onOpenChange={setShowUploadDialog}
          onUploadDocument={handleUploadDocument}
          clientId={clientId}
        />
      </Card>
    </div>
  );
};

export default DocumentsTab;

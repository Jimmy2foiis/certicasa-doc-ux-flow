
import React from 'react';
import { AdministrativeDocument } from '@/types/documents';
import { Button } from "@/components/ui/button";
import { Download, RefreshCw, Eye, AlertCircle, FileText, Settings } from 'lucide-react';
import { PDFViewer } from '@/features/documents/PDFViewer';

interface DocumentAccordionContentProps {
  document: AdministrativeDocument;
  onAction: (action: string) => void;
}

export const DocumentAccordionContent: React.FC<DocumentAccordionContentProps> = ({
  document,
  onAction,
}) => {
  const renderDocumentPreview = () => {
    // Check if document has content for preview
    if (['generated', 'available', 'linked', 'signed'].includes(document.status)) {
      if (document.content) {
        // If it's a PDF, show PDF viewer
        if (document.type?.toLowerCase() === 'pdf' || document.reference?.toLowerCase().includes('.pdf')) {
          return (
            <div className="h-96 border rounded-md overflow-hidden bg-white">
              <PDFViewer
                fileUrl={
                  document.content.startsWith('data:')
                    ? document.content
                    : `data:application/pdf;base64,${document.content}`
                }
                fileName={document.name}
              />
            </div>
          );
        }
        
        // For other file types, show placeholder
        return (
          <div className="h-64 border border-dashed border-gray-300 rounded-md flex items-center justify-center bg-white">
            <div className="text-center">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-600 font-medium">Aperçu disponible</p>
              <p className="text-sm text-gray-500">Cliquez sur "Voir" pour ouvrir le document</p>
            </div>
          </div>
        );
      }
    }

    // For documents without content or not generated
    return (
      <div className="h-64 border border-dashed border-gray-300 rounded-md flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-2" />
          <p className="text-gray-600 font-medium">Aperçu non disponible</p>
          <p className="text-sm text-gray-500">
            {document.status === 'missing' || document.status === 'pending' 
              ? 'Le document doit être généré'
              : 'Aucun contenu disponible'
            }
          </p>
        </div>
      </div>
    );
  };

  const renderActionButtons = () => {
    switch (document.status) {
      case 'missing':
      case 'pending':
      case 'ready':
        return (
          <div className="flex gap-2">
            <Button
              onClick={() => onAction('generate')}
              className="bg-green-500 hover:bg-green-600 text-white"
              size="sm"
            >
              <Settings className="h-4 w-4 mr-2" />
              Générer le document
            </Button>
          </div>
        );

      case 'error':
        return (
          <div className="flex gap-2">
            <Button
              onClick={() => onAction('regenerate')}
              className="bg-orange-500 hover:bg-orange-600 text-white"
              size="sm"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Régénérer
            </Button>
          </div>
        );

      case 'generated':
      case 'available':
      case 'linked':
      case 'signed':
        return (
          <div className="flex gap-2">
            <Button
              onClick={() => onAction('view')}
              className="bg-blue-500 hover:bg-blue-600 text-white"
              size="sm"
            >
              <Eye className="h-4 w-4 mr-2" />
              Voir en plein écran
            </Button>
            <Button
              onClick={() => onAction('download')}
              variant="outline"
              size="sm"
            >
              <Download className="h-4 w-4 mr-2" />
              Télécharger
            </Button>
            <Button
              onClick={() => onAction('regenerate')}
              variant="outline"
              size="sm"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Régénérer
            </Button>
          </div>
        );

      case 'action-required':
        return (
          <div className="flex gap-2">
            <Button
              onClick={() => onAction('view')}
              className="bg-blue-500 hover:bg-blue-600 text-white"
              size="sm"
            >
              <Eye className="h-4 w-4 mr-2" />
              Voir
            </Button>
            <Button
              onClick={() => onAction('regenerate')}
              className="bg-orange-500 hover:bg-orange-600 text-white"
              size="sm"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Régénérer
            </Button>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="p-4 space-y-4">
      {/* Document Preview */}
      <div>
        <h4 className="text-sm font-medium text-gray-700 mb-2">Aperçu du document</h4>
        {renderDocumentPreview()}
      </div>

      {/* Status Information */}
      <div className="bg-white p-3 rounded-md border">
        <h4 className="text-sm font-medium text-gray-700 mb-2">Statut du document</h4>
        <p className="text-sm text-gray-600">
          {getOperationalStatus(document.status).description}
        </p>
      </div>

      {/* Action Buttons */}
      <div>
        <h4 className="text-sm font-medium text-gray-700 mb-2">Actions disponibles</h4>
        {renderActionButtons()}
      </div>
    </div>
  );
};

// Helper function to get status information
const getOperationalStatus = (status: string) => {
  switch (status) {
    case 'missing':
    case 'pending':
      return { description: 'Ce document doit être généré avec les données disponibles.' };
    case 'generated':
    case 'available':
    case 'linked':
      return { description: 'Document généré avec succès et prêt à être utilisé.' };
    case 'action-required':
      return { description: 'Ce document nécessite une action ou vérification de votre part.' };
    case 'error':
      return { description: 'Une erreur s\'est produite lors de la génération. Veuillez régénérer.' };
    case 'ready':
      return { description: 'Toutes les données sont disponibles pour générer ce document.' };
    case 'signed':
      return { description: 'Document validé et vérifié par un opérateur administratif.' };
    default:
      return { description: 'Statut du document non défini.' };
  }
};

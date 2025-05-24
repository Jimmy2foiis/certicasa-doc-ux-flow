
import React, { useState } from 'react';
import { AdministrativeDocument } from '@/types/documents';
import { Button } from "@/components/ui/button";
import { Download, RefreshCw, CheckCircle2, Settings, Eye } from 'lucide-react';
import { DocumentPreview } from '@/features/documents/DocumentPreview';

interface DocumentAccordionContentProps {
  document: AdministrativeDocument;
  onAction: (action: string) => void;
}

export const DocumentAccordionContent: React.FC<DocumentAccordionContentProps> = ({
  document,
  onAction,
}) => {
  const [showPreview, setShowPreview] = useState(false);

  const renderActionButtons = () => {
    const isGenerated = ['generated', 'available', 'linked', 'signed'].includes(document.status);
    const canGenerate = ['missing', 'pending', 'ready'].includes(document.status);
    const isSigned = document.status === 'signed';

    return (
      <div className="flex flex-wrap gap-3">
        {/* Régénérer - pour tous les documents */}
        <Button
          onClick={() => onAction('regenerate')}
          className="bg-orange-500 hover:bg-orange-600 text-white"
          size="sm"
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Régénérer le document
        </Button>

        {/* Télécharger - si généré */}
        {isGenerated && (
          <Button
            onClick={() => onAction('download')}
            variant="outline"
            size="sm"
          >
            <Download className="h-4 w-4 mr-2" />
            Télécharger
          </Button>
        )}

        {/* Voir - si généré */}
        {isGenerated && (
          <Button
            onClick={() => setShowPreview(true)}
            className="bg-blue-500 hover:bg-blue-600 text-white"
            size="sm"
          >
            <Eye className="h-4 w-4 mr-2" />
            Visualiser
          </Button>
        )}

        {/* Signer par Certicasa - si généré mais pas encore signé */}
        {isGenerated && !isSigned && (
          <Button
            onClick={() => onAction('sign-certicasa')}
            className="bg-emerald-500 hover:bg-emerald-600 text-white"
            size="sm"
          >
            <CheckCircle2 className="h-4 w-4 mr-2" />
            Signer par Certicasa
          </Button>
        )}

        {/* Générer - seulement si pas encore généré */}
        {canGenerate && (
          <Button
            onClick={() => onAction('generate')}
            className="bg-green-500 hover:bg-green-600 text-white"
            size="sm"
          >
            <Settings className="h-4 w-4 mr-2" />
            Générer le document
          </Button>
        )}
      </div>
    );
  };

  const handleDownload = (documentId: string) => {
    onAction('download');
  };

  return (
    <div className="p-4 space-y-4">
      {/* Document Information */}
      <div className="bg-white p-3 rounded-md border">
        <h4 className="text-sm font-medium text-gray-700 mb-2">Informations</h4>
        <div className="text-sm text-gray-600 space-y-1">
          <p><span className="font-medium">Type:</span> {document.name}</p>
          <p><span className="font-medium">Référence:</span> {document.reference}</p>
          <p><span className="font-medium">Statut:</span> {getOperationalStatus(document.status).description}</p>
          {document.status === 'signed' && (
            <p className="text-emerald-600 font-medium">✓ Document validé par l'équipe Certicasa</p>
          )}
        </div>
      </div>

      {/* Document Preview */}
      {['generated', 'available', 'linked', 'signed'].includes(document.status) && (
        <div className="bg-white p-3 rounded-md border">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Aperçu du document</h4>
          <div className="h-96 border rounded-md bg-gray-50 flex items-center justify-center">
            <div className="text-center text-gray-500">
              <Eye className="h-12 w-12 mx-auto mb-2 text-gray-400" />
              <p className="text-sm">Cliquez sur "Visualiser" pour voir le document</p>
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div>
        <h4 className="text-sm font-medium text-gray-700 mb-2">Actions</h4>
        {renderActionButtons()}
      </div>

      {/* Document Preview Modal */}
      <DocumentPreview
        isOpen={showPreview}
        onClose={() => setShowPreview(false)}
        document={document}
        onDownload={handleDownload}
      />
    </div>
  );
};

// Helper function to get status information
const getOperationalStatus = (status: string) => {
  switch (status) {
    case 'missing':
    case 'pending':
      return { description: 'Ce document peut être généré avec les données disponibles.' };
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
      return { description: 'Document validé et signé par l\'équipe Certicasa.' };
    default:
      return { description: 'Document en attente de génération.' };
  }
};

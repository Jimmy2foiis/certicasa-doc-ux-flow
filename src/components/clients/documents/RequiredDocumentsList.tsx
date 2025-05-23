
import React from 'react';
import { AdministrativeDocument, DocumentStatus } from '@/types/documents';
import { Button } from '@/components/ui/button';
import { Eye, FileDown, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import DocumentStatusBadge from '@/features/documents/DocumentStatusBadge';

interface RequiredDocumentsListProps {
  documents: AdministrativeDocument[];
  isLoading: boolean;
  onAction: (documentId: string, action: string) => void;
}

// État de chargement pour la liste de documents
const LoadingState = () => (
  <div className="space-y-4">
    {Array(8).fill(0).map((_, i) => (
      <div key={i} className="animate-pulse flex items-center p-4 border rounded-md">
        <div className="w-6 h-6 bg-gray-200 rounded-full mr-4"></div>
        <div className="flex-1">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
          <div className="h-3 bg-gray-100 rounded w-1/2"></div>
        </div>
        <div className="flex space-x-2">
          <div className="w-20 h-8 bg-gray-200 rounded"></div>
          <div className="w-20 h-8 bg-gray-200 rounded"></div>
        </div>
      </div>
    ))}
  </div>
);

export const RequiredDocumentsList: React.FC<RequiredDocumentsListProps> = ({
  documents,
  isLoading,
  onAction,
}) => {
  if (isLoading) {
    return <LoadingState />;
  }

  // Trier les documents par ordre
  const sortedDocuments = [...documents].sort((a, b) => (a.order || 0) - (b.order || 0));

  return (
    <div className="space-y-3">
      {/* En-tête des colonnes */}
      <div className="grid grid-cols-12 text-sm font-medium text-gray-500 border-b pb-2">
        <div className="col-span-1">N°</div>
        <div className="col-span-4">Nom du document</div>
        <div className="col-span-3">Référence</div>
        <div className="col-span-2">Statut</div>
        <div className="col-span-2 text-right">Actions</div>
      </div>
      
      {/* Liste des documents */}
      {sortedDocuments.map((doc, index) => (
        <div
          key={doc.id}
          className="grid grid-cols-12 items-center p-3 border rounded-md hover:bg-gray-50 transition-colors"
        >
          {/* Numéro d'ordre */}
          <div className="col-span-1 font-medium text-gray-600">
            {doc.order || index + 1}
          </div>
          
          {/* Nom du document */}
          <div className="col-span-4">
            <div className="font-medium">{doc.name}</div>
            <div className="text-xs text-gray-500">{doc.description}</div>
          </div>
          
          {/* Référence du document */}
          <div className="col-span-3 text-sm text-gray-600">
            {doc.reference}
          </div>
          
          {/* Statut du document */}
          <div className="col-span-2">
            <DocumentStatusBadge 
              status={doc.status as DocumentStatus} 
              customLabel={doc.statusLabel} 
            />
          </div>
          
          {/* Actions pour le document */}
          <div className="col-span-2 flex justify-end space-x-2">
            {(doc.status === 'generated' || doc.status === 'available') ? (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onAction(doc.id, 'view')}
                  className="flex items-center"
                >
                  <Eye className="h-3.5 w-3.5 mr-1" />
                  <span>Voir</span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onAction(doc.id, 'download')}
                  className="flex items-center"
                >
                  <FileDown className="h-3.5 w-3.5 mr-1" />
                  <span>Télécharger</span>
                </Button>
              </>
            ) : (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onAction(doc.id, 'generate')}
                disabled={doc.status === 'error'}
                className="flex items-center"
              >
                {doc.status === 'error' ? (
                  <>
                    <AlertCircle className="h-3.5 w-3.5 mr-1 text-red-500" />
                    <span>Erreur</span>
                  </>
                ) : (
                  <>
                    <Clock className="h-3.5 w-3.5 mr-1" />
                    <span>Générer</span>
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

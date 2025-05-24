
import React, { useState, useCallback } from 'react';
import { AdministrativeDocument } from '@/types/documents';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { GripVertical, RotateCcw } from 'lucide-react';
import { getOperationalStatus } from './DocumentStatusUtils';
import { DocumentActionButtons } from './DocumentActionButtons';
import { DocumentsProgressBar } from './DocumentsProgressBar';

interface DocumentsWithDragDropProps {
  documents: AdministrativeDocument[];
  isLoading: boolean;
  onAction: (documentId: string, action: string) => void;
}

const DocumentsLoadingState = () => (
  <div className="space-y-4">
    {Array(8).fill(0).map((_, i) => (
      <div key={i} className="animate-pulse grid grid-cols-12 items-center p-3 border rounded-md">
        <div className="col-span-1">
          <div className="w-4 h-4 bg-gray-200 rounded"></div>
        </div>
        <div className="col-span-1">
          <div className="w-6 h-6 bg-gray-200 rounded-full"></div>
        </div>
        <div className="col-span-3">
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
          <div className="h-3 bg-gray-100 rounded w-1/2"></div>
        </div>
        <div className="col-span-3">
          <div className="h-4 bg-gray-200 rounded w-2/3"></div>
        </div>
        <div className="col-span-2">
          <div className="w-20 h-6 bg-gray-200 rounded"></div>
        </div>
        <div className="col-span-2 flex justify-end">
          <div className="w-20 h-8 bg-gray-200 rounded"></div>
        </div>
      </div>
    ))}
  </div>
);

export const DocumentsWithDragDrop: React.FC<DocumentsWithDragDropProps> = ({
  documents,
  isLoading,
  onAction,
}) => {
  const [orderedDocuments, setOrderedDocuments] = useState(documents);
  const [isCustomOrder, setIsCustomOrder] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [draggedForPreview, setDraggedForPreview] = useState<string | null>(null);

  // Update when documents prop changes
  React.useEffect(() => {
    if (!isCustomOrder) {
      setOrderedDocuments(documents.sort((a, b) => (a.order || 0) - (b.order || 0)));
    }
  }, [documents, isCustomOrder]);

  const handleDragStart = useCallback((e: React.DragEvent, index: number, isForPreview = false) => {
    const document = orderedDocuments[index];
    
    if (isForPreview) {
      // Drag for preview - only allow if document is generated
      if (['generated', 'available', 'linked', 'signed'].includes(document.status)) {
        setDraggedForPreview(document.id);
        e.dataTransfer.setData('application/json', JSON.stringify(document));
        e.dataTransfer.effectAllowed = 'copy';
      } else {
        e.preventDefault();
        return;
      }
    } else {
      // Drag for reordering
      setDraggedIndex(index);
      e.dataTransfer.effectAllowed = 'move';
    }
  }, [orderedDocuments]);

  const handleDragEnd = useCallback(() => {
    setDraggedIndex(null);
    setDraggedForPreview(null);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  }, []);

  const handleDrop = useCallback((e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    
    if (draggedIndex === null || draggedIndex === dropIndex) {
      setDraggedIndex(null);
      return;
    }

    const newDocuments = [...orderedDocuments];
    const [draggedItem] = newDocuments.splice(draggedIndex, 1);
    newDocuments.splice(dropIndex, 0, draggedItem);
    
    setOrderedDocuments(newDocuments);
    setIsCustomOrder(true);
    setDraggedIndex(null);
  }, [draggedIndex, orderedDocuments]);

  const resetOrder = useCallback(() => {
    const defaultOrder = [...documents].sort((a, b) => (a.order || 0) - (b.order || 0));
    setOrderedDocuments(defaultOrder);
    setIsCustomOrder(false);
  }, [documents]);

  const handleGenerateAll = () => {
    orderedDocuments
      .filter(doc => ['missing', 'pending', 'ready'].includes(doc.status))
      .forEach(doc => onAction(doc.id, 'generate'));
  };

  if (isLoading) {
    return <DocumentsLoadingState />;
  }

  return (
    <div className="space-y-4">
      {/* Progress Bar */}
      <DocumentsProgressBar documents={orderedDocuments} onGenerateAll={handleGenerateAll} />

      {/* Custom Order Indicator */}
      {isCustomOrder && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex items-center justify-between">
          <div className="flex items-center gap-2 text-blue-700">
            <GripVertical className="h-4 w-4" />
            <span className="text-sm font-medium">🔀 Ordre personnalisé actif</span>
          </div>
          <Button
            onClick={resetOrder}
            variant="outline"
            size="sm"
            className="text-blue-600 border-blue-300 hover:bg-blue-50"
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            ↩️ Réinitialiser l'ordre par défaut
          </Button>
        </div>
      )}

      {/* Documents Grid */}
      <div className="space-y-3">
        {/* En-tête des colonnes */}
        <div className="grid grid-cols-12 text-sm font-medium text-gray-500 border-b pb-2">
          <div className="col-span-1"></div>
          <div className="col-span-1">N°</div>
          <div className="col-span-3">Nom du document</div>
          <div className="col-span-3">Nom fichier attendu</div>
          <div className="col-span-2">Statut</div>
          <div className="col-span-2 text-right">Actions</div>
        </div>
        
        {/* Liste des documents */}
        {orderedDocuments.map((doc, index) => {
          const operationalStatus = getOperationalStatus(doc.status);
          const StatusIcon = operationalStatus.icon;
          const canPreview = ['generated', 'available', 'linked', 'signed'].includes(doc.status);
          
          return (
            <div
              key={doc.id}
              className={`
                grid grid-cols-12 items-center p-3 border rounded-md hover:bg-gray-50 transition-colors 
                ${canPreview ? 'cursor-grab active:cursor-grabbing' : 'cursor-move'}
              `}
              draggable
              onDragStart={(e) => handleDragStart(e, index)}
              onDragEnd={handleDragEnd}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, index)}
            >
              {/* Grip handle */}
              <div className="col-span-1 text-center">
                <GripVertical className="h-4 w-4 text-gray-400 cursor-grab active:cursor-grabbing" />
              </div>
              
              {/* Numéro d'ordre */}
              <div className="col-span-1 font-medium text-gray-600">
                {doc.order || index + 1}
              </div>
              
              {/* Nom du document */}
              <div 
                className={`col-span-3 ${canPreview ? 'cursor-grab' : ''}`}
                draggable={canPreview}
                onDragStart={canPreview ? (e) => handleDragStart(e, index, true) : undefined}
                onDragEnd={handleDragEnd}
              >
                <div className="font-medium flex items-center gap-2">
                  {doc.name}
                  {canPreview && (
                    <span className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded">
                      📄 Glissez pour prévisualiser
                    </span>
                  )}
                </div>
                <div className="text-xs text-gray-500">{doc.description}</div>
              </div>
              
              {/* Nom fichier attendu */}
              <div className="col-span-3 text-sm text-gray-600">
                {doc.reference}
              </div>
              
              {/* Statut du document */}
              <div className="col-span-2">
                <Badge className={`flex items-center gap-1.5 font-normal px-2 py-1 ${operationalStatus.color}`}>
                  <StatusIcon className="h-3 w-3" />
                  <span>{operationalStatus.label}</span>
                </Badge>
              </div>
              
              {/* Actions pour le document */}
              <div className="col-span-2 flex justify-end">
                <DocumentActionButtons 
                  document={doc} 
                  onAction={(action) => onAction(doc.id, action)} 
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

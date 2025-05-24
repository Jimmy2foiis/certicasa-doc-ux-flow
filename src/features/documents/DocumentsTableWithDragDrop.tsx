
import React, { useState, useCallback } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import DocumentStatusBadge from '@/features/documents/DocumentStatusBadge';
import { AdministrativeDocument } from '@/models/documents';
import { 
  GripVertical, 
  RotateCcw, 
  Settings, 
  RefreshCw, 
  Eye, 
  Download, 
  Trash2,
  Clock,
  CheckCircle,
  AlertTriangle,
  XCircle,
  FileX,
  CheckCircle2
} from 'lucide-react';

interface DocumentsTableWithDragDropProps {
  documents: AdministrativeDocument[];
  onDocumentAction: (documentId: string, action: string) => void;
  onReorderDocuments?: (reorderedDocs: AdministrativeDocument[]) => void;
}

// Enhanced status with operational context
const getOperationalStatus = (status: string) => {
  switch (status) {
    case 'missing':
    case 'pending':
      return {
        label: 'À générer',
        color: 'bg-gray-100 text-gray-800 border-gray-200',
        icon: Clock,
        description: 'Par défaut, jamais généré'
      };
    case 'generated':
    case 'linked':
      return {
        label: 'Généré',
        color: 'bg-green-100 text-green-800 border-green-200',
        icon: CheckCircle,
        description: 'Fichier généré avec succès'
      };
    case 'action-required':
      return {
        label: 'À vérifier',
        color: 'bg-orange-100 text-orange-800 border-orange-200',
        icon: AlertTriangle,
        description: 'Document à relire ou valider'
      };
    case 'error':
      return {
        label: 'Erreur',
        color: 'bg-red-100 text-red-800 border-red-200',
        icon: XCircle,
        description: 'Génération échouée'
      };
    case 'ready':
      return {
        label: 'Manquant',
        color: 'bg-gray-100 text-gray-800 border-gray-200',
        icon: FileX,
        description: 'Élément source non fourni'
      };
    case 'signed':
      return {
        label: 'Validé',
        color: 'bg-emerald-100 text-emerald-800 border-emerald-200',
        icon: CheckCircle2,
        description: 'Vérifié par un opérateur admin'
      };
    default:
      return {
        label: 'À générer',
        color: 'bg-gray-100 text-gray-800 border-gray-200',
        icon: Clock,
        description: 'Par défaut, jamais généré'
      };
  }
};

// Get action button based on document status
const getActionButton = (document: AdministrativeDocument, onAction: (action: string) => void) => {
  const status = document.status;
  
  switch (status) {
    case 'missing':
    case 'pending':
    case 'ready':
      return (
        <Button
          onClick={() => onAction('generate')}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md flex items-center gap-2"
          size="sm"
        >
          <Settings className="h-4 w-4" />
          Générer
        </Button>
      );
      
    case 'error':
      return (
        <Button
          onClick={() => onAction('regenerate')}
          className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-md flex items-center gap-2"
          size="sm"
        >
          <RefreshCw className="h-4 w-4" />
          Régénérer
        </Button>
      );
      
    case 'generated':
    case 'linked':
    case 'signed':
      return (
        <div className="flex gap-2">
          <Button
            onClick={() => onAction('view')}
            className="bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded-md flex items-center gap-1.5"
            size="sm"
          >
            <Eye className="h-4 w-4" />
            Voir
          </Button>
          <Button
            onClick={() => onAction('download')}
            variant="outline"
            className="px-3 py-2 rounded-md flex items-center gap-1.5"
            size="sm"
          >
            <Download className="h-4 w-4" />
            Télécharger
          </Button>
        </div>
      );
      
    case 'action-required':
      return (
        <div className="flex gap-2">
          <Button
            onClick={() => onAction('view')}
            className="bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded-md flex items-center gap-1.5"
            size="sm"
          >
            <Eye className="h-4 w-4" />
            Voir
          </Button>
          <Button
            onClick={() => onAction('regenerate')}
            className="bg-orange-500 hover:bg-orange-600 text-white px-3 py-2 rounded-md flex items-center gap-1.5"
            size="sm"
          >
            <RefreshCw className="h-4 w-4" />
            Régénérer
          </Button>
        </div>
      );
      
    default:
      return (
        <Button
          onClick={() => onAction('generate')}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md flex items-center gap-2"
          size="sm"
        >
          <Settings className="h-4 w-4" />
          Générer
        </Button>
      );
  }
};

const DocumentsTableWithDragDrop = ({ 
  documents, 
  onDocumentAction, 
  onReorderDocuments 
}: DocumentsTableWithDragDropProps) => {
  const [orderedDocuments, setOrderedDocuments] = useState(documents);
  const [isCustomOrder, setIsCustomOrder] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  // Update when documents prop changes
  React.useEffect(() => {
    if (!isCustomOrder) {
      setOrderedDocuments(documents.sort((a, b) => (a.order || 0) - (b.order || 0)));
    }
  }, [documents, isCustomOrder]);

  const handleDragStart = useCallback((e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
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
    
    if (onReorderDocuments) {
      onReorderDocuments(newDocuments);
    }
  }, [draggedIndex, orderedDocuments, onReorderDocuments]);

  const resetOrder = useCallback(() => {
    const defaultOrder = [...documents].sort((a, b) => (a.order || 0) - (b.order || 0));
    setOrderedDocuments(defaultOrder);
    setIsCustomOrder(false);
    if (onReorderDocuments) {
      onReorderDocuments(defaultOrder);
    }
  }, [documents, onReorderDocuments]);

  // Calculate progress
  const totalDocs = orderedDocuments.length;
  const generatedDocs = orderedDocuments.filter(doc => 
    ['generated', 'linked', 'signed'].includes(doc.status)
  ).length;
  const errorDocs = orderedDocuments.filter(doc => doc.status === 'error').length;
  const toVerifyDocs = orderedDocuments.filter(doc => doc.status === 'action-required').length;
  const pendingDocs = orderedDocuments.filter(doc => 
    ['missing', 'pending', 'ready'].includes(doc.status)
  ).length;

  const handleGenerateAll = () => {
    orderedDocuments
      .filter(doc => ['missing', 'pending', 'ready'].includes(doc.status))
      .forEach(doc => onDocumentAction(doc.id, 'generate'));
  };

  return (
    <div className="space-y-4">
      {/* Progress Bar */}
      <div className="bg-white p-4 rounded-lg border">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-medium text-gray-900">Progression documentaire</h3>
          {pendingDocs > 1 && (
            <Button
              onClick={handleGenerateAll}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md flex items-center gap-2"
              size="sm"
            >
              <Settings className="h-4 w-4" />
              Générer tous les documents
            </Button>
          )}
        </div>
        <div className="flex items-center gap-6 text-sm">
          <span className="text-green-600">
            {generatedDocs} / {totalDocs} documents générés
          </span>
          {errorDocs > 0 && (
            <span className="text-red-600">{errorDocs} erreur{errorDocs > 1 ? 's' : ''}</span>
          )}
          {toVerifyDocs > 0 && (
            <span className="text-orange-600">{toVerifyDocs} à vérifier</span>
          )}
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
          <div 
            className="bg-green-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(generatedDocs / totalDocs) * 100}%` }}
          />
        </div>
      </div>

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

      {/* Documents Table */}
      <div className="rounded-md border bg-white">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="w-[40px]"></TableHead>
              <TableHead className="w-[45%] font-medium">Document</TableHead>
              <TableHead className="w-[25%] font-medium">Statut</TableHead>
              <TableHead className="w-[30%] font-medium">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orderedDocuments.map((document, index) => {
              const operationalStatus = getOperationalStatus(document.status);
              const StatusIcon = operationalStatus.icon;
              
              return (
                <TableRow 
                  key={document.id} 
                  className="hover:bg-muted/30 cursor-move"
                  draggable
                  onDragStart={(e) => handleDragStart(e, index)}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, index)}
                >
                  <TableCell className="text-center">
                    <GripVertical className="h-4 w-4 text-gray-400 cursor-grab active:cursor-grabbing" />
                  </TableCell>
                  
                  <TableCell className="font-medium">
                    <div className="flex items-start gap-2">
                      <span className="bg-muted w-6 h-6 rounded-full flex items-center justify-center text-xs mt-0.5">
                        {document.order || index + 1}
                      </span>
                      <div>
                        <p className="font-medium text-foreground">{document.name}</p>
                        <p className="text-xs text-muted-foreground">{document.description}</p>
                      </div>
                    </div>
                  </TableCell>
                  
                  <TableCell>
                    <Badge className={`flex items-center gap-1.5 font-normal px-2 py-1 ${operationalStatus.color}`}>
                      <StatusIcon className="h-3 w-3" />
                      <span>{operationalStatus.label}</span>
                    </Badge>
                  </TableCell>
                  
                  <TableCell>
                    {getActionButton(document, (action) => onDocumentAction(document.id, action))}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default DocumentsTableWithDragDrop;

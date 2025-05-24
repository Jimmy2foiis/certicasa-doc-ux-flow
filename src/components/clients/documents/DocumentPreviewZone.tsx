
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Download, X } from 'lucide-react';
import { DocumentPreview } from '@/features/documents/DocumentPreview';
import type { AdministrativeDocument } from '@/types/documents';

interface DocumentPreviewZoneProps {
  onDownload: (documentId: string) => void;
}

export const DocumentPreviewZone = ({ onDownload }: DocumentPreviewZoneProps) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [previewDocument, setPreviewDocument] = useState<AdministrativeDocument | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const documentData = e.dataTransfer.getData('application/json');
    if (documentData) {
      try {
        const document = JSON.parse(documentData) as AdministrativeDocument;
        if (document.status === 'generated' || document.status === 'available' || document.status === 'linked' || document.status === 'signed') {
          setPreviewDocument(document);
          setIsPreviewOpen(true);
        }
      } catch (error) {
        console.error('Erreur lors du parsing du document:', error);
      }
    }
  };

  const handleClosePreview = () => {
    setIsPreviewOpen(false);
    setPreviewDocument(null);
  };

  return (
    <>
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Zone de prévisualisation
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div
            className={`
              border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200
              ${isDragOver 
                ? 'border-blue-500 bg-blue-50 scale-105' 
                : 'border-gray-300 hover:border-gray-400'
              }
            `}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <FileText className={`h-12 w-12 mx-auto mb-4 ${isDragOver ? 'text-blue-500' : 'text-gray-400'}`} />
            <p className={`text-lg font-medium ${isDragOver ? 'text-blue-700' : 'text-gray-600'}`}>
              {isDragOver ? 'Relâchez pour prévisualiser' : 'Glissez un document ici pour le prévisualiser'}
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Seuls les documents générés peuvent être prévisualisés
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Document Preview Dialog */}
      <DocumentPreview
        isOpen={isPreviewOpen}
        onClose={handleClosePreview}
        document={previewDocument}
        onDownload={onDownload}
      />
    </>
  );
};

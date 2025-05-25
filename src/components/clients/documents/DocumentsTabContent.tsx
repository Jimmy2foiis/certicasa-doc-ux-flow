
import React from 'react';
import { CardContent } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info } from "lucide-react";
import { DocumentsWithDragDrop } from './DocumentsWithDragDrop';
import type { AdministrativeDocument } from '@/types/documents';

interface DocumentsTabContentProps {
  requiredDocuments: AdministrativeDocument[];
  isLoading: boolean;
  onAction: (documentId: string, action: string) => void;
  onRefresh: () => void;
}

const DocumentsTabContent = ({ 
  requiredDocuments, 
  isLoading, 
  onAction, 
  onRefresh 
}: DocumentsTabContentProps) => {
  return (
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
        isLoading={isLoading}
        onAction={onAction}
        onRefresh={onRefresh}
      />
    </CardContent>
  );
};

export default DocumentsTabContent;

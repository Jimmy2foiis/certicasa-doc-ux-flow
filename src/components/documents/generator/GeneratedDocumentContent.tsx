
import React from 'react';
import { Button } from "@/components/ui/button";
import { FileText, Download } from "lucide-react";

interface GeneratedDocumentContentProps {
  documentId: string | null;
  clientId?: string;
  canDownload: boolean;
  onDownload: () => Promise<void>;
}

export function GeneratedDocumentContent({ 
  documentId, 
  clientId, 
  canDownload,
  onDownload
}: GeneratedDocumentContentProps) {
  // Convert the onDownload handler to return a Promise if it doesn't already
  const handleDownload = async () => {
    await onDownload();
  };

  return (
    <div className="py-8 text-center">
      <div className="flex flex-col items-center">
        <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
          <FileText className="h-6 w-6 text-green-500" />
        </div>
        <h3 className="mt-4 font-medium text-lg">Document généré avec succès</h3>
        <p className="text-gray-500 mt-2">
          Le document est maintenant prêt à être téléchargé ou envoyé par email
        </p>
        
        <div className="mt-6 flex gap-4">
          <Button
            variant="default"
            onClick={handleDownload}
            disabled={!canDownload}
          >
            <Download className="mr-2 h-4 w-4" />
            Télécharger
          </Button>
        </div>
        
        <div className="mt-6 text-sm text-gray-400">
          ID du document : {documentId}
        </div>
      </div>
    </div>
  );
}

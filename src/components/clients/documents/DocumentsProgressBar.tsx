
import React from 'react';
import { Button } from "@/components/ui/button";
import { Settings } from 'lucide-react';
import type { AdministrativeDocument } from '@/types/documents';

interface DocumentsProgressBarProps {
  documents: AdministrativeDocument[];
  onGenerateAll: () => void;
}

export const DocumentsProgressBar: React.FC<DocumentsProgressBarProps> = ({ documents, onGenerateAll }) => {
  // Calculate progress
  const totalDocs = documents.length;
  const generatedDocs = documents.filter(doc => 
    ['generated', 'available', 'linked', 'signed'].includes(doc.status)
  ).length;
  const errorDocs = documents.filter(doc => doc.status === 'error').length;
  const toVerifyDocs = documents.filter(doc => doc.status === 'action-required').length;
  const pendingDocs = documents.filter(doc => 
    ['missing', 'pending', 'ready'].includes(doc.status)
  ).length;

  return (
    <div className="bg-white p-4 rounded-lg border">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-medium text-gray-900">Progression documentaire</h3>
        {pendingDocs > 1 && (
          <Button
            onClick={onGenerateAll}
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
  );
};

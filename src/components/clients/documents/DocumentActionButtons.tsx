
import React from 'react';
import { Button } from "@/components/ui/button";
import { 
  Settings, 
  RefreshCw, 
  Eye, 
  Download
} from 'lucide-react';
import type { AdministrativeDocument } from '@/types/documents';

interface DocumentActionButtonsProps {
  document: AdministrativeDocument;
  onAction: (action: string) => void;
}

export const DocumentActionButtons: React.FC<DocumentActionButtonsProps> = ({ document, onAction }) => {
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
    case 'available':
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

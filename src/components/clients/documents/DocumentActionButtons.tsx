
import React from 'react';
import { Button } from "@/components/ui/button";
import { Settings, Eye, Download, RefreshCw, CheckCircle2 } from 'lucide-react';
import { AdministrativeDocument } from '@/types/documents';

interface DocumentActionButtonsProps {
  document: AdministrativeDocument;
  onAction: (action: string) => void;
  compact?: boolean;
}

export const DocumentActionButtons: React.FC<DocumentActionButtonsProps> = ({
  document,
  onAction,
  compact = false
}) => {
  const isGenerated = ['generated', 'available', 'linked', 'signed'].includes(document.status);
  const canGenerate = ['missing', 'pending', 'ready'].includes(document.status);
  const isError = document.status === 'error';

  // En mode compact, on affiche seulement l'action principale
  if (compact) {
    if (canGenerate) {
      return (
        <Button
          onClick={() => onAction('generate')}
          className="bg-green-500 hover:bg-green-600 text-white"
          size="sm"
        >
          <Settings className="h-4 w-4 mr-1" />
          Générer
        </Button>
      );
    }

    if (isError) {
      return (
        <Button
          onClick={() => onAction('regenerate')}
          className="bg-orange-500 hover:bg-orange-600 text-white"
          size="sm"
        >
          <RefreshCw className="h-4 w-4 mr-1" />
          Régénérer
        </Button>
      );
    }

    if (isGenerated) {
      return (
        <Button
          onClick={() => onAction('view')}
          className="bg-blue-500 hover:bg-blue-600 text-white"
          size="sm"
        >
          <Eye className="h-4 w-4 mr-1" />
          Voir
        </Button>
      );
    }
  }

  // Mode complet (dans l'accordéon)
  return (
    <div className="flex flex-wrap gap-2">
      {canGenerate && (
        <Button
          onClick={() => onAction('generate')}
          className="bg-green-500 hover:bg-green-600 text-white"
          size="sm"
        >
          <Settings className="h-4 w-4 mr-1" />
          Générer
        </Button>
      )}

      {isGenerated && (
        <>
          <Button
            onClick={() => onAction('view')}
            className="bg-blue-500 hover:bg-blue-600 text-white"
            size="sm"
          >
            <Eye className="h-4 w-4 mr-1" />
            Voir
          </Button>
          <Button
            onClick={() => onAction('download')}
            variant="outline"
            size="sm"
          >
            <Download className="h-4 w-4 mr-1" />
            Télécharger
          </Button>
        </>
      )}

      {isGenerated && document.status !== 'signed' && (
        <Button
          onClick={() => onAction('sign-certicasa')}
          className="bg-emerald-500 hover:bg-emerald-600 text-white"
          size="sm"
        >
          <CheckCircle2 className="h-4 w-4 mr-1" />
          Signer Certicasa
        </Button>
      )}

      {(isGenerated || isError) && (
        <Button
          onClick={() => onAction('regenerate')}
          variant="outline"
          size="sm"
        >
          <RefreshCw className="h-4 w-4 mr-1" />
          Régénérer
        </Button>
      )}
    </div>
  );
};

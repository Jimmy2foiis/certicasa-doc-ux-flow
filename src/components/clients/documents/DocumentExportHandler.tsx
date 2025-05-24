
import { useToast } from '@/hooks/use-toast';
import type { AdministrativeDocument } from '@/types/documents';
import { exportAllDocuments } from '@/services/documentService';

interface DocumentExportHandlerProps {
  filteredDocuments: AdministrativeDocument[];
  onError: (error: string) => void;
}

export const useDocumentExport = ({ filteredDocuments, onError }: DocumentExportHandlerProps) => {
  const { toast } = useToast();

  const handleExportAll = async () => {
    try {
      onError('');

      if (!filteredDocuments || filteredDocuments.length === 0) {
        onError('Aucun document à exporter');
        toast({
          title: 'Information',
          description: 'Aucun document à exporter.',
          variant: 'default',
        });
        return;
      }

      toast({
        title: 'Export groupé',
        description: "Préparation de l'export des documents...",
      });

      const exportResult = await exportAllDocuments(filteredDocuments);

      if (exportResult.success) {
        toast({
          title: 'Export réussi',
          description: 'Tous les documents ont été exportés avec succès',
        });
      } else {
        onError(`Erreur d'exportation: ${exportResult.error}`);
        toast({
          title: "Erreur d'exportation",
          description: exportResult.error || "Impossible d'exporter tous les documents",
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error("Erreur lors de l'exportation des documents:", error);
      onError(error instanceof Error ? error.message : 'Erreur inattendue');
      toast({
        title: 'Erreur',
        description: "Une erreur est survenue lors de l'exportation",
        variant: 'destructive',
      });
    }
  };

  const handleGenerateAll = () => {
    const pendingDocs = filteredDocuments.filter(doc => 
      ['missing', 'pending', 'ready'].includes(doc.status)
    );
    
    if (pendingDocs.length === 0) {
      toast({
        title: 'Information',
        description: 'Aucun document en attente de génération.',
      });
      return;
    }

    toast({
      title: 'Génération groupée',
      description: `Génération de ${pendingDocs.length} document(s) en cours...`,
    });

    return pendingDocs;
  };

  return {
    handleExportAll,
    handleGenerateAll,
  };
};

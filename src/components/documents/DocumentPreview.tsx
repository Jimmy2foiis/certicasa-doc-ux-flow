
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { PDFViewer } from './PDFViewer';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface DocumentPreviewProps {
  isOpen: boolean;
  onClose: () => void;
  document: {
    id: string;
    name: string;
    type: string;
    content?: string | null;
    file_path?: string | null;
  } | null;
  onDownload: (documentId: string) => void;
}

export const DocumentPreview = ({ isOpen, onClose, document, onDownload }: DocumentPreviewProps) => {
  const { toast } = useToast();
  const [pdfUrl, setPdfUrl] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState<boolean>(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (isOpen && document) {
      setIsLoading(true);
      setError(null);

      try {
        if (document.content) {
          // Si le contenu est une URL data (base64)
          if (document.content.startsWith('data:')) {
            setPdfUrl(document.content);
          } else {
            // Si le contenu est un binaire ou du texte brut
            const blob = new Blob([document.content], { type: 'application/pdf' });
            setPdfUrl(URL.createObjectURL(blob));
          }
        } else if (document.file_path) {
          // Si nous avons un chemin de fichier
          setPdfUrl(document.file_path);
        } else {
          setError("Aucun contenu disponible pour ce document");
        }
      } catch (err) {
        console.error("Erreur lors du chargement du PDF:", err);
        setError("Impossible de charger le document");
        toast({
          title: "Erreur",
          description: "Impossible de charger le document PDF",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    } else {
      // Nettoyer l'URL lors de la fermeture
      if (pdfUrl && pdfUrl.startsWith('blob:')) {
        URL.revokeObjectURL(pdfUrl);
      }
      setPdfUrl(null);
    }

    // Nettoyage lors du démontage
    return () => {
      if (pdfUrl && pdfUrl.startsWith('blob:')) {
        URL.revokeObjectURL(pdfUrl);
      }
    };
  }, [isOpen, document, toast]);

  const handleDownload = () => {
    if (document) {
      onDownload(document.id);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => onClose()}>
      <DialogContent className="max-w-4xl h-[90vh]">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle>{document?.name}</DialogTitle>
          <Button 
            variant="outline" 
            onClick={handleDownload}
            disabled={!document || (!document.content && !document.file_path)}
            className="flex items-center gap-1"
          >
            <Download className="h-4 w-4" />
            <span>Télécharger</span>
          </Button>
        </DialogHeader>

        <div className="mt-4 flex-1 overflow-hidden">
          {isLoading ? (
            <div className="flex h-full items-center justify-center">
              <div className="text-center">
                <div className="animate-spin h-10 w-10 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
                <p>Chargement du document...</p>
              </div>
            </div>
          ) : error ? (
            <div className="flex h-full items-center justify-center">
              <div className="text-center text-destructive">
                <p>{error}</p>
              </div>
            </div>
          ) : document?.type?.toLowerCase() === 'pdf' && pdfUrl ? (
            <PDFViewer fileUrl={pdfUrl} fileName={document.name} />
          ) : (
            <div className="flex h-full items-center justify-center">
              <div className="text-center">
                <p>L'aperçu n'est pas disponible pour ce type de document.</p>
                <p className="text-sm text-muted-foreground mt-2">Veuillez télécharger le fichier pour le consulter.</p>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

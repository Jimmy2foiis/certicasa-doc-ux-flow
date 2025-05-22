
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { apiClient } from "@/lib/api-client";
import { TemplateTag } from "@/types/documents";

export const useDocumentGeneration = (onDocumentGenerated?: (documentId: string) => void, clientName?: string) => {
  const [generating, setGenerating] = useState(false);
  const [generated, setGenerated] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [documentId, setDocumentId] = useState<string | null>(null);
  const [canDownload, setCanDownload] = useState(false);
  const { toast } = useToast();
  
  const reset = () => {
    setGenerating(false);
    setGenerated(false);
    setError(null);
    setDocumentId(null);
    setCanDownload(false);
  };
  
  const handleGenerate = async (templateId: string, clientId?: string, mappings?: TemplateTag[]) => {
    try {
      setGenerating(true);
      setError(null);
      
      // Display a mock generation process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const mockDocumentId = `doc_${Date.now()}`;
      setDocumentId(mockDocumentId);
      
      toast({
        title: "Document généré",
        description: `Le document ${clientName ? `pour ${clientName} ` : ''}a été généré avec succès.`,
      });
      
      setGenerated(true);
      setCanDownload(true);
      
      if (onDocumentGenerated) {
        onDocumentGenerated(mockDocumentId);
      }
      
      return mockDocumentId;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erreur inconnue lors de la génération du document";
      setError(errorMessage);
      console.error("Erreur de génération de document:", err);
      
      toast({
        title: "Erreur",
        description: errorMessage,
        variant: "destructive",
      });
      
      return null;
    } finally {
      setGenerating(false);
    }
  };
  
  const handleDownload = async () => {
    try {
      toast({
        title: "Téléchargement",
        description: "Le document a été téléchargé.",
      });
      
      // Mock download action
      return true;
    } catch (error) {
      console.error("Erreur lors du téléchargement:", error);
      toast({
        title: "Erreur",
        description: "Impossible de télécharger le document.",
        variant: "destructive",
      });
      return false;
    }
  };
  
  return {
    generating,
    generated,
    documentId,
    handleGenerate,
    handleDownload,
    error,
    canDownload,
    reset
  };
};

// For backward compatibility with default imports
export default useDocumentGeneration;

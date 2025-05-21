
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";

interface UseDocumentActionsProps {
  documentId: string | null;
}

export const useDocumentActions = ({ documentId }: UseDocumentActionsProps) => {
  const { toast } = useToast();

  // Fonction pour télécharger un document
  const handleDownload = async (): Promise<void> => {
    if (!documentId) {
      toast({
        title: "Erreur",
        description: "Aucun document à télécharger.",
        variant: "destructive",
      });
      return;
    }

    try {
      // Import dynamique pour éviter de charger ces modules à l'initialisation
      const { downloadDocument } = await import("@/utils/downloadUtils");
      const success = await downloadDocument(documentId);
      
      if (success) {
        toast({
          title: "Téléchargement",
          description: "Le téléchargement du document a commencé.",
        });
      } else {
        throw new Error("Échec du téléchargement");
      }
    } catch (error) {
      console.error("Erreur de téléchargement:", error);
      toast({
        title: "Erreur",
        description: "Impossible de télécharger le document.",
        variant: "destructive",
      });
    }
  };

  // Fonction pour enregistrer le document dans un dossier
  const handleSaveToFolder = async (): Promise<boolean> => {
    if (!documentId) {
      toast({
        title: "Erreur",
        description: "Aucun document à enregistrer.",
        variant: "destructive",
      });
      return false;
    }

    try {
      // Import dynamique
      const { saveDocumentToFolder } = await import("@/utils/downloadUtils");
      const success = await saveDocumentToFolder(documentId, null);
      
      if (success) {
        toast({
          title: "Document sauvegardé",
          description: "Le document a été ajouté au dossier du client.",
        });
      }
      return success;
    } catch (error) {
      console.error("Erreur de sauvegarde:", error);
      toast({
        title: "Erreur",
        description: "Impossible d'enregistrer le document dans le dossier.",
        variant: "destructive",
      });
      return false;
    }
  };

  return {
    handleDownload,
    handleSaveToFolder
  };
};


import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";

export const useDocumentGeneration = (
  onDocumentGenerated?: (documentId: string) => void,
  clientName?: string
) => {
  const [generating, setGenerating] = useState(false);
  const [generated, setGenerated] = useState(false);
  const { toast } = useToast();

  const handleGenerate = (selectedTemplate: string) => {
    if (!selectedTemplate) {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner un modèle de document.",
        variant: "destructive",
      });
      return;
    }

    setGenerating(true);

    // Simuler le temps de génération
    setTimeout(() => {
      setGenerating(false);
      setGenerated(true);
      
      // Générer un ID de document
      const documentId = `doc-${Date.now()}`;
      
      toast({
        title: "Document généré avec succès",
        description: clientName 
          ? `Le document a été généré et ajouté au dossier du client ${clientName}.`
          : "Le document a été généré avec succès.",
      });
      
      // Notifier le parent si nécessaire
      if (onDocumentGenerated) {
        onDocumentGenerated(documentId);
      }
      
      // Reset après quelques secondes
      setTimeout(() => {
        setGenerated(false);
      }, 2000);
    }, 1500);
  };

  const handleDownload = () => {
    toast({
      title: "Téléchargement commencé",
      description: "Le document est en cours de téléchargement."
    });
  };

  return {
    generating,
    generated,
    setGenerated,
    handleGenerate,
    handleDownload
  };
};

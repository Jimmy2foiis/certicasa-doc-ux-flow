import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { apiClient } from "@/lib/api-client";

const useDocumentGeneration = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  
  const generateDocument = async (templateId: string, data: Record<string, any>) => {
    try {
      setIsGenerating(true);
      setError(null);
      
      toast({
        title: "Fonctionnalité non disponible",
        description: "La génération de documents nécessite une intégration Supabase.",
        variant: "destructive",
      });
      
      // This would normally call Supabase function
      // const { data: result, error: functionError } = await apiClient.functions.invoke('generate-document', {
      //   body: { templateId, data }
      // });
      
      // if (functionError) {
      //   throw new Error(functionError.message);
      // }
      
      return null;
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
      setIsGenerating(false);
    }
  };
  
  return {
    generateDocument,
    isGenerating,
    error
  };
};

export default useDocumentGeneration;

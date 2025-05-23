
import { useState, useEffect, useCallback } from 'react';
import { useToast } from "@/components/ui/use-toast";

interface DocumentStats {
  total: number;
  generated: number;
  missing: number;
  error: number;
}

export const useRequiredDocuments = (clientId: string) => {
  const [documentStats, setDocumentStats] = useState<DocumentStats>({
    total: 8,
    generated: 5,
    missing: 3,
    error: 0
  });
  const { toast } = useToast();
  
  // Fonction pour rafraîchir les documents
  const refreshDocuments = useCallback(() => {
    // Simuler le rechargement des documents avec un délai
    setTimeout(() => {
      console.log("Refreshing documents for client:", clientId);
      // Pour l'exemple, on modifie légèrement les statistiques pour montrer le rafraîchissement
      setDocumentStats(prev => ({
        ...prev,
        generated: Math.min(prev.total, prev.generated + 1),
        missing: Math.max(0, prev.missing - 1)
      }));
    }, 500);
  }, [clientId]);
  
  // Charger les documents au montage
  useEffect(() => {
    const loadDocuments = async () => {
      try {
        // Ici vous feriez normalement un appel API
        // Pour l'exemple, on génère des statistiques aléatoires
        console.log("Loading required documents for client:", clientId);
        
        const totalDocs = 8;
        const generatedDocs = Math.floor(Math.random() * (totalDocs + 1));
        
        setDocumentStats({
          total: totalDocs,
          generated: generatedDocs,
          missing: totalDocs - generatedDocs,
          error: 0
        });
      } catch (error) {
        console.error("Erreur lors du chargement des documents du client:", error);
        toast({
          title: "Erreur",
          description: "Impossible de charger les documents requis",
          variant: "destructive"
        });
      }
    };
    
    loadDocuments();
  }, [clientId, toast]);
  
  return { documentStats, refreshDocuments };
};

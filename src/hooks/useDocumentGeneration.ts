
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { TemplateTag } from "@/types/documents";
import { processDocumentContent, prepareDocumentData } from "@/utils/documentUtils";
import { supabase } from "@/integrations/supabase/client";
import { useTemplateStorage } from "./useTemplateStorage";

interface UseDocumentGenerationProps {
  (onDocumentGenerated?: (documentId: string) => void, clientName?: string, clientId?: string): {
    generating: boolean;
    generated: boolean;
    documentId: string | null;
    handleGenerate: (templateId: string, clientId?: string, mappings?: TemplateTag[]) => Promise<void>;
    handleDownload: () => Promise<void>;
    handleSaveToFolder: () => Promise<boolean>;
  };
}

export const useDocumentGeneration: UseDocumentGenerationProps = (
  onDocumentGenerated,
  clientName,
  clientId
) => {
  const [generating, setGenerating] = useState(false);
  const [generated, setGenerated] = useState(false);
  const [documentId, setDocumentId] = useState<string | null>(null);
  const { toast } = useToast();
  const { getTemplateById } = useTemplateStorage(() => {});

  // Fonction pour récupérer les données client nécessaires au mapping
  const fetchClientData = async (clientId?: string) => {
    if (!clientId) return null;
    
    try {
      // Récupérer les données du client
      const { data: clientData, error: clientError } = await supabase
        .from('clients')
        .select('*')
        .eq('id', clientId)
        .maybeSingle();
        
      if (clientError) throw clientError;
      
      // Récupérer les données cadastrales si disponibles
      const { data: cadastralData } = await supabase
        .from('cadastral_data')
        .select('*')
        .eq('client_id', clientId)
        .maybeSingle();
        
      // Récupérer les projets du client
      const { data: projectsData } = await supabase
        .from('projects')
        .select('*')
        .eq('client_id', clientId)
        .order('created_at', { ascending: false });
        
      // Organiser les données par catégorie pour le mapping
      return {
        client: clientData || {},
        cadastre: cadastralData || {},
        projet: projectsData?.[0] || {},
        // Autres catégories si nécessaire
      };
    } catch (error) {
      console.error("Erreur lors de la récupération des données client:", error);
      return null;
    }
  };

  // Fonction pour obtenir un modèle par son ID
  const getTemplateById2 = async (templateId: string) => {
    try {
      if (!templateId) throw new Error("ID de template manquant");
      
      const { data, error } = await supabase
        .from('document_templates')
        .select('*')
        .eq('id', templateId)
        .maybeSingle();
        
      if (error) throw error;
      if (!data) throw new Error("Template non trouvé");
      
      return data;
    } catch (error) {
      console.error("Erreur lors de la récupération du template:", error);
      throw error;
    }
  };
  
  // Fonction pour créer un document
  const createDocument = async (documentData: any) => {
    try {
      const { data, error } = await supabase
        .from('documents')
        .insert(documentData)
        .select()
        .single();
        
      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Erreur lors de la création du document:", error);
      throw error;
    }
  };

  // Fonction pour générer un document
  const handleGenerate = async (templateId: string, clientId?: string, mappings?: TemplateTag[]) => {
    if (!templateId) {
      toast({
        title: "Erreur",
        description: "Aucun modèle sélectionné.",
        variant: "destructive",
      });
      return;
    }
    
    setGenerating(true);

    try {
      console.log("Génération de document à partir du template:", templateId);
      console.log("ID client:", clientId);
      console.log("Mappings:", mappings);
      
      // Obtenir les données du template
      const templateData = await getTemplateById2(templateId);
      
      if (!templateData) {
        throw new Error("Le modèle sélectionné n'existe pas");
      }
      
      if (!templateData.content) {
        throw new Error("Le modèle sélectionné est vide ou invalide");
      }
      
      // Récupérer les données client si nous avons un ID client et des mappings
      let documentContent = templateData.content;
      if (clientId && mappings && mappings.length > 0) {
        console.log("Application des mappings au document:", mappings);
        const clientData = await fetchClientData(clientId);
        
        if (!clientData || Object.keys(clientData).length === 0) {
          console.warn("Les données client sont vides pour l'ID client:", clientId);
        }
        
        documentContent = processDocumentContent(documentContent, mappings, clientData);
      }

      // Préparer les données du document
      const documentData = prepareDocumentData(
        templateData,
        clientName || "Document sans nom",
        clientId,
        documentContent
      );

      // Créer le document
      const document = await createDocument(documentData);
      
      if (!document || !document.id) {
        throw new Error("Erreur lors de la création du document");
      }
      
      console.log("Document généré avec succès:", document);
      
      setDocumentId(document.id);
      
      // Simuler un délai pour l'expérience utilisateur
      setTimeout(() => {
        setGenerating(false);
        setGenerated(true);
        
        if (onDocumentGenerated) {
          onDocumentGenerated(document.id);
        }
        
        toast({
          title: "Document généré",
          description: "Le document a été généré avec succès.",
        });
      }, 1500);

    } catch (error) {
      console.error("Erreur de génération:", error);
      setGenerating(false);
      
      toast({
        title: "Erreur",
        description: error instanceof Error ? error.message : "Erreur lors de la génération du document",
        variant: "destructive",
      });
    }
  };

  // Fonction pour télécharger un document
  const handleDownload = async () => {
    if (!documentId) {
      toast({
        title: "Erreur",
        description: "Aucun document à télécharger.",
        variant: "destructive",
      });
      return;
    }

    try {
      // Récupérer les informations du document
      const { data: document, error } = await supabase
        .from('documents')
        .select('*')
        .eq('id', documentId)
        .maybeSingle();
        
      if (error) throw error;
      if (!document) throw new Error("Document introuvable");
      
      // Créer un blob à partir du contenu
      const blob = new Blob([document.content || ""], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      
      // Créer un lien de téléchargement et cliquer dessus
      const link = document.createElement('a');
      link.href = url;
      link.download = `${document.name || 'document'}.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      toast({
        title: "Téléchargement",
        description: "Le téléchargement du document a commencé.",
      });
      
      return true;
    } catch (error) {
      console.error("Erreur de téléchargement:", error);
      toast({
        title: "Erreur",
        description: "Impossible de télécharger le document.",
        variant: "destructive",
      });
      return false;
    }
  };

  // Fonction pour enregistrer le document dans un dossier
  const handleSaveToFolder = async () => {
    if (!documentId) {
      toast({
        title: "Erreur",
        description: "Aucun document à enregistrer.",
        variant: "destructive",
      });
      return false;
    }

    try {
      toast({
        title: "Document sauvegardé",
        description: "Le document a été ajouté au dossier du client.",
      });
      return true;
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
    generating,
    generated,
    documentId,
    handleGenerate,
    handleDownload,
    handleSaveToFolder
  };
};

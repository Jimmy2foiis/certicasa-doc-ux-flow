import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { TemplateTag } from "@/components/documents/template-mapping/types";

interface UseDocumentGenerationProps {
  (onDocumentGenerated?: (documentId: string) => void, clientName?: string): {
    generating: boolean;
    generated: boolean;
    documentId: string | null;
    handleGenerate: (templateId: string, clientId?: string, mappings?: TemplateTag[]) => Promise<void>;
    handleDownload: () => void;
  };
}

export const useDocumentGeneration: UseDocumentGenerationProps = (
  onDocumentGenerated,
  clientName
) => {
  const [generating, setGenerating] = useState(false);
  const [generated, setGenerated] = useState(false);
  const [documentId, setDocumentId] = useState<string | null>(null);
  const { toast } = useToast();

  // Fonction pour générer un document
  const handleGenerate = async (templateId: string, clientId?: string, mappings?: TemplateTag[]) => {
    setGenerating(true);

    try {
      // Récupérer les informations du template
      const { data: templateData, error: templateError } = await supabase
        .from('document_templates')
        .select('name, type, content')
        .eq('id', templateId)
        .single();
      
      if (templateError) {
        console.error("Erreur lors de la récupération du template:", templateError);
        throw new Error("Template introuvable");
      }

      // Generate document content by replacing variables if mappings provided
      let documentContent = templateData.content;
      
      if (mappings && mappings.length > 0) {
        console.log("Applying mappings to document:", mappings);
        
        // Get client data if we have clientId
        let clientData: any = {};
        if (clientId) {
          try {
            // Get client data
            const { data: client } = await supabase
              .from('clients')
              .select('*')
              .eq('id', clientId)
              .single();
              
            if (client) {
              clientData.client = client;
              
              // Get cadastral data
              const { data: cadastre } = await supabase
                .from('cadastral_data')
                .select('*')
                .eq('client_id', clientId)
                .single();
                
              if (cadastre) {
                clientData.cadastre = cadastre;
              }
              
              // Get projects
              const { data: projects } = await supabase
                .from('projects')
                .select('*')
                .eq('client_id', clientId);
                
              if (projects && projects.length > 0) {
                clientData.project = projects[0]; // Use first project for now
                
                // Get calculations
                const { data: calculations } = await supabase
                  .from('calculations')
                  .select('*')
                  .eq('project_id', projects[0].id);
                  
                if (calculations && calculations.length > 0) {
                  clientData.calcul = calculations[0];
                }
              }
            }
          } catch (err) {
            console.error("Error fetching client data:", err);
          }
        }
        
        // Apply replacements
        mappings.forEach(mapping => {
          const tagRegex = new RegExp(mapping.tag.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
          
          // Get the value from client data based on mapping
          const [category, field] = mapping.mappedTo.split('.');
          const value = clientData[category]?.[field] || `[${mapping.mappedTo}]`;
          
          // Replace in content
          if (documentContent) {
            documentContent = documentContent.replace(tagRegex, value);
          }
        });
      }

      // Préparer les données du document
      const documentData = {
        name: `${templateData.name} - ${clientName || 'Document'}`,
        type: templateData.type,
        status: 'generated',
        client_id: clientId || null,
        content: documentContent || templateData.content,
        created_at: new Date().toISOString()
      };

      // Insérer le document dans Supabase
      const { data, error } = await supabase
        .from('documents')
        .insert([documentData])
        .select();
      
      if (error) {
        console.error("Erreur lors de la génération du document:", error);
        throw new Error("Impossible de générer le document");
      }

      console.log("Document généré avec succès:", data[0]);
      setDocumentId(data[0].id);
      
      // Simuler un délai pour l'expérience utilisateur
      setTimeout(() => {
        setGenerating(false);
        setGenerated(true);
        
        if (onDocumentGenerated) {
          onDocumentGenerated(data[0].id);
        }
        
        toast({
          title: "Document généré",
          description: "Le document a été généré avec succès.",
        });
      }, 1500);

    } catch (error) {
      console.error("Erreur lors de la génération:", error);
      setGenerating(false);
      
      toast({
        title: "Erreur",
        description: error instanceof Error ? error.message : "Erreur lors de la génération du document",
        variant: "destructive",
      });
    }
  };

  // Fonction pour télécharger un document
  const handleDownload = () => {
    if (!documentId) {
      toast({
        title: "Erreur",
        description: "Aucun document à télécharger.",
        variant: "destructive",
      });
      return;
    }

    // Simulate a download (in a real app, use Storage or a URL)
    console.log(`Téléchargement du document ${documentId}`);
    
    toast({
      title: "Téléchargement",
      description: "Le téléchargement du document a commencé.",
    });
    
    // In a real application, you might use something like:
    // const { data } = await supabase.storage.from('documents').download(`path/to/${documentId}`);
    // const url = URL.createObjectURL(data);
    // const a = document.createElement('a');
    // a.href = url;
    // a.download = 'document.pdf';
    // a.click();
  };

  return {
    generating,
    generated,
    documentId,
    handleGenerate,
    handleDownload
  };
};

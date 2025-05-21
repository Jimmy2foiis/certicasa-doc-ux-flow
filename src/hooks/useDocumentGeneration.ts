
import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { TemplateTag } from "@/types/documents";
import { documentService } from "@/services/documentService";

interface UseDocumentGenerationProps {
  (onDocumentGenerated?: (documentId: string) => void, clientName?: string): {
    generating: boolean;
    generated: boolean;
    documentId: string | null;
    handleGenerate: (templateId: string, clientId?: string, mappings?: TemplateTag[]) => Promise<void>;
    handleDownload: () => Promise<void>;
    error: string | null;
  };
}

export const useDocumentGeneration: UseDocumentGenerationProps = (
  onDocumentGenerated,
  clientName
) => {
  const [generating, setGenerating] = useState(false);
  const [generated, setGenerated] = useState(false);
  const [documentId, setDocumentId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Fonction pour vérifier si le mapping est complet
  const validateMappings = (mappings?: TemplateTag[]): boolean => {
    if (!mappings || mappings.length === 0) {
      return false;
    }
    
    // Vérifier si toutes les balises ont un mapping
    return mappings.every(mapping => 
      mapping.mappedTo && mapping.mappedTo.trim().length > 0 && mapping.mappedTo !== 'undefined.undefined'
    );
  };

  // Fonction pour appliquer le mapping aux variables
  const applyMappingToContent = async (
    content: string, 
    mappings: TemplateTag[], 
    clientData: any
  ): Promise<string> => {
    let documentContent = content;
    
    try {
      console.log("Données client pour mapping:", clientData);
      console.log("Application des mappings au document:", mappings);
      
      // Appliquer les remplacements
      mappings.forEach(mapping => {
        if (!mapping.tag || !mapping.mappedTo) return;
        
        const tagRegex = new RegExp(mapping.tag.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
        
        // Récupérer la valeur depuis les données client en fonction du mapping
        const [category, field] = mapping.mappedTo.split('.');
        let value: string;
        
        if (clientData && clientData[category] && field && clientData[category][field] !== undefined) {
          value = String(clientData[category][field]);
        } else {
          // Utiliser une valeur par défaut ou une indication visuelle si les données sont manquantes
          value = `[${mapping.mappedTo || mapping.tag}]`;
        }
        
        // Remplacer dans le contenu
        documentContent = documentContent.replace(tagRegex, value);
      });
      
      return documentContent;
    } catch (error) {
      console.error("Erreur lors de l'application du mapping:", error);
      throw new Error(`Erreur lors de l'application du mapping: ${error instanceof Error ? error.message : String(error)}`);
    }
  };

  // Fonction pour générer un document
  const handleGenerate = async (templateId: string, clientId?: string, mappings?: TemplateTag[]) => {
    setError(null);
    setGenerating(true);

    try {
      // Vérifier que le mapping est complet si fourni
      if (mappings && mappings.length > 0 && !validateMappings(mappings)) {
        throw new Error("Le mapping des variables n'est pas complet. Veuillez mapper toutes les variables avant de générer le document.");
      }

      // Récupérer les informations du template
      const { data: templateData, error: templateError } = await supabase
        .from('document_templates')
        .select('name, type, content')
        .eq('id', templateId)
        .single();
      
      if (templateError || !templateData) {
        console.error("Erreur lors de la récupération du template:", templateError);
        throw new Error("Template introuvable ou inaccessible");
      }

      // Initialiser le contenu du document
      let documentContent = templateData.content;
      
      if (!documentContent) {
        throw new Error("Le contenu du template est vide ou invalide");
      }
      
      // Récupérer les données client si un ID client est fourni
      let clientData: any = {};
      
      if (clientId) {
        try {
          // Récupérer les données client
          const { data: client, error: clientError } = await supabase
            .from('clients')
            .select('*')
            .eq('id', clientId)
            .single();
            
          if (clientError || !client) {
            console.error("Erreur lors de la récupération des données client:", clientError);
            throw new Error("Impossible de récupérer les données client");
          }
          
          clientData.client = client;
          
          // Récupérer les données cadastrales
          const { data: cadastre } = await supabase
            .from('cadastral_data')
            .select('*')
            .eq('client_id', clientId)
            .maybeSingle();
            
          if (cadastre) {
            clientData.cadastre = cadastre;
          }
          
          // Récupérer les projets
          const { data: projects } = await supabase
            .from('projects')
            .select('*')
            .eq('client_id', clientId);
            
          if (projects && projects.length > 0) {
            clientData.project = projects[0]; // Utiliser le premier projet pour l'instant
            
            // Récupérer les calculs
            const { data: calculations } = await supabase
              .from('calculations')
              .select('*')
              .eq('project_id', projects[0].id);
              
            if (calculations && calculations.length > 0) {
              clientData.calcul = calculations[0];
            }
          }
        } catch (err) {
          console.error("Erreur lors de la récupération des données client:", err);
          throw new Error("Erreur lors de la récupération des données client");
        }
      }
      
      // Appliquer le mapping si fourni
      if (mappings && mappings.length > 0) {
        try {
          documentContent = await applyMappingToContent(documentContent, mappings, clientData);
        } catch (err) {
          console.error("Erreur lors de l'application du mapping:", err);
          throw new Error("Erreur lors de l'application du mapping aux variables");
        }
      }
      
      // Valider le contenu final
      const validationResult = documentService.validateDocumentContent(documentContent, templateData.type);
      
      if (!validationResult.success) {
        throw new Error(`Le document généré est invalide: ${validationResult.error}`);
      }

      // Préparer les données du document
      const documentData = {
        name: `${templateData.name} - ${clientName || 'Document'}`,
        type: templateData.type,
        status: 'generated',
        client_id: clientId || null,
        content: documentContent,
        created_at: new Date().toISOString()
      };

      // Insérer le document dans Supabase
      const { data, error } = await supabase
        .from('documents')
        .insert([documentData])
        .select();
      
      if (error || !data || data.length === 0) {
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
      }, 800);

    } catch (err) {
      console.error("Erreur lors de la génération:", err);
      setGenerating(false);
      setError(err instanceof Error ? err.message : String(err));
      
      toast({
        title: "Erreur",
        description: err instanceof Error ? err.message : "Erreur lors de la génération du document",
        variant: "destructive",
      });
    }
  };

  // Fonction pour télécharger un document
  const handleDownload = async () => {
    try {
      setError(null);
      
      if (!documentId) {
        throw new Error("Aucun document à télécharger");
      }
      
      // Récupérer le document depuis Supabase
      const { data: document, error: documentError } = await supabase
        .from('documents')
        .select('name, type, content')
        .eq('id', documentId)
        .single();
        
      if (documentError || !document) {
        console.error("Erreur lors de la récupération du document:", documentError);
        throw new Error("Impossible de récupérer le document pour téléchargement");
      }
      
      // Valider le contenu du document
      const validationResult = documentService.validateDocumentContent(document.content, document.type);
      
      if (!validationResult.success) {
        throw new Error(`Le document est invalide: ${validationResult.error}`);
      }
      
      // Télécharger le document
      const downloadResult = await documentService.downloadDocument(
        document.content,
        document.name,
        document.type
      );
      
      if (!downloadResult.success) {
        throw new Error(`Erreur lors du téléchargement: ${downloadResult.error}`);
      }
      
      toast({
        title: "Téléchargement",
        description: "Le téléchargement du document a commencé.",
      });
    } catch (err) {
      console.error("Erreur lors du téléchargement:", err);
      setError(err instanceof Error ? err.message : String(err));
      
      toast({
        title: "Erreur",
        description: err instanceof Error ? err.message : "Erreur lors du téléchargement du document",
        variant: "destructive",
      });
    }
  };

  return {
    generating,
    generated,
    documentId,
    handleGenerate,
    handleDownload,
    error
  };
};

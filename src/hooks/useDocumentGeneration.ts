import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { TemplateTag } from "@/types/documents";
import { documentService } from "@/services/documentService";
import PizZip from "pizzip";
import Docxtemplater from "docxtemplater";
import { PDFDocument, StandardFonts } from "pdf-lib";

interface UseDocumentGenerationProps {
  (onDocumentGenerated?: (documentId: string) => void, clientName?: string): {
    generating: boolean;
    generated: boolean;
    documentId: string | null;
    handleGenerate: (templateId: string, clientId?: string, mappings?: TemplateTag[]) => Promise<void>;
    handleDownload: () => Promise<void>;
    error: string | null;
    canDownload: boolean;
    reset: () => void;
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
  const [canDownload, setCanDownload] = useState(false);
  const { toast } = useToast();

  // Reset the generation state
  const reset = () => {
    setGenerated(false);
    setGenerating(false);
    setDocumentId(null);
    setError(null);
    setCanDownload(false);
  };

  // Fonction améliorée pour vérifier si le mapping est complet
  const validateMappings = (mappings?: TemplateTag[]): boolean => {
    if (!mappings || mappings.length === 0) {
      return false;
    }
    
    // Vérifier si toutes les balises ont un mapping valide
    return mappings.every(mapping => 
      mapping.mappedTo && 
      mapping.mappedTo.trim().length > 0 && 
      mapping.mappedTo !== 'undefined.undefined'
    );
  };
  
  // Fonction pour vérifier si le contenu est valide selon le type
  const validateContent = (content: string | null, type: string): boolean => {
    if (!content || content.trim().length === 0) {
      return false;
    }
    
    // Vérification spécifique selon le type de document
    switch (type.toLowerCase()) {
      case 'pdf':
        return content.startsWith('data:application/pdf') || content.startsWith('blob:');
      case 'docx':
        return content.startsWith('data:application/vnd.openxmlformats-officedocument') || content.length > 0;
      case 'txt':
        return content.length > 0;
      default:
        return content.length > 0;
    }
  };

  // Fonction pour appliquer le mapping aux variables avec validation améliorée
  const applyMappingToContent = async (
    content: string, 
    mappings: TemplateTag[], 
    clientData: any
  ): Promise<{documentContent: string, replacementsCount: number}> => {
    if (!content || content.trim().length === 0) {
      throw new Error("Le contenu du template est vide ou invalide");
    }
    
    let documentContent = content;
    let replacementsCount = 0;
    
    try {
      console.log("Données client pour mapping:", clientData);
      console.log("Application des mappings au document:", mappings);
      
      // Appliquer les remplacements avec validation
      for (const mapping of mappings) {
        if (!mapping.tag || !mapping.mappedTo) continue;
        
        const tagRegex = new RegExp(mapping.tag.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
        
        // Vérifier si la balise existe dans le contenu
        if (!tagRegex.test(documentContent)) {
          console.warn(`La balise ${mapping.tag} n'existe pas dans le document`);
          continue;
        }
        
        // Récupérer la valeur depuis les données client en fonction du mapping
        const [category, field] = mapping.mappedTo.split('.');
        let value: string;
        
        // Gestion de l'alias adresse -> address
        if (category === "client" && field === "adresse") {
          // alias vers address
          if (!clientData.client?.adresse && clientData.client?.address) {
            clientData.client.adresse = clientData.client.address;
          }
        }
        
        if (clientData && clientData[category] && field && clientData[category][field] !== undefined) {
          value = String(clientData[category][field]);
        } else {
          // Utiliser une valeur par défaut visible dans le document final
          value = `[${mapping.mappedTo || mapping.tag}]`;
        }
        
        // Remplacer dans le contenu
        const originalContent = documentContent;
        documentContent = documentContent.replace(tagRegex, value);
        
        // Vérifier si un remplacement a été effectué
        if (originalContent !== documentContent) {
          replacementsCount++;
        }
      }
      
      return { documentContent, replacementsCount };
    } catch (error) {
      console.error("Erreur lors de l'application du mapping:", error);
      throw new Error(`Erreur lors de l'application du mapping: ${error instanceof Error ? error.message : String(error)}`);
    }
  };

  // Fonction pour générer un document avec validations améliorées
  const handleGenerate = async (templateId: string, clientId?: string, mappings?: TemplateTag[]) => {
    setError(null);
    setGenerating(true);
    setCanDownload(false);

    try {
      // Validation du template ID
      if (!templateId) {
        throw new Error("Aucun modèle sélectionné. Veuillez sélectionner un modèle avant de générer un document.");
      }

      // Récupérer les informations du template
      const { data: templateData, error: templateError } = await supabase
        .from('document_templates')
        .select('name, type, content, extracted_text')
        .eq('id', templateId)
        .single();
      
      if (templateError || !templateData) {
        console.error("Erreur lors de la récupération du template:", templateError);
        throw new Error("Template introuvable ou inaccessible");
      }

      // Vérifier si le contenu du template est valide selon son type
      if (templateData.type === 'docx') {
        // Pour les DOCX, on vérifie que le texte extrait est disponible
        if (!templateData.extracted_text || templateData.extracted_text.trim().length === 0) {
          throw new Error("Le texte extrait du template DOCX est vide ou invalide. Impossible de générer un document.");
        }
      } else if (templateData.type === 'pdf') {
        // Pour les PDF, on vérifie le contenu binaire
        if (!templateData.content || templateData.content.trim().length === 0 || 
            (!templateData.content.startsWith('data:application/pdf') && 
             !templateData.content.startsWith('blob:'))) {
          throw new Error("Le contenu du template PDF est invalide ou corrompu.");
        }
      } else {
        // Pour les autres types
        if (!templateData.content || templateData.content.trim().length === 0) {
          throw new Error("Le contenu du template est vide ou invalide. Impossible de générer un document.");
        }
      }

      // Vérifier que le mapping est complet si fourni
      if (mappings && mappings.length > 0 && !validateMappings(mappings)) {
        throw new Error("Le mapping des variables n'est pas complet. Veuillez mapper toutes les variables avant de générer le document.");
      }

      // Initialiser le contenu du document selon le type
      let documentContent = '';
      let documentType = templateData.type;
      let documentName = templateData.name;
      
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
      
      // Appliquer le mapping selon le type de document
      if (mappings && mappings.length > 0) {
        try {
          if (templateData.type === 'docx') {
            // Pour les DOCX avec Docxtemplater
            if (templateData.content && templateData.content.includes('base64')) {
              try {
                // Décoder le base64 -> ArrayBuffer
                const base64 = templateData.content.split(",")[1];
                const binaryString = atob(base64);
                const uint8Array = Uint8Array.from(binaryString, c => c.charCodeAt(0));

                const zip = new PizZip(uint8Array);
                const doc = new Docxtemplater(zip, { paragraphLoop: true, linebreaks: true });

                // Construire l'objet de remplacement
                const dataObj: Record<string, any> = {};
                mappings.forEach(m => {
                  if (!m.tag || !m.mappedTo) return;
                  
                  const [category, field] = m.mappedTo.split('.');
                  
                  // Gestion de l'alias adresse -> address
                  if (category === "client" && field === "adresse") {
                    if (!clientData.client?.adresse && clientData.client?.address) {
                      clientData.client.adresse = clientData.client.address;
                    }
                  }
                  
                  // Extraire le nom de la balise sans les caractères spéciaux
                  const tagName = m.tag.replace(/[{}<>%$]/g, '').trim();
                  const tagRegex = new RegExp(m.tag.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "g");
                  
                  if (clientData && clientData[category] && field && clientData[category][field] !== undefined) {
                    dataObj[tagName] = String(clientData[category][field]);
                  } else {
                    dataObj[tagName] = `[${m.mappedTo || m.tag}]`;
                  }
                  
                  // Remplacement dans extracted_text (fallback)
                  if (templateData.extracted_text) {
                    templateData.extracted_text = templateData.extracted_text.replace(
                      tagRegex, 
                      dataObj[tagName]
                    );
                  }
                });
                
                console.log("Données pour Docxtemplater:", dataObj);
                
                // Définir les données pour le rendu
                doc.setData(dataObj);
                
                try {
                  doc.render();
                  const out = doc.getZip().generate({ type: "base64" });
                  documentContent = "data:application/vnd.openxmlformats-officedocument.wordprocessingml.document;base64," + out;
                  documentType = "docx";
                } catch (e) {
                  console.error("Docxtemplater render error, fallback TXT:", e);
                  // Fallback à la méthode de remplacement de texte
                  documentContent = templateData.extracted_text || '';
                  documentType = 'txt'; // Changer le type en texte pour les DOCX mappés
                }
              } catch (docxError) {
                console.error("Erreur avec Docxtemplater:", docxError);
                
                // Fallback à la méthode de remplacement de texte
                console.log("Fallback à la méthode de texte simple");
                const { documentContent: mappedContent, replacementsCount } = await applyMappingToContent(
                  templateData.extracted_text || '', 
                  mappings, 
                  clientData
                );
                
                // Vérifier si des remplacements ont été effectués
                if (replacementsCount === 0) {
                  throw new Error("Aucun remplacement n'a été effectué lors du mapping des variables. Vérifiez les mappings.");
                }
                
                documentContent = mappedContent;
                documentType = 'txt'; // Changer le type en texte pour les DOCX mappés
              }
            } else {
              // Utiliser le texte extrait comme base si pas de contenu base64
              const { documentContent: mappedContent, replacementsCount } = await applyMappingToContent(
                templateData.extracted_text || '', 
                mappings, 
                clientData
              );
              
              // Vérifier si des remplacements ont été effectués
              if (replacementsCount === 0) {
                throw new Error("Aucun remplacement n'a été effectué lors du mapping des variables. Vérifiez les mappings.");
              }
              
              documentContent = mappedContent;
              documentType = 'txt'; // Changer le type en texte pour les DOCX mappés
              documentName = `${templateData.name}-mapped`; // Ajouter un suffixe pour identifier
            }
          } else if (templateData.type === 'pdf' && templateData.content?.startsWith("data:application/pdf")) {
            try {
              // Convertir base64 → Uint8Array
              const base64 = templateData.content.split(",")[1];
              const bytes = Uint8Array.from(atob(base64), c => c.charCodeAt(0));

              // Charger le PDF
              const pdfDoc = await PDFDocument.load(bytes);

              // Utiliser la première page comme canvas texte
              const page = pdfDoc.getPage(0);
              const { width, height } = page.getSize();
              const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

              // Construire l'objet data pour remplacement
              const dataObj: Record<string, string> = {};
              mappings.forEach(m => {
                if (!m.tag || !m.mappedTo) return;
                
                const [cat, key] = m.mappedTo.split('.');
                
                // Gestion de l'alias adresse -> address
                if (cat === "client" && key === "adresse") {
                  if (!clientData.client?.adresse && clientData.client?.address) {
                    clientData.client.adresse = clientData.client.address;
                  }
                }
                
                if (clientData && clientData[cat] && key && clientData[cat][key] !== undefined) {
                  dataObj[m.tag] = String(clientData[cat][key]);
                } else {
                  dataObj[m.tag] = `[${m.mappedTo || m.tag}]`;
                }
              });

              // Remplacer dans extracted_text (si présent) pour conserver le flux
              let textContent = '';
              if (templateData.extracted_text) {
                textContent = templateData.extracted_text;
                Object.entries(dataObj).forEach(([tag, val]) => {
                  const re = new RegExp(tag.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "g");
                  textContent = textContent.replace(re, String(val));
                });
              }

              // Écrire le texte final sur la page (simplifié)
              if (textContent) {
                page.drawText(textContent.substring(0, 1000), { // Limiter pour éviter les erreurs
                  x: 50,
                  y: height - 100,
                  size: 12,
                  font,
                  maxWidth: width - 100,
                  lineHeight: 14,
                });
              } else {
                page.drawText("PDF généré - variables remplacées", {
                  x: 50,
                  y: height - 100,
                  size: 12,
                  font,
                });
              }

              const pdfBytes = await pdfDoc.saveAsBase64({ dataUri: true });
              documentContent = pdfBytes; // data:application/pdf;base64,...
              documentType = "pdf";
              console.log("PDF généré avec succès");
            } catch (pdfError) {
              console.error("Erreur lors de la manipulation du PDF:", pdfError);
              throw new Error(`Erreur lors de la manipulation du PDF: ${pdfError instanceof Error ? pdfError.message : String(pdfError)}`);
            }
          } else {
            // Pour les autres types, conserver le contenu binaire original
            documentContent = templateData.content || '';
          }
        } catch (err) {
          console.error("Erreur lors de l'application du mapping:", err);
          throw new Error("Erreur lors de l'application du mapping aux variables");
        }
      } else {
        // Si pas de mapping, simplement copier le contenu original
        documentContent = templateData.type === 'docx' 
          ? (templateData.extracted_text || '')
          : (templateData.content || '');
      }
      
      // Valider le contenu final
      if (!validateContent(documentContent, documentType)) {
        throw new Error("Le document généré est vide ou invalide après le mapping des variables.");
      }
      
      if (documentType !== 'txt') {
        const validationResult = documentService.validateDocumentContent(documentContent, documentType);
        
        if (!validationResult.success) {
          throw new Error(`Le document généré est invalide: ${validationResult.error}`);
        }
      }

      // Préparer les données du document
      const documentData = {
        name: `${documentName} - ${clientName || 'Document'}`,
        type: documentType,
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
      
      // Vérifier que le document a bien un contenu
      if (!data[0].content || data[0].content.trim().length === 0) {
        throw new Error("Le document a été créé mais son contenu est vide.");
      }
      
      setDocumentId(data[0].id);
      setCanDownload(true);
      
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
      setCanDownload(false);
      
      toast({
        title: "Erreur",
        description: err instanceof Error ? err.message : "Erreur lors de la génération du document",
        variant: "destructive",
      });
    }
  };

  // Fonction pour télécharger un document avec validation améliorée
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
      
      // Vérifier si le contenu du document est valide
      if (!document.content || document.content.trim().length === 0) {
        throw new Error("Le contenu du document est vide ou invalide. Impossible de télécharger.");
      }
      
      // Validation spécifique selon le type, sauf pour txt
      if (document.type !== 'txt' && document.type === 'pdf' && 
          !document.content.startsWith('data:application/pdf') && 
          !document.content.startsWith('blob:')) {
        throw new Error("Le contenu du document PDF est invalide ou corrompu.");
      }
      
      // Pour les types autres que txt, valider avec le service
      if (document.type !== 'txt') {
        const validationResult = documentService.validateDocumentContent(document.content, document.type);
        
        if (!validationResult.success) {
          throw new Error(`Le document est invalide: ${validationResult.error}`);
        }
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
    error,
    canDownload,
    reset
  };
};

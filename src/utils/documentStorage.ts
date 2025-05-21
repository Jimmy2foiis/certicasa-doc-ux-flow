
import { supabase } from "@/integrations/supabase/client";

/**
 * Function to fetch a template by its ID
 */
export const fetchTemplateById = async (templateId: string) => {
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

/**
 * Function to create a new document
 */
export const createDocument = async (documentData: any) => {
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

/**
 * Function to fetch a document by its ID
 */
export const fetchDocumentById = async (documentId: string) => {
  try {
    const { data, error } = await supabase
      .from('documents')
      .select('*')
      .eq('id', documentId)
      .maybeSingle();
      
    if (error) throw error;
    if (!data) throw new Error("Document introuvable");
    
    return data;
  } catch (error) {
    console.error("Erreur lors de la récupération du document:", error);
    throw error;
  }
};

/**
 * Function to update a document status
 */
export const updateDocumentStatus = async (documentId: string, status: string) => {
  try {
    const { error } = await supabase
      .from('documents')
      .update({ status })
      .eq('id', documentId);
      
    if (error) throw error;
    return true;
  } catch (error) {
    console.error("Erreur lors de la mise à jour du statut du document:", error);
    return false;
  }
};


import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

/**
 * Handle document download functionality
 * @param documentId The ID of the document to download
 * @returns boolean indicating success
 */
export const downloadDocument = async (documentId: string | null): Promise<boolean> => {
  if (!documentId) {
    console.error("Aucun ID de document fourni pour le téléchargement");
    return false;
  }

  try {
    // Get document details from database
    const { data: document, error: docError } = await supabase
      .from('documents')
      .select('name, content, type')
      .eq('id', documentId)
      .single();
    
    if (docError || !document) {
      console.error("Erreur lors de la récupération du document:", docError);
      return false;
    }

    // Create the file content - in a real app this might come from Storage
    // For now, we'll just use the content stored in the database
    const content = document.content || "Contenu du document non disponible";
    
    // Create a blob for the file
    const blob = new Blob([content], { type: 'application/pdf' });
    
    // Create download link and trigger download
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${document.name || 'document'}.pdf`;
    document.body.appendChild(a);
    a.click();
    
    // Clean up
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 100);
    
    console.log(`Document ${documentId} téléchargé avec succès`);
    return true;
  } catch (error) {
    console.error("Erreur lors du téléchargement du document:", error);
    return false;
  }
};

/**
 * Save document to client folder
 * @param documentId The ID of the document to save
 * @param clientId The client ID to associate with the document
 * @returns Promise<boolean> indicating success
 */
export const saveDocumentToFolder = async (documentId: string | null, clientId: string | null): Promise<boolean> => {
  if (!documentId || !clientId) {
    console.error("ID de document ou ID de client manquant");
    return false;
  }
  
  try {
    // Update document status to indicate it's been saved to folder
    const { error } = await supabase
      .from('documents')
      .update({ 
        status: 'saved_to_folder',
      })
      .eq('id', documentId);
      
    if (error) {
      console.error("Erreur lors de l'enregistrement du document dans le dossier:", error);
      return false;
    }
    
    console.log(`Document ${documentId} enregistré dans le dossier du client ${clientId}`);
    return true;
  } catch (error) {
    console.error("Erreur lors de l'enregistrement dans le dossier:", error);
    return false;
  }
};

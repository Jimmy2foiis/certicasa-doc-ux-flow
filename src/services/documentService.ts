
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

// Types
interface DownloadOptions {
  fileName?: string;
  fileType?: string;
}

// Service pour la gestion des documents
export const documentService = {
  // Télécharger un document
  downloadDocument: async (
    content: string | null | undefined,
    fileName: string,
    fileType: string = 'pdf'
  ): Promise<boolean> => {
    try {
      if (!content) {
        console.error('Aucun contenu à télécharger');
        return false;
      }

      // Déterminer le type MIME
      let mimeType = 'application/octet-stream'; // Par défaut
      let extension = '';
      
      switch (fileType.toLowerCase()) {
        case 'pdf':
          mimeType = 'application/pdf';
          extension = '.pdf';
          break;
        case 'docx':
        case 'doc':
          mimeType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
          extension = '.docx';
          break;
        case 'xlsx':
        case 'xls':
          mimeType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
          extension = '.xlsx';
          break;
        // Ajoutez d'autres types selon vos besoins
      }

      // Créer un Blob à partir du contenu
      let blob;
      
      // Si le contenu est déjà en base64 avec en-tête data:application/...
      if (typeof content === 'string' && content.startsWith('data:')) {
        // Extraire la partie base64 après la virgule
        const base64Data = content.split(',')[1];
        const binaryData = atob(base64Data);
        const array = new Uint8Array(binaryData.length);
        for (let i = 0; i < binaryData.length; i++) {
          array[i] = binaryData.charCodeAt(i);
        }
        blob = new Blob([array], { type: mimeType });
      } else {
        // Sinon, créer un Blob directement
        blob = new Blob([content], { type: mimeType });
      }
      
      // Créer une URL à partir du Blob
      const url = URL.createObjectURL(blob);
      
      // Créer un lien de téléchargement
      const a = document.createElement('a');
      a.href = url;
      a.download = `${fileName}${extension}`;
      document.body.appendChild(a);
      a.click();
      
      // Nettoyer
      setTimeout(() => {
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }, 100);
      
      return true;
    } catch (error) {
      console.error('Erreur lors du téléchargement du document:', error);
      return false;
    }
  },

  // Récupérer le contenu d'un document
  getDocumentContent: async (documentId: string): Promise<{content: string | null; type: string; name: string} | null> => {
    try {
      const { data, error } = await supabase
        .from('documents')
        .select('content, type, name, file_path')
        .eq('id', documentId)
        .single();

      if (error) {
        throw error;
      }

      // Si le document a une URL de fichier mais pas de contenu, essayez de récupérer le fichier
      if (!data.content && data.file_path) {
        // Vous pouvez implémenter la récupération du fichier depuis l'URL ici
        // Par exemple, en utilisant fetch pour obtenir le contenu
      }

      return {
        content: data.content || data.file_path,
        type: data.type || 'pdf',
        name: data.name
      };
    } catch (error) {
      console.error('Erreur lors de la récupération du contenu du document:', error);
      return null;
    }
  },

  // Exporter tous les documents
  exportAllDocuments: async (documents: any[]): Promise<boolean> => {
    try {
      // Implémenter la logique pour télécharger tous les documents
      // Par exemple, créer un fichier ZIP
      // Pour l'instant, nous téléchargeons simplement le premier document
      if (documents.length === 0) {
        return false;
      }

      // Télécharger le premier document comme exemple
      const doc = documents[0];
      return await documentService.downloadDocument(doc.content, doc.name, doc.type);
    } catch (error) {
      console.error('Erreur lors de l\'exportation de tous les documents:', error);
      return false;
    }
  }
};

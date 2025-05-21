
import { 
  AdministrativeDocument, 
  DocumentContentType, 
  DocumentOperationResult, 
  SupportedFileType 
} from '@/types/documents';

// Détermine le type MIME en fonction de l'extension du fichier
const getMimeTypeFromExtension = (type: string): string => {
  switch (type.toLowerCase()) {
    case 'pdf':
      return 'application/pdf';
    case 'docx':
      return 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
    case 'xlsx':
      return 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
    case 'png':
      return 'image/png';
    case 'jpg':
    case 'jpeg':
      return 'image/jpeg';
    default:
      return 'application/octet-stream';
  }
};

// Helper function to create a blob from document content
const createDocumentBlob = (content: DocumentContentType, type: string): Blob | null => {
  if (!content) return null;
  
  const mimeType = getMimeTypeFromExtension(type);
  
  // Handle base64 content
  if (typeof content === 'string' && content.startsWith('data:')) {
    try {
      const base64Content = content.split(',')[1];
      const binaryString = window.atob(base64Content);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      return new Blob([bytes], { type: mimeType });
    } catch (error) {
      console.error("Erreur lors de la conversion base64 en Blob:", error);
      return null;
    }
  }
  
  // Handle ArrayBuffer content
  if (content instanceof ArrayBuffer) {
    return new Blob([content], { type: mimeType });
  }
  
  // Handle string content (assuming it's raw text for now)
  if (typeof content === 'string') {
    return new Blob([content], { type: mimeType });
  }
  
  return null;
};

// Déterminer le type de fichier supporté
export const getFileTypeFromName = (fileName: string): SupportedFileType => {
  const extension = fileName.split('.').pop()?.toLowerCase() || '';
  
  if (extension === 'pdf') return 'pdf';
  if (extension === 'docx') return 'docx';
  if (extension === 'xlsx') return 'xlsx';
  
  return 'unknown';
};

// Télécharger un document
export const downloadDocument = async (
  content: DocumentContentType, 
  fileName: string, 
  fileType: string
): Promise<DocumentOperationResult<void>> => {
  try {
    const blob = createDocumentBlob(content, fileType);
    if (!blob) {
      return {
        success: false,
        error: "Impossible de créer le blob à partir du contenu du document"
      };
    }
    
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement("a");
    a.href = url;
    a.download = `${fileName}.${fileType.toLowerCase()}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    
    // Clean up the URL object
    setTimeout(() => URL.revokeObjectURL(url), 100);
    
    return {
      success: true
    };
  } catch (error) {
    console.error("Erreur lors du téléchargement du document:", error);
    return {
      success: false,
      error: `Erreur lors du téléchargement: ${error instanceof Error ? error.message : String(error)}`
    };
  }
};

// Télécharger tous les documents sous forme de zip
export const exportAllDocuments = async (documents: AdministrativeDocument[]): Promise<DocumentOperationResult<void>> => {
  try {
    // Vérifier s'il y a des documents à exporter
    if (documents.length === 0) {
      return {
        success: false,
        error: "Aucun document à exporter"
      };
    }
    
    // Pour l'instant, on télécharge simplement le premier document (preuve de concept)
    // Dans une implémentation réelle, cela créerait un fichier zip avec tous les documents
    const doc = documents[0];
    
    if (!doc.content) {
      return {
        success: false,
        error: "Le premier document n'a pas de contenu"
      };
    }
    
    return await downloadDocument(doc.content, doc.name, doc.type);
    
  } catch (error) {
    console.error("Erreur lors de l'exportation de tous les documents:", error);
    return {
      success: false,
      error: `Erreur lors de l'exportation: ${error instanceof Error ? error.message : String(error)}`
    };
  }
};

// Obtenir le contenu d'un document par ID (simuler un appel API)
export const getDocumentContent = async (documentId: string): Promise<DocumentOperationResult<AdministrativeDocument>> => {
  try {
    // Ceci serait généralement un appel API pour obtenir le contenu du document
    // Pour l'instant, on renvoie simplement du contenu factice
    return {
      success: true,
      data: {
        id: documentId,
        name: "Document Exemple",
        type: "pdf",
        content: "Contenu exemple qui serait des données binaires",
        status: "generated",
        description: "",
        order: 0
      }
    };
  } catch (error) {
    console.error("Erreur lors de l'obtention du contenu du document:", error);
    return {
      success: false,
      error: `Erreur lors de l'obtention du contenu: ${error instanceof Error ? error.message : String(error)}`
    };
  }
};

// Créer une URL de prévisualisation du document
export const createDocumentPreviewUrl = (content: DocumentContentType, type: string): DocumentOperationResult<string> => {
  try {
    if (typeof content === 'string' && content.startsWith('data:')) {
      // C'est déjà une URL de données
      return {
        success: true,
        data: content
      };
    }
    
    const blob = createDocumentBlob(content, type);
    if (!blob) {
      return {
        success: false,
        error: "Impossible de créer le blob pour la prévisualisation"
      };
    }
    
    return {
      success: true,
      data: URL.createObjectURL(blob)
    };
  } catch (error) {
    console.error("Erreur lors de la création de l'URL de prévisualisation:", error);
    return {
      success: false,
      error: `Erreur lors de la création de l'URL: ${error instanceof Error ? error.message : String(error)}`
    };
  }
};

// Vérification et validation du contenu du document
export const validateDocumentContent = (content: DocumentContentType, type: string): DocumentOperationResult<boolean> => {
  try {
    if (!content) {
      return {
        success: false,
        error: "Le contenu du document est vide"
      };
    }
    
    if (typeof content === 'string' && content.startsWith('data:')) {
      // Vérifier si le contenu base64 est valide
      try {
        const base64Content = content.split(',')[1];
        window.atob(base64Content);
        return { success: true, data: true };
      } catch (e) {
        return {
          success: false,
          error: "Le contenu base64 est invalide"
        };
      }
    }
    
    // Pour ArrayBuffer et autres types de contenu
    return { success: true, data: true };
  } catch (error) {
    console.error("Erreur lors de la validation du contenu du document:", error);
    return {
      success: false,
      error: `Erreur lors de la validation: ${error instanceof Error ? error.message : String(error)}`
    };
  }
};

export const documentService = {
  downloadDocument,
  exportAllDocuments,
  getDocumentContent,
  createDocumentPreviewUrl,
  validateDocumentContent,
  getFileTypeFromName
};

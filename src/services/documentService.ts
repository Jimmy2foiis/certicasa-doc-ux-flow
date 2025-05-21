
export const validateDocumentContent = (content: string | null, type: string): { success: boolean; error?: string } => {
  if (!content || content.trim() === '') {
    return {
      success: false,
      error: "Le contenu du document est vide"
    };
  }

  // Validation spécifique selon le type
  const fileType = type.toLowerCase();
  
  if (fileType === 'pdf') {
    // Pour les PDF, vérifier qu'il s'agit d'une dataURL PDF ou d'un blob
    if (!content.startsWith('data:application/pdf') && 
        !content.startsWith('blob:')) {
      return {
        success: false,
        error: "Format de document PDF invalide"
      };
    }
  }
  
  return { success: true };
};

/**
 * Crée une URL de prévisualisation pour un document
 * @param content Contenu du document
 * @param type Type du document
 * @returns URL utilisable pour la prévisualisation
 */
export const createDocumentPreviewUrl = (content: string, type: string): { success: boolean; data?: string; error?: string } => {
  try {
    // Validation
    const validation = validateDocumentContent(content, type);
    if (!validation.success) {
      return {
        success: false,
        error: validation.error
      };
    }
    
    // Si c'est déjà une URL blob ou data
    if (content.startsWith('blob:') || content.startsWith('data:')) {
      return {
        success: true,
        data: content
      };
    }
    
    // Selon le type, créer l'URL appropriée
    const fileType = type.toLowerCase();
    
    if (fileType === 'pdf') {
      // Pour PDF, on crée un blob à partir du contenu
      const blob = new Blob([content], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      return {
        success: true,
        data: url
      };
    }
    
    return {
      success: false,
      error: `Type de document non supporté pour la prévisualisation: ${fileType}`
    };
  } catch (error) {
    console.error("Erreur lors de la création de l'URL de prévisualisation:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Erreur inconnue"
    };
  }
};

/**
 * Télécharge un document
 * @param content Contenu du document
 * @param fileName Nom du fichier
 * @param type Type du document
 * @returns Indication de succès ou d'échec
 */
export const downloadDocument = (content: string, fileName: string, type: string): { success: boolean; error?: string } => {
  try {
    // Validation
    const validation = validateDocumentContent(content, type);
    if (!validation.success) {
      return {
        success: false,
        error: validation.error
      };
    }
    
    // Préparer le fichier pour le téléchargement
    let downloadUrl: string;
    let fileType = type.toLowerCase();
    let mimeType = '';
    
    // Déterminer le type MIME
    switch (fileType) {
      case 'pdf':
        mimeType = 'application/pdf';
        break;
      case 'docx':
        mimeType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
        break;
      default:
        mimeType = 'application/octet-stream';
    }
    
    // Si le contenu est déjà une URL data ou blob
    if (content.startsWith('data:')) {
      downloadUrl = content;
    } else if (content.startsWith('blob:')) {
      // Pour les blob URLs, on ne peut pas les utiliser directement car elles sont temporaires
      // On devrait récupérer le blob et créer une data URL
      // Mais ici on suppose que c'est géré ailleurs
      downloadUrl = content;
    } else {
      // Créer un blob à partir du contenu
      const blob = new Blob([content], { type: mimeType });
      downloadUrl = URL.createObjectURL(blob);
    }
    
    // Créer un lien de téléchargement et le déclencher
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = fileName.includes(`.${fileType}`) ? fileName : `${fileName}.${fileType}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Si on a créé une URL d'objet, la libérer après utilisation
    if (!content.startsWith('data:') && !content.startsWith('blob:')) {
      setTimeout(() => URL.revokeObjectURL(downloadUrl), 100);
    }
    
    return { success: true };
  } catch (error) {
    console.error("Erreur lors du téléchargement:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Erreur lors du téléchargement"
    };
  }
};

/**
 * Récupère le contenu d'un document par ID
 * @param documentId ID du document
 * @returns Contenu du document avec ses métadonnées
 */
export const getDocumentContent = async (documentId: string): Promise<{ success: boolean; data?: { id: string; name: string; type: string; content: string }; error?: string }> => {
  try {
    // Ici, normalement on ferait un appel à une API ou Supabase
    // Pour simplifier, on va simuler une réussite avec des données fictives
    return {
      success: true,
      data: {
        id: documentId,
        name: "Document_" + documentId,
        type: "pdf",
        content: "data:application/pdf;base64,JVBERi0xLjcKJeLjz9MKNSAwIG9iago8PCAvVHlwZSAvWE9iamVjdCAvU3VidHlwZSAvSW1hZ2UgL1dpZHRoIDEyMDAgL0hlaWdodCAxNjAwIC" // Contenu court pour l'exemple
      }
    };
    
    // En cas d'échec de récupération du contenu
    // return {
    //   success: false,
    //   error: "Document introuvable ou contenu indisponible"
    // };
  } catch (error) {
    console.error("Erreur lors de la récupération du document:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Erreur lors de la récupération du document"
    };
  }
};

/**
 * Exporte tous les documents fournis en une archive ZIP
 * @param documents Liste des documents à exporter
 * @returns Indication de succès ou d'échec
 */
export const exportAllDocuments = async (documents: any[]): Promise<{ success: boolean; error?: string }> => {
  try {
    // Vérifier s'il y a des documents à exporter
    if (!documents || documents.length === 0) {
      return {
        success: false,
        error: "Aucun document à exporter"
      };
    }
    
    // Simuler un téléchargement ZIP
    // Dans une implémentation réelle, on utiliserait JSZip ou une bibliothèque similaire
    console.log("Exportation de", documents.length, "documents");
    
    // Créer un lien de téléchargement fictif
    const link = document.createElement('a');
    link.href = "#";
    link.download = "documents_export.zip";
    link.textContent = "Télécharger l'archive";
    document.body.appendChild(link);
    setTimeout(() => {
      alert("Fonctionnalité d'exportation ZIP en développement");
      document.body.removeChild(link);
    }, 100);
    
    return { success: true };
  } catch (error) {
    console.error("Erreur lors de l'exportation des documents:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Erreur lors de l'exportation des documents"
    };
  }
};

// Regroupe toutes les fonctions dans un objet exporté pour faciliter l'utilisation
export const documentService = {
  validateDocumentContent,
  createDocumentPreviewUrl,
  downloadDocument,
  getDocumentContent,
  exportAllDocuments
};

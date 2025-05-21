
export const documentService = {
  /**
   * Valide le contenu d'un document
   * @param content Contenu du document
   * @param type Type du document (pdf, docx, etc.)
   * @returns Objet indiquant si le contenu est valide et message d'erreur éventuel
   */
  validateDocumentContent: (content: string | null, type: string): { success: boolean; error?: string } => {
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
  },
  
  /**
   * Crée une URL de prévisualisation pour un document
   * @param content Contenu du document
   * @param type Type du document
   * @returns URL utilisable pour la prévisualisation
   */
  createDocumentPreviewUrl: (content: string, type: string): { success: boolean; data?: string; error?: string } => {
    try {
      // Validation
      const validation = documentService.validateDocumentContent(content, type);
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
  },
  
  /**
   * Télécharge un document
   * @param content Contenu du document
   * @param fileName Nom du fichier
   * @param type Type du document
   * @returns Indication de succès ou d'échec
   */
  downloadDocument: (content: string, fileName: string, type: string): { success: boolean; error?: string } => {
    try {
      // Validation
      const validation = documentService.validateDocumentContent(content, type);
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
  }
};

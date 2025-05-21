
import mammoth from 'mammoth';

/**
 * Extrait le texte d'un fichier .docx en utilisant mammoth.js
 * @param file Fichier .docx à traiter
 * @returns Promise avec le contenu textuel du document
 */
export const extractDocxContent = async (file: File): Promise<string> => {
  try {
    // Convertir le fichier en ArrayBuffer
    const arrayBuffer = await file.arrayBuffer();
    
    // Utiliser mammoth pour extraire le texte
    const result = await mammoth.extractRawText({ arrayBuffer });
    console.log("Contenu DOCX extrait:", result.value.substring(0, 100) + "...");
    
    return result.value;
  } catch (error) {
    console.error("Erreur lors de l'extraction du contenu DOCX:", error);
    throw new Error("Impossible d'extraire le contenu du fichier DOCX");
  }
};

/**
 * Extrait le contenu d'un fichier en fonction de son type
 * @param file Fichier à traiter
 * @returns Promise avec le contenu du fichier
 */
export const extractFileContent = async (file: File): Promise<string> => {
  try {
    console.log("Extraction du contenu pour:", file.name, file.type);
    
    // Pour les fichiers DOCX
    if (file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
      return await extractDocxContent(file);
    }
    
    // Pour les fichiers PDF (pour l'instant, retourne une chaîne vide)
    if (file.type === "application/pdf") {
      console.warn("L'extraction de contenu PDF n'est pas encore implémentée");
      return ""; // À implémenter avec une bibliothèque comme pdf.js
    }
    
    // Pour les fichiers texte
    if (file.type.includes("text/") || file.type.includes("application/json")) {
      return await file.text();
    }
    
    console.warn("Type de fichier non pris en charge pour l'extraction de contenu:", file.type);
    return "";
  } catch (error) {
    console.error("Erreur lors de l'extraction du contenu:", error);
    return "";
  }
};

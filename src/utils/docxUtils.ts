
import mammoth from 'mammoth';
import { TemplateTag } from '@/types/documents';

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

/**
 * Extrait les balises d'un contenu de document
 * @param content Contenu du document
 * @returns Tableau de balises uniques trouvées
 */
export const extractTemplateTags = (content: string | null): string[] => {
  if (!content) return [];
  
  try {
    // Match {{tag}} patterns in the content
    const tagRegex = /\{\{([^{}]+)\}\}/g;
    const tags: string[] = [];
    let match;
    
    while ((match = tagRegex.exec(content)) !== null) {
      tags.push(match[0]); // Capturer la balise complète avec {{}}
    }
    
    // Afficher les balises pour le débogage
    console.log(`Balises extraites (${tags.length}):`, tags);
    
    return [...new Set(tags)]; // Supprimer les doublons
  } catch (error) {
    console.error("Erreur lors de l'extraction des balises:", error);
    return [];
  }
};

/**
 * Détermine la catégorie la plus probable pour une balise
 * @param tag Balise à analyser
 * @param availableCategories Liste des catégories disponibles
 * @returns Catégorie déterminée
 */
export const determineTagCategory = (tag: string, availableCategories: string[]): string => {
  // Supprimer {{ et }} et diviser par point si présent
  const cleanTag = tag.replace(/[{}]/g, "");
  const parts = cleanTag.split(".");
  
  if (parts.length > 1) {
    const category = parts[0].toLowerCase();
    if (availableCategories.includes(category)) {
      return category;
    }
  }
  
  // Par défaut, utiliser "client" si aucune correspondance
  return "client";
};

/**
 * Obtient un mapping par défaut pour une balise
 * @param tag Balise à mapper
 * @param availableVariables Variables disponibles par catégorie
 * @returns Mapping par défaut
 */
export const getDefaultMapping = (
  tag: string, 
  availableVariables: Record<string, string[]>
): string => {
  const cleanTag = tag.replace(/[{}]/g, "");
  const parts = cleanTag.split(".");
  
  if (parts.length > 1) {
    return cleanTag; // A déjà le format category.variable
  }
  
  // Essayer de trouver dans les variables disponibles
  for (const [category, variables] of Object.entries(availableVariables)) {
    for (const variable of variables) {
      if (cleanTag === variable || cleanTag.includes(variable)) {
        return `${category}.${variable}`;
      }
    }
  }
  
  // Si aucune correspondance trouvée, utiliser le nom de la balise avec la catégorie par défaut
  const category = determineTagCategory(tag, Object.keys(availableVariables));
  return `${category}.${cleanTag}`;
};

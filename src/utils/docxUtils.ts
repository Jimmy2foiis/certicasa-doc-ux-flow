
import mammoth from 'mammoth';

/**
 * Extraire le contenu d'un fichier .docx ou .pdf
 * @param file Le fichier à traiter
 * @returns Le contenu extrait sous forme de texte
 */
export const extractFileContent = async (file: File): Promise<string | null> => {
  try {
    if (!file) return null;
    
    // Selon le type de fichier
    if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      // Pour les fichiers .docx, utiliser mammoth
      const arrayBuffer = await file.arrayBuffer();
      const result = await mammoth.extractRawText({ arrayBuffer });
      return result.value;
    } else if (file.type === 'application/pdf') {
      // Pour les PDF, ajouter ici la logique d'extraction si nécessaire
      // Actuellement simple indication que PDF est détecté
      console.log("PDF détecté, extraction de contenu non supportée");
      return "PDF Content Placeholder";
    } else {
      // Pour les fichiers texte et autres formats supportés
      return await file.text();
    }
  } catch (error) {
    console.error("Erreur lors de l'extraction du contenu du fichier:", error);
    return null;
  }
};

/**
 * Extraire les balises de template d'un contenu de document
 * @param content Le contenu du document
 * @returns Un tableau des balises trouvées
 */
export const extractTemplateTags = (content: string | null): string[] => {
  if (!content) return [];
  
  try {
    console.log("Extraction des balises du contenu:", content.substring(0, 100) + "...");
    
    // Recherche les balises au format {{variable}}
    const regex = /\{\{([^}]+)\}\}/g;
    const tags = [];
    let match;
    
    while ((match = regex.exec(content)) !== null) {
      tags.push(match[0]); // match[0] contient la balise complète avec {{}}
    }
    
    console.log(`${tags.length} balises trouvées:`, tags);
    return tags;
  } catch (error) {
    console.error("Erreur lors de l'extraction des balises:", error);
    return [];
  }
};

/**
 * Déterminer la catégorie la plus probable pour une balise
 * @param tag La balise à analyser
 * @param categories Liste des catégories disponibles
 * @returns La catégorie la plus probable
 */
export const determineTagCategory = (tag: string, categories: string[]): string => {
  // Nettoyer la balise (enlever {{ et }})
  const cleanTag = tag.replace(/[{}]/g, '');
  
  // Vérifier si la balise contient déjà une catégorie (format categorie.variable)
  if (cleanTag.includes('.')) {
    const [category] = cleanTag.split('.');
    if (categories.includes(category)) return category;
  }
  
  // Essayer de trouver une correspondance dans les catégories disponibles
  for (const category of categories) {
    if (cleanTag.toLowerCase().includes(category.toLowerCase())) {
      return category;
    }
  }
  
  // Par défaut, utiliser la première catégorie disponible ou "client"
  return categories[0] || 'client';
};

/**
 * Obtenir un mapping par défaut pour une balise
 * @param tag La balise à mapper
 * @param availableVariables Les variables disponibles par catégorie
 * @returns Une chaîne de mapping au format "categorie.variable"
 */
export const getDefaultMapping = (tag: string, availableVariables: any): string => {
  // Nettoyer la balise (enlever {{ et }})
  const cleanTag = tag.replace(/[{}]/g, '');
  
  // Si la balise est déjà au format categorie.variable
  if (cleanTag.includes('.')) {
    const [category, variable] = cleanTag.split('.');
    if (
      availableVariables[category] && 
      availableVariables[category].includes(variable)
    ) {
      return `${category}.${variable}`;
    }
  }
  
  // Essayer de trouver une correspondance dans les variables disponibles
  for (const [category, variables] of Object.entries(availableVariables)) {
    for (const variable of variables as string[]) {
      if (cleanTag.toLowerCase() === variable.toLowerCase()) {
        return `${category}.${variable}`;
      }
    }
  }
  
  // Déterminer la catégorie la plus probable
  const category = determineTagCategory(cleanTag, Object.keys(availableVariables));
  
  // Par défaut, utiliser la première variable de la catégorie ou le nom de la balise
  const defaultVariable = 
    availableVariables[category] && availableVariables[category].length > 0 
      ? availableVariables[category][0] 
      : cleanTag;
  
  return `${category}.${defaultVariable}`;
};

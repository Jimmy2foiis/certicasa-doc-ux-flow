
import { Document, TemplateTag } from "@/types/documents";

/**
 * Traite le contenu d'un document en remplaçant les variables du modèle par des valeurs réelles
 * @param content Contenu du modèle contenant des variables
 * @param mappings Tableau des mappings de balises de modèle
 * @param clientData Objet contenant les données client pour les mappings
 * @returns Contenu du document traité
 */
export const processDocumentContent = (
  content: string | null,
  mappings?: TemplateTag[], 
  clientData?: any
): string => {
  if (!content) {
    console.warn("processDocumentContent: Le contenu du document est null");
    return '';
  }
  
  if (!mappings || mappings.length === 0) {
    console.warn("processDocumentContent: Aucun mapping fourni");
    return content;
  }
  
  if (!clientData) {
    console.warn("processDocumentContent: Aucune donnée client fournie");
    return content;
  }
  
  let documentContent = content;
  
  // Appliquer les remplacements
  mappings.forEach(mapping => {
    const tagRegex = new RegExp(mapping.tag.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
    
    // Obtenir la valeur à partir des données client selon le mapping
    const [category, field] = mapping.mappedTo.split('.');
    let value = '[Donnée manquante]';
    
    try {
      value = clientData[category]?.[field] || `[${mapping.mappedTo}]`;
    } catch (error) {
      console.error(`Erreur lors de l'accès à ${mapping.mappedTo}:`, error);
    }
    
    // Remplacer dans le contenu
    documentContent = documentContent.replace(tagRegex, value);
  });
  
  return documentContent;
};

/**
 * Prépare les données d'un document pour la création
 * @param templateData Les données du modèle
 * @param clientName Le nom du client
 * @param clientId ID du client optionnel
 * @param documentContent Contenu du document traité optionnel
 * @returns Objet de données du document prêt pour insertion
 */
export const prepareDocumentData = (
  templateData: any,
  clientName?: string,
  clientId?: string,
  documentContent?: string
): Partial<Document> => {
  if (!templateData) {
    throw new Error("Données de modèle manquantes");
  }
  
  return {
    name: `${templateData.name} - ${clientName || 'Document'}`,
    type: templateData.type,
    status: 'generated',
    client_id: clientId || null,
    content: documentContent || templateData.content,
    created_at: new Date().toISOString()
  };
};


import { TemplateTag } from "@/components/documents/template-mapping/types";

/**
 * Processes document content by replacing template variables with actual values
 * @param content The template content containing variables
 * @param mappings Array of template tag mappings
 * @param clientData Object containing client data for mappings
 * @returns Processed document content
 */
export const processDocumentContent = (
  content: string | null,
  mappings?: TemplateTag[], 
  clientData?: any
): string => {
  if (!content || !mappings || mappings.length === 0 || !clientData) {
    return content || '';
  }
  
  let documentContent = content;
  
  // Apply replacements
  mappings.forEach(mapping => {
    const tagRegex = new RegExp(mapping.tag.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
    
    // Get the value from client data based on mapping
    const [category, field] = mapping.mappedTo.split('.');
    const value = clientData[category]?.[field] || `[${mapping.mappedTo}]`;
    
    // Replace in content
    documentContent = documentContent.replace(tagRegex, value);
  });
  
  return documentContent;
};

/**
 * Prepares document data for creation
 * @param templateData The template data
 * @param clientName The name of the client
 * @param clientId Optional client ID
 * @param documentContent Optional processed document content
 * @returns Document data object ready for insertion
 */
export const prepareDocumentData = (
  templateData: any,
  clientName?: string,
  clientId?: string,
  documentContent?: string
) => {
  return {
    name: `${templateData.name} - ${clientName || 'Document'}`,
    type: templateData.type,
    status: 'generated',
    client_id: clientId || null,
    content: documentContent || templateData.content,
    created_at: new Date().toISOString()
  };
};

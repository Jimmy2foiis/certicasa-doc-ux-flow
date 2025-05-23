
import { supabase } from "@/integrations/supabase/client";
import { TemplateTag, Json, availableVariables } from "@/types/documents";

// Helper function to extract tags from a document content
export const extractTemplateTags = (content: string | null): string[] => {
  if (!content) return [];
  
  // Match {{tag}} patterns in the content
  const tagRegex = /\{\{([^{}]+)\}\}/g;
  const tags: string[] = [];
  let match;
  
  while ((match = tagRegex.exec(content)) !== null) {
    tags.push(match[0]);
  }
  
  return [...new Set(tags)]; // Remove duplicates
};

// Helper function to determine the most likely category for a tag
export const determineTagCategory = (tag: string): string => {
  // Remove {{ and }} and split by dot if present
  const cleanTag = tag.replace(/[{}]/g, "");
  const parts = cleanTag.split(".");
  
  if (parts.length > 1) {
    const category = parts[0].toLowerCase();
    if (Object.keys(availableVariables).includes(category)) {
      return category;
    }
  }
  
  // Try to find in available variables
  for (const [category, variables] of Object.entries(availableVariables)) {
    if (variables.some(v => cleanTag.includes(v))) {
      return category;
    }
  }
  
  // Default to client if no match
  return "client";
};

// Helper to get a suitable default mapping for a tag
export const getDefaultMapping = (tag: string): string => {
  const cleanTag = tag.replace(/[{}]/g, "");
  const parts = cleanTag.split(".");
  
  if (parts.length > 1) {
    return cleanTag; // Already has category.variable format
  }
  
  // Try to find in available variables
  for (const [category, variables] of Object.entries(availableVariables)) {
    for (const variable of variables) {
      if (cleanTag === variable || cleanTag.includes(variable)) {
        return `${category}.${variable}`;
      }
    }
  }
  
  // If no match found, use the tag name with the default category
  const category = determineTagCategory(tag);
  return `${category}.${cleanTag}`;
};

// Load template mapping from Supabase
export const loadTemplateMapping = async (
  templateId: string
): Promise<TemplateTag[]> => {
  try {
    // Try to get existing mapping from Supabase
    const { data: mappingData, error } = await supabase
      .from('template_mappings')
      .select('*')
      .eq('template_id', templateId)
      .single();
    
    if (error) throw error;
    
    if (mappingData?.mappings) {
      // Type cast safely
      const jsonMappings = mappingData.mappings as unknown;
      
      // Validate the shape of the mappings
      if (Array.isArray(jsonMappings) && jsonMappings.length > 0 && 
          typeof jsonMappings[0] === 'object' && jsonMappings[0] !== null &&
          'tag' in jsonMappings[0] && 'category' in jsonMappings[0] && 'mappedTo' in jsonMappings[0]) {
        return jsonMappings as TemplateTag[];
      }
    }
    throw new Error('No valid mapping found');
  } catch (error) {
    console.log('Error or no mapping found, will extract from template');
    return [];
  }
};

// Save template mapping to Supabase
export const saveTemplateMapping = async (
  templateId: string, 
  mappings: TemplateTag[]
): Promise<boolean> => {
  try {
    // Convert TemplateTag[] to a JSON-compatible format for the JSONB column
    const jsonMappings = JSON.parse(JSON.stringify(mappings)) as Json;
    
    const { error } = await supabase
      .from('template_mappings')
      .upsert({
        template_id: templateId,
        mappings: jsonMappings,
        updated_at: new Date().toISOString()
      });
    
    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error saving template mapping:', error);
    return false;
  }
};

// Extract tags from template content and create initial mapping
export const createInitialMapping = (
  content: string | null
): TemplateTag[] => {
  const extractedTags = extractTemplateTags(content);
  
  return extractedTags.map(tag => ({
    tag,
    category: determineTagCategory(tag),
    mappedTo: getDefaultMapping(tag)
  }));
};

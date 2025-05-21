
import { supabase } from "@/integrations/supabase/client";
import { TemplateTag } from "./types";

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
export const determineTagCategory = (tag: string, availableCategories: string[]): string => {
  // Remove {{ and }} and split by dot if present
  const cleanTag = tag.replace(/[{}]/g, "");
  const parts = cleanTag.split(".");
  
  if (parts.length > 1) {
    const category = parts[0].toLowerCase();
    if (availableCategories.includes(category)) {
      return category;
    }
  }
  
  // Default to client if no match
  return "client";
};

// Helper to get a suitable default mapping for a tag
export const getDefaultMapping = (tag: string, availableVariables: Record<string, string[]>): string => {
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
  const category = determineTagCategory(tag, Object.keys(availableVariables));
  return `${category}.${cleanTag}`;
};

// Load template mapping from Supabase
export const loadTemplateMapping = async (
  templateId: string, 
  availableVariables: Record<string, string[]>
): Promise<TemplateTag[]> => {
  try {
    if (!templateId) {
      console.error("No template ID provided for loading mapping");
      return [];
    }
    
    console.log("Loading template mapping for:", templateId);
    
    // Try to get existing mapping from Supabase
    const { data: mappingData, error } = await supabase
      .from('template_mappings')
      .select('*')
      .eq('template_id', templateId)
      .maybeSingle(); // Using maybeSingle instead of single to avoid error when no mapping exists
    
    if (error) {
      console.error("Error loading template mapping:", error);
      return await createInitialMappingFromTemplate(templateId, availableVariables);
    }
    
    if (mappingData?.mappings && mappingData.mappings.length > 0) {
      console.log("Found existing mapping:", mappingData.mappings);
      return mappingData.mappings as TemplateTag[];
    }
    
    console.log("No mapping found, creating initial mapping from template");
    return await createInitialMappingFromTemplate(templateId, availableVariables);
  } catch (error) {
    console.error('Error loading template mapping:', error);
    return await createInitialMappingFromTemplate(templateId, availableVariables);
  }
};

// Helper function to create initial mapping from template content
export const createInitialMappingFromTemplate = async (
  templateId: string,
  availableVariables: Record<string, string[]>
): Promise<TemplateTag[]> => {
  try {
    if (!templateId) {
      console.error("No template ID provided for creating mapping");
      return [];
    }
    
    // Get template content from database
    const { data: templateData, error } = await supabase
      .from('document_templates')
      .select('content')
      .eq('id', templateId)
      .single();
      
    if (error) {
      console.error("Error fetching template content:", error);
      return [];
    }
    
    if (!templateData?.content) {
      console.error("Template content is empty:", templateId);
      return [];
    }
    
    return createInitialMapping(templateData.content, availableVariables);
  } catch (error) {
    console.error("Error creating initial mapping:", error);
    return [];
  }
};

// Save template mapping to Supabase
export const saveTemplateMapping = async (
  templateId: string, 
  mappings: TemplateTag[]
): Promise<boolean> => {
  if (!templateId) {
    console.error("No template ID provided for saving mapping");
    return false;
  }
  
  try {
    console.log("Saving mapping for template:", templateId, mappings);
    
    const { error } = await supabase
      .from('template_mappings')
      .upsert({
        template_id: templateId,
        mappings: mappings,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'template_id'
      });
    
    if (error) {
      console.error('Error saving template mapping:', error);
      throw error;
    }
    
    return true;
  } catch (error) {
    console.error('Error saving template mapping:', error);
    return false;
  }
};

// Extract tags from template content and create initial mapping
export const createInitialMapping = (
  content: string | null, 
  availableVariables: Record<string, string[]>
): TemplateTag[] => {
  const extractedTags = extractTemplateTags(content);
  
  return extractedTags.map(tag => ({
    tag,
    category: determineTagCategory(tag, Object.keys(availableVariables)),
    mappedTo: getDefaultMapping(tag, availableVariables)
  }));
};

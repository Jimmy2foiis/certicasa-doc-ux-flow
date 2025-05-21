
import { supabase } from "@/integrations/supabase/client";

/**
 * Retrieves a template from the database by ID
 * @param templateId The ID of the template to retrieve
 * @returns The template data or null if not found
 */
export const getTemplateById = async (templateId: string) => {
  const { data: templateData, error: templateError } = await supabase
    .from('document_templates')
    .select('name, type, content')
    .eq('id', templateId)
    .single();
  
  if (templateError) {
    console.error("Error retrieving template:", templateError);
    throw new Error("Template not found");
  }
  
  return templateData;
};

/**
 * Creates a document in the database
 * @param documentData Data for the new document
 * @returns The created document or null if creation failed
 */
export const createDocument = async (documentData: any) => {
  const { data, error } = await supabase
    .from('documents')
    .insert([documentData])
    .select();
  
  if (error) {
    console.error("Error generating document:", error);
    throw new Error("Unable to generate document");
  }
  
  return data?.[0] || null;
};

/**
 * Fetches client data for document generation
 * @param clientId The client ID to fetch data for
 * @returns Client data with related entities
 */
export const fetchClientDataForMapping = async (clientId?: string) => {
  if (!clientId) return {};
  
  try {
    const clientData: any = {};
    
    // Get client data
    const { data: client } = await supabase
      .from('clients')
      .select('*')
      .eq('id', clientId)
      .single();
      
    if (client) {
      clientData.client = client;
      
      // Get cadastral data
      const { data: cadastre } = await supabase
        .from('cadastral_data')
        .select('*')
        .eq('client_id', clientId)
        .single();
        
      if (cadastre) {
        clientData.cadastre = cadastre;
      }
      
      // Get projects
      const { data: projects } = await supabase
        .from('projects')
        .select('*')
        .eq('client_id', clientId);
        
      if (projects && projects.length > 0) {
        clientData.project = projects[0]; // Use first project for now
        
        // Get calculations
        const { data: calculations } = await supabase
          .from('calculations')
          .select('*')
          .eq('project_id', projects[0].id);
          
        if (calculations && calculations.length > 0) {
          clientData.calcul = calculations[0];
        }
      }
    }
    
    return clientData;
  } catch (err) {
    console.error("Error fetching client data:", err);
    return {};
  }
};

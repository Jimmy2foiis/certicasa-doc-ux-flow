
import { supabase } from "@/integrations/supabase/client";
import { TemplateTag, availableVariables } from "@/types/documents";
import { extractTemplateTags, determineTagCategory, getDefaultMapping } from "@/utils/docxUtils";

// Charger le mapping de template depuis Supabase
export const loadTemplateMapping = async (
  templateId: string
): Promise<TemplateTag[]> => {
  try {
    if (!templateId) {
      console.error("Aucun ID de template fourni pour le chargement du mapping");
      return [];
    }
    
    console.log("Chargement du mapping de template pour:", templateId);
    
    // Essayer d'obtenir le mapping existant depuis Supabase
    const { data: mappingData, error } = await supabase
      .from('template_mappings')
      .select('*')
      .eq('template_id', templateId)
      .maybeSingle();
    
    if (error) {
      console.error("Erreur lors du chargement du mapping de template:", error);
      return await createInitialMappingFromTemplate(templateId);
    }
    
    // Vérifier si les mappings existent et sont un tableau avant d'accéder à length
    if (mappingData?.mappings && Array.isArray(mappingData.mappings)) {
      console.log("Mapping existant trouvé:", mappingData.mappings);
      
      // Convertir Json[] en TemplateTag[] avec un mapping explicite
      const templateTags: TemplateTag[] = mappingData.mappings.map((item: any) => ({
        tag: String(item.tag || ''),
        category: String(item.category || ''),
        mappedTo: String(item.mappedTo || '')
      }));
      
      return templateTags;
    }
    
    console.log("Aucun mapping trouvé, création d'un mapping initial à partir du template");
    return await createInitialMappingFromTemplate(templateId);
  } catch (error) {
    console.error('Erreur lors du chargement du mapping de template:', error);
    return await createInitialMappingFromTemplate(templateId);
  }
};

// Fonction auxiliaire pour créer un mapping initial à partir du contenu du template
export const createInitialMappingFromTemplate = async (
  templateId: string
): Promise<TemplateTag[]> => {
  try {
    if (!templateId) {
      console.error("Aucun ID de template fourni pour la création du mapping");
      return [];
    }
    
    // Obtenir le contenu du template depuis la base de données
    const { data: templateData, error } = await supabase
      .from('document_templates')
      .select('content')
      .eq('id', templateId)
      .maybeSingle();
      
    if (error) {
      console.error("Erreur lors de la récupération du contenu du template:", error);
      return [];
    }
    
    if (!templateData?.content) {
      console.error("Le contenu du template est vide:", templateId);
      return [];
    }
    
    return createInitialMapping(templateData.content);
  } catch (error) {
    console.error("Erreur lors de la création du mapping initial:", error);
    return [];
  }
};

// Sauvegarder le mapping de template dans Supabase
export const saveTemplateMapping = async (
  templateId: string, 
  mappings: TemplateTag[]
): Promise<boolean> => {
  if (!templateId) {
    console.error("Aucun ID de template fourni pour la sauvegarde du mapping");
    return false;
  }
  
  try {
    console.log("Sauvegarde du mapping pour le template:", templateId, mappings);
    
    // Convertir TemplateTag[] en Json pour compatibilité avec Supabase
    const { error } = await supabase
      .from('template_mappings')
      .upsert({
        template_id: templateId,
        mappings: mappings as unknown as any,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'template_id'
      });
    
    if (error) {
      console.error('Erreur lors de la sauvegarde du mapping de template:', error);
      throw error;
    }
    
    return true;
  } catch (error) {
    console.error('Erreur lors de la sauvegarde du mapping de template:', error);
    return false;
  }
};

// Extraire les balises du contenu du template et créer un mapping initial
export const createInitialMapping = (
  content: string | null
): TemplateTag[] => {
  const extractedTags = extractTemplateTags(content);
  const categoriesList = Object.keys(availableVariables);
  
  return extractedTags.map(tag => ({
    tag,
    category: determineTagCategory(tag, categoriesList),
    mappedTo: getDefaultMapping(tag, availableVariables)
  }));
};

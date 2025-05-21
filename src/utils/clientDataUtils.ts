
import { supabase } from "@/integrations/supabase/client";

/**
 * Fetch client data needed for document mapping
 */
export const fetchClientData = async (clientId?: string) => {
  if (!clientId) return null;
  
  try {
    // Récupérer les données du client
    const { data: clientData, error: clientError } = await supabase
      .from('clients')
      .select('*')
      .eq('id', clientId)
      .maybeSingle();
      
    if (clientError) throw clientError;
    
    // Récupérer les données cadastrales si disponibles
    const { data: cadastralData } = await supabase
      .from('cadastral_data')
      .select('*')
      .eq('client_id', clientId)
      .maybeSingle();
      
    // Récupérer les projets du client
    const { data: projectsData } = await supabase
      .from('projects')
      .select('*')
      .eq('client_id', clientId)
      .order('created_at', { ascending: false });
      
    // Organiser les données par catégorie pour le mapping
    return {
      client: clientData || {},
      cadastre: cadastralData || {},
      projet: projectsData?.[0] || {},
      // Autres catégories si nécessaire
    };
  } catch (error) {
    console.error("Erreur lors de la récupération des données client:", error);
    return null;
  }
};

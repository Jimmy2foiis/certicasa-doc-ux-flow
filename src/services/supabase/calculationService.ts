
import { supabase } from './supabaseClient';
import { Calculation } from './types';

// Fonctions pour gérer les calculs
export const getCalculationsForProject = async (projectId: string): Promise<Calculation[]> => {
  const { data, error } = await supabase
    .from('calculations')
    .select('*')
    .eq('project_id', projectId)
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Erreur lors de la récupération des calculs du projet:', error);
    return [];
  }
  
  return data || [];
};

export const createCalculation = async (calculationData: Calculation): Promise<Calculation | null> => {
  const { data, error } = await supabase
    .from('calculations')
    .insert([calculationData])
    .select();
  
  if (error) {
    console.error('Erreur lors de la création du calcul:', error);
    return null;
  }
  
  return data?.[0] || null;
};

export const updateCalculation = async (calculationId: string, calculationData: Partial<Calculation>): Promise<Calculation | null> => {
  const { data, error } = await supabase
    .from('calculations')
    .update(calculationData)
    .eq('id', calculationId)
    .select();
  
  if (error) {
    console.error('Erreur lors de la mise à jour du calcul:', error);
    return null;
  }
  
  return data?.[0] || null;
};

export const deleteCalculation = async (calculationId: string): Promise<boolean> => {
  const { error } = await supabase
    .from('calculations')
    .delete()
    .eq('id', calculationId);
  
  if (error) {
    console.error('Erreur lors de la suppression du calcul:', error);
    return false;
  }
  
  return true;
};

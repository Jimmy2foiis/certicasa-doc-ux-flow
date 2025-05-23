// @ts-nocheck

import { supabase } from './supabaseClient';
import { Calculation } from './types';

// Fonctions pour gérer les calculs
export const getCalculationsForProject = async (projectId: string): Promise<Calculation[]> => {
  // Si l'ID du projet commence par "local_" ou "project_", on récupère localement
  if (projectId.toString().startsWith('local_') || projectId.toString().startsWith('project_')) {
    try {
      const savedData = localStorage.getItem('saved_calculations');
      if (savedData) {
        const allCalculations = JSON.parse(savedData);
        return allCalculations.filter((calc: any) => calc.projectId === projectId);
      }
      return [];
    } catch (error) {
      console.error('Erreur lors de la récupération locale des calculs:', error);
      return [];
    }
  }

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

export const createCalculation = async (
  calculationData: Calculation,
): Promise<Calculation | null> => {
  // Si l'ID du projet commence par "local_" ou "project_", on sauvegarde localement
  if (
    calculationData.project_id &&
    (calculationData.project_id.toString().startsWith('local_') ||
      calculationData.project_id.toString().startsWith('project_'))
  ) {
    try {
      // Récupérer les calculs existants
      const savedData = localStorage.getItem('saved_calculations');
      let allCalculations: Calculation[] = [];
      if (savedData) {
        allCalculations = JSON.parse(savedData);
      }

      // Ajouter le nouveau calcul avec un ID unique
      const newCalculation = {
        ...calculationData,
        id: calculationData.id || `calc_${Date.now()}`,
        created_at: new Date().toISOString(),
      };

      allCalculations.push(newCalculation);
      localStorage.setItem('saved_calculations', JSON.stringify(allCalculations));

      console.log('Calcul sauvegardé localement:', newCalculation);
      return newCalculation;
    } catch (error) {
      console.error('Erreur lors de la sauvegarde locale du calcul:', error);
      return null;
    }
  }

  const { data, error } = await supabase.from('calculations').insert([calculationData]).select();

  if (error) {
    console.error('Erreur lors de la création du calcul:', error);
    return null;
  }

  return data?.[0] || null;
};

export const updateCalculation = async (
  calculationId: string,
  calculationData: Partial<Calculation>,
): Promise<Calculation | null> => {
  // Si l'ID du calcul commence par "calc_", on met à jour localement
  if (calculationId.toString().startsWith('calc_')) {
    try {
      const savedData = localStorage.getItem('saved_calculations');
      if (savedData) {
        const allCalculations = JSON.parse(savedData);
        const updatedCalculations = allCalculations.map((calc: any) => {
          if (calc.id === calculationId) {
            return { ...calc, ...calculationData };
          }
          return calc;
        });

        localStorage.setItem('saved_calculations', JSON.stringify(updatedCalculations));

        const updatedCalculation = updatedCalculations.find(
          (calc: any) => calc.id === calculationId,
        );
        return updatedCalculation || null;
      }
      return null;
    } catch (error) {
      console.error('Erreur lors de la mise à jour locale du calcul:', error);
      return null;
    }
  }

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
  // Si l'ID du calcul commence par "calc_", on supprime localement
  if (calculationId.toString().startsWith('calc_')) {
    try {
      const savedData = localStorage.getItem('saved_calculations');
      if (savedData) {
        const allCalculations = JSON.parse(savedData);
        const updatedCalculations = allCalculations.filter(
          (calc: any) => calc.id !== calculationId,
        );

        localStorage.setItem('saved_calculations', JSON.stringify(updatedCalculations));
        return true;
      }
      return false;
    } catch (error) {
      console.error('Erreur lors de la suppression locale du calcul:', error);
      return false;
    }
  }

  const { error } = await supabase.from('calculations').delete().eq('id', calculationId);

  if (error) {
    console.error('Erreur lors de la suppression du calcul:', error);
    return false;
  }

  return true;
};

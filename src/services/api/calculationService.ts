/**
 * Service pour la gestion des calculs
 */
import { httpClient } from './httpClient';
import { Calculation } from './types';

/**
 * Récupère tous les calculs d'un projet
 */
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

  try {
    // Note: cet endpoint n'existe peut-être pas encore dans l'API externe
    // À adapter selon les spécifications réelles
    const response = await httpClient.get<Calculation[]>(`/projects/${projectId}/calculations`);

    if (!response.success || !response.data) {
      console.error(
        `Erreur lors de la récupération des calculs pour le projet ${projectId}:`,
        response.message,
      );
      return [];
    }

    return response.data;
  } catch (error) {
    console.error(`Erreur lors de la récupération des calculs pour le projet ${projectId}:`, error);
    return [];
  }
};

/**
 * Crée un nouveau calcul
 */
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

      return newCalculation;
    } catch (error) {
      console.error('Erreur lors de la sauvegarde locale du calcul:', error);
      return null;
    }
  }

  try {
    // Note: cet endpoint n'existe peut-être pas encore dans l'API externe
    // À adapter selon les spécifications réelles
    const response = await httpClient.post<Calculation>(
      `/projects/${calculationData.project_id}/calculations`,
      calculationData,
    );

    if (!response.success || !response.data) {
      console.error('Erreur lors de la création du calcul:', response.message);
      return null;
    }

    return response.data;
  } catch (error) {
    console.error('Erreur lors de la création du calcul:', error);
    return null;
  }
};

/**
 * Met à jour un calcul existant
 */
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

        return updatedCalculations.find((calc: any) => calc.id === calculationId);
      }
      return null;
    } catch (error) {
      console.error('Erreur lors de la mise à jour locale du calcul:', error);
      return null;
    }
  }

  try {
    // Note: cet endpoint n'existe peut-être pas encore dans l'API externe
    // À adapter selon les spécifications réelles
    const response = await httpClient.patch<Calculation>(
      `/calculations/${calculationId}`,
      calculationData,
    );

    if (!response.success || !response.data) {
      console.error(`Erreur lors de la mise à jour du calcul ${calculationId}:`, response.message);
      return null;
    }

    return response.data;
  } catch (error) {
    console.error(`Erreur lors de la mise à jour du calcul ${calculationId}:`, error);
    return null;
  }
};

/**
 * Supprime un calcul
 */
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

  try {
    // Note: cet endpoint n'existe peut-être pas encore dans l'API externe
    // À adapter selon les spécifications réelles
    const response = await httpClient.delete<any>(`/calculations/${calculationId}`);
    return response.success;
  } catch (error) {
    console.error(`Erreur lors de la suppression du calcul ${calculationId}:`, error);
    return false;
  }
};

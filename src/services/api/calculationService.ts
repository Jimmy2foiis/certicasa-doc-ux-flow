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
        return allCalculations.filter((calc: any) => calc.project_id === projectId);
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
  calculationData: any,
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
      let allCalculations: any[] = [];
      if (savedData) {
        allCalculations = JSON.parse(savedData);
      }

      // Créer l'objet de calcul complet avec TOUTES les données
      const completeCalculation = {
        id: calculationData.id || `calc_${Date.now()}`,
        project_id: calculationData.project_id,
        project_name: calculationData.project_name || 'Calcul thermique',
        client_id: calculationData.client_id,
        client_name: calculationData.client_name || 'Client',
        client_address: calculationData.client_address || '',
        type: calculationData.type || 'RES010',
        surface_area: calculationData.surface_area || 0,
        roof_area: calculationData.roof_area || 0,
        improvement_percent: calculationData.improvement_percent || 0,
        u_value_before: calculationData.u_value_before || 0,
        u_value_after: calculationData.u_value_after || 0,
        climate_zone: calculationData.climate_zone || 'C3',
        // Sauvegarder TOUTES les données du calcul thermique SANS modification
        calculation_data: calculationData.calculation_data ? {
          ...calculationData.calculation_data,
          // S'assurer que les couches sont sauvegardées EXACTEMENT comme elles sont
          beforeLayers: calculationData.calculation_data.beforeLayers ? 
            calculationData.calculation_data.beforeLayers.map((layer: any) => ({
              id: layer.id,
              name: layer.name,
              thickness: layer.thickness, // Garder l'épaisseur EXACTE modifiée par l'utilisateur
              lambda: layer.lambda,
              r: layer.r,
              isNew: layer.isNew
            })) : [],
          afterLayers: calculationData.calculation_data.afterLayers ? 
            calculationData.calculation_data.afterLayers.map((layer: any) => ({
              id: layer.id,
              name: layer.name,
              thickness: layer.thickness, // Garder l'épaisseur EXACTE modifiée par l'utilisateur
              lambda: layer.lambda,
              r: layer.r,
              isNew: layer.isNew
            })) : []
        } : {},
        created_at: new Date().toISOString(),
        saved_at: new Date().toISOString()
      };

      allCalculations.push(completeCalculation);
      localStorage.setItem('saved_calculations', JSON.stringify(allCalculations));

      console.log('✅ Calcul complet sauvegardé avec épaisseurs exactes:', {
        id: completeCalculation.id,
        beforeLayersCount: completeCalculation.calculation_data.beforeLayers?.length || 0,
        afterLayersCount: completeCalculation.calculation_data.afterLayers?.length || 0,
        beforeLayersThickness: completeCalculation.calculation_data.beforeLayers?.map((l: any) => `${l.name}: ${l.thickness}mm`) || [],
        afterLayersThickness: completeCalculation.calculation_data.afterLayers?.map((l: any) => `${l.name}: ${l.thickness}mm`) || []
      });

      return completeCalculation;
    } catch (error) {
      console.error('❌ Erreur lors de la sauvegarde locale du calcul:', error);
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
            return { ...calc, ...calculationData, updated_at: new Date().toISOString() };
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

/**
 * Récupère tous les calculs pour un client spécifique
 */
export const getCalculationsForClient = async (clientId: string): Promise<Calculation[]> => {
  try {
    const savedData = localStorage.getItem('saved_calculations');
    if (savedData) {
      const allCalculations = JSON.parse(savedData);
      const clientCalculations = allCalculations.filter((calc: any) => 
        calc.client_id === clientId || calc.clientId === clientId
      );
      console.log(`📋 Calculs trouvés pour le client ${clientId}:`, clientCalculations.length);
      return clientCalculations;
    }
    return [];
  } catch (error) {
    console.error('Erreur lors de la récupération des calculs du client:', error);
    return [];
  }
};

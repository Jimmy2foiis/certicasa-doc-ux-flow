
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
        // Sauvegarder TOUTES les données du calcul thermique
        calculation_data: {
          // Données de base du projet
          projectType: calculationData.calculation_data?.projectType || calculationData.type,
          surfaceArea: calculationData.calculation_data?.surfaceArea || calculationData.surface_area?.toString(),
          roofArea: calculationData.calculation_data?.roofArea || calculationData.roof_area?.toString(),
          climateZone: calculationData.calculation_data?.climateZone || calculationData.climate_zone,
          
          // Couches avant travaux - CRITIQUES pour la sauvegarde
          beforeLayers: calculationData.calculation_data?.beforeLayers || [],
          
          // Couches après travaux - CRITIQUES pour la sauvegarde
          afterLayers: calculationData.calculation_data?.afterLayers || [],
          
          // Valeurs de résistance thermique
          rsiBefore: calculationData.calculation_data?.rsiBefore || '0.10',
          rseBefore: calculationData.calculation_data?.rseBefore || '0.10',
          rsiAfter: calculationData.calculation_data?.rsiAfter || '0.10',
          rseAfter: calculationData.calculation_data?.rseAfter || '0.10',
          
          // Types de ventilation
          ventilationBefore: calculationData.calculation_data?.ventilationBefore || 'caso1',
          ventilationAfter: calculationData.calculation_data?.ventilationAfter || 'caso1',
          
          // Ratios
          ratioBefore: calculationData.calculation_data?.ratioBefore || 0.58,
          ratioAfter: calculationData.calculation_data?.ratioAfter || 0.58,
          
          // Résultats calculés
          totalRBefore: calculationData.calculation_data?.totalRBefore || 0,
          totalRAfter: calculationData.calculation_data?.totalRAfter || 0,
          upValueBefore: calculationData.calculation_data?.upValueBefore || 0,
          upValueAfter: calculationData.calculation_data?.upValueAfter || 0,
          uValueBefore: calculationData.calculation_data?.uValueBefore || calculationData.u_value_before || 0,
          uValueAfter: calculationData.calculation_data?.uValueAfter || calculationData.u_value_after || 0,
          improvementPercent: calculationData.calculation_data?.improvementPercent || calculationData.improvement_percent || 0,
          
          // Coefficients B
          bCoefficientBefore: calculationData.calculation_data?.bCoefficientBefore || 0,
          bCoefficientAfter: calculationData.calculation_data?.bCoefficientAfter || 0,
          
          // État des exigences
          meetsRequirements: calculationData.calculation_data?.meetsRequirements || false,
          
          // Toutes les autres données du calcul
          ...calculationData.calculation_data
        },
        created_at: new Date().toISOString(),
        saved_at: new Date().toISOString()
      };

      allCalculations.push(completeCalculation);
      localStorage.setItem('saved_calculations', JSON.stringify(allCalculations));

      console.log('✅ Calcul complet sauvegardé localement:', completeCalculation);
      console.log('📊 Couches avant sauvegardées:', completeCalculation.calculation_data.beforeLayers?.length || 0);
      console.log('📊 Couches après sauvegardées:', completeCalculation.calculation_data.afterLayers?.length || 0);
      console.log('📊 Total calculs sauvegardés:', allCalculations.length);

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

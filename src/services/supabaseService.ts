
/**
 * Service de compatibilité pour maintenir l'ancienne API
 * Redirige toutes les opérations vers les nouveaux services API REST
 */

// Re-export le supabase stub pour la compatibilité
export { supabase } from './supabase/supabaseClient';

// Re-export les types
export type {
  Client,
  CadastralData,
  Project,
  Calculation,
  Document
} from './api/types';

// Re-export les fonctions d'auth
export * from './supabase/authService';

// Re-export les services client
export {
  getClients,
  getClientById,
  createClientRecord,
  updateClientRecord,
  deleteClientRecord
} from './api/clientService';

// Re-export les services cadastraux
export {
  saveCadastralData,
  getCadastralDataForClient
} from './api/cadastralService';

// Re-export les services de projet
export {
  getProjectsForClient,
  createProject,
  updateProject,
  deleteProject
} from './api/projectService';

// Re-export les services de calcul
export {
  getCalculationsForProject,
  createCalculation,
  updateCalculation,
  deleteCalculation
} from './api/calculationService';

// Re-export les services de document
export {
  getDocumentsForClient,
  getDocumentsForProject,
  createDocument,
  updateDocument,
  deleteDocument,
  getDocumentById,
  markDocumentAsSent
} from './api/documentService';

// Re-export les services utilitaires
export {
  updateClientProjectCount
} from './api/projectService';

// Fonction vide pour rétrocompatibilité
export const updateClientDataHook = (): void => {
  console.log('Cette fonction est désuète et sera bientôt supprimée.');
};

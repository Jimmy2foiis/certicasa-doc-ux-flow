
// This file re-exports all services to maintain backward compatibility
// This helps avoid breaking changes in existing code

// Re-export the mock supabase client for backward compatibility
export { supabase } from './supabase/supabaseClient';

// Types
export type {
  Client,
  CadastralData,
  Project,
  Calculation,
  Document
} from './supabase/types';

// Auth Service
export {
  signUp,
  signIn,
  signOut,
  getCurrentUser
} from './supabase/authService';

// Client Service - now from API service
export {
  getClients,
  getClientById,
  createClientRecord,
  updateClientRecord,
  deleteClientRecord
} from './api/clientService';

// Cadastral Service
export {
  saveCadastralData,
  getCadastralDataForClient
} from './supabase/cadastralService';

// Project Service
export {
  getProjectsForClient,
  createProject,
  updateProject,
  deleteProject
} from './supabase/projectService';

// Calculation Service
export {
  getCalculationsForProject,
  createCalculation,
  updateCalculation,
  deleteCalculation
} from './supabase/calculationService';

// Document Service
export {
  getDocumentsForClient,
  getDocumentsForProject,
  createDocument,
  updateDocument,
  deleteDocument
} from './supabase/documentService';

// Utils Service
export {
  updateClientProjectCount,
  updateClientDataHook
} from './supabase/utilsService';

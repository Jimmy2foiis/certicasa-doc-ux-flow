
/**
 * Service pour récupérer les données depuis l'API externe
 * Maintenant intégré avec l'API Beetool réelle
 */
import { Client } from './types';

/**
 * Cette fonction est maintenant dépréciée
 * Utilisez BeetoolService directement pour les prospects individuels
 */
export const fetchExternalProspects = async (): Promise<Client[]> => {
  console.warn('fetchExternalProspects est déprécié. Utilisez BeetoolService pour les prospects individuels.');
  return [];
};


/**
 * Client HTTP pour les appels API
 */
import { get } from './methods/getMethod';
import { post } from './methods/postMethod';
import { patch } from './methods/patchMethod';
import { deleteMethod } from './methods/deleteMethod';

// Client HTTP avec toutes les méthodes
export const httpClient = {
  get,
  post,
  patch,
  delete: deleteMethod
};

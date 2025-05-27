
/**
 * Client HTTP pour les appels API avec debug amélioré
 */
import { get } from './methods/getMethod';
import { post } from './methods/postMethod';
import { patch } from './methods/patchMethod';
import { deleteMethod } from './methods/deleteMethod';

// Client HTTP générique avec debug amélioré
export const httpClient = {
  get,
  post,
  patch,
  delete: deleteMethod
};

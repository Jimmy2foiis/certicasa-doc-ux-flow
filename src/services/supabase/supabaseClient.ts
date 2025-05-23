/**
 * Stub pour compatibilité avec le code existant.
 * Ce fichier fournit un objet factice qui simule l'API Supabase
 * mais redirige toutes les opérations vers l'API REST externe.
 */

/* Stub Supabase ultra-générique : toutes les propriétés et appels renvoient un
   nouvel objet « chainable » pour que TypeScript n'exige aucun paramètre
   particulier. Les méthodes terminant une requête renvoient une promesse
   résolue avec { data:null, error:{ message:'SUPABASE_REMOVED' } }. */

// Objet résultat pour les appels finaux
const stubResponse: Promise<any> = Promise.resolve({
  data: null as any,
  error: { message: 'SUPABASE_REMOVED' },
});

// Fabrique un maillon chaînable
function createChain(): any {
  const fn: any = (..._args: any[]) => createChain();

  // Méthodes courantes
  const chainMethods = [
    'select',
    'insert',
    'update',
    'delete',
    'upsert',
    'order',
    'eq',
    'neq',
    'limit',
    'range',
  ];
  chainMethods.forEach((m) => {
    fn[m] = (..._a: any[]) => createChain();
  });

  // Méthodes terminant la requête
  fn.single = () => stubResponse;
  fn.maybeSingle = () => stubResponse;
  fn.then = (...args: any[]) => stubResponse.then(...args);

  return fn;
}

export const supabase: any = {
  from: (_table?: string) => createChain(),
  auth: {
    getSession: () => stubResponse,
    signInWithPassword: () => stubResponse,
    signUp: () => stubResponse,
    signOut: () => stubResponse,
    getUser: () => stubResponse,
  },
  functions: {
    invoke: () => stubResponse,
  },
};

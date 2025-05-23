// Rétro-compatibilité : on continue d'exposer le client Supabase afin que
// les services documents / cadastrales, etc. fonctionnent le temps de la
// migration complète.  Il pointe vers le client centralisé dans
// src/integrations/supabase/client.ts.

// Stub Supabase client (lecture seule) – permet de conserver le reste du
// code en attendant la migration complète vers des endpoints REST.

type StubResponse<T = any> = Promise<{ data: T | null; error: { message: string } | null }>;

const makeResponse = <T = any>(): StubResponse<T> =>
  Promise.resolve({ data: null, error: { message: 'SUPABASE_REMOVED' } });

class QueryStub {
  // Chaînage (select, insert, update, delete, order, eq, neq, upsert…)
  select(): this { return this; }
  insert(): this { return this; }
  update(): this { return this; }
  delete(): this { return this; }
  upsert(): this { return this; }
  order(): this { return this; }
  eq(): this { return this; }
  neq(): this { return this; }

  single = (): StubResponse => makeResponse();
  maybeSingle = (): StubResponse => makeResponse();

  // Une `then` méthode fait de l'instance un « thenable » ;
  // `await queryStub` retournera directement la réponse fictive.
  then<TResult1 = any, TResult2 = never>(
    onfulfilled?: ((value: { data: any; error: { message: string } }) => TResult1 | PromiseLike<TResult1>) | null,
    _onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | null,
  ): Promise<TResult1 | TResult2> {
    return makeResponse().then(onfulfilled);
  }
}

export const supabase = {
  from(): QueryStub {
    return new QueryStub();
  },
  // Auth stub (seulement getSession utilisé actuellement)
  auth: {
    getSession: (): StubResponse<{ session: null }> => makeResponse(),
    signInWithPassword: () => makeResponse(),
    signUp: () => makeResponse(),
    signOut: () => makeResponse(),
    getUser: () => makeResponse(),
  },
  functions: {
    invoke: (): StubResponse => makeResponse(),
  },
} as const;

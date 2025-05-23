
/**
 * Stub pour compatibilité avec le code existant.
 * Ce fichier fournit un objet factice qui simule l'API Supabase
 * mais redirige toutes les opérations vers l'API REST externe.
 */

export const supabase = {
  from: () => ({
    select: () => ({
      eq: () => ({
        single: async () => ({
          data: null,
          error: { message: "Service migré vers l'API REST" }
        }),
        maybeSingle: async () => ({
          data: null,
          error: { message: "Service migré vers l'API REST" }
        }),
        order: () => ({
          data: null,
          error: { message: "Service migré vers l'API REST" }
        }),
      }),
      order: () => ({
        data: null,
        error: { message: "Service migré vers l'API REST" }
      })
    }),
    insert: () => ({
      select: async () => ({
        data: null,
        error: { message: "Service migré vers l'API REST" }
      })
    }),
    update: () => ({
      eq: () => ({
        select: async () => ({
          data: null,
          error: { message: "Service migré vers l'API REST" }
        })
      })
    }),
    delete: () => ({
      eq: async () => ({
        error: { message: "Service migré vers l'API REST" }
      })
    })
  }),
  auth: {
    getSession: async () => ({ 
      data: null,
      error: { message: "Service migré vers l'API REST" }
    }),
    signInWithPassword: async () => ({
      data: null, 
      error: { message: "Service migré vers l'API REST" }
    }),
    signUp: async () => ({
      data: null,
      error: { message: "Service migré vers l'API REST" }
    }),
    signOut: async () => ({
      error: { message: "Service migré vers l'API REST" }
    }),
    getUser: async () => ({
      data: { user: null },
      error: { message: "Service migré vers l'API REST" }
    })
  },
  functions: {
    invoke: async () => ({
      data: null,
      error: { message: "Service migré vers l'API REST" }
    }),
  },
};

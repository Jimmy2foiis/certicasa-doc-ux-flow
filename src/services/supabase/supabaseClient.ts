
/**
 * Stub pour la transition vers l'API REST
 * Ce fichier existe pour maintenir la compatibilité avec le code existant
 */

// Créer un client factice pour éviter les erreurs lors de la migration
export const supabase = {
  from: () => ({
    select: () => ({
      eq: () => ({
        single: async () => ({ data: null, error: { message: 'Méthode non implémentée dans la migration REST' } }),
        order: () => ({ data: null, error: { message: 'Méthode non implémentée dans la migration REST' } })
      }),
      order: () => ({ data: null, error: { message: 'Méthode non implémentée dans la migration REST' } })
    }),
    insert: () => ({ select: () => ({ data: null, error: { message: 'Méthode non implémentée dans la migration REST' } }) }),
    update: () => ({ eq: () => ({ data: null, error: { message: 'Méthode non implémentée dans la migration REST' } }) }),
    delete: () => ({ eq: () => ({ data: null, error: { message: 'Méthode non implémentée dans la migration REST' } }) }),
  }),
  auth: {
    getUser: async () => ({ data: null, error: { message: 'Méthode non implémentée dans la migration REST' } }),
    signOut: async () => ({ error: { message: 'Méthode non implémentée dans la migration REST' } }),
    signInWithPassword: async () => ({ data: null, error: { message: 'Méthode non implémentée dans la migration REST' } }),
    signUp: async () => ({ data: null, error: { message: 'Méthode non implémentée dans la migration REST' } })
  },
  storage: {
    from: () => ({
      upload: async () => ({ data: null, error: { message: 'Méthode non implémentée dans la migration REST' } }),
      getPublicUrl: () => ({ data: { publicUrl: '' }, error: null })
    })
  }
};

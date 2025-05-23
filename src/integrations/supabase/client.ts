
// Ce fichier est conservé pour la rétrocompatibilité
// Il ne fait plus appel à Supabase mais aux APIs REST

// Nous créons un objet factice qui ne fait rien pour éviter les erreurs
// lors de la transition vers l'API REST

export const supabase = {
  auth: {
    getUser: async () => ({ 
      data: null,
      error: { message: "Méthode non disponible - migration vers API REST" }
    }),
    signOut: async () => ({
      error: { message: "Méthode non disponible - migration vers API REST" }
    }),
    signInWithPassword: async () => ({
      data: null, 
      error: { message: "Méthode non disponible - migration vers API REST" }
    }),
    signUp: async () => ({
      data: null,
      error: { message: "Méthode non disponible - migration vers API REST" }
    })
  },
  from: () => ({
    select: () => ({
      eq: () => ({
        single: async () => ({
          data: null,
          error: { message: "Méthode non disponible - migration vers API REST" }
        }),
        order: () => ({
          data: null,
          error: { message: "Méthode non disponible - migration vers API REST" }
        })
      }),
      order: () => ({
        data: null,
        error: { message: "Méthode non disponible - migration vers API REST" }
      })
    }),
    insert: () => ({
      select: async () => ({
        data: null,
        error: { message: "Méthode non disponible - migration vers API REST" }
      })
    }),
    update: () => ({
      eq: () => ({
        select: async () => ({
          data: null,
          error: { message: "Méthode non disponible - migration vers API REST" }
        })
      })
    }),
    delete: () => ({
      eq: async () => ({
        error: { message: "Méthode non disponible - migration vers API REST" }
      })
    })
  })
};

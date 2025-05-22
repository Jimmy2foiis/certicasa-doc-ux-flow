
// Simple API client to replace Supabase client

const apiClient = {
  from: (tableName: string) => {
    return {
      select: (query?: string) => ({
        eq: (field: string, value: any) => ({
          single: () => Promise.resolve({ data: null, error: new Error(`No Supabase integration available`) }),
          order: () => Promise.resolve({ data: [], error: null }),
          limit: () => Promise.resolve({ data: [], error: null }),
          then: (callback: any) => Promise.resolve({ data: [], error: null }).then(callback)
        }),
        neq: () => ({ data: [], error: null }),
        order: () => ({ data: [], error: null }),
        limit: () => ({ data: [], error: null }),
        then: (callback: any) => Promise.resolve({ data: [], error: null }).then(callback)
      }),
      insert: (data: any) => Promise.resolve({ data: null, error: new Error(`Cannot insert into ${tableName}: No Supabase integration available`) }),
      update: (data: any) => ({
        eq: () => Promise.resolve({ data: null, error: new Error(`Cannot update ${tableName}: No Supabase integration available`) })
      }),
      delete: () => ({
        eq: () => Promise.resolve({ data: null, error: new Error(`Cannot delete from ${tableName}: No Supabase integration available`) }),
        neq: () => Promise.resolve({ data: null, error: new Error(`Cannot delete from ${tableName}: No Supabase integration available`) })
      })
    };
  },
  storage: {
    from: (bucket: string) => ({
      upload: () => Promise.resolve({ data: null, error: new Error(`Cannot upload to ${bucket}: No Supabase integration available`) }),
      getPublicUrl: () => ({ data: { publicUrl: '' } })
    })
  },
  functions: {
    invoke: () => Promise.resolve({ data: null, error: new Error('No Supabase integration available') })
  }
};

export { apiClient };

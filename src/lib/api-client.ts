
// Simple API client to replace Supabase client
import { Client } from "@/types/clientTypes";

const mockClients: Client[] = [
  { 
    id: "1", 
    name: "Entreprise Martin", 
    email: "contact@martin.fr", 
    phone: "01 23 45 67 89", 
    type: "Entreprise",
    status: "Active",
    projects: 3
  },
  { 
    id: "2", 
    name: "Pierre Dubois", 
    email: "pierre.dubois@email.com", 
    phone: "06 12 34 56 78", 
    type: "Particulier",
    status: "En cours",
    projects: 1
  },
  { 
    id: "3", 
    name: "Société Dupont", 
    email: "contact@dupont.fr", 
    phone: "01 98 76 54 32", 
    type: "Entreprise",
    status: "Terminé",
    projects: 2
  }
];

// Function to fetch clients
export const fetchClients = async (): Promise<Client[]> => {
  // Simulate API request delay
  await new Promise(resolve => setTimeout(resolve, 500));
  return [...mockClients];
};

// Function to delete a client
export const deleteClient = async (clientId: string): Promise<void> => {
  // Simulate API request delay
  await new Promise(resolve => setTimeout(resolve, 500));
  console.log(`Client ${clientId} deleted (mock)`);
  return Promise.resolve();
};

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

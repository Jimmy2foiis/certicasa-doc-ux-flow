
// Version locale de PrismaClient pour éviter les erreurs d'importation
// En environnement de production, ce fichier serait remplacé par l'import réel

// Simuler la classe PrismaClient pour le développement local
export class PrismaClient {
  constructor(options?: any) {
    console.log('Initializing mock PrismaClient', options);
  }
  
  // Méthode $connect simulée
  async $connect() {
    console.log('Mock connection established');
    return this;
  }
  
  // Méthode $disconnect simulée
  async $disconnect() {
    console.log('Mock connection closed');
    return this;
  }
  
  // Ajout d'une propriété prospect simulée
  prospect = {
    findMany: async (params?: any) => {
      console.log('Mock prospect.findMany called with params:', params);
      return []; // Retourner un tableau vide ou des données simulées
    },
    findUnique: async (params?: any) => {
      console.log('Mock prospect.findUnique called with params:', params);
      return {
        id: 'mock-id',
        beetoolToken: 'mock-token',
        prenom: 'Prénom',
        nom: 'Nom',
        email: 'email@test.com',
        tel: '0123456789',
        ville: 'Paris',
        status: 'DONNEE_RECUPEREE',
        File: [],
        GoogleDriveFolder: null
      };
    },
    delete: async (params?: any) => {
      console.log('Mock prospect.delete called with params:', params);
      return { id: 'mock-id' };
    }
  };
  
  // Ajout d'une propriété file simulée
  file = {
    findMany: async (params?: any) => {
      console.log('Mock file.findMany called with params:', params);
      return []; // Retourner un tableau vide ou des données simulées
    },
    create: async (params?: any) => {
      console.log('Mock file.create called with params:', params);
      return { id: 'mock-file-id', ...params.data };
    },
    update: async (params?: any) => {
      console.log('Mock file.update called with params:', params);
      return { id: 'mock-file-id', ...params.data };
    },
    delete: async (params?: any) => {
      console.log('Mock file.delete called with params:', params);
      return { id: 'mock-file-id' };
    }
  };
}

// Éviter de multiplier les connexions en dev avec hot reload
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ['error', 'warn', 'info'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

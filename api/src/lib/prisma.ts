import { PrismaClient } from '@prisma/client';

// Éviter de multiplier les connexions en dev avec rechargement à chaud
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ['error', 'warn', 'info'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma; 
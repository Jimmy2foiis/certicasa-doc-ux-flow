
import { PrismaClient } from '@prisma/client';

// Avoid multiple connections in development with hot reload
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ['error', 'warn', 'info'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

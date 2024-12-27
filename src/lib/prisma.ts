import { PrismaClient } from '@prisma/client';

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma = globalForPrisma.prisma || new PrismaClient({
  log: ['query', 'error', 'warn'],
});

// Log any errors during database operations
prisma.$use(async (params, next) => {
  try {
    const result = await next(params);
    return result;
  } catch (error) {
    console.error('Prisma Client Error:', {
      model: params.model,
      action: params.action,
      error,
    });
    throw error;
  }
});

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

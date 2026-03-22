import { PrismaClient } from '@prisma/client';
import { PrismaD1 } from '@prisma/adapter-d1';

const globalForPrisma = global as unknown as { prisma: PrismaClient | undefined };

const prismaClientSingleton = (d1?: any) => {
  if (d1) {
    const adapter = new PrismaD1(d1);
    return new PrismaClient({ adapter });
  }
  
  // In development, we use the local SQLite file via DATABASE_URL
  if (process.env.NODE_ENV !== 'production') {
    return new PrismaClient({
      log: ['query'],
    });
  }

  // In production (Cloudflare), if we reach here and d1 is missing, it's an error.
  // We throw a delayed error inside the client or a clearer message to debug.
  console.error("D1 database binding 'DB' not found. Ensure it is configured in Cloudflare Dashboard.");
  return new PrismaClient(); // This will likely fail but at least we logged the error
};

// Lazy initialization to avoid top-level crashes
export const getPrisma = () => {
    if (globalForPrisma.prisma) return globalForPrisma.prisma;
    
    // Check global scope (used by some Cloudflare setups) 
    // or pass through the binding if available.
    const d1 = (globalThis as any).DB;
    globalForPrisma.prisma = prismaClientSingleton(d1);
    return globalForPrisma.prisma;
};

export const prisma = globalForPrisma.prisma ?? getPrisma();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

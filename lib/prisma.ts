import { PrismaClient } from '@prisma/client/edge';
import { PrismaD1 } from '@prisma/adapter-d1';

import { getCloudflareContext } from '@opennextjs/cloudflare';

const globalForPrisma = global as unknown as { prisma: PrismaClient | undefined };

const prismaClientSingleton = (d1?: any) => {
  if (d1) {
    const adapter = new PrismaD1(d1);
    return new PrismaClient({ adapter });
  }
  
  if (process.env.NODE_ENV !== 'production') {
    return new PrismaClient({
      log: ['query'],
    });
  }

  // Fallback if no D1 binding is provided in production
  return null;
};

const getPrisma = () => {
  if (globalForPrisma.prisma) return globalForPrisma.prisma;

  let d1;
  if (process.env.NODE_ENV === 'production') {
    d1 = (globalThis as any).DB;
    if (!d1) {
      try {
        const ctx = getCloudflareContext();
        d1 = (ctx?.env as any)?.DB;
      } catch (e) {
        // Ignore context errors
      }
    }
  }

  const client = prismaClientSingleton(d1);

  if (process.env.NODE_ENV !== 'production' && client) {
    globalForPrisma.prisma = client;
  }
  
  // Cache in production isolate too so it doesn't create new instances per edge request
  if (process.env.NODE_ENV === 'production' && client) {
      globalForPrisma.prisma = client;
  }

  return client;
};

// Export a proxy so existing `prisma.user...` calls work transparently
export const prisma = new Proxy({} as PrismaClient, {
  get: (target, prop) => {
    const client = getPrisma();
    if (!client) throw new Error("Prisma client not initialized (D1 database binding 'DB' missing)");
    return (client as any)[prop];
  }
});

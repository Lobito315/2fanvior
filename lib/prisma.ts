import { PrismaClient } from '@prisma/client';
import { PrismaD1 } from '@prisma/adapter-d1';

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

  // In production (Cloudflare), if d1 is missing, we return null to avoid crashing the Worker boot.
  // The Error 1101 is usually caused by a top-level exception.
  console.error("D1 database binding 'DB' not found in globalThis.DB");
  return null;
};

// Initialize only where needed or return null to avoid boot-time exceptions
export const prisma = globalForPrisma.prisma ?? (
    (process.env.NODE_ENV === 'production' && !(globalThis as any).DB) 
    ? null as any 
    : prismaClientSingleton((globalThis as any).DB)
);

if (process.env.NODE_ENV !== 'production' && prisma) {
    globalForPrisma.prisma = prisma;
}

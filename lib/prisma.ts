import { PrismaClient } from '@prisma/client';
import { PrismaD1 } from '@prisma/adapter-d1';

const globalForPrisma = global as unknown as { prisma: PrismaClient | undefined };

const prismaClientSingleton = (d1?: any) => {
  if (d1) {
    const adapter = new PrismaD1(d1);
    return new PrismaClient({ adapter });
  }
  return new PrismaClient({
    log: ['query'],
  });
};

// In Cloudflare Pages, we get the D1 binding from the environment
// We'll export a function or a getter if needed, but for now we look at globalThis
export const prisma = globalForPrisma.prisma ?? prismaClientSingleton((globalThis as any).DB);

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

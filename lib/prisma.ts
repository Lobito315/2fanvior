import { PrismaClient } from '@prisma/client/edge';
import { PrismaLibSql } from '@prisma/adapter-libsql';

const globalForPrisma = global as unknown as { prisma: PrismaClient | undefined };

const getPrismaClient = () => {
  const url = process.env.TURSO_DATABASE_URL;
  const authToken = process.env.TURSO_AUTH_TOKEN;

  if (!url) {
    throw new Error('TURSO_DATABASE_URL is not defined');
  }

  const adapter = new PrismaLibSql({ url, authToken });
  return new PrismaClient({ adapter, log: process.env.NODE_ENV !== 'production' ? ['query'] : [] });
};

export const prisma = globalForPrisma.prisma ?? getPrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

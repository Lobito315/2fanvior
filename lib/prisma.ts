import { PrismaClient } from '@prisma/client';
import { PrismaD1 } from '@prisma/adapter-d1';

// Polyfill for fs.readdir (fixes Cloudflare/unenv issues)
if (typeof process !== 'undefined' && process.env.NODE_ENV === 'production') {
  try {
    const fs = require('fs');
    if (fs) {
      fs.readdir = (path: any, callback: any) => { if (callback) callback(null, []); };
      fs.readdirSync = () => [];
      fs.stat = (path: any, callback: any) => { if (callback) callback(null, { isDirectory: () => false }); };
      fs.statSync = () => ({ isDirectory: () => false });
      fs.readFile = (path: any, options: any, callback: any) => { 
        const cb = typeof options === 'function' ? options : callback;
        if (cb) cb(null, Buffer.from('')); 
      };
      fs.readFileSync = () => Buffer.from('');
    }
  } catch (e) {
    // Ignore fs errors in edge environments
  }
}


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

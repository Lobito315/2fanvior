import { createClient } from '@libsql/client';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

const url = process.env.TURSO_DATABASE_URL;
const authToken = process.env.TURSO_AUTH_TOKEN;

if (!url || !authToken) {
  console.error("Missing TURSO env vars");
  process.exit(1);
}

const client = createClient({ url, authToken });

async function sync() {
  console.log("🚀 Syncing Turso Database...");

  const queries = [
    `CREATE TABLE IF NOT EXISTS "Like" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "userId" TEXT NOT NULL,
        "postId" TEXT NOT NULL,
        "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "Like_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
        CONSTRAINT "Like_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
    );`,
    `CREATE UNIQUE INDEX IF NOT EXISTS "Like_userId_postId_key" ON "Like"("userId", "postId");`,
    `CREATE TABLE IF NOT EXISTS "Comment" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "userId" TEXT NOT NULL,
        "postId" TEXT NOT NULL,
        "content" TEXT NOT NULL,
        "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" DATETIME NOT NULL,
        CONSTRAINT "Comment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
        CONSTRAINT "Comment_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
    );`
  ];

  for (const query of queries) {
    try {
      console.log(`Executing: ${query.substring(0, 50)}...`);
      await client.execute(query);
    } catch (e) {
      if (e.message.includes("already exists")) {
        console.log("Table/Index already exists, skipping...");
      } else {
        throw e;
      }
    }
  }

  console.log("✅ Database sync completed!");
}

sync().catch(console.error);

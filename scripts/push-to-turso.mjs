import { createClient } from '@libsql/client';
import fs from 'fs';
import path from 'path';
import 'dotenv/config';

async function main() {
  const url = process.env.TURSO_DATABASE_URL;
  const authToken = process.env.TURSO_AUTH_TOKEN;

  if (!url) {
    console.error("TURSO_DATABASE_URL not found in .env");
    process.exit(1);
  }

  const client = createClient({
    url,
    authToken,
  });

  // Get SQL from the generated file or stdin
  const sqlFile = process.argv[2] || 'schema.sql';
  if (!fs.existsSync(sqlFile)) {
    console.error(`SQL file ${sqlFile} not found.`);
    process.exit(1);
  }

  const sql = fs.readFileSync(sqlFile, 'utf8');
  
  // Split by semicolon, but be careful with triggers/etc (though SQLite standard is simple)
  // For simplicity, we can try to execute the whole block if the client supports it
  console.log(`Pushing schema to ${url}...`);

  try {
    // LibSQL client doesn't have a single "executeMultiple" but we can split into statements
    // or just use execute once if it's one large batch (it depends on driver)
    // Actually batch() is for transactions. execute() is for single.
    
    // Let's use a better approach: split into statements
    const statements = sql
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0);

    for (const statement of statements) {
      await client.execute(statement);
    }

    console.log("Schema pushed successfully!");
  } catch (error) {
    console.error("Error pushing schema:", error);
    process.exit(1);
  }
}

main();

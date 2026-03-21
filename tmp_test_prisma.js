const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function test() {
  console.log("Starting Prisma test...");
  try {
    const users = await prisma.user.findMany();
    console.log("Success! Found users:", users.length);
  } catch (err) {
    console.error("Prisma failed:", err);
  } finally {
    await prisma.$disconnect();
  }
}

test();

import { PrismaClient } from "@prisma/client";

// add prisma to the NodeJS global type
type CustomGlobal = Global & {
  prisma: PrismaClient;
};

// Prevent multiple instances of Prisma Client in development
declare const global: CustomGlobal;
const prisma =
  global.prisma ||
  new PrismaClient({ log: ["query", "info", "warn", "error"] });

// re-use existing prisma client on consecutive hot reloads
if (process.env.NODE_ENV === "development") {
  global.prisma = prisma;
  console.log("Using cached connection.");
}

export default prisma;

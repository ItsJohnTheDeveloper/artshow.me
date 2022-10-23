import { PrismaClient } from "@prisma/client";

const printLogs = process.env.NODE_ENV === "production";
const config = {
  log: printLogs ? ["query", "info", "warn", "error"] : [],
} as any;

// add prisma to the NodeJS global type
type CustomGlobal = Global & {
  prisma: PrismaClient;
};

// Prevent multiple instances of Prisma Client in development
declare const global: CustomGlobal;
const prisma = global.prisma || new PrismaClient(config);

// re-use existing prisma client on consecutive hot reloads
if (process.env.NODE_ENV === "development") {
  global.prisma = prisma;
  console.log("Using cached connection.");
}

export default prisma;

import { PrismaClient } from "@prisma/client";

let prisma: PrismaClient;

// if (process.env.NODE_ENV === "production") {
//   prisma = new PrismaClient();

// } else {
if (!global.prisma) {
  console.log("No cached connection - Prisma Connecting...");
  try {
    global.prisma = new PrismaClient();
  } catch (err) {
    console.error(err);
    console.log("Prisma Client can't run right now :(");
  }
}
console.log("Using cached connection.");

prisma = global.prisma;
// }

export default prisma;

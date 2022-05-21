import { PrismaClient } from "@prisma/client";

let prisma: PrismaClient;

if (process.env.NODE_ENV === "production") {
  prisma = new PrismaClient();
} else {
  if (!global.prisma) {
    try {
      global.prisma = new PrismaClient();
    } catch (err) {
      console.log(err);
      console.log("cant run prisma client");
    }
  }
  prisma = global.prisma;
}

export default prisma;
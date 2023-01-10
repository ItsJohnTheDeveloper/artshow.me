// import { PrismaClient } from "@prisma/client";

// const printLogs = false;
// const config = {
//   log: printLogs
//     ? [
//         {
//           emit: "event",
//           level: "query",
//         },
//         {
//           emit: "stdout",
//           level: "error",
//         },
//         {
//           emit: "stdout",
//           level: "info",
//         },
//         {
//           emit: "stdout",
//           level: "warn",
//         },
//       ]
//     : [],
// } as any;

// // add prisma to the NodeJS global type
// type CustomGlobal = Global & {
//   prisma: PrismaClient;
// };

// // Prevent multiple instances of Prisma Client in development
// declare const global: CustomGlobal;
// const prisma = global.prisma || new PrismaClient(config);

// // re-use existing prisma client on consecutive hot reloads
// if (process.env.NODE_ENV === "development") {
//   global.prisma = prisma;
//   console.log("Using cached connection.");
// }

// export default prisma;

// prisma/prisma.js
import { PrismaClient } from "@prisma/client";

let prisma;

if (process.env.NODE_ENV === "production") {
  prisma = new PrismaClient();
} else {
  if (!global.prisma) {
    global.prisma = new PrismaClient();
  }
  prisma = global.prisma;
}

export default prisma;

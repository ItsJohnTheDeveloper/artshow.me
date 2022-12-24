import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const seed = (nUsers, nPaintings) => {
  // *********USERS
  const a = ["Small", "Chirpy", "Ugly", "Blue"];
  const b = ["Hilarious", "Evil", "Pretty", "Godly"];
  const c = ["Bear", "Dog", "Banana", "Tuple"];

  const users = [];
  for (let i = 1; i < nUsers; i++) {
    const email = Math.round(Math.random() * 100000) + "@email.com";
    const name =
      a[Math.floor(Math.random() * a.length)] +
      b[Math.floor(Math.random() * b.length)] +
      c[Math.floor(Math.random() * c.length)];

    users.push({ email, name, password: "password" });
  }

  // *********PAINTINGS
  const paintings = [];
  // todo write paintings seed

  Promise.all(users.map((user) => prisma.user.create({ data: user })))
    .then(() => console.info("[SEED] Successfully created users."))
    .catch((err) => console.error(`[SEED] Error creating users: ${err}`));
};

seed(10, 10);

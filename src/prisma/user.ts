import prisma from "../lib/prisma";
import { ArtistDocument } from "../models/Artist";

export const getUser = async (id: string) => {
  const user: ArtistDocument = await prisma.user.findUnique({
    where: { id },
  });

  return user;
};

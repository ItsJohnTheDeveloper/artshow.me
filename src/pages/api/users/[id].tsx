import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../../lib/prisma";
import { getUser } from "../../../../prisma/user";
import { ArtistDocument } from "../../../models/Artist";

const handle = async (req: NextApiRequest, res: NextApiResponse) => {
  switch (req.method) {
    case "GET":
      if (!req.query) {
        return res.status(404).json({ message: "No request query found" });
      }
      const { id } = req.query as any;

      try {
        const user = await getUser(id);

        res.status(200).json(user);
      } catch (err) {
        res.status(403).json({ message: `An Error occurred: ${err}` });
      }

      break;
    case "PATCH":
      if (!req.body) {
        return res.status(404).json({ message: "No request body found" });
      }
      const userId = req.query.id as string;
      const { name, bio, profilePic } = req.body;
      try {
        const response = await prisma.user.update({
          where: { id: userId },
          data: {
            name,
            bio,
            profilePic,
          },
        });

        res.status(200).json(response);
        console.log(`user successfully PATCHED`);
      } catch (err) {
        res.status(403).json({ message: `An Error occurred: ${err}` });
      }
      break;
    default:
      return res.status(405).json("405 - Method Not Allowed");
  }
};

export default handle;

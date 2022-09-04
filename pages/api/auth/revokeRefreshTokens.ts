import jwt from "jsonwebtoken";
import { NextApiRequest, NextApiResponse } from "next";
import { revokeTokens } from "../../../utils/auth/auth.services";

const handle = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {
    if (!req.body) {
      return res.status(404).json("404 - No request body found");
    }

    try {
      const { userId } = req.body;
      await revokeTokens(userId);

      console.log(`Tokens revoked for user with id #${userId}`);
      res
        .status(200)
        .json({ message: `Tokens revoked for user with id #${userId}` });
    } catch (err) {
      console.error(err);
      res.status(403).json({ err: `An Error occurred: ${err}` });
    }
  } else {
    return res.status(405).json("405 - Method Not Allowed");
  }
};

export default handle;

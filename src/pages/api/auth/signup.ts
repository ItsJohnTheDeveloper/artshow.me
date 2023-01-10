import { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";
import prisma from "../../../../lib/prisma";
import { UserDocument } from "../../../models/user";
import { findUserByEmail } from "../../../utils/users/users.services";
import { generateTokens } from "../../../utils/jwt";
import { addRefreshTokenToWhitelist } from "../../../utils/auth/auth.services";

const handle = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {
    if (!req.body) {
      return res.status(404).json("404 - No request body found");
    }

    try {
      const hash = await bcrypt.hash(req.body.password, 10);
      const user: UserDocument = {
        email: req.body.email,
        password: hash,
        name: req.body.name,
        ...req.body,
      };
      user.password = hash;

      const userExists = await findUserByEmail(user.email);

      if (userExists) {
        console.log(`Email already in use.`);
        return res.status(400).json({ message: `400 - Email already in use.` });
      }

      const response = await prisma.user.create({ data: user });

      const mongoId = response.id;
      const jti = uuidv4();
      const { accessToken, refreshToken } = generateTokens(response, jti);
      await addRefreshTokenToWhitelist({
        jti,
        refreshToken,
        userId: mongoId,
      });

      console.log(`User: (${user.email}) successfully created`);
      res.status(200).json({ response, accessToken, refreshToken });
    } catch (err) {
      console.error(err);
      res.status(403).json({ message: `An Error occurred: ${err}` });
    }
  } else {
    return res.status(405).json("405 - Method Not Allowed");
  }
};

export default handle;

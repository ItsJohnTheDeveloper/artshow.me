import { NextApiRequest, NextApiResponse } from "next";
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcrypt";
import { findUserByEmail } from "../../../utils/users/users.services";
import { generateTokens } from "../../../utils/jwt";
import { addRefreshTokenToWhitelist } from "../../../utils/auth/auth.services";

const handle = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {
    if (!req.body) {
      return res.status(404).json("404 - No request body found");
    }

    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res
          .status(400)
          .json("400 - You must provide an email and password.");
      }

      const existingUser = await findUserByEmail(email);

      if (!existingUser) {
        return res.status(403).json("Invalid login credentials no user found.");
      }

      const validPassword = await bcrypt.compare(
        password,
        existingUser.password
      );

      if (!validPassword) {
        return res.status(403).json("Invalid login credentials.");
      }

      const jti = uuidv4();
      const { accessToken, refreshToken } = generateTokens(existingUser, jti);
      await addRefreshTokenToWhitelist({
        jti,
        refreshToken,
        userId: existingUser.id,
      });

      console.log(`User id: (${existingUser.email}) successfully logged in.`);
      res.status(200).json({ id: existingUser.id, accessToken, refreshToken });
    } catch (err) {
      console.error(err);
      res.status(403).json({ message: `An Error occurred: ${err}` });
    }
  } else {
    return res.status(405).json("405 - Method Not Allowed");
  }
};

export default handle;

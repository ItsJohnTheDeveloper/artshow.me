import jwt from "jsonwebtoken";
import { NextApiRequest, NextApiResponse } from "next";
import { v4 as uuidv4 } from "uuid";
import {
  addRefreshTokenToWhitelist,
  deleteRefreshToken,
  findRefreshTokenById,
} from "../../../utils/auth/auth.services";
import hashToken from "../../../utils/hashToken";
import { generateTokens } from "../../../utils/jwt";
import { findUserById } from "../../../utils/users/users.services";

const handle = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {
    if (!req.body) {
      return res.status(404).json("404 - No request body found");
    }

    try {
      const { refreshToken } = req.body;
      if (!refreshToken) {
        return res.status(403).json("Missing refresh token.");
      }

      const payload = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
      // @ts-ignore
      const savedRefreshToken = await findRefreshTokenById(payload.jti);

      console.log(savedRefreshToken);

      if (!savedRefreshToken || savedRefreshToken.revoked === true) {
        return res.status(401).json("Unauthorized-1");
      }

      const hashedToken = hashToken(refreshToken);
      if (hashedToken !== savedRefreshToken.hashedToken) {
        return res.status(401).json("Unauthorized-2");
      }

      // @ts-ignore
      const user = await findUserById(payload.userId);
      if (!user) {
        return res.status(401).json("Unauthorized-3");
      }

      await deleteRefreshToken(savedRefreshToken.id);
      const jti = uuidv4();
      const { accessToken, refreshToken: newRefreshToken } = generateTokens(
        user,
        jti
      );
      await addRefreshTokenToWhitelist({
        jti,
        refreshToken: newRefreshToken,
        userId: user.id,
      });

      console.log(`Refresh token successfully validated`);
      res.status(200).json({ accessToken, refreshToken: newRefreshToken });
    } catch (err) {
      console.log(err?.response?.data);
      res.status(403).json(`An Error occurred: ${err}`);
    }
  } else {
    return res.status(405).json("405 - Method Not Allowed");
  }
};

export default handle;

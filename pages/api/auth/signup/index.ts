import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../../lib/prisma";
import bcrypt from "bcrypt";
import { UserDocument } from "../../../../models/user";

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

      const response = await prisma.user.create({ data: user });
      console.log(`User: (${user.email}) successfully created`);
      console.log({ hashword: hash });

      res.status(200).json(response);
    } catch (err) {
      console.log(err);
      res.status(403).json({ err: `An Error occurred: ${err}` });
    }
  } else {
    return res.status(405).json("405 - Method Not Allowed");
  }
};

export default handle;

import { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

export default function isAuthenticated(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { authorization } = req.headers;

  if (!authorization) {
    res.status(401);
    throw new Error("🚫 Un-Authorized 🚫");
  }

  try {
    const token = authorization.split(" ")[1];
    const payload = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    req.headers.authorization += payload;
  } catch (err) {
    res.status(401);
    if (err.name === "TokenExpiredError") {
      throw new Error(err.name);
    }
    throw new Error("🚫 Un-Authorized 🚫");
  }

  return NextResponse.next();
}

import { NextRequest, NextResponse } from "next/server";
import { SignJWT, jwtVerify, type JWTPayload } from "jose";

/**
 * 
 * @param sign sign a new refresh token
 * @returns 
 * export async function sign(payload: Token, secret: string): Promise<string> {
    const iat = Math.floor(Date.now() / 1000);
    const exp = iat + 60* 60; // one hour

    return new SignJWT({...payload})
        .setProtectedHeader({alg: 'HS256', typ: 'JWT'})
        .setExpirationTime(exp)
        .setIssuedAt(iat)
        .setNotBefore(iat)
        .sign(new TextEncoder().encode(secret));
}
 */

const isAuthenticated = async (req: NextRequest) => {
  const authorization = req.headers.get("authorization");

  // TODO improve redirect logic
  const loginUrl = new URL("/login", req.url);
  loginUrl.searchParams.set("from", req.nextUrl.pathname);
  if (!authorization) {
    return NextResponse.redirect(loginUrl);
  }

  try {
    const token = authorization.split(" ")[1];
    const signingKey = new TextEncoder().encode(process.env.JWT_ACCESS_SECRET);
    const { payload, protectedHeader } = await jwtVerify(token, signingKey);
    console.log({ payload, protectedHeader });
    // TODO Verify iat and exp (if expired then refresh the token using above sign function)
  } catch (err) {
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
};

export async function middleware(request: NextRequest) {
  const page = request.nextUrl.pathname;
  const method = request.method;

  // Protected Routes
  switch (method) {
    case "POST":
      if (
        page.includes("/api/collections/create") ||
        page.includes("/api/paintings/create")
      ) {
        return await isAuthenticated(request);
      }
      break;
    case "PATCH":
      if (
        page.includes("/api/collections") ||
        page.includes("/api/paintings") ||
        page.includes("/api/users")
      ) {
        return await isAuthenticated(request);
      }
      break;
    case "DELETE":
      if (
        page.includes("/api/collections") ||
        page.includes("/api/paintings")
      ) {
        return await isAuthenticated(request);
      }
      break;

    default:
      return NextResponse.next();
  }
}

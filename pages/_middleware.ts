import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const isAuthenticated = (req: NextRequest) => {
  const authorization = req.headers.get("authorization");

  if (!authorization) {
    return new Response(
      JSON.stringify({ message: "Un-Authorized to make this request." }),
      {
        status: 401,
      }
    );
  }

  try {
    const token = authorization.split(" ")[1];
    jwt.verify(token, process.env.JWT_ACCESS_SECRET);
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return new Response(JSON.stringify({ message: err.name }), {
        status: 401,
      });
    }
    return new Response(
      JSON.stringify({ message: "Un-Authorized to make this request." }),
      {
        status: 401,
      }
    );
  }

  return NextResponse.next();
};

export function middleware(request: NextRequest) {
  const route = request.nextUrl.pathname;

  // Protected Routes
  switch (route) {
    // Collections
    case "/api/collection/create":
      return isAuthenticated(request);

    case "/api/collection/updateCollectionOrder":
      return isAuthenticated(request);

    case "/api/collection/delete":
      return isAuthenticated(request);

    // Paintings
    case "/api/painting/create":
      return isAuthenticated(request);

    // add more protected auth routes here...

    default:
      return NextResponse.next();
  }
}

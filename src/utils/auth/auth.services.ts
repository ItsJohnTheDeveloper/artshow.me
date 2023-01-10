import prisma from "../../lib/prisma";
import hashToken from "../hashToken";

export async function addRefreshTokenToWhitelist({
  jti,
  refreshToken,
  userId,
}) {
  return await prisma.refreshToken.create({
    data: {
      id: jti,
      hashedToken: hashToken(refreshToken),
      userId: userId,
    },
  });
}

export async function findRefreshTokenById(id) {
  return await prisma.refreshToken.findUnique({
    where: {
      id,
    },
  });
}

export async function deleteRefreshToken(id) {
  console.log("attempting to delete Refresh token...");
  return await prisma.refreshToken.update({
    where: {
      id,
    },
    data: { revoked: true },
  });
}

export async function revokeTokens(userId) {
  return await prisma.refreshToken.updateMany({
    where: {
      userId: userId,
    },
    data: {
      revoked: true,
    },
  });
}

import { getServerSession } from "next-auth";
import { NextApiRequest, NextApiResponse } from "next";
import { authOptions } from "./[...nextauth]";
import prisma from "../../../../lib/prisma";

/**
 * A middleware function that checks if the user is authenticated.
 *
 * @type {function}
 * @param {NextApiRequest} req - The request object.
 * @param {NextApiResponse} res - The response object.
 * @param {function} callback - The callback function to run if the user is authenticated.
 */

const HandleAuthRequest = async (
  req: NextApiRequest,
  res: NextApiResponse,
  callback: () => void
): Promise<void> => {
  const authedPromise = new Promise<void>(async (resolve, reject) => {
    const session = await getServerSession(req, res, authOptions);
    const isAuthed = !!session;
    if (!isAuthed) {
      reject({ code: 401, message: "Not authenticated." });
    } else {
      resolve(callback());
    }
  });

  await Promise.all([authedPromise]).catch(({ message, code }) => {
    return res.json({
      message,
      code,
    });
  });
};

/**
 * A middleware function that checks if the user is authenticated and if the user is the owner of the resource.
 *
 * @type {function}
 * @param {NextApiRequest} req - The request object.
 * @param {NextApiResponse} res - The response object.
 * @param {string} resourceType - The type of resource to check. Can be "user", "collection", or "painting".
 * @param {string} field - The field to check. Can be "id", "userId".
 * @param {string} resourceId - The id of the resource to check.
 * @param {function} callback - The callback function to run if the user is authenticated and the user is the owner of the resource.
 */
const HandleAuthRequestWithOwnership = async (
  req: NextApiRequest,
  res: NextApiResponse,
  options: {
    resourceType: "user" | "collection" | "painting";
    field: "id" | "userId";
    resourceId: string;
    callback: () => void;
  }
): Promise<void> => {
  const { resourceType, field, resourceId, callback } = options;

  const authedPromise = new Promise<void>(async (resolve, reject) => {
    // check if authed
    const session = await getServerSession(req, res, authOptions);
    const isAuthed = !!session;
    if (!isAuthed) {
      reject({ code: 401, message: "Not authenticated." });
    }

    const loggedInUserId = session?.user?.id ?? null;

    try {
      // @ts-expect-error
      const response = await prisma?.[resourceType].findUnique({
        where: { [field]: resourceId },
      });

      const resourceOwnerId = response?.[field];
      if (resourceOwnerId === loggedInUserId) {
        resolve(callback());
      } else {
        reject({
          code: 401,
          message: "Not authorized to modify this resource.",
        });
      }
    } catch (err) {
      reject({ code: 404, message: "Error fetching resource." });
    }
  });
  await Promise.all([authedPromise]).catch(({ message, code }) => {
    return res.json({
      message,
      code,
    });
  });
};

export { HandleAuthRequest, HandleAuthRequestWithOwnership };

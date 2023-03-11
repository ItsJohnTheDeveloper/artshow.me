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
    const isPostRequest = req.method === "POST";

    let isAuthed = !!session;

    // if the request is POST, check if the session "userId" matches the "userId" in the request body
    // *ensures the user is creating a resource for themselves.*
    if (isPostRequest) {
      isAuthed = isPostRequest && session?.user?.id === req?.body?.userId;
    }

    if (!isAuthed) {
      reject({ code: 401, message: "Not authenticated." });
      return;
    } else {
      resolve(callback());
    }
  });

  await Promise.all([authedPromise]).catch(({ message, code }) => {
    return res.status(code).json({ message });
  });
};

/**
 * A middleware function that checks if the user is authenticated and if the user is the owner of the resource.
 *
 * @type {function}
 * @param {NextApiRequest} req - The request object.
 * @param {NextApiResponse} res - The response object.
 * @param {object} options - The options object.
 * @param {string} options.resourceType - The type of resource to check. Can be "user", "collection", or "painting".
 * @param {string} options.resourceId - The id of the resource to check.
 * @param {function} options.callback - The callback function to run if the user is authenticated and the user is the owner of the resource.
 */
const HandleAuthRequestWithOwnership = async (
  req: NextApiRequest,
  res: NextApiResponse,
  options: {
    resourceType: "user" | "collection" | "painting";
    resourceId: string;
    callback: () => void;
  }
): Promise<void> => {
  const { resourceType, resourceId, callback } = options;
  let field: "id" | "userId" = "id"; // property to check for ownership when fetching the resource

  const authedPromise = new Promise<void>(async (resolve, reject) => {
    // check if authed
    const session = await getServerSession(req, res, authOptions);
    const isAuthed = !!session;
    if (!isAuthed) {
      reject({ code: 401, message: "Not authenticated." });
      return;
    }

    const loggedInUserId = session?.user?.id ?? null;

    let filters = {
      where: { [field]: resourceId },
    };

    // if the resource type is a user, the field will be "id" else a collection, painting, or anything else will be "userId"
    if (resourceType === "painting" || resourceType === "collection") {
      field = "userId";
      // @ts-expect-error
      filters.where = { AND: [{ id: resourceId }, { userId: loggedInUserId }] };
    }
    try {
      // @ts-expect-error
      const response = await prisma?.[resourceType].findFirst(filters);
      const resourceOwnerId = response?.[field];

      if (resourceOwnerId === loggedInUserId) {
        resolve(callback());
      } else {
        reject({
          code: 401,
          message: "Not authorized to modify this resource.",
        });
        return;
      }
    } catch (err) {
      reject({ code: 404, message: "Error fetching resource." });
      return;
    }
  });
  await Promise.all([authedPromise]).catch(({ message, code }) => {
    return res.status(code).json({ message });
  });
};

export { HandleAuthRequest, HandleAuthRequestWithOwnership };

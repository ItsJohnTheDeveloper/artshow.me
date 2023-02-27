import { Collection } from "./../../../models/Collection";
import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../../lib/prisma";
import { apiHandler } from "../../../utils/api";
import { HandleAuthRequestWithOwnership } from "../auth/authMiddlware";

const getCollection = async (req: NextApiRequest, res: NextApiResponse) => {
  const { cid } = req.query;
  if (!cid) {
    return res.status(404).json("404 - no collection id found.");
  }
  const response: Collection = await prisma.collection.findUnique({
    where: { id: cid as string },
  });
  return res.status(200).json(response);
};

type CollectionUpdate = {
  name?: string;
  order?: string[];
};
const updateCollection = async (req: NextApiRequest, res: NextApiResponse) => {
  const cid = req.query.cid as string;
  const { name, order } = req.body;

  if (!cid) {
    return res.status(404).json("404 - no collection id found.");
  }
  if (!name && !order) {
    return res.status(404).json("404 - no query params found");
  }

  await HandleAuthRequestWithOwnership(req, res, {
    resourceType: "collection",
    field: "userId",
    resourceId: cid,
    callback: async () => {
      let data: CollectionUpdate;

      if (name) {
        data = { ...data, name };
      }
      if (order) {
        data = { ...data, order: JSON.parse(order) };
      }
      const response = await prisma.collection.update({
        where: { id: cid },
        data,
      });
      return res.status(200).json(response);
    },
  });
};

const deleteCollection = async (req: NextApiRequest, res: NextApiResponse) => {
  const cid = req.query.cid as string;
  if (!cid) {
    return res.status(404).json("404 - No request body found");
  }

  await HandleAuthRequestWithOwnership(req, res, {
    resourceType: "collection",
    field: "userId",
    resourceId: cid,
    callback: async () => {
      const response = await prisma.collection.delete({
        where: { id: cid },
      });
      return res.status(200).json(response);
    },
  });
};

export default apiHandler({
  GET: getCollection,
  PATCH: updateCollection,
  DELETE: deleteCollection,
});

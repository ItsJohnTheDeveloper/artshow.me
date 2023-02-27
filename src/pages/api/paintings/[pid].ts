import { Painting } from "./../../../models/Painting";
import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../../lib/prisma";
import { apiHandler } from "../../../utils/api";
import { z } from "zod";
import { HandleAuthRequestWithOwnership } from "../auth/authMiddlware";

const PaintingSchema = z.object({
  name: z.string().optional(),
  image: z.string().optional(),
  width: z.number().optional(),
  height: z.number().optional(),
  price: z.number().optional(),
  sizeUnit: z.enum(["cm", "in"]).optional(),
  showPrice: z.boolean().optional(),
  showSize: z.boolean().optional(),
  description: z.string().optional(),
  collectionIds: z.array(z.string()).optional(),
});

const getPainting = async (req: NextApiRequest, res: NextApiResponse) => {
  const pid = req.query.pid as string;
  if (!pid) {
    return res.status(404).json("404 - no painting id found.");
  }
  const response = await prisma.painting.findUnique({
    where: { id: pid },
  });
  res.status(200).json(response);
};

const updatePainting = async (req: NextApiRequest, res: NextApiResponse) => {
  const pid = req.query.pid as string;
  if (!pid && !req.body) {
    return res.status(404).json("404 - no painting id or data found.");
  }

  await HandleAuthRequestWithOwnership(req, res, {
    resourceType: "painting",
    field: "userId",
    resourceId: pid,
    callback: async () => {
      const result = PaintingSchema.safeParse(req.body);
      if (result.success === false) {
        return res.status(400).json({
          message: "400 - bad request",
          detail: result?.error,
        });
      }

      const response = await prisma.painting.update({
        where: { id: pid },
        data: result.data,
      });
      return res.status(200).json(response);
    },
  });
};

const deletePainting = async (req: NextApiRequest, res: NextApiResponse) => {
  const pid = req.query.pid as string;
  if (!pid) {
    return res.status(404).json("404 - no painting id found.");
  }

  await HandleAuthRequestWithOwnership(req, res, {
    resourceType: "painting",
    field: "userId",
    resourceId: pid,
    callback: async () => {
      const response = await prisma.painting.delete({
        where: { id: pid },
      });
      return res.status(200).json(response);
    },
  });
};

export default apiHandler({
  GET: getPainting,
  PATCH: updatePainting,
  DELETE: deletePainting,
});

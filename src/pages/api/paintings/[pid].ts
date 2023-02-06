import { Painting } from "./../../../models/Painting";
import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../../lib/prisma";
import { apiHandler } from "../../../utils/api";

const getPainting = async (req: NextApiRequest, res: NextApiResponse) => {
  const { pid } = req.query;
  if (!pid) {
    return res.status(404).json("404 - no painting id found.");
  }
  const response: Painting = await prisma.painting.findUnique({
    where: { id: pid },
  });
  res.status(200).json(response);
};

const updatePainting = async (req: NextApiRequest, res: NextApiResponse) => {
  const { pid } = req.query;
  const { data } = req.body;
  if (!pid || !data) {
    return res.status(404).json("404 - no painting id or data found.");
  }
  const response: Painting = await prisma.painting.update({
    where: { id: pid },
    data,
  });
  res.status(200).json(response);
};

const deletePainting = async (req: NextApiRequest, res: NextApiResponse) => {
  const { pid } = req.query;
  if (!pid) {
    return res.status(404).json("404 - no painting id found.");
  }
  const response: Painting = await prisma.painting.delete({
    where: { id: pid },
  });
  res.status(200).json(response);
};

export default apiHandler({
  GET: getPainting,
  PATCH: updatePainting,
  DELETE: deletePainting,
});

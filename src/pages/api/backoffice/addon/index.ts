// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { prisma } from "@/utils/prisma";
import type { NextApiRequest, NextApiResponse } from "next";

// Serverless function
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const method = req.method;
  if (method === "GET") {
    return res.status(200).send("OK GET addon");
  } else if (method === "POST") {
    const { name, price, addonCategoryId } = req.body;
    const isValid = name && addonCategoryId;
    if (!isValid) return res.status(400).send("Bad request");
    const addon = await prisma.addon.create({
      data: { name, price, addonCategoryId },
    });
    return res.status(200).json({ addon });
  } else if (method === "PUT") {
    const { id, ...payload } = req.body;
    const exist = await prisma.addon.findFirst({ where: { id } });
    if (!exist) return res.status(400).send("Bad request");
    const addon = await prisma.addon.update({ data: payload, where: { id } });
    return res.status(200).json({ addon });
  } else if (method === "DELETE") {
    return res.status(200).send("OK DELETE addon");
  }
  return res.status(405).send("Invalid method");
}

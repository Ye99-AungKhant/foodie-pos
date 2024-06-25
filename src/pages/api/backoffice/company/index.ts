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
    return res.status(200).send("OK GET company");
  } else if (method === "PUT") {
    const { id, name, street, township, city } = req.body;
    const exist = await prisma.company.findFirst({ where: { id } });
    if (!exist) return res.status(400).send("Bad request.");
    const company = await prisma.company.update({
      data: { name, street, township, city },
      where: { id },
    });
    return res.status(200).json({ company });
  }
  return res.status(405).send("Invalid method");
}

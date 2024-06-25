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
    return res.status(200).send("OK GET menu category");
  } else if (method === "POST") {
    const { name, companyId, isAvailable } = req.body;
    console.log(name);
    console.log(companyId);
    console.log(isAvailable);

    const isValid = name && companyId && isAvailable !== undefined;
    if (!isValid) return res.status(400).send("Bad request");
    const menuCategory = await prisma.menuCategory.create({
      data: { name, companyId },
    });
    return res.status(200).json({ menuCategory });
  } else if (method === "PUT") {
    const { id, locationId, isAvailable, ...payload } = req.body;
    const menuCategory = await prisma.menuCategory.findFirst({ where: { id } });
    if (!menuCategory) return res.status(400).send("Bad request.");
    const updatedMenuCategory = await prisma.menuCategory.update({
      data: payload,
      where: { id },
    });
    if (locationId && isAvailable !== undefined) {
      if (isAvailable === false) {
        await prisma.disabledLocationMenuCategory.create({
          data: { menuCategoryId: id, locationId },
        });
      } else {
        const item = await prisma.disabledLocationMenuCategory.findFirst({
          where: { menuCategoryId: id, locationId },
        });
        item &&
          (await prisma.disabledLocationMenuCategory.delete({
            where: { id: item.id },
          }));
      }
    }
    const disabledLocationMenuCategories =
      await prisma.disabledLocationMenuCategory.findMany({
        where: { menuCategoryId: id },
      });
    return res
      .status(200)
      .json({ updatedMenuCategory, disabledLocationMenuCategories });
  } else if (method === "DELETE") {
    const menuCategoryId = Number(req.query.id);
    const exist = await prisma.menuCategory.findFirst({
      where: { id: menuCategoryId },
    });
    if (!exist) return res.status(400).send("Bad request.");
    await prisma.menuCategory.update({
      data: { isArchived: true },
      where: { id: menuCategoryId },
    });
    return res.status(200).send("OK");
  }
  return res.status(405).send("Invalid method");
}

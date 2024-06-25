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
    return res.status(200).send("OK GET menu");
  } else if (method === "POST") {
    const { name, price, menuCategoryIds, assetUrl } = req.body;
    const isValid = name && price !== undefined && menuCategoryIds.length > 0;
    if (!isValid) return res.status(400).send("Bad request.");
    const menu = await prisma.menu.create({ data: { name, price, assetUrl } });
    const menuCategoryMenus = await prisma.$transaction(
      menuCategoryIds.map((itemId: number) =>
        prisma.menuCategoryMenu.create({
          data: { menuId: menu.id, menuCategoryId: itemId },
        })
      )
    );
    return res.status(200).json({ menu, menuCategoryMenus });
  } else if (method === "PUT") {
    const { id, name, price, locationId, isAvailable, menuCategoryIds } =
      req.body;
    const exist = await prisma.menu.findFirst({ where: { id } });
    if (!exist) return res.status(400).send("Bad request.");
    const menu = await prisma.menu.update({
      data: { name, price },
      where: { id },
    });
    if (locationId && isAvailable !== undefined) {
      if (isAvailable === false) {
        await prisma.disabledLocationMenu.create({
          data: { menuId: id, locationId },
        });
      } else {
        const item = await prisma.disabledLocationMenu.findFirst({
          where: { menuId: id, locationId },
        });
        item &&
          (await prisma.disabledLocationMenu.delete({
            where: { id: item.id },
          }));
      }
    }
    if (menuCategoryIds) {
      const menuCategoriesMenus = await prisma.menuCategoryMenu.findMany({
        where: { menuId: id },
      });
      // Remove
      const toRemove = menuCategoriesMenus.filter(
        (item) => !menuCategoryIds.includes(item.menuCategoryId)
      );
      if (toRemove.length) {
        await prisma.menuCategoryMenu.deleteMany({
          where: { id: { in: toRemove.map((item) => item.id) } },
        });
      }
      // Add
      const toAdd = menuCategoryIds.filter(
        (menuCategoryId: number) =>
          !menuCategoriesMenus.find(
            (item) => item.menuCategoryId === menuCategoryId
          )
      );
      if (toAdd.length) {
        await prisma.$transaction(
          toAdd.map((menuCategoryId: number) =>
            prisma.menuCategoryMenu.create({
              data: { menuId: id, menuCategoryId },
            })
          )
        );
      }
    }
    const location = await prisma.location.findFirst({
      where: { id: locationId },
    });
    const locations = await prisma.location.findMany({
      where: { companyId: location?.companyId },
    });
    const locationIds = locations.map((item) => item.id);
    const disabledLocationMenus = await prisma.disabledLocationMenu.findMany({
      where: { locationId: { in: locationIds } },
    });
    const menuCategoryMenus = await prisma.menuCategoryMenu.findMany({
      where: { menuId: id },
    });
    return res
      .status(200)
      .json({ menu, disabledLocationMenus, menuCategoryMenus });
  } else if (method === "DELETE") {
    const menuId = Number(req.query.id);
    const exist = await prisma.menu.findFirst({
      where: { id: menuId },
    });
    if (!exist) return res.status(400).send("Bad request.");
    await prisma.menu.update({
      data: { isArchived: true },
      where: { id: menuId },
    });
    return res.status(200).send("OK");
  }
  return res.status(405).send("Invalid method");
}

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
    return res.status(200).send("OK GET addon category");
  } else if (method === "POST") {
    const { name, isRequired, menuIds } = req.body;
    const isValid = name && isRequired !== undefined && menuIds.length;
    if (!isValid) return res.status(400).send("Bad request.");
    const addonCategory = await prisma.addonCategory.create({
      data: { name, isRequired },
    });
    const menuAddonCategories = await prisma.$transaction(
      menuIds.map((menuId: number) =>
        prisma.menuAddonCategory.create({
          data: { menuId, addonCategoryId: addonCategory.id },
        })
      )
    );
    return res.status(200).json({ addonCategory, menuAddonCategories });
  } else if (method === "PUT") {
    const { id, name, isRequired, menuIds, companyId } = req.body;
    const exist = await prisma.addonCategory.findFirst({ where: { id } });
    if (!exist) return res.status(400).send("Bad request.");
    const addonCategory = await prisma.addonCategory.update({
      data: { name, isRequired },
      where: { id },
    });
    const existingMenuAddonCategories = await prisma.menuAddonCategory.findMany(
      {
        where: { addonCategoryId: id },
      }
    );
    const toRemove = existingMenuAddonCategories.filter(
      (item) => !menuIds.includes(item.menuId)
    );

    if (toRemove.length) {
      await prisma.menuAddonCategory.deleteMany({
        where: { id: { in: toRemove.map((item) => item.id) } },
      });
    }
    const toAdd = menuIds.filter(
      (menuId: number) =>
        !existingMenuAddonCategories.find((item) => item.menuId === menuId)
    );

    if (toAdd.length) {
      await prisma.$transaction(
        toAdd.map((menuId: number) =>
          prisma.menuAddonCategory.create({
            data: { menuId, addonCategoryId: id },
          })
        )
      );
    }
    const menuCategories = await prisma.menuCategory.findMany({
      where: { companyId },
    });
    const menuCategoryMenus = await prisma.menuCategoryMenu.findMany({
      where: { menuCategoryId: { in: menuCategories.map((item) => item.id) } },
    });
    const companyMenuIds = menuCategoryMenus.map((item) => item.menuId);
    const menuAddonCategories = await prisma.menuAddonCategory.findMany({
      where: { menuId: { in: companyMenuIds } },
    });
    return res.status(200).json({ addonCategory, menuAddonCategories });
  } else if (method === "DELETE") {
    const addonCategoryId = Number(req.query.id);
    const exist = await prisma.addonCategory.findFirst({
      where: { id: addonCategoryId },
    });
    if (!exist) return res.status(400).send("Bad request.");
    await prisma.addonCategory.update({
      data: { isArchived: true },
      where: { id: addonCategoryId },
    });
    return res.status(200).send("OK");
  }
  return res.status(405).send("Invalid method");
}

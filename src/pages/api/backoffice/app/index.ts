// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { qrCodeImageUpload } from "@/utils/assetUpload";
import { prisma } from "@/utils/prisma";
import type { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";

// Serverless function
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getSession({ req });
  if (session) {
    const { user } = session;
    if (user) {
      const name = user.name as string;
      const email = user.email as string;
      const userFromDb = await prisma.user.findFirst({ where: { email } });
      if (userFromDb) {
        const companyId = userFromDb.companyId;
        const company = await prisma.company.findFirst({
          where: { id: companyId },
        });
        const locations = await prisma.location.findMany({
          where: { companyId, isArchived: false },
        });
        const locationIds = locations.map((item) => item.id);
        const tables = await prisma.table.findMany({
          where: { locationId: { in: locationIds }, isArchived: false },
        });
        const menuCategories = await prisma.menuCategory.findMany({
          orderBy: [{ id: "asc" }],
          where: { companyId, isArchived: false },
        });
        const menuCategoryIds = menuCategories.map((item) => item.id);
        const disabledLocationMenuCategories =
          await prisma.disabledLocationMenuCategory.findMany({
            where: { menuCategoryId: { in: menuCategoryIds } },
          });
        const menuCategoryMenus = await prisma.menuCategoryMenu.findMany({
          where: { menuCategoryId: { in: menuCategoryIds } },
        });
        const menuCategoryMenuIds = menuCategoryMenus.map(
          (item) => item.menuId
        );
        const menus = await prisma.menu.findMany({
          orderBy: [{ id: "asc" }],
          where: { id: { in: menuCategoryMenuIds }, isArchived: false },
        });
        const menuIds = menus.map((item) => item.id);
        const disabledLocationMenus =
          await prisma.disabledLocationMenu.findMany({
            where: { menuId: { in: menuIds } },
          });
        const menuAddonCategories = await prisma.menuAddonCategory.findMany({
          where: { menuId: { in: menuIds } },
        });
        const addonCategories = await prisma.addonCategory.findMany({
          where: {
            id: {
              in: menuAddonCategories.map((item) => item.addonCategoryId),
            },
            isArchived: false,
          },
        });
        const addons = await prisma.addon.findMany({
          orderBy: [{ id: "asc" }],
          where: {
            addonCategoryId: {
              in: addonCategories.map((item) => item.id),
            },
          },
        });
        const orders = await prisma.order.findMany({
          where: { tableId: { in: tables.map((item) => item.id) } },
        });
        res.status(200).json({
          company,
          menus,
          menuCategories,
          locations,
          tables,
          menuCategoryMenus,
          addonCategories,
          addons,
          menuAddonCategories,
          disabledLocationMenus,
          disabledLocationMenuCategories,
          orders,
        });
      } else {
        const newCompany = await prisma.company.create({
          data: {
            name: "Default company",
            street: "Default street",
            township: "Default twonship",
            city: "Default city",
          },
        });
        await prisma.user.create({
          data: { name, email, companyId: newCompany.id },
        });
        const newLocation = await prisma.location.create({
          data: {
            name: "Default location",
            street: "Default location street",
            city: "Default location city",
            township: "Default location township",
            companyId: newCompany.id,
          },
        });
        let newTable = await prisma.table.create({
          data: {
            name: "Default table",
            locationId: newLocation.id,
            assetUrl: "",
          },
        });
        const assetUrl = await qrCodeImageUpload(newTable.id);
        newTable = await prisma.table.update({
          data: { assetUrl },
          where: { id: newTable.id },
        });
        const newMenuCategory = await prisma.menuCategory.create({
          data: {
            name: "Default menu category",
            companyId: newCompany.id,
          },
        });
        const newMenu = await prisma.menu.create({
          data: { name: "Default menu", price: 1000 },
        });
        const newMenuCategoryMenu = await prisma.menuCategoryMenu.create({
          data: {
            menuId: newMenu.id,
            menuCategoryId: newMenuCategory.id,
          },
        });
        const newAddonCategory = await prisma.addonCategory.create({
          data: { name: "Default addon category" },
        });
        const newMenuAddonCategory = await prisma.menuAddonCategory.create({
          data: {
            addonCategoryId: newAddonCategory.id,
            menuId: newMenu.id,
          },
        });
        const newAddonsData = [
          { name: "Addon1", addonCategoryId: newAddonCategory.id },
          { name: "Addon2", addonCategoryId: newAddonCategory.id },
          { name: "Addon3", addonCategoryId: newAddonCategory.id },
        ];
        const newAddons = await prisma.$transaction(
          newAddonsData.map((addon) => prisma.addon.create({ data: addon }))
        );
        res.status(200).json({
          company: newCompany,
          menus: [newMenu],
          menuCategories: [newMenuCategory],
          locations: [newLocation],
          tables: [newTable],
          menuCategoryMenus: [newMenuCategoryMenu],
          addonCategories: [newAddonCategory],
          addons: [newAddons],
          menuAddonCategories: [newMenuAddonCategory],
          disabledLocationMenus: [],
          disabledLocationMenuCategories: [],
          orders: [],
        });
      }
    }
  } else {
    res.status(401).send("Unauthorized");
  }
}

import { MenuCategoryMenu } from "@prisma/client";

export interface MenuCategoryMenuSlice {
  menuCategoryMenus: MenuCategoryMenu[];
  isLoading: boolean;
  error: Error | null;
}

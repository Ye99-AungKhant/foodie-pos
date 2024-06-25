import { DisabledLocationMenuCategory } from "@prisma/client";

export interface DisabledLocationMenuCategorySlice {
  disabledLocationMenuCategories: DisabledLocationMenuCategory[];
  isLoading: boolean;
  error: Error | null;
}

import { AddonCategory } from "@prisma/client";
import { BaseOptions } from "./user";

export interface AddonCategorySlice {
  addonCategories: AddonCategory[];
  isLoading: boolean;
  error: Error | null;
}

export interface UpdateAddonCategoryPayload extends AddonCategory, BaseOptions {
  menuIds: number[];
  companyId?: number;
}

export interface CreateAddonCategoryPayload extends BaseOptions {
  name: string;
  isRequired: boolean;
  menuIds: number[];
}

export interface DeleteAddonCategoryPayload extends BaseOptions {
  id: number;
}

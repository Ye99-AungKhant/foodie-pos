import { Addon } from "@prisma/client";
import { BaseOptions } from "./user";

export interface AddonSlice {
  addons: Addon[];
  isLoading: boolean;
  error: Error | null;
}

export interface UpdateAddonPayload extends Addon, BaseOptions {}

export interface CreateAddonPayload extends BaseOptions {
  name: string;
  price: number;
  addonCategoryId?: number;
}

export interface DeleteAddonPayload extends BaseOptions {
  id: number;
}

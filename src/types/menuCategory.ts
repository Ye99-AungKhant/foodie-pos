import { BaseOptions } from "./user";

export interface CreateMenuCategoryPayload extends BaseOptions {
  name: string;
  isAvailable: boolean;
  companyId?: number;
}

export interface UpdateMenuCategoryPayload extends BaseOptions {
  id: number;
  name?: string;
  isAvailable?: boolean;
  locationId?: number;
}

export interface DeleteMenuCategoryPayload extends BaseOptions {
  id: number;
}

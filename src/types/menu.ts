import { Menu } from "@prisma/client";
import { BaseOptions } from "./user";

interface BaseMenu {
  name: string;
  price: number;
}

export interface CreateMenuPayload extends BaseOptions {
  name: string;
  price: number;
  menuCategoryIds: number[];
  assetUrl?: string;
}

export interface UpdateMenuPayload extends Menu, BaseOptions {
  locationId?: number;
  isAvailable?: boolean;
  menuCategoryIds?: number[];
}

export interface DeleteMenuPayload extends BaseOptions {
  id: number;
}

export interface NewMenuParams extends BaseMenu, BaseOptions {}
export interface UpdateMenuPayload extends Menu, BaseOptions {}

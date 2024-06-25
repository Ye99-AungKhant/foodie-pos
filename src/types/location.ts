import { Location } from "@prisma/client";
import { BaseOptions } from "./user";

export interface LocationSlice {
  locations: Location[];
  isLoading: boolean;
  error: Error | null;
}

export interface UpdateLocationPayload extends Location, BaseOptions {}

export interface DeleteLocationPayload extends BaseOptions {
  id: number;
}

export interface CreateLocationPayload extends BaseOptions {
  name: string;
  street: string;
  township: string;
  city: string;
  companyId?: number;
}

import { Table } from "@prisma/client";
import { BaseOptions } from "./user";

export interface TableSlice {
  tables: Table[];
  isLoading: boolean;
  error: Error | null;
}

export interface UpdateTablePayload extends Table, BaseOptions {}

export interface CreateTablePayload extends BaseOptions {
  name: string;
  locationId?: number;
}

export interface DeleteTablePayload extends BaseOptions {
  id: number;
}

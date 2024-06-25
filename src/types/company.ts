import { Company } from "@prisma/client";
import { BaseOptions } from "./user";

export interface CompanySlice {
  company: Company | null;
  isLoading: boolean;
  error: Error | null;
}

export interface UpdateCompanyPayload extends Company, BaseOptions {}

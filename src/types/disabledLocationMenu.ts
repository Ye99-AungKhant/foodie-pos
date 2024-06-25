import { DisabledLocationMenu } from "@prisma/client";

export interface DisabledLocationMenuSlice {
  disabledLocationMenus: DisabledLocationMenu[];
  isLoading: boolean;
  error: Error | null;
}

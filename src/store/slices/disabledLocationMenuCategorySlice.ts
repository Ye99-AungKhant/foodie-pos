import { DisabledLocationMenuCategorySlice } from "@/types/disabledLocationMenuCategory";
import { DisabledLocationMenuCategory } from "@prisma/client";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

const initialState: DisabledLocationMenuCategorySlice = {
  disabledLocationMenuCategories: [],
  isLoading: false,
  error: null,
};

export const disabledLocationMenuCategorySlice = createSlice({
  name: "disabledLocationMenuCategory",
  initialState,
  reducers: {
    setDisabledLocationMenuCategory: (
      state,
      action: PayloadAction<DisabledLocationMenuCategory[]>
    ) => {
      state.disabledLocationMenuCategories = action.payload;
    },
  },
});

export const { setDisabledLocationMenuCategory } =
  disabledLocationMenuCategorySlice.actions;

export default disabledLocationMenuCategorySlice.reducer;

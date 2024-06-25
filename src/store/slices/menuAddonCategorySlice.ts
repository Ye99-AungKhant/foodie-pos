import { MenuAddonCategorySlice } from "@/types/menuAddonCategory";
import { MenuAddonCategory } from "@prisma/client";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

const initialState: MenuAddonCategorySlice = {
  menuAddonCategories: [],
  isLoading: false,
  error: null,
};

export const menuAddonCategorySlice = createSlice({
  name: "menuAddonCategory",
  initialState,
  reducers: {
    addMenuAddonCategories: (
      state,
      action: PayloadAction<MenuAddonCategory[]>
    ) => {
      state.menuAddonCategories = [
        ...state.menuAddonCategories,
        ...action.payload,
      ];
    },
    setMenuAddonCategories: (
      state,
      action: PayloadAction<MenuAddonCategory[]>
    ) => {
      state.menuAddonCategories = action.payload;
    },
  },
});

export const { setMenuAddonCategories, addMenuAddonCategories } =
  menuAddonCategorySlice.actions;

export default menuAddonCategorySlice.reducer;

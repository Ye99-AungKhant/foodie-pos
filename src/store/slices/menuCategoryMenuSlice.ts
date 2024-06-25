import { MenuCategoryMenuSlice } from "@/types/menuCategoryMenu";
import { MenuCategoryMenu } from "@prisma/client";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

const initialState: MenuCategoryMenuSlice = {
  menuCategoryMenus: [],
  isLoading: false,
  error: null,
};

export const menuCategoryMenuSlice = createSlice({
  name: "menuCategoryMenuSlice",
  initialState,
  reducers: {
    setMenuCategoryMenus: (
      state,
      action: PayloadAction<MenuCategoryMenu[]>
    ) => {
      state.menuCategoryMenus = action.payload;
    },
  },
});

export const { setMenuCategoryMenus } = menuCategoryMenuSlice.actions;

export default menuCategoryMenuSlice.reducer;

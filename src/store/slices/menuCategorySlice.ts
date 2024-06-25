import { config } from "@/config";
import { MenuCategory } from "@prisma/client";
import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { RootState } from "..";
import {
  CreateMenuCategoryPayload,
  DeleteMenuCategoryPayload,
  UpdateMenuCategoryPayload,
} from "../../types/menuCategory";
import { setDisabledLocationMenuCategory } from "./disabledLocationMenuCategorySlice";

interface MenuCategorySlice {
  menuCategories: MenuCategory[];
  isLoading: boolean;
  error: Error | null;
}

const initialState: MenuCategorySlice = {
  menuCategories: [],
  isLoading: false,
  error: null,
};

export const createMenuCategory = createAsyncThunk(
  "menuCategory/createMenuCategory",
  async (payload: CreateMenuCategoryPayload, thunkApi) => {
    const { onSuccess } = payload;
    const response = await fetch(
      `${config.backofficeApiBaseUrl}/menu-category`,
      {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify(payload),
      }
    );
    const dataFromServer = await response.json();
    const { menuCategory } = dataFromServer;
    onSuccess && onSuccess();
    thunkApi.dispatch(addMenuCategory(menuCategory));
  }
);

export const updateMenuCategory = createAsyncThunk(
  "menuCategory/updateMenuCategory",
  async (payload: UpdateMenuCategoryPayload, thunkApi) => {
    const { onSuccess } = payload;
    const response = await fetch(
      `${config.backofficeApiBaseUrl}/menu-category`,
      {
        method: "PUT",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify(payload),
      }
    );
    const dataFromServer = await response.json();
    const { updatedMenuCategory, disabledLocationMenuCategories } =
      dataFromServer;
    onSuccess && onSuccess();
    thunkApi.dispatch(replaceMenuCategory(updatedMenuCategory));
    thunkApi.dispatch(
      setDisabledLocationMenuCategory(disabledLocationMenuCategories)
    );
  }
);

export const deleteMenuCategory = createAsyncThunk(
  "menuCategory/deleteMenuCategory",
  async (payload: DeleteMenuCategoryPayload, thunkApi) => {
    const { id, onSuccess } = payload;
    await fetch(`${config.backofficeApiBaseUrl}/menu-category?id=${id}`, {
      method: "DELETE",
    });
    onSuccess && onSuccess();
    thunkApi.dispatch(removeMenuCategory(id));
  }
);

export const menuCategorySlice = createSlice({
  name: "menuCategory",
  initialState,
  reducers: {
    setMenuCategories: (state, action: PayloadAction<MenuCategory[]>) => {
      state.menuCategories = action.payload;
    },
    addMenuCategory: (state, action: PayloadAction<MenuCategory>) => {
      state.menuCategories = [...state.menuCategories, action.payload];
    },
    replaceMenuCategory: (state, action: PayloadAction<MenuCategory>) => {
      state.menuCategories = state.menuCategories.map((item) =>
        item.id === action.payload.id ? action.payload : item
      );
    },
    removeMenuCategory: (state, action: PayloadAction<number>) => {
      state.menuCategories = state.menuCategories.filter((menuCategory) =>
        menuCategory.id === action.payload ? false : true
      );
    },
  },
});

export const {
  setMenuCategories,
  addMenuCategory,
  removeMenuCategory,
  replaceMenuCategory,
} = menuCategorySlice.actions;

export const menuCategoriesSelector = (state: RootState) => state.menuCategory;

export default menuCategorySlice.reducer;

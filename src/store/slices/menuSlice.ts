import { config } from "@/config";
import { Menu } from "@prisma/client";
import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  CreateMenuPayload,
  DeleteMenuPayload,
  UpdateMenuPayload,
} from "../../types/menu";
import { setDisabledLocationMenus } from "./disabledLocationMenuSlice";
import { setMenuCategoryMenus } from "./menuCategoryMenuSlice";

interface MenuSlice {
  menus: Menu[];
  isLoading: boolean;
  error: string | null;
}

const initialState: MenuSlice = {
  menus: [],
  isLoading: false,
  error: null,
};

export const createMenu = createAsyncThunk(
  "menu/createMenu",
  async (payload: CreateMenuPayload, thunkApi) => {
    const { onSuccess } = payload;
    const response = await fetch(`${config.backofficeApiBaseUrl}/menu`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({ ...payload }),
    });
    const dataFromServer = await response.json();
    const { menu, menuCategoryMenus } = dataFromServer;
    onSuccess && onSuccess();
    return menu;
  }
);

export const updateMenu = createAsyncThunk(
  "menu/updateMenu",
  async (payload: UpdateMenuPayload, thunkApi) => {
    const { onSuccess } = payload;
    const response = await fetch(`${config.backofficeApiBaseUrl}/menu`, {
      method: "PUT",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    const dataFromServer = await response.json();
    const { menu, disabledLocationMenus, menuCategoryMenus } = dataFromServer;
    thunkApi.dispatch(replaceMenu(menu));
    thunkApi.dispatch(setDisabledLocationMenus(disabledLocationMenus));
    thunkApi.dispatch(setMenuCategoryMenus(menuCategoryMenus));
    onSuccess && onSuccess();
  }
);

export const deleteMenu = createAsyncThunk(
  "menu/deleteMenu",
  async (payload: DeleteMenuPayload, thunkApi) => {
    const { id, onSuccess } = payload;
    await fetch(`${config.backofficeApiBaseUrl}/menu?id=${id}`, {
      method: "DELETE",
    });
    onSuccess && onSuccess();
    thunkApi.dispatch(removeMenu(id));
  }
);

export const menuSlice = createSlice({
  name: "menu",
  initialState,
  reducers: {
    setMenus: (state, action: PayloadAction<Menu[]>) => {
      state.menus = action.payload;
    },
    addMenu: (state, action: PayloadAction<Menu>) => {
      state.menus = [...state.menus, action.payload];
    },
    replaceMenu: (state, action: PayloadAction<Menu>) => {
      state.menus = state.menus.map((item) =>
        item.id === action.payload.id ? action.payload : item
      );
    },
    removeMenu: (state, action: PayloadAction<number>) => {
      state.menus = state.menus.filter((menu) =>
        menu.id === action.payload ? false : true
      );
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createMenu.pending, (state, action) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createMenu.fulfilled, (state, action) => {
        state.menus = [...state.menus, action.payload];
        state.isLoading = false;
      })
      .addCase(createMenu.rejected, (state) => {
        state.isLoading = false;
        const err = new Error("createMenu error occurred");
        state.error = err.message;
      });
  },
});

export const { setMenus, addMenu, removeMenu, replaceMenu } = menuSlice.actions;

export default menuSlice.reducer;

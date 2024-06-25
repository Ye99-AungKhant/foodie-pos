import { config } from "@/config";
import {
  AddonCategorySlice,
  CreateAddonCategoryPayload,
  DeleteAddonCategoryPayload,
  UpdateAddonCategoryPayload,
} from "@/types/addonCategory";
import { AddonCategory } from "@prisma/client";
import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  addMenuAddonCategories,
  setMenuAddonCategories,
} from "./menuAddonCategorySlice";

const initialState: AddonCategorySlice = {
  addonCategories: [],
  isLoading: false,
  error: null,
};

export const createAddonCategory = createAsyncThunk(
  "addonCategory/createAddonCategory",
  async (payload: CreateAddonCategoryPayload, thunkApi) => {
    const { onSuccess } = payload;
    const response = await fetch(
      `${config.backofficeApiBaseUrl}/addon-category`,
      {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify(payload),
      }
    );
    const dataFromServer = await response.json();
    const { addonCategory, menuAddonCategories } = dataFromServer;
    thunkApi.dispatch(addAddonCategory(addonCategory));
    thunkApi.dispatch(addMenuAddonCategories(menuAddonCategories));
    onSuccess && onSuccess();
  }
);

export const updateAddonCategory = createAsyncThunk(
  "addonCategory/updateAddonCategory",
  async (payload: UpdateAddonCategoryPayload, thunkApi) => {
    const { onSuccess } = payload;
    const response = await fetch(
      `${config.backofficeApiBaseUrl}/addon-category`,
      {
        method: "PUT",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify(payload),
      }
    );
    const dataFromServer = await response.json();
    const { addonCategory, menuAddonCategories } = dataFromServer;
    thunkApi.dispatch(replaceAddonCategory(addonCategory));
    thunkApi.dispatch(setMenuAddonCategories(menuAddonCategories));
    onSuccess && onSuccess();
  }
);

export const deleteAddonCategory = createAsyncThunk(
  "menu/deleteAddonCategory",
  async (payload: DeleteAddonCategoryPayload, thunkApi) => {
    const { id, onSuccess } = payload;
    await fetch(`${config.backofficeApiBaseUrl}/addon-category?id=${id}`, {
      method: "DELETE",
    });
    onSuccess && onSuccess();
    thunkApi.dispatch(removeAddonCategory(id));
  }
);

export const addonCategorySlice = createSlice({
  name: "addonCategory",
  initialState,
  reducers: {
    addAddonCategory: (state, action: PayloadAction<AddonCategory>) => {
      state.addonCategories = [...state.addonCategories, action.payload];
    },
    setAddonCategories: (state, action: PayloadAction<AddonCategory[]>) => {
      state.addonCategories = action.payload;
    },
    replaceAddonCategory: (state, action: PayloadAction<AddonCategory>) => {
      state.addonCategories = state.addonCategories.map((item) =>
        item.id === action.payload.id ? action.payload : item
      );
    },
    removeAddonCategory: (state, action: PayloadAction<number>) => {
      state.addonCategories = state.addonCategories.filter((item) =>
        item.id === action.payload ? false : true
      );
    },
  },
});

export const {
  setAddonCategories,
  replaceAddonCategory,
  addAddonCategory,
  removeAddonCategory,
} = addonCategorySlice.actions;

export default addonCategorySlice.reducer;

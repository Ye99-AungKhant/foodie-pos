import { config } from "@/config";
import {
  AddonSlice,
  CreateAddonPayload,
  DeleteAddonPayload,
  UpdateAddonPayload,
} from "@/types/addon";
import { Addon } from "@prisma/client";
import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState: AddonSlice = {
  addons: [],
  isLoading: false,
  error: null,
};

export const createAddon = createAsyncThunk(
  "addon/createAddon",
  async (payload: CreateAddonPayload, thunkApi) => {
    const { onSuccess } = payload;
    const response = await fetch(`${config.backofficeApiBaseUrl}/addon`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    const dataFromServer = await response.json();
    const { addon } = dataFromServer;
    thunkApi.dispatch(addAddon(addon));
    onSuccess && onSuccess();
  }
);

export const updateAddon = createAsyncThunk(
  "addon/updateAddon",
  async (payload: UpdateAddonPayload, thunkApi) => {
    const { onSuccess } = payload;
    const response = await fetch(`${config.backofficeApiBaseUrl}/addon`, {
      method: "PUT",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    const dataFromServer = await response.json();
    const { addon } = dataFromServer;
    thunkApi.dispatch(replaceAddon(addon));
    onSuccess && onSuccess();
  }
);

export const deleteAddon = createAsyncThunk(
  "addon/deleteAddon",
  async (payload: DeleteAddonPayload, thunkApi) => {
    const { id, onSuccess } = payload;
    await fetch(`${config.backofficeApiBaseUrl}/addon?id=${id}`, {
      method: "DELETE",
    });
    onSuccess && onSuccess();
    thunkApi.dispatch(removeAddon(id));
  }
);

export const addonSlice = createSlice({
  name: "addon",
  initialState,
  reducers: {
    addAddon: (state, action: PayloadAction<Addon>) => {
      state.addons = [...state.addons, action.payload];
    },
    setAddons: (state, action: PayloadAction<Addon[]>) => {
      state.addons = action.payload;
    },
    replaceAddon: (state, action: PayloadAction<Addon>) => {
      state.addons = state.addons.map((item) =>
        item.id === action.payload.id ? action.payload : item
      );
    },
    removeAddon: (state, action: PayloadAction<number>) => {
      state.addons = state.addons.filter((item) =>
        item.id === action.payload ? false : true
      );
    },
  },
});

export const { setAddons, addAddon, replaceAddon, removeAddon } =
  addonSlice.actions;

export default addonSlice.reducer;

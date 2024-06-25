import { config } from "@/config";
import {
  AppSlice,
  GetAppDataOptions,
  Theme,
  UploadAssetPayload,
} from "@/types/app";
import { Location } from "@prisma/client";
import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { RootState } from "..";
import { setAddonCategories } from "./addonCategorySlice";
import { setAddons } from "./addonSlice";
import { replaceCompany } from "./companySlice";
import { setDisabledLocationMenuCategory } from "./disabledLocationMenuCategorySlice";
import { setDisabledLocationMenus } from "./disabledLocationMenuSlice";
import { setLocations } from "./locationSlice";
import { setMenuAddonCategories } from "./menuAddonCategorySlice";
import { setMenuCategoryMenus } from "./menuCategoryMenuSlice";
import { setMenuCategories } from "./menuCategorySlice";
import { setMenus } from "./menuSlice";
import { setOrders } from "./orderSlice";
import { setTables } from "./tableSlice";

const initialState: AppSlice = {
  init: false,
  theme: "light",
  selectedLocation: null,
  isLoading: false,
  error: null,
};

export const fetchAppData = createAsyncThunk(
  "app/fetchAppData",
  async (options: GetAppDataOptions, thunkApi) => {
    thunkApi.dispatch(setIsLoading(true));
    try {
      const { tableId } = options;
      const apiUrl = tableId
        ? `${config.orderAppApiUrl}/app?tableId=${tableId}`
        : `${config.backofficeApiBaseUrl}/app`;
      const response = await fetch(apiUrl);
      const dataFromServer = await response.json();
      const {
        menus,
        menuCategories,
        company,
        menuCategoryMenus,
        locations,
        disabledLocationMenus,
        disabledLocationMenuCategories,
        addonCategories,
        menuAddonCategories,
        addons,
        tables,
        orders,
      } = dataFromServer;
      thunkApi.dispatch(setMenus(menus));
      thunkApi.dispatch(setMenuCategories(menuCategories));
      thunkApi.dispatch(replaceCompany(company));
      thunkApi.dispatch(setMenuCategoryMenus(menuCategoryMenus));
      thunkApi.dispatch(setLocations(locations));
      thunkApi.dispatch(
        setDisabledLocationMenuCategory(disabledLocationMenuCategories)
      );
      thunkApi.dispatch(setDisabledLocationMenus(disabledLocationMenus));
      thunkApi.dispatch(setAddonCategories(addonCategories));
      thunkApi.dispatch(setMenuAddonCategories(menuAddonCategories));
      thunkApi.dispatch(setAddons(addons));
      thunkApi.dispatch(setTables(tables));
      thunkApi.dispatch(setOrders(orders));
      const selectedLocationId = localStorage.getItem("selectedLocationId");
      if (selectedLocationId) {
        const isOwnLocation =
          selectedLocationId &&
          locations.find((item: any) => item.id === Number(selectedLocationId));
        if (!isOwnLocation) {
          localStorage.removeItem("selectedLocationId");
          localStorage.setItem("selectedLocationId", String(locations[0].id));
          thunkApi.dispatch(setSelectedLocation(locations[0]));
          return;
        }
        const selectedLocation = locations.find(
          (item: any) => item.id === Number(selectedLocationId)
        ) as Location;
        thunkApi.dispatch(setSelectedLocation(selectedLocation));
      } else {
        const selectedLocation = locations[0];
        thunkApi.dispatch(setSelectedLocation(locations[0]));
        localStorage.setItem("selectedLocationId", String(selectedLocation.id));
      }
      thunkApi.dispatch(
        setTheme((localStorage.getItem("theme") as Theme) ?? "light")
      );
      thunkApi.dispatch(setInit(true));
      thunkApi.dispatch(setIsLoading(false));
    } catch (err) {
      console.log(err);
    }
  }
);

export const uploadAsset = createAsyncThunk(
  "app/uploadAsset",
  async (payload: UploadAssetPayload) => {
    const { file, onSuccess } = payload;
    const formData = new FormData();
    formData.append("file", file);
    const response = await fetch(`${config.backofficeApiBaseUrl}/asset`, {
      method: "POST",
      body: formData,
    });
    const dataFromServer = await response.json();
    const { assetUrl } = dataFromServer;
    onSuccess && onSuccess(assetUrl);
  }
);

export const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    setInit: (state, action: PayloadAction<boolean>) => {
      state.init = action.payload;
    },
    setSelectedLocation: (state, action: PayloadAction<Location>) => {
      state.selectedLocation = action.payload;
    },
    setIsLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setTheme: (state, action: PayloadAction<Theme>) => {
      state.theme = action.payload;
    },
  },
});

export const { setInit, setSelectedLocation, setIsLoading, setTheme } =
  appSlice.actions;
export const appDataSelector = (state: RootState) => {
  return {
    app: state.app,
    selectedLocation: state.app.selectedLocation,
    menus: state.menu.menus,
    menuCategories: state.menuCategory.menuCategories,
    menuCategoryMenus: state.menuCategoryMenu.menuCategoryMenus,
    addonCategories: state.addonCategory.addonCategories,
    addons: state.addon.addons,
    menuAddonCategories: state.menuAddonCategory.menuAddonCategories,
    disabledLocationMenuCategories:
      state.disabledLocationMenuCategory.disabledLocationMenuCategories,
    company: state.company.company,
    orders: state.order.items,
    tables: state.table.tables,
  };
};

export default appSlice.reducer;

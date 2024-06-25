import { DisabledLocationMenuSlice } from "@/types/disabledLocationMenu";
import { DisabledLocationMenu } from "@prisma/client";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

const initialState: DisabledLocationMenuSlice = {
  disabledLocationMenus: [],
  isLoading: false,
  error: null,
};

export const disabledLocationMenuSlice = createSlice({
  name: "disabledLocationMenu",
  initialState,
  reducers: {
    setDisabledLocationMenus: (
      state,
      action: PayloadAction<DisabledLocationMenu[]>
    ) => {
      state.disabledLocationMenus = action.payload;
    },
  },
});

export const { setDisabledLocationMenus } = disabledLocationMenuSlice.actions;

export default disabledLocationMenuSlice.reducer;

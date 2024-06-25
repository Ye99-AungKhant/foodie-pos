import { PayloadAction, createSlice } from "@reduxjs/toolkit";

type SnackbarType = "error" | "success";

interface AppSnackbarSlice {
  type: SnackbarType;
  open: boolean;
  message: string;
}

const initialState: AppSnackbarSlice = {
  type: "success",
  open: false,
  message: "",
};

export const appSnackbarSlice = createSlice({
  name: "snackbar",
  initialState,
  reducers: {
    showSnackbar: (
      state,
      action: PayloadAction<{ type: SnackbarType; message: string }>
    ) => {
      const { type, message } = action.payload;
      state.open = true;
      state.type = type;
      state.message = message;
    },
    hideSnackbar: (state) => {
      state.open = false;
      state.type = "success";
      state.message = "";
    },
  },
});

export const { showSnackbar, hideSnackbar } = appSnackbarSlice.actions;
export default appSnackbarSlice.reducer;

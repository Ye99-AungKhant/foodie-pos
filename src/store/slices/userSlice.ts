import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { User, UserSlice } from "../../types/user";

const initialState: UserSlice = {
  user: null,
  isLoading: false,
  error: null,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
    },
  },
});

const { setUser } = userSlice.actions;

export default userSlice.reducer;

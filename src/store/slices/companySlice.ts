import { config } from "@/config";
import { CompanySlice, UpdateCompanyPayload } from "@/types/company";
import { Company } from "@prisma/client";
import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { RootState } from "..";

const initialState: CompanySlice = {
  company: null,
  isLoading: false,
  error: null,
};

export const updateCompany = createAsyncThunk(
  "company/updateCompany",
  async (payload: UpdateCompanyPayload, thunkApi) => {
    const { onSuccess } = payload;
    const response = await fetch(`${config.backofficeApiBaseUrl}/company`, {
      method: "PUT",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    const dataFromServer = await response.json();
    const { company } = dataFromServer;
    thunkApi.dispatch(replaceCompany(company));
    onSuccess && onSuccess();
  }
);

export const companySlice = createSlice({
  name: "company",
  initialState,
  reducers: {
    replaceCompany: (state, action: PayloadAction<Company>) => {
      state.company = action.payload;
    },
  },
});

export const { replaceCompany } = companySlice.actions;

export const selectCompany = (state: RootState) => state.company.company;

export default companySlice.reducer;

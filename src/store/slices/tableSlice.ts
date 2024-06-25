import { config } from "@/config";
import {
  CreateTablePayload,
  DeleteTablePayload,
  TableSlice,
  UpdateTablePayload,
} from "@/types/table";
import { Table } from "@prisma/client";
import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { RootState } from "..";

const initialState: TableSlice = {
  tables: [],
  isLoading: false,
  error: null,
};

export const createTable = createAsyncThunk(
  "table/createTable",
  async (payload: CreateTablePayload, thunkApi) => {
    const { onSuccess } = payload;
    const response = await fetch(`${config.backofficeApiBaseUrl}/table`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    const dataFromServer = await response.json();
    const { table } = dataFromServer;
    thunkApi.dispatch(addTable(table));
    onSuccess && onSuccess();
  }
);

export const updateTable = createAsyncThunk(
  "table/updateTable",
  async (payload: UpdateTablePayload, thunkApi) => {
    const { onSuccess } = payload;
    const response = await fetch(`${config.backofficeApiBaseUrl}/table`, {
      method: "PUT",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    const dataFromServer = await response.json();
    const { table } = dataFromServer;
    thunkApi.dispatch(replaceTable(table));
    onSuccess && onSuccess();
  }
);

export const deleteTable = createAsyncThunk(
  "table/deleteTable",
  async (payload: DeleteTablePayload, thunkApi) => {
    const { id, onSuccess } = payload;
    await fetch(`${config.backofficeApiBaseUrl}/table?id=${id}`, {
      method: "DELETE",
    });
    onSuccess && onSuccess();
    thunkApi.dispatch(removeTable(id));
  }
);

export const tableSlice = createSlice({
  name: "table",
  initialState,
  reducers: {
    addTable: (state, action: PayloadAction<Table>) => {
      state.tables = [...state.tables, action.payload];
    },
    setTables: (state, action: PayloadAction<Table[]>) => {
      state.tables = action.payload;
    },
    replaceTable: (state, action: PayloadAction<Table>) => {
      state.tables = state.tables.map((item) =>
        item.id === action.payload.id ? action.payload : item
      );
    },
    removeTable: (state, action: PayloadAction<number>) => {
      state.tables = state.tables.filter((item) =>
        item.id === action.payload ? false : true
      );
    },
  },
});

export const { setTables, addTable, replaceTable, removeTable } =
  tableSlice.actions;
export const selectTables = (state: RootState) => state.table.tables;

export default tableSlice.reducer;

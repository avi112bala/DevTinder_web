import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface ConnectionRequest {
  _id: string;
  [key: string]: unknown;
}

const initialState: ConnectionRequest[] = [];

const requestSlice = createSlice({
  name: "request",
  initialState,
  reducers: {
    addRequest: (_state, action: PayloadAction<ConnectionRequest[]>) => {
      return action.payload;
    },
    removeRequest: (state, action: PayloadAction<string>) => {
      return state.filter((r) => r._id !== action.payload);
    },
  },
});

export const { addRequest, removeRequest } = requestSlice.actions;
export default requestSlice.reducer;

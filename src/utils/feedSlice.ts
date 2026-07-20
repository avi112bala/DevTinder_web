import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface FeedItem {
  _id: string;
  [key: string]: unknown;
}

const initialState: FeedItem[] = [];

const feedSlice = createSlice({
  name: "feed",
  initialState,
  reducers: {
    addfeed: (_state, action: PayloadAction<FeedItem[]>) => {
      return action.payload;
    },
    removeFeed: () => {
      return [];
    },
    removeprevFeed: (state, action: PayloadAction<string>) => {
      return state.filter((r) => r._id !== action.payload);
    },
  },
});

export const { addfeed, removeFeed, removeprevFeed } = feedSlice.actions;
export default feedSlice.reducer;

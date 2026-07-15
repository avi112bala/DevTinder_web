import { createSlice } from "@reduxjs/toolkit";

const feedSlice = createSlice({
    name: "feed",
    initialState: null,
    reducers: {
        addfeed: (state, action) => {
            return action.payload
        },
        removeFeed: () => {
            return null
        },
        removeprevFeed: (state, action) => {
            const newArr = state.filter((r: any) => r._id !== action.payload)
            return newArr
        }
    }
})


export const { addfeed, removeFeed,removeprevFeed } = feedSlice.actions
export default feedSlice.reducer
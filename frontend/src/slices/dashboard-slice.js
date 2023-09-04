import { createSlice } from "@reduxjs/toolkit";

const initialState = {
	selectedMenu: "dashboard",
};

const dashboardSlice = createSlice({
	name: "dashboard",
	initialState,
	reducers: {
		setSelectedMenu: (state, action) => {
			state.selectedMenu = action.payload;
		},
	},
});

export const { setSelectedMenu } = dashboardSlice.actions;

export default dashboardSlice.reducer;

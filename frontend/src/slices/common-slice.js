import { createSlice } from "@reduxjs/toolkit";

const initialState = {
	user: null,
	loginFormDisplayed: false,
	loading: false,
	drawerExtended: false,
};

const commonSlice = createSlice({
	name: "common",
	initialState,
	reducers: {
		setUser: (state, action) => {
			state.user = action.payload;
		},
		setLoginFormDisplayed: (state, action) => {
			state.loginFormDisplayed = action.payload;
		},
		setLoading: (state, action) => {
			state.loading = action.payload;
		},
		setDrawerExtended: (state, action) => {
			state.drawerExtended = action.payload;
		},
	},
});

export const { setUser, setLoginFormDisplayed, setLoading, setDrawerExtended } =
	commonSlice.actions;

export default commonSlice.reducer;

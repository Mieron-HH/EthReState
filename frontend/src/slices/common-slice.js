import { createSlice } from "@reduxjs/toolkit";

const initialState = {
	user: null,
	loginFormDisplayed: false,
	loading: false,
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
	},
});

export const { setUser, setLoginFormDisplayed, setLoading } =
	commonSlice.actions;

export default commonSlice.reducer;

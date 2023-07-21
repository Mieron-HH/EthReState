import { createSlice } from "@reduxjs/toolkit";

const initialState = {
	user: null,
	loginFormDisplayed: false,
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
	},
});

export const { setUser, setLoginFormDisplayed } = commonSlice.actions;

export default commonSlice.reducer;

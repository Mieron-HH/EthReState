import { createSlice } from "@reduxjs/toolkit";

const initialState = {
	account: null,
	provider: null,
	network: null,
	rethState: null,
	ethRow: null,
};

const configSlice = createSlice({
	name: "config",
	initialState,
	reducers: {
		setAccount: (state, action) => {
			state.account = action.payload;
		},
		setProvider: (state, action) => {
			state.provider = action.payload;
		},
		setNetwork: (state, action) => {
			state.network = action.payload;
		},
		setRethState: (state, action) => {
			state.rethState = action.payload;
		},
		setEthRow: (state, action) => {
			state.ethRow = action.payload;
		},
		reset: (state) => {
			state.account = null;
			state.provider = null;
			state.network = null;
			state.rethState = null;
			state.ethRow = null;
		},
	},
});

export const { setAccount, setProvider, setNetwork, setRethState, setEthRow } =
	configSlice.actions;

export default configSlice.reducer;

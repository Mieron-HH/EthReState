import { createSlice } from "@reduxjs/toolkit";

const initialState = {
	account: null,
	provider: null,
	chainId: null,
	signer: null,
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
		setChainId: (state, action) => {
			state.chainId = action.payload;
		},
		setSigner: (state, action) => {
			state.signer = action.payload;
		},

		reset: (state) => {
			state.account = null;
			state.provider = null;
			state.chainId = null;
			state.rethState = null;
			state.ethRow = null;
		},
	},
});

export const {
	setAccount,
	setProvider,
	setChainId,
	setSigner,
	setCoordinates,
	reset,
} = configSlice.actions;

export default configSlice.reducer;

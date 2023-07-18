import { configureStore } from "@reduxjs/toolkit";

// importing slices
import PropertySlice from "./slices/property-slice";
import ConfigSlice from "./slices/config-slice";

const store = configureStore({
	reducer: {
		property: PropertySlice,
		config: ConfigSlice,
	},
});

export default store;

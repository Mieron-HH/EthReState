import { configureStore } from "@reduxjs/toolkit";

// importing slices
import PropertySlice from "./slices/property-slice";
import ConfigSlice from "./slices/config-slice";
import CommonSlice from "./slices/common-slice";

const store = configureStore({
	reducer: {
		property: PropertySlice,
		config: ConfigSlice,
		common: CommonSlice,
	},
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware({
			serializableCheck: false,
		}),
});

export default store;

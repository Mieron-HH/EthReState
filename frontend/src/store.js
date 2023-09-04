import { configureStore } from "@reduxjs/toolkit";

// importing slices
import PropertySlice from "./slices/property-slice";
import ConfigSlice from "./slices/config-slice";
import CommonSlice from "./slices/common-slice";
import DashboardSlice from "./slices/dashboard-slice";

const store = configureStore({
	reducer: {
		properties: PropertySlice,
		config: ConfigSlice,
		common: CommonSlice,
		dashboard: DashboardSlice,
	},
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware({
			serializableCheck: false,
		}),
});

export default store;

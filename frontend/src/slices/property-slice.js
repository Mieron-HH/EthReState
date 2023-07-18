import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const BASE_URL = "http://localhost:3000/api";
const initialState = {
	properties: [],
	status: "idle", // idle, loading, succeeded, failed
	error: null,
	newProperty: null,
};

const fetchPropertiesAPI = async () => {
	const response = await fetch(BASE_URL + "/property/getProperties");
	const data = await response.json();

	return data;
};

const addPropertyAPI = async (property) => {
	const response = await fetch(BASE_URL + "/property/publish", {
		method: "POST",
		body: property,
	});
	const data = await response.json();

	return data;
};

const fetchProperties = createAsyncThunk(
	"properties/fetchProperties",
	async (_, { getState }) => {
		try {
			const { status } = getState.properties;

			if (status !== "loading") return await fetchPropertiesAPI();
		} catch (error) {
			console.error(error);
			throw new Error("Error fetching properties");
		}
	}
);

const addProperty = createAsyncThunk(
	"properties/addProperty",
	async (property, { getState }) => {
		try {
			const { status } = getState().properties;

			if (status !== "loading") return await addPropertyAPI(property);
		} catch (error) {
			console.error(error);
			throw new Error("Error adding property");
		}
	}
);

const propertySlice = createSlice({
	name: "properties",
	initialState,
	reducers: {
		setNewProperty: (state, action) => {
			state.newProperty = action.payload;
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(fetchProperties.pending, (state) => {
				state.status = "loading";
			})
			.addCase(fetchProperties.fulfilled, (state, action) => {
				state.status = "succeeded";
				state.properties.push(action.payload);
			})
			.addCase(fetchProperties.rejected, (state, action) => {
				state.status = "failed";
				state.error = action.error.message;
			})
			.addCase(addProperty.pending, (state) => {
				state.status = "loading";
			})
			.addCase(addProperty.fulfilled, (state, action) => {
				state.status = "succeeded";
				state.properties.push(action.payload);
			})
			.addCase(addProperty.rejected, (state, action) => {
				state.status = "failed";
				state.error = action.error.message;
			});
	},
});

export const { setNewProperty } = state.reducers;

export const selectNewProperty = (state) => state.properties.newProperty;

export default propertySlice.reducer;

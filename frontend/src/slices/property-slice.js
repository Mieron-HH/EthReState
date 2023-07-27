import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL = process.env.REACT_APP_BASE_URL;
const initialState = {
	properties: [],
	popular: [],
	status: "idle", // idle, loading, succeeded, failed
	error: null,
};

const fetchPropertiesAPI = async (city, state) => {
	let payload = {};

	if (city && city.trim() !== "") {
		payload.city = city.trim();
	}

	if (state && state.trim() !== "") {
		payload.state = state.trim();
	}

	return await axios
		.post(BASE_URL + "/property/getProperties", payload, {
			withCredentials: true,
		})
		.then((response) => response.data)
		.catch((error) => {
			throw error;
		});
};

const fetchPopularAPI = async () => {
	return await axios
		.get(BASE_URL + "/property/popular", { withCredentials: true })
		.then((response) => response.data)
		.catch((error) => {
			throw error;
		});
};

export const fetchProperties = createAsyncThunk(
	"properties/fetchProperties",
	async ({ city = "", state = "" }) => {
		try {
			return await fetchPropertiesAPI(city, state);
		} catch (error) {
			console.log({ error });
			if (
				error.response &&
				error.response.data.errors &&
				error.response.data.errors.length > 0
			) {
				// Throw the server's error response so that it will be available in the action object
				throw new Error(error.response.data.errors[0].message);
			} else {
				// If there is no specific error message from the server, throw a generic message
				throw new Error("Error fetching properties");
			}
		}
	}
);

export const fetchPopular = createAsyncThunk(
	"popular/fetchPopular",
	async () => {
		try {
			return await fetchPopularAPI();
		} catch (error) {
			console.log({ error });
			throw new Error("Error fetching popular properties");
		}
	}
);

const propertySlice = createSlice({
	name: "properties",
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder
			.addCase(fetchProperties.pending, (state) => {
				state.status = "loading";
			})
			.addCase(fetchProperties.fulfilled, (state, action) => {
				state.status = "succeeded";
				state.properties = action.payload;
			})
			.addCase(fetchProperties.rejected, (state, action) => {
				state.status = "failed";
				state.error = action.error.message;
			})
			.addCase(fetchPopular.pending, (state) => {
				state.status = "loading";
			})
			.addCase(fetchPopular.fulfilled, (state, action) => {
				state.status = "succeeded";
				state.popular = action.payload;
			})
			.addCase(fetchPopular.rejected, (state, action) => {
				state.status = "failed";
				state.error = action.error.message;
			});
	},
});

export default propertySlice.reducer;

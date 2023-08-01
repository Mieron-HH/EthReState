import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL = process.env.REACT_APP_BASE_URL;
const initialState = {
	properties: [],
	popular: [],
	status: "idle", // idle, loading, succeeded, failed
	error: null,
	street: "",
	city: "",
	stateEntry: "",
	bedroomNumber: "",
	bathroomNumber: "",
	price: "",
	size: "",
	minPrice: "",
	maxPrice: "",
	minSize: "",
	maxSize: "",
};

const fetchPropertiesAPI = async (
	street,
	city,
	state,
	bedroomNumber,
	bathroomNumber,
	minPrice,
	maxPrice,
	minSize,
	maxSize
) => {
	let payload = {};

	if (street && street.trim() !== "") payload.street = street.trim();

	if (city && city.trim() !== "") payload.city = city.trim();

	if (state && state.trim() !== "") payload.state = state.trim();

	if (bedroomNumber && bedroomNumber.trim() !== "")
		payload.bedroomNumber = bedroomNumber.trim();

	if (bathroomNumber && bathroomNumber.trim() !== "")
		payload.bathroomNumber = bathroomNumber.trim();

	if (minPrice && minPrice.trim() !== "") payload.minPrice = minPrice.trim();

	if (maxPrice && maxPrice.trim() !== "") payload.maxPrice = maxPrice.trim();

	if (minSize && minSize.trim() !== "") payload.minSize = minSize.trim();

	if (maxSize && maxSize.trim() !== "") payload.maxSize = maxSize.trim();

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
	async ({
		street = "",
		city = "",
		state = "",
		bedroomNumber = "",
		bathroomNumber = "",
		minPrice = "",
		maxPrice = "",
		minSize = "",
		maxSize = "",
	}) => {
		try {
			return await fetchPropertiesAPI(
				street,
				city,
				state,
				bedroomNumber,
				bathroomNumber,
				minPrice,
				maxPrice,
				minSize,
				maxSize
			);
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
	reducers: {
		setStreet: (state, action) => {
			state.street = action.payload;
		},
		setCity: (state, action) => {
			state.city = action.payload;
		},
		setStateEntry: (state, action) => {
			state.stateEntry = action.payload;
		},
		setBedroomNumber: (state, action) => {
			state.bedroomNumber = action.payload;
		},
		setBathroomNumber: (state, action) => {
			state.bathroomNumber = action.payload;
		},
		setPrice: (state, action) => {
			state.price = action.payload;
		},
		setSize: (state, action) => {
			state.size = action.payload;
		},
		setMinPrice: (state, action) => {
			state.minPrice = action.payload;
		},
		setMaxPrice: (state, action) => {
			state.maxPrice = action.payload;
		},
		setMinSize: (state, action) => {
			state.minSize = action.payload;
		},
		setMaxSize: (state, action) => {
			state.maxSize = action.payload;
		},
	},
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

export const {
	setStreet,
	setCity,
	setStateEntry,
	setBedroomNumber,
	setBathroomNumber,
	setPrice,
	setSize,
	setMinPrice,
	setMaxPrice,
	setMinSize,
	setMaxSize,
} = propertySlice.actions;

export default propertySlice.reducer;

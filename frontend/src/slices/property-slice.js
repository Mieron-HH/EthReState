import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL = process.env.REACT_APP_BASE_URL;
const initialState = {
	properties: [],
	popular: [],
	sellerProperties: [],
	status: "idle", // idle, loading, succeeded, failed
	error: null,
	street: "",
	city: "",
	stateEntry: "",
	zipCode: "",
	bedroomNumber: "",
	bathroomNumber: "",
	price: "",
	downPayment: "",
	size: "",
	minPrice: "",
	maxPrice: "",
	minSize: "",
	maxSize: "",
	listingContentDisplayed: "create",
	listingProgress: 0,
	selectedProperty: null,
	selectedPropertyThumbnail: null,
	selectedPropertyImages: [],
	selectedPropertyModified: false,
	propertyStatus: "",
	propertyDetailDisplayed: false,
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

const fetchSellerPropertiesAPI = async (
	propertyStatus,
	city,
	bedroomNumber,
	bathroomNumber
) => {
	let payload = {};

	if (propertyStatus && propertyStatus.trim() !== "")
		payload.propertyStatus = propertyStatus.trim();

	if (city && city.trim() !== "") payload.city = city.trim();

	if (bedroomNumber && bedroomNumber.trim() !== "")
		payload.bedroomNumber = bedroomNumber.trim();

	if (bathroomNumber && bathroomNumber.trim() !== "")
		payload.bathroomNumber = bathroomNumber.trim();

	return await axios
		.post(BASE_URL + "/property/getSellerProperties", payload, {
			withCredentials: true,
		})
		.then((response) => response.data)
		.catch((error) => {
			throw error;
		});
};

const changePropertyThumbnailAPI = async (postdata) => {
	return await axios
		.post(BASE_URL + "/property/changePropertyThumbnail", postdata, {
			withCredentials: true,
		})
		.then((response) => response.data)
		.catch((error) => {
			throw error;
		});
};

const addPropertyImageAPI = async (postdata) => {
	return await axios
		.post(BASE_URL + "/property/addPropertyImage", postdata, {
			withCredentials: true,
		})
		.then((response) => response.data)
		.catch((error) => {
			throw error;
		});
};

const removePropertyImageAPI = async (postdata) => {
	return await axios
		.post(BASE_URL + "/property/removePropertyImage", postdata, {
			withCredentials: true,
		})
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
			)
				throw new Error(error.response.data.errors[0].message);
			else throw new Error("Error fetching properties");
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

export const fetchSellerProperties = createAsyncThunk(
	"properties/fetchSellerProperties",
	async ({
		propertyStatus = "",
		city = "",
		bedroomNumber = "",
		bathroomNumber = "",
	}) => {
		try {
			return await fetchSellerPropertiesAPI(
				propertyStatus,
				city,
				bedroomNumber,
				bathroomNumber
			);
		} catch (error) {
			console.log({ error });
			if (
				error.response &&
				error.response.data.errors &&
				error.response.data.errors.length > 0
			)
				throw new Error(error.response.data.errors[0].message);
			else throw new Error("Error fetching seller properties");
		}
	}
);

export const changePropertyThumbnail = createAsyncThunk(
	"properties/changePropertyThumbnail",
	async ({ postdata = null }) => {
		try {
			return await changePropertyThumbnailAPI(postdata);
		} catch (error) {
			console.log({ error });
			if (
				error.response &&
				error.response.data.errors &&
				error.response.data.errors.length > 0
			)
				throw new Error(error.response.data.errors[0].message);
			else throw new Error("Error changing property thumbnail");
		}
	}
);

export const addPropertyImage = createAsyncThunk(
	"properties/addPropertyImage",
	async ({ postdata = null }) => {
		try {
			return await addPropertyImageAPI(postdata);
		} catch (error) {
			console.log({ error });
			if (
				error.response &&
				error.response.data.errors &&
				error.response.data.errors.length > 0
			)
				throw new Error(error.response.data.errors[0].message);
			else throw new Error("Error removing property image");
		}
	}
);

export const removePropertyImage = createAsyncThunk(
	"properties/removePropertyImage",
	async ({ propertyID, imageIndex }) => {
		try {
			return await removePropertyImageAPI({ propertyID, imageIndex });
		} catch (error) {
			console.log({ error });
			if (
				error.response &&
				error.response.data.errors &&
				error.response.data.errors.length > 0
			)
				throw new Error(error.response.data.errors[0].message);
			else throw new Error("Error removing property image");
		}
	}
);

const propertySlice = createSlice({
	name: "properties",
	initialState,
	reducers: {
		setStatus: (state, action) => {
			state.status = action.payload;
		},
		emptyProperties: (state) => {
			state.properties = [];
		},
		setStreet: (state, action) => {
			state.street = action.payload;
		},
		setCity: (state, action) => {
			state.city = action.payload;
		},
		setStateEntry: (state, action) => {
			state.stateEntry = action.payload;
		},
		setZipCode: (state, action) => {
			state.zipCode = action.payload;
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
		setDownPayment: (state, action) => {
			state.downPayment = action.payload;
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
		setListingContentDisplayed: (state, action) => {
			state.listingContentDisplayed = action.payload;
		},
		setListingProgress: (state, action) => {
			state.listingProgress = action.payload;
		},
		setSelectedProperty: (state, action) => {
			state.selectedProperty = action.payload;
		},
		setSelectedPropertyThumbnail: (state, action) => {
			state.selectedPropertyThumbnail = action.payload;
		},
		setSelectedPropertyImages: (state, action) => {
			state.selectedPropertyImages = action.payload;
		},
		setSelectedPropertyModified: (state, action) => {
			state.selectedPropertyModified = action.payload;
		},
		setPropertyStatus: (state, action) => {
			state.propertyStatus = action.payload;
		},
		setPropertyDetailDisplayed: (state, action) => {
			state.propertyDetailDisplayed = action.payload;
		},
		resetPropertySlice: (state) => {
			state.street = "";
			state.city = "";
			state.stateEntry = "";
			state.zipCode = "";
			state.bedroomNumber = "";
			state.bathroomNumber = "";
			state.price = "";
			state.downPayment = "";
			state.size = "";
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
			})
			.addCase(fetchSellerProperties.pending, (state) => {
				state.status = "loading";
			})
			.addCase(fetchSellerProperties.fulfilled, (state, action) => {
				state.status = "succeeded";
				state.sellerProperties = action.payload;
			})
			.addCase(fetchSellerProperties.rejected, (state, action) => {
				state.status = "failed";
				state.error = action.error.message;
			})
			.addCase(changePropertyThumbnail.pending, (state) => {
				state.status = "loading";
			})
			.addCase(changePropertyThumbnail.fulfilled, (state, action) => {
				state.status = "succeeded";
				state.selectedProperty = action.payload;
			})
			.addCase(changePropertyThumbnail.rejected, (state, action) => {
				state.status = "failed";
				state.error = action.error.message;
			})
			.addCase(addPropertyImage.pending, (state) => {
				state.status = "loading";
			})
			.addCase(addPropertyImage.fulfilled, (state, action) => {
				state.status = "succeeded";
				state.selectedProperty = action.payload;
			})
			.addCase(addPropertyImage.rejected, (state, action) => {
				state.status = "failed";
				state.error = action.error.message;
			})
			.addCase(removePropertyImage.pending, (state) => {
				state.status = "loading";
			})
			.addCase(removePropertyImage.fulfilled, (state, action) => {
				state.status = "succeeded";
				state.selectedProperty = action.payload;
			})
			.addCase(removePropertyImage.rejected, (state, action) => {
				state.status = "failed";
				state.error = action.error.message;
			});
	},
});

export const {
	setStatus,
	emptyProperties,
	setStreet,
	setCity,
	setStateEntry,
	setZipCode,
	setBedroomNumber,
	setBathroomNumber,
	setPrice,
	setDownPayment,
	setSize,
	resetPropertySlice,
	setMinPrice,
	setMaxPrice,
	setMinSize,
	setMaxSize,
	setListingContentDisplayed,
	setListingProgress,
	setSelectedProperty,
	setSelectedPropertyThumbnail,
	setSelectedPropertyImages,
	setSelectedPropertyModified,
	setPropertyStatus,
	setPropertyDetailDisplayed,
} = propertySlice.actions;

export default propertySlice.reducer;

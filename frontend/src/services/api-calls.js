import axios from "axios";

const BASE_URL = "http://localhost:5000/api";

export const getCurrentUser = async () => {
	try {
		const response = await axios.get(BASE_URL + "/user/currentUser", {
			withCredentials: true,
		});
		const data = response.data;

		return { data, error: "" };
	} catch (err) {
		console.error(err);
		const error = err.response
			? err.response.data.errors[0].message
			: "Something went wrong. Please try again.";

		return { data: null, error };
	}
};

export const getUserData = async () => {
	try {
		const response = await axios.get(`${BASE_URL}/user/getUser`, {
			withCredentials: true,
		});
		const data = response.data;

		return { data, error: "" };
	} catch (err) {
		console.error(err);
		const error = err.response
			? err.response.data.errors[0].message
			: "Something went wrong. Please try again.";

		return { data: null, error };
	}
};

export const loginUser = async (email, password) => {
	try {
		const response = await axios.post(
			BASE_URL + "/user/signin",
			{
				email,
				password,
			},
			{ withCredentials: true }
		);
		const data = response.data;

		return { data, error: "" };
	} catch (err) {
		console.error(err);
		const error = err.response
			? err.response.data.errors[0].message
			: "Something went wrong. Please try again.";

		return { data: null, error };
	}
};

export const logoutUser = async () => {
	try {
		await axios.get(BASE_URL + "/user/signout");

		return null;
	} catch (error) {
		console.error("Error logging out user:", error);
		throw error;
	}
};

export const createProperty = async (PostData) => {
	try {
		const response = await axios.post(BASE_URL + "/property/create", PostData, {
			withCredentials: true,
		});
		const data = response.data;

		return { data, error: "" };
	} catch (err) {
		console.error(err);
		const error = err.response
			? err.response.data.errors[0].message
			: "Something went wrong. Please try again.";

		return { data: null, error };
	}
};

export const updatePropertyLikes = async (propertyID) => {
	try {
		const response = await axios.post(
			BASE_URL + "/property/updateLikes",
			{ propertyID },
			{ withCredentials: true }
		);
		const data = response.data;

		return { data, error: "" };
	} catch (err) {
		console.error(err);
		const error = err.response
			? err.response.data.errors[0].message
			: "Something went wrong. Please try again.";

		return { data: null, error };
	}
};

export const updatePropertyViews = async (propertyID) => {
	try {
		const response = await axios.post(
			BASE_URL + "/property/updateViews",
			{ propertyID },
			{ withCredentials: true }
		);
		const data = response.data;

		return { data, error: "" };
	} catch (err) {
		console.error(err);
		const error = err.response
			? err.response.data.errors[0].message
			: "Something went wrong. Please try again.";

		return { data: null, error };
	}
};

export const lockProperty = async (propertyID) => {
	try {
		const response = await axios.post(
			BASE_URL + "/property/lock",
			{ propertyID },
			{ withCredentials: true }
		);
		const data = response.data;

		return { data, error: "" };
	} catch (err) {
		console.error(err);
		const error = err.response
			? err.response.data.errors[0].message
			: "Something went wrong. Please try again.";

		return { data: null, error };
	}
};

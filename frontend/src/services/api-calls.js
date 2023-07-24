import axios from "axios";

const BASE_URL = "http://localhost:5000/api";

export const getCurrentUser = async () => {
	let data = null;

	try {
		await axios
			.get(BASE_URL + "/user/currentUser", { withCredentials: true })
			.then((result) => {
				data = result.data.currentUser;
			});

		return data;
	} catch (error) {
		console.error("Error fetching current user:", error);
		throw error;
	}
};

export const loginUser = async (email, password) => {
	let data = null;
	let error = "";

	try {
		await axios
			.post(
				BASE_URL + "/user/signin",
				{
					email,
					password,
				},
				{ withCredentials: true }
			)
			.then((response) => {
				data = response.data;
			})
			.catch((err) => {
				if (err.response) error = err.response.data.errors[0].message;
				console.error({ error });
			});

		return { data, error };
	} catch (error) {
		console.error({ error });
		throw error;
	}
};

export const logoutUser = async () => {
	try {
		await axios.get(BASE_URL + "/user/signout").then((response) => {
			console.log(response.data);
		});

		return null;
	} catch (error) {
		console.error("Error logging out user:", error);
		throw error;
	}
};

export const publishProperty = async (PostData) => {
	let data = null;
	let error = "";

	try {
		await axios
			.post(BASE_URL + "/property/publish", PostData, { withCredentials: true })
			.then((response) => {
				console.log({ data: response.data });
				data = response.data;
			})
			.catch((err) => {
				if (err.response) error = err.response.data.errors[0].message;
				console.log({ err });
			});

		return { data, error };
	} catch (error) {
		console.error({ error });
		throw error;
	}
};

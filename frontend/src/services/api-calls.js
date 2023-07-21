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
			.then((result) => {
				data = result.data;
			})
			.catch((err) => {
				error = err.response.data.errors[0].message;
				console.log({ error });
			});

		return { data, error };
	} catch (error) {
		console.log({ error });
		throw error;
	}
};

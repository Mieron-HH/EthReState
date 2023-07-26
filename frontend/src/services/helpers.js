import Cookies from "js-cookie";

// importing variables
import { stateAbbreviations } from "./variables";

export const getCityAndState = async (lat, lng) => {
	const location = {
		city: "",
		state: "",
	};

	try {
		const response = await fetch(
			`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}`
		);
		const data = await response.json();

		if (data.results.length > 0) {
			const addressComponents = data.results[0].address_components;

			for (const component of addressComponents) {
				if (component.types.includes("locality"))
					location.city = component.long_name;
				if (component.types.includes("administrative_area_level_1"))
					location.state = stateAbbreviations[component.long_name];
			}
		}
	} catch (error) {
		console.log({ error });
	}

	return location;
};

export const createAddress = (street = "", city = "", state = "") => {
	const address = `${street.toUpperCase()}, ${city.toUpperCase()}, ${state.toUpperCase()}`;

	if (address.length > 40) return address.slice(0, 40) + "...";

	return address;
};

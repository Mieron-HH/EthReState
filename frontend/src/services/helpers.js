import Cookies from "js-cookie";
import { ethers } from "ethers";

// importing icons
import { BsPersonFillDown } from "react-icons/bs";

// importing variables
import { stateAbbreviations } from "./variables";

export const loadUserCookie = () => {
	if (Cookies.get("user")) return JSON.parse(Cookies.get("user"));
	else return null;
};

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

export const concatAddress = ({
	street = "",
	city = "",
	state = "",
	zipcode = "",
	maxChars = 200,
}) => {
	const address = `${street.toUpperCase()} | ${city.toUpperCase()} | ${state.toUpperCase()} | ${zipcode}`;

	if (address.length > maxChars) return address.slice(0, maxChars) + "...";

	return address;
};

export const concatPrice = (property) => {
	return (
		<>
			ETH {property.price}
			{property.downPayment && (
				<small>
					<BsPersonFillDown /> {property.downPayment}
				</small>
			)}
		</>
	);
};

export const parseToEther = (n) => {
	return ethers.parseEther(n);
};

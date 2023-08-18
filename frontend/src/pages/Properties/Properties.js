import React, { useEffect, useMemo, useState } from "react";
import "./_properties.scss";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import Cookies from "js-cookie";

// importing components
import Loader from "../../components/Loader/loader";
import Header from "../../components/Header/header";
import SearchBarLarge from "../../components/Search-Bar-Large/search_bar_large";
import Drawer from "../../components/Drawer/drawer";
import PropertyCard from "../../components/Property-Card/property_card";
import PropertyDetail from "../../components/Property-Detail/property_detail";
import Login from "../../components/Login/login";

// importing actions
import {
	fetchProperties,
	setCity,
	setBedroomNumber,
	setBathroomNumber,
	emptyProperties,
} from "../../slices/property-slice";
import { setLoading } from "../../slices/common-slice";

/// importing helpers
import { getCityAndState } from "../../services/helpers";

const Properties = () => {
	const dispatch = useDispatch();
	const location = useLocation();

	const { properties, status, error, propertyDetailDisplayed } = useSelector(
		(state) => state.properties
	);
	const { drawerExtended, loading, loginFormDisplayed } = useSelector(
		(state) => state.common
	);
	const [coordinates, setCoordinates] = useState(null);

	useEffect(() => {
		dispatch(setLoading(true));
		handleUserCoordinates();

		return () => {
			dispatch(emptyProperties());
		};
	}, []);

	useEffect(() => {
		if (status === "loading" || status === "idle") dispatch(setLoading(true));
		else dispatch(setLoading(false));
	}, [properties, status, error]);

	const handleUserCoordinates = async () => {
		if (location.state) {
			const { city, bedroomNumber, bathrooNumber } = location.state;

			dispatch(setCity(city));
			dispatch(setBedroomNumber(bedroomNumber));
			dispatch(setBathroomNumber(bathrooNumber));

			dispatch(fetchProperties({ city, bedroomNumber, bathrooNumber }));
		} else if (Cookies.get("location") === undefined) {
			if (navigator) {
				navigator.geolocation.getCurrentPosition(
					(position) => {
						setCoordinates({
							lat: position.coords.latitude,
							lng: position.coords.longitude,
						});
					},
					(error) => {
						console.log({ error });
						dispatch(fetchProperties({ city: "", state: "" }));
					}
				);
			} else {
				dispatch(fetchProperties({ city: "", state: "" }));
			}
		} else {
			const location = JSON.parse(Cookies.get("location"));
			dispatch(fetchProperties({ city: location.city, state: location.state }));
		}
	};

	const handleUserLocation = useMemo(async () => {
		if (coordinates) {
			const { lat, lng } = coordinates;
			const { city, state } = await getCityAndState(lat, lng);

			dispatch(fetchProperties({ city, state }));
			Cookies.set("location", JSON.stringify({ city, state }));
		}
	}, [coordinates]);

	return (
		<div className="Properties">
			{loading && (
				<div className="properties-loader-container">
					<Loader />
				</div>
			)}

			{propertyDetailDisplayed && <PropertyDetail />}
			{loginFormDisplayed && <Login />}

			<div className="properties-header-container">
				<Header inverted="inverted" />
			</div>

			<div className="properties-search-bar-container">
				<SearchBarLarge />
			</div>

			<div
				className="properties-drawer-container"
				style={{ width: drawerExtended ? "18vw" : "5vw" }}
			>
				<Drawer />
			</div>

			<div
				className="properties-container"
				style={{ overflowY: propertyDetailDisplayed ? "hidden" : "scroll" }}
			>
				{properties.map((property) => {
					return (
						<PropertyCard
							key={property.id}
							width="350px"
							height="320px"
							property={property}
						/>
					);
				})}
			</div>
		</div>
	);
};

export default Properties;

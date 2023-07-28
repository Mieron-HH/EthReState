import React, { useEffect, useMemo, useState } from "react";
import "./_properties.scss";
import { useDispatch, useSelector } from "react-redux";
import Cookies from "js-cookie";

// importing components
import Loader from "../../components/Loader/loader";
import Card from "../../components/Card/card";

// importing actions
import { fetchProperties } from "../../slices/property-slice";
import { setLoading } from "../../slices/common-slice";

/// importing helpers
import { getCityAndState } from "../../services/helpers";

const Properties = () => {
	const dispatch = useDispatch();

	const { properties, status, error } = useSelector(
		(state) => state.properties
	);
	const { loading } = useSelector((state) => state.common);
	const [coordinates, setCoordinates] = useState(null);

	useEffect(() => {
		dispatch(setLoading(true));
		handleUserCoordinates();
	}, []);

	useEffect(() => {
		if (status === "loading" || status === "idle") dispatch(setLoading(true));
		else dispatch(setLoading(false));

		console.log({ loading });
	}, [properties, status, error]);

	const handleUserCoordinates = async () => {
		if (Cookies.get("location") === undefined) {
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
			{loading && <Loader />}

			<div className="properties-container">
				{properties.map((property) => {
					return (
						<Card
							key={property.id}
							width={370}
							height={440}
							property={property}
						/>
					);
				})}
			</div>
		</div>
	);
};

export default Properties;

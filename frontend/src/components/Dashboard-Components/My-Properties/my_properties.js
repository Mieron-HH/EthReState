import React, { useEffect } from "react";
import "./_my_properties.scss";
import { useDispatch, useSelector } from "react-redux";

// importing components
import PropertyList from "./Property-List/property_list";
import SelectedProperty from "./Selected-Property/selected_property";

// importing actions
import { setSelectedProperty } from "../../../slices/property-slice";

const MyProperties = () => {
	const dispatch = useDispatch();

	const { selectedProperty } = useSelector((state) => state.properties);

	useEffect(() => {
		dispatch(setSelectedProperty(null));
	}, []);

	return (
		<div className="my-properties">
			{selectedProperty !== null ? <SelectedProperty /> : <PropertyList />}
		</div>
	);
};

export default MyProperties;

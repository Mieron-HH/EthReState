import React, { useEffect, useRef } from "react";
import "./_search_bar.scss";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";

// importing Icons
import { BiBath, BiBed } from "react-icons/bi";
import { MdOutlineLocationOn } from "react-icons/md";
import {
	fetchProperties,
	fetchSellerProperties,
	resetPropertySlice,
	setBathroomNumber,
	setBedroomNumber,
	setCity,
} from "../../slices/property-slice";
import { setLoading } from "../../slices/common-slice";

const SearchBar = ({ backgroundColor = "white", height = "100%" }) => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const location = useLocation();

	const {
		street,
		city,
		stateEntry,
		bedroomNumber,
		bathroomNumber,
		minPrice,
		maxPrice,
		minSize,
		maxSize,
		propertyStatus,
	} = useSelector((state) => state.properties);
	const inputRef = useRef(null);

	useEffect(() => {
		if (location.pathname === "/") dispatch(resetPropertySlice());
	}, []);

	const searchProperties = () => {
		switch (location.pathname) {
			case "/":
				if (city !== "" || bedroomNumber !== "" || bathroomNumber !== "")
					navigate("/properties", {
						state: { city, bedroomNumber, bathroomNumber },
					});

				inputRef.current.focus();
				break;
			case "/properties":
				dispatch(setLoading(true));
				dispatch(
					fetchProperties({
						street,
						city,
						stateEntry,
						bedroomNumber,
						bathroomNumber,
						minPrice,
						maxPrice,
						minSize,
						maxSize,
					})
				);
				break;
			case "/dashboard":
				dispatch(setLoading(true));
				dispatch(
					fetchSellerProperties({
						propertyStatus,
						city,
						bedroomNumber,
						bathroomNumber,
					})
				);
		}
	};

	return (
		<div className="search-bar-container" style={{ height }}>
			<div className="input-group text">
				<input
					className="input-item"
					style={{ backgroundColor }}
					type="text"
					ref={inputRef}
					value={city}
					onChange={(e) => {
						dispatch(setCity(e.target.value));
					}}
					placeholder="Enter a city. e.g New York"
				/>

				<div className="label-icon">
					<MdOutlineLocationOn className="icon" />
				</div>
			</div>

			<div className="input-group number">
				<input
					className="input-item"
					style={{ backgroundColor }}
					type="text"
					value={bedroomNumber}
					onChange={(e) => {
						if (
							(/^[0-9]*(\.[0-9]*)?$/.test(e.target.value) &&
								parseInt(e.target.value) < 100) ||
							e.target.value === ""
						)
							dispatch(setBedroomNumber(e.target.value));
					}}
					placeholder="e.g 3"
				/>

				<div className="label-icon">
					<BiBed className="icon" />
				</div>
			</div>

			<div className="input-group number">
				<input
					className="input-item"
					style={{ backgroundColor }}
					type="text"
					value={bathroomNumber}
					onChange={(e) => {
						if (
							(/^[0-9]*(\.[0-9]*)?$/.test(e.target.value) &&
								parseInt(e.target.value) < 100) ||
							e.target.value === ""
						)
							dispatch(setBathroomNumber(e.target.value));
					}}
					placeholder="e.g 2"
				/>

				<div className="label-icon">
					<BiBath className="icon" />
				</div>
			</div>

			<button
				className="search-button"
				type="button"
				onClick={searchProperties}
			>
				Search
			</button>
		</div>
	);
};

export default SearchBar;

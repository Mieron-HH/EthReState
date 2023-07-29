import React, { useEffect, useRef } from "react";
import "./_search_bar.scss";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";

// importing Icons
import { BiBath, BiBed } from "react-icons/bi";
import { MdOutlineLocationOn } from "react-icons/md";
import {
	fetchProperties,
	setBathroomNumber,
	setBedroomNumber,
	setCity,
	setStateEntry,
	setStreet,
} from "../../slices/property-slice";
import { setLoading } from "../../slices/common-slice";

const SearchBar = ({ backgroundColor = "white" }) => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const location = useLocation();

	const {
		street,
		city,
		stateEntry,
		bedroomNumber,
		bathRoomNumber,
		price,
		size,
	} = useSelector((state) => state.properties);
	const inputRef = useRef(null);

	useEffect(() => {
		if (location.pathname === "/") {
			dispatch(setStreet(""));
			dispatch(setCity(""));
			dispatch(setStateEntry(""));
			dispatch(setBedroomNumber(""));
			dispatch(setBathroomNumber(""));
		}
	}, []);

	const searchProperties = () => {
		if (location.pathname === "/") {
			if (city !== "" || bedroomNumber !== "" || bathRoomNumber !== "")
				navigate("/properties", {
					state: { city, bedroomNumber, bathRoomNumber },
				});

			inputRef.current.focus();
		} else {
			setLoading(true);
			dispatch(
				fetchProperties({
					street,
					city,
					stateEntry,
					bedroomNumber,
					bathRoomNumber,
					price,
					size,
				})
			);
		}
	};

	return (
		<div className="search-bar-container">
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
					placeholder="3"
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
					value={bathRoomNumber}
					onChange={(e) => {
						if (
							(/^[0-9]*(\.[0-9]*)?$/.test(e.target.value) &&
								parseInt(e.target.value) < 100) ||
							e.target.value === ""
						)
							dispatch(setBathroomNumber(e.target.value));
					}}
					placeholder="2"
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

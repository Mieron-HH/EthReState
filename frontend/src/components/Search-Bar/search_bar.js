import React, { useRef, useState } from "react";
import "./_search_bar.scss";
import { useNavigate } from "react-router-dom";
import { BiBath, BiBed } from "react-icons/bi";
import { MdLocationOn } from "react-icons/md";

const SearchBar = ({ backgroundColor = "white" }) => {
	const navigate = useNavigate();
	const [city, setCity] = useState("");
	const [bedroomNumber, setBedroomNumber] = useState("");
	const [bathRoomNumber, setBathroomNumber] = useState("");
	const inputRef = useRef(null);

	const searchProperties = () => {
		if (city !== "" || bedroomNumber !== "" || bathRoomNumber !== "")
			navigate("/properties", {
				state: { city, bedroomNumber, bathRoomNumber },
			});

		inputRef.current.focus();
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
						setCity(e.target.value);
					}}
					placeholder="Enter a city. e.g New York"
				/>

				<div className="label-icon">
					<MdLocationOn className="icon" />
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
							setBedroomNumber(e.target.value);
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
							setBathroomNumber(e.target.value);
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

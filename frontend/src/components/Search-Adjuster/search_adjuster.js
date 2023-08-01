import React, { useState } from "react";
import "./_search_adjuster.scss";
import { useDispatch, useSelector } from "react-redux";

// importing icons
import { BiChevronDown, BiChevronUp, BiX } from "react-icons/bi";

// importing actions
import { setLoading } from "../../slices/common-slice";
import {
	setMinPrice,
	setMaxPrice,
	setMinSize,
	setMaxSize,
	fetchProperties,
} from "../../slices/property-slice";

// importing variables
import {
	priceMinRange,
	priceMaxRange,
	sizeMinRange,
	sizeMaxRange,
} from "../../services/variables";

const SearchAdjuster = ({
	backgroundColor = "#ddd",
	width = "100%",
	height = "100%",
}) => {
	const dispatch = useDispatch();

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
	} = useSelector((state) => state.properties);
	const [priceDropdownExtended, setPriceDropdownExtended] = useState(false);
	const [sizeDropdownExtended, setSizeDropdownExtended] = useState(false);

	const handleFetchingProperties = async () => {
		setPriceDropdownExtended(false);
		setSizeDropdownExtended(false);
		dispatch(setLoading(true));
		dispatch(
			fetchProperties({
				street,
				city,
				state: stateEntry,
				bedroomNumber,
				bathroomNumber,
				minPrice,
				maxPrice,
				minSize,
				maxSize,
			})
		);
	};

	const renderDropdown = ({
		label = "",
		extended = false,
		setExtended = null,
		minRanges = [],
		maxRanges = [],
		dropdownHeader = "",
		minState = "",
		setMinState = null,
		maxState = "",
		setMaxState = null,
		unit = "",
		hideOtherDropdown = null,
	}) => {
		return (
			<>
				<div
					className="adjuster-label"
					onClick={() => {
						hideOtherDropdown(false);
						setExtended(!extended);
					}}
				>
					{label}
				</div>

				<div
					className="adjuster-icon"
					onClick={() => {
						hideOtherDropdown(false);
						setExtended(!extended);
					}}
				>
					{extended ? (
						<BiChevronUp className="icon" />
					) : (
						<BiChevronDown className="icon" />
					)}
				</div>

				<div className={`adjuster-dropdown ${!extended && "compressed"}`}>
					<div className="dropdown-header">
						{dropdownHeader}
						<BiX className="icon" onClick={() => setExtended(false)} />
					</div>
					<div className="dropdown-container">
						<div className="dropdown">
							<h1>Minimum</h1>

							<select
								value={minState}
								onChange={(e) => {
									if (parseInt(e.target.value) > parseInt(maxState))
										dispatch(setMinState(maxState));
									else dispatch(setMinState(e.target.value));
								}}
							>
								<option value="">No Min</option>
								{minRanges.map((value) => {
									return (
										<option key={value} value={value}>
											{value} {unit}
										</option>
									);
								})}
							</select>
						</div>

						<div className="dropdown">
							<h1>Maximum</h1>

							<select
								value={maxState}
								onChange={(e) => {
									if (parseInt(e.target.value) < parseInt(minState))
										dispatch(setMaxState(minState));
									else dispatch(setMaxState(e.target.value));
								}}
							>
								{maxRanges.map((value) => {
									return (
										<option key={value} value={value}>
											{value} {unit}
										</option>
									);
								})}
								<option value="">No Max</option>
							</select>
						</div>
					</div>

					<div className="dropdown-button" onClick={handleFetchingProperties}>
						Apply
					</div>
				</div>
			</>
		);
	};

	return (
		<div className="search-adjuster-container" style={{ width, height }}>
			<div
				className={`adjuster-container ${priceDropdownExtended && "active"}`}
				style={{ backgroundColor }}
			>
				{renderDropdown({
					label: "Price (ETH)",
					extended: priceDropdownExtended,
					setExtended: setPriceDropdownExtended,
					minRanges: priceMinRange,
					maxRanges: priceMaxRange,
					dropdownHeader: "Price Range",
					minState: minPrice,
					setMinState: setMinPrice,
					maxState: maxPrice,
					setMaxState: setMaxPrice,
					unit: "ETH",
					hideOtherDropdown: setSizeDropdownExtended,
				})}
			</div>

			<div
				className={`adjuster-container ${sizeDropdownExtended && "active"}`}
				style={{ backgroundColor }}
			>
				{renderDropdown({
					label: "Size (sqft)",
					extended: sizeDropdownExtended,
					setExtended: setSizeDropdownExtended,
					minRanges: sizeMinRange,
					maxRanges: sizeMaxRange,
					dropdownHeader: "Size Range",
					minState: minSize,
					setMinState: setMinSize,
					maxState: maxSize,
					setMaxState: setMaxSize,
					unit: "sqft",
					hideOtherDropdown: setPriceDropdownExtended,
				})}
			</div>
		</div>
	);
};

export default SearchAdjuster;

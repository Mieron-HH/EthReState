import React, { useEffect, useRef, useState } from "react";
import "./_property_list.scss";
import { useDispatch, useSelector } from "react-redux";

// importing components
import SearchBar from "../../../Search-Bar/search_bar";

// importing icons
import {
	BiBed,
	BiSolidDownArrow,
	BiSolidHeart,
	BiSolidUpArrow,
} from "react-icons/bi";
import {
	BsEyeFill,
	BsFillCalendarWeekFill,
	BsHouseFill,
	BsHouseUpFill,
} from "react-icons/bs";
import { IoMdPhotos } from "react-icons/io";
import { PiToilet } from "react-icons/pi";
import { RiNftFill } from "react-icons/ri";
import { SlSizeFullscreen } from "react-icons/sl";

// importing actions
import {
	fetchSellerProperties,
	setPropertyStatus,
	setSelectedProperty,
	setSelectedPropertyModified,
} from "../../../../slices/property-slice";
import { setLoading } from "../../../../slices/common-slice";

// importing helper functions
import { concatAddress, concatPrice } from "../../../../services/helpers";

// Component global variables
const filterButtonsArray = [
	{ label: "minted", backgroundColor: "green" },
	{ label: "listed", backgroundColor: "darkblue" },
	{ label: "locked", backgroundColor: "black" },
	{ label: "sold", backgroundColor: "purple" },
];

const PropertyList = () => {
	const dispatch = useDispatch();

	const {
		city,
		bedroomNumber,
		bathroomNumber,
		propertyStatus,
		sellerProperties,
		status,
		error,
		selectedPropertyModified,
	} = useSelector((state) => state.properties);
	const [filtersExpanded, setFiltersExpanded] = useState(false);
	const [sortsExpanded, setSortsExpanded] = useState(false);
	const filtersContainerRef = useRef(null);

	useEffect(() => {
		if (!selectedPropertyModified) {
			dispatch(setLoading(true));
			dispatch(fetchSellerProperties({}));
		}
	}, []);

	useEffect(() => {
		if (selectedPropertyModified) {
			fetchProperties();
			dispatch(setSelectedPropertyModified(false));
		}
	}, [selectedPropertyModified]);

	useEffect(() => {
		if (status === "loading" || status === "idle") dispatch(setLoading(true));
		else dispatch(setLoading(false));
	}, [sellerProperties, status, error]);

	useEffect(() => {
		if (status !== "loading") fetchProperties();
	}, [propertyStatus]);

	useEffect(() => {
		if (filtersExpanded) document.addEventListener("click", handleOutsideClick);
		else document.removeEventListener("click", handleOutsideClick);

		return () => {
			document.removeEventListener("click", handleOutsideClick);
		};
	}, [filtersExpanded]);

	const renderMoreFilterButtons = () => {
		return (
			<>
				{renderFilterButton({ label: "none", backgroundColor: "white" })}

				{filterButtonsArray.map((status, index) => {
					return renderFilterButton(status, index);
				})}
			</>
		);
	};

	const renderFilterButton = (status, key = "") => {
		return (
			<div
				key={key}
				className={`filter-button ${status.label === "none" && "outlined"}`}
				style={{ backgroundColor: status.backgroundColor }}
				onClick={() => {
					dispatch(
						setPropertyStatus(status.label === "none" ? "" : status.label)
					);
					setFiltersExpanded(false);
				}}
			>
				{status.label.charAt(0).toUpperCase() + status.label.slice(1)}
			</div>
		);
	};

	const renderSelectedFilter = () => {
		const getBackgroundColor = (label) => {
			const button = filterButtonsArray.find(
				(button) => button.label === label
			);
			return button ? button.backgroundColor : "white";
		};

		return (
			<>
				<div
					className={`filter-button ${propertyStatus === "" && "outlined"} ${
						filtersExpanded && "dimmed"
					}`}
					style={{ backgroundColor: getBackgroundColor(propertyStatus) }}
				>
					{propertyStatus === ""
						? "Status Filter"
						: propertyStatus.charAt(0).toUpperCase() + propertyStatus.slice(1)}
				</div>

				{filtersExpanded ? (
					<BiSolidUpArrow
						className="icon"
						style={{ color: propertyStatus === "" ? "#222" : "white" }}
					/>
				) : (
					<BiSolidDownArrow
						className="icon"
						style={{ color: propertyStatus === "" ? "#222" : "white" }}
					/>
				)}
			</>
		);
	};

	const handleOutsideClick = (event) => {
		if (
			filtersContainerRef.current &&
			!filtersContainerRef.current.contains(event.target)
		)
			setFiltersExpanded(false);
	};

	const fetchProperties = () => {
		dispatch(setLoading(true));
		dispatch(
			fetchSellerProperties({
				propertyStatus,
				city,
				bedroomNumber,
				bathroomNumber,
			})
		);
	};

	const renderPropertyStatus = (property) => {
		return (
			<>
				<BsHouseFill className="icon active" />
				<div className={`status-bar ${property.minted && "active"}`}></div>
				<RiNftFill className={`icon ${property.minted && "active"}`} />
				<div className={`status-bar ${property.listed && "active"}`}></div>
				<BsHouseUpFill className={`icon ${property.listed && "active"}`} />
			</>
		);
	};

	const renderDate = (date) => {
		return (
			date !== undefined && (
				<>
					<BsFillCalendarWeekFill className="icon" />
					{new Date(date).toDateString().toUpperCase()}
				</>
			)
		);
	};

	return (
		<div className="property-list">
			<div className="header-container">
				<div className="search-input-container">
					<SearchBar backgroundColor="#ddd" />
				</div>

				<div
					className="filter-buttons-container"
					onClick={(event) => {
						event.stopPropagation();
						setFiltersExpanded(!filtersExpanded);
					}}
				>
					{renderSelectedFilter()}

					{filtersExpanded && (
						<div
							ref={filtersContainerRef}
							className="extended-filter-container"
						>
							{renderMoreFilterButtons()}
						</div>
					)}
				</div>

				<div className="filter-buttons-container">
					<div className="filter-button outlined">Date Sort</div>

					{sortsExpanded ? (
						<BiSolidUpArrow className="icon" />
					) : (
						<BiSolidDownArrow className="icon" />
					)}

					{sortsExpanded && (
						<div className="extended-filter-container">
							{renderFilterButton()}
							{renderFilterButton()}
						</div>
					)}
				</div>
			</div>

			<div className="body-container">
				{sellerProperties.length !== 0 && (
					<div className="property-cards-container">
						{sellerProperties.map((property) => {
							return (
								<div
									key={property._id}
									className="property-card"
									onClick={() => {
										dispatch(setLoading(true));
										setTimeout(() => {
											dispatch(setSelectedProperty(property));
										}, 500);
									}}
								>
									<div className="images-container">
										<img
											className="image"
											src={`data:${property.thumbnail.contentType};base64,${property.thumbnail.data}`}
											alt="Property Image"
										/>
									</div>

									<div className="details-container">
										<div className="address-container">
											{concatAddress({
												street: property.street,
												city: property.city,
												state: property.state,
												maxChars: 30, // length of characters to be displayed
											})}
										</div>

										<div className="price-container">
											{concatPrice(property)}
										</div>

										<div className="bed-bath-size-container">
											<div className="item-container">
												<BiBed className="icon" />
												<div className="item">{property.bedroomNumber}</div>
											</div>

											<div className="item-container">
												<PiToilet className="icon" />
												<div className="item">{property.bathroomNumber}</div>
											</div>

											<div className="item-container">
												<SlSizeFullscreen className="icon" size={14} />
												<div className="item">{property.size} sqft</div>
											</div>
										</div>

										<div className="counts-container">
											<div className="counts-item">
												<div className="count">{property.views}</div>
												<BsEyeFill className="icon" />
											</div>

											<div className="counts-item">
												<div className="count">{property.likes.length}</div>
												<BiSolidHeart className="icon" />
											</div>

											<div className="counts-item">
												<div className="count">{property.imagesCount + 1}</div>
												<IoMdPhotos className="icon" />
											</div>
										</div>

										<div className="property-status">
											{renderPropertyStatus(property)}
										</div>

										<div className="date-container">
											{renderDate(property.createdAt)}
										</div>
									</div>
								</div>
							);
						})}
					</div>
				)}

				{sellerProperties.length === 0 && (
					<div className="no-data-found-container">
						<img
							className="image"
							src={require("../../../../images/no-data-image.png")}
						/>
					</div>
				)}
			</div>
		</div>
	);
};

export default PropertyList;

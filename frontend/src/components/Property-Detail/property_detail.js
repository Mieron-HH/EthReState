import React, { useEffect, useState } from "react";
import "./_property_detail.scss";
import { useDispatch, useSelector } from "react-redux";

// importing icons
import {
	BiBath,
	BiBed,
	BiChevronLeft,
	BiChevronRight,
	BiSolidHeart,
	BiX,
} from "react-icons/bi";
import { BsEyeFill } from "react-icons/bs";
import { CgUserlane } from "react-icons/cg";
import { FaEthereum } from "react-icons/fa";
import { IoMdPhotos } from "react-icons/io";
import { SlSizeFullscreen } from "react-icons/sl";

// importing actions
import {
	setPropertyDetailDisplayed,
	setSelectedProperty,
} from "../../slices/property-slice";

// importing services
import { lockProperty, updatePropertyLikes } from "../../services/api-calls";
import { concatAddress } from "../../services/helpers";
import { setLoading, setLoginFormDisplayed } from "../../slices/common-slice";

const bgColors = {
	seller: { backgroundColor: "gray" },
	unlocked: { backgroundColor: "blue" },
	unlock: { backgroundColor: "red" },
	finalize: { backgroundColor: "green" },
	login: { backgroundColor: "green" },
};

const PropertyDetail = () => {
	const dispatch = useDispatch();

	const { loading, user } = useSelector((state) => state.common);
	const { selectedProperty } = useSelector((state) => state.properties);
	const [slide, setSlide] = useState(0);
	const [propertyLikes, setPropertyLikes] = useState(0);
	const [propertyLiked, setPropertyLiked] = useState(false);

	useEffect(() => {
		setTimeout(() => {
			dispatch(setLoading(false));
		}, 800);

		if (selectedProperty) setPropertyLikes(selectedProperty.likes.length);
	}, []);

	useEffect(() => {
		if (user && selectedProperty && selectedProperty.likes.includes(user.id))
			setPropertyLiked(true);
	}, [user]);

	const hidePropertyDetailDisplay = () => {
		dispatch(setPropertyDetailDisplayed(false));
		dispatch(setSelectedProperty(null));
	};

	const nextSlide = () => {
		setSlide(slide === selectedProperty.images.length ? 0 : slide + 1);
	};

	const prevSlide = () => {
		setSlide(slide === 0 ? selectedProperty.images.length : slide - 1);
	};

	const handlePropertyLocking = async () => {
		if (!selectedProperty.locked) {
			console.log("entered here");
			await lockProperty(selectedProperty.id);
		}
	};

	const displayLoginForm = () => {
		dispatch(setLoginFormDisplayed(true));
	};

	const renderButton = () => {
		if (!user)
			return (
				<div
					className="button-container"
					style={bgColors.login}
					onClick={displayLoginForm}
				>
					Login
				</div>
			);
		else if (selectedProperty.seller.id === user.id && !selectedProperty.locked)
			return (
				<div className="button-container" style={bgColors.unlock}>
					Unlist
				</div>
			);
		else if (!selectedProperty.locked)
			return (
				<div
					className="button-container"
					style={bgColors.unlocked}
					onClick={handlePropertyLocking}
				>
					Lock
				</div>
			);
		else if (
			selectedProperty.locked &&
			selectedProperty.buyer.toString() === user.id
		)
			return (
				<div className="group-button-container">
					<div className="button-container" style={bgColors.unlock}>
						Unlock
					</div>

					<div className="button-container" style={bgColors.finalize}>
						Finalize
					</div>
				</div>
			);
	};

	const handlePropertyLikes = (propertyID) => {
		if (propertyLiked) setPropertyLikes(propertyLikes - 1);
		else setPropertyLikes(propertyLikes + 1);
		setPropertyLiked(!propertyLiked);
		updatePropertyLikes(propertyID);
	};

	return (
		!loading && (
			<div className="property-detail-container">
				<div className="property-detail-header">
					<div className="logo-container">
						<img
							className="logo"
							src={require("../../images/Logo.png")}
							alt=""
						/>
					</div>

					<div className="hide-button" onClick={hidePropertyDetailDisplay}>
						<BiX className="icon" />
					</div>
				</div>

				<div className="property-detail-body">
					<div className="images-carousel">
						<div className="arrow left" onClick={prevSlide}>
							<BiChevronLeft className="icon" />
						</div>

						<img
							className={`image ${slide !== 0 && "hidden"}`}
							src={`data:${selectedProperty.thumbnail.contentType};base64,${selectedProperty.thumbnail.data}`}
						/>

						{selectedProperty.images.map((image, index) => {
							return (
								<img
									key={index}
									className={`image ${slide - 1 !== index && "hidden"}`}
									src={`data:${image.contentType};base64,${image.data}`}
								/>
							);
						})}

						<div className="arrow right" onClick={nextSlide}>
							<BiChevronRight className="icon" />
						</div>
					</div>

					<div className="detail-container">
						<div className="address-container">
							{concatAddress(
								selectedProperty.street,
								selectedProperty.city,
								selectedProperty.state
							)}
						</div>

						<div className="price-container">
							<FaEthereum /> {selectedProperty.price} ETH
						</div>

						<div className="group-container">
							<div className="bed-bath-size-container">
								<div className="item-container">
									<BiBed className="icon" />
									<div className="item">{selectedProperty.bedroomNumber}</div>
								</div>

								<div className="item-container">
									<BiBath className="icon" />
									<div className="item">{selectedProperty.bathroomNumber}</div>
								</div>

								<div className="item-container">
									<SlSizeFullscreen className="icon" size={17} />
									<div className="item">{selectedProperty.size} sqft</div>
								</div>
							</div>

							<div className="counts-container">
								<div className="counts-item">
									<BsEyeFill className="icon" />
									<div className="count">{selectedProperty.views}</div>
								</div>

								<div className="counts-item">
									<BiSolidHeart className="icon" />
									<div className="count">{propertyLikes}</div>
								</div>

								<div className="counts-item">
									<IoMdPhotos className="icon" />
									<div className="count">
										{selectedProperty.images.length + 1}
									</div>
								</div>
							</div>
						</div>

						<div className="seller-container">
							<CgUserlane className="icon" />
							{selectedProperty.seller.firstName}{" "}
							{selectedProperty.seller.lastName}
						</div>

						{renderButton()}
					</div>
				</div>
			</div>
		)
	);
};

export default PropertyDetail;

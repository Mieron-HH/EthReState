import React, { useEffect, useState } from "react";
import "./_property.scss";
import { useDispatch, useSelector } from "react-redux";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import {
	BsCameraFill,
	BsEyeFill,
	BsFillCalendarWeekFill,
} from "react-icons/bs";
import {
	BiBath,
	BiBed,
	BiChevronLeft,
	BiChevronRight,
	BiSolidHeart,
} from "react-icons/bi";
import { SlSizeFullscreen } from "react-icons/sl";
import { MdLocationOn } from "react-icons/md";
import { CgUserlane } from "react-icons/cg";

// importing services
import { updatePropertyLikes } from "../../services/api-calls";

// importing helpers
import { createAddress, loadUserCookie } from "../../services/helpers";
import { setUser } from "../../slices/common-slice";

const Card = ({ property = null, width = "", height = "" }) => {
	const dispatch = useDispatch();

	const { user } = useSelector((state) => state.common);
	const [slide, setSlide] = useState(0);
	const [propertyLikes, setPropertyLikes] = useState(0);
	const [propertyLiked, setPropertyLiked] = useState(false);

	useEffect(() => {
		dispatch(setUser(loadUserCookie()));

		if (property) setPropertyLikes(property.likes.length);
	}, []);

	useEffect(() => {
		console.log({ user });
		if (user && property && property.likes.includes(user.id))
			setPropertyLiked(true);
	}, [user]);

	const nextSlide = () => {
		setSlide(slide === property.images.length ? 0 : slide + 1);
	};

	const prevSlide = () => {
		setSlide(slide === 0 ? property.images.length : slide - 1);
	};

	const renderDate = (date) => {
		return (
			date !== undefined && (
				<div className="date-container">
					<BsFillCalendarWeekFill className="icon" />
					{new Date(date).toDateString().toUpperCase()}
				</div>
			)
		);
	};

	const handlePropertyLikes = (propertyID) => {
		if (propertyLiked) setPropertyLikes(propertyLikes - 1);
		else setPropertyLikes(propertyLikes + 1);
		setPropertyLiked(!propertyLiked);
		updatePropertyLikes(propertyID);
	};

	return property ? (
		<div
			className="card-container"
			style={{
				width: width !== "" ? width : "370px",
				height: height !== "" ? height : "440px",
			}}
		>
			<div className="image-container">
				<div className="arrow left" onClick={prevSlide}>
					<BiChevronLeft className="icon" />
				</div>

				<img
					className={`image ${slide !== 0 && "hidden"}`}
					src={`data:${property.thumbnail.contentType};base64,${property.thumbnail.data}`}
				/>

				{property.images.map((image, index) => {
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

				<div className="counts-container">
					<div className="counts-item">
						<BsEyeFill className="icon" />
						<div className="count">{property.views}</div>
					</div>

					<div className="counts-item">
						<BiSolidHeart />
						<div className="count">{propertyLikes}</div>
					</div>

					<div className="counts-item">
						<BsCameraFill />
						<div className="count">{property.images.length + 1}</div>
					</div>
				</div>
			</div>

			<div className="details-container">
				<div className="address">
					<MdLocationOn className="icon" />{" "}
					{createAddress(property.street, property.city, property.state)}
				</div>

				<div className="price">ETH {property.price}</div>

				<div className="bed-bath-size-container">
					<div className="item-container">
						<BiBed className="icon" />
						<div className="item">{property.bedroomNumber}</div>
					</div>

					<div className="item-container">
						<BiBath className="icon" />
						<div className="item">{property.bathroomNumber}</div>
					</div>

					<div className="item-container">
						<SlSizeFullscreen className="icon" size={15} />
						<div className="item">{property.size} sqft</div>
					</div>
				</div>

				<div className="seller">
					<CgUserlane className="icon" />
					{property.seller.firstName} {property.seller.lastName}
				</div>

				<div className="other-info">
					{renderDate(property.listedAt)}

					{propertyLiked ? (
						<AiFillHeart
							className="icon"
							onClick={() => handlePropertyLikes(property.id)}
						/>
					) : (
						<AiOutlineHeart
							className="icon"
							onClick={() => handlePropertyLikes(property.id)}
						/>
					)}
				</div>
			</div>
		</div>
	) : (
		<></>
	);
};

export default Card;

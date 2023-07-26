import React, { useEffect } from "react";
import "./_card.scss";
import {
	BsEyeFill,
	BsCameraFill,
	BsScale,
	BsArrowsFullscreen,
} from "react-icons/bs";
import { BiBath, BiBed, BiSolidHeart } from "react-icons/bi";

// importing helpers
import { createAddress } from "../../services/helpers";

const Card = ({ property = null, width = "", height = "" }) => {
	return property ? (
		<div
			className="card-container"
			style={{
				width: width !== "" ? width : "370px",
				height: height !== "" ? height : "440px",
			}}
		>
			<div className="thumbnail-container">
				<img
					className="thumbnail"
					src={`data:${property.thumbnail.contentType};base64,${property.thumbnail.data}`}
				/>

				<div className="counts-container">
					<div className="counts-item">
						<BsEyeFill className="icon" />
						<div className="count">{property.views}</div>
					</div>

					<div className="counts-item">
						<BiSolidHeart />
						<div className="count">{property.likes.length}</div>
					</div>

					<div className="counts-item">
						<BsCameraFill />
						<div className="count">{property.images.length}</div>
					</div>
				</div>
			</div>

			<div className="details-container">
				<div className="address">
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
						<BsArrowsFullscreen className="icon" />
						<div className="item">{property.size} sqft</div>
					</div>
				</div>
			</div>
		</div>
	) : (
		<></>
	);
};

export default Card;

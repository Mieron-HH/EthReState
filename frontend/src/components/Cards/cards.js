import React from "react";
import "./_cards.scss";

const Cards = () => {
	return (
		<div className="cards-container">
			<div className="card-item">
				<img src={require("../../images/new_properties.png")} alt="" />
				<p className="label">NEW PROPERTIES</p>
			</div>
			<div className="card-item">
				<img src={require("../../images/contact_agent.png")} alt="" />
				<p className="label">CONTACT AGENT</p>
			</div>
			<div className="card-item">
				<img src={require("../../images/building_for_sale.png")} alt="" />
				<p className="label">BUILDING FOR SALE</p>
			</div>
			<div className="card-item">
				<img src={require("../../images/house_for_sale.png")} alt="" />
				<p className="label">HOUSE FOR SALE</p>
			</div>
		</div>
	);
};

export default Cards;

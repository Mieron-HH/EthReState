import React from "react";
import "./_header.scss";

// importing components
import Drawer from "../../components/Drawer/drawer";

const Header = () => {
	return (
		<div className="header-container">
			<div className="inner-header-container">
				<img className="logo" src={require("../../images/Logo.png")} alt="" />

				<div className="menu-container">
					<div className="menu-item">Home</div>
					<div className="menu-item">Property Listing</div>
					<div className="menu-item">Contact Us</div>
				</div>
			</div>

			<Drawer />
		</div>
	);
};

export default Header;

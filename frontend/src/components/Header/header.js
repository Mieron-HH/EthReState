import React from "react";
import "./_header.scss";
import { Link, useLocation } from "react-router-dom";

const Header = () => {
	const location = useLocation();

	return (
		<div className="header-container">
			<div className="inner-header-container">
				<img className="logo" src={require("../../images/Logo.png")} alt="" />

				<div className="menu-container">
					<Link
						className={`menu-item ${location.pathname === "/" && "selected"}`}
						to="/"
					>
						Home
					</Link>

					<Link
						className={`menu-item ${
							location.pathname === "/publish" && "selected"
						}`}
						to="/properties"
					>
						Properties
					</Link>

					<div
						className={`menu-item ${
							location.pathname === "/contactUs" && "selected"
						}`}
					>
						Contact Us
					</div>
				</div>
			</div>
		</div>
	);
};

export default Header;

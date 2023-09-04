import React from "react";
import "./_header.scss";
import { Link, useLocation, useNavigate } from "react-router-dom";

const Header = ({ inverted = "" }) => {
	const navigate = useNavigate();
	const location = useLocation();

	const navigateHome = () => {
		if (location.pathname !== "/") navigate("/");
	};

	return (
		<div className="header-container">
			<div className={`logo-container ${inverted}`} onClick={navigateHome}>
				<img className="logo" src={require("../../images/Logo.png")} alt="" />
			</div>

			<div className="menu-container">
				<Link
					className={`menu-item ${location.pathname === "/" && "selected"}`}
					to="/"
				>
					Home
				</Link>

				<Link
					className={`menu-item ${
						location.pathname === "/properties" && "selected"
					}`}
					to="/properties"
				>
					Properties
				</Link>

				<Link
					className={`menu-item ${
						location.pathname === "/dashboard" && "selected"
					}`}
					to="/dashboard"
				>
					Dashboard
				</Link>
			</div>
		</div>
	);
};

export default Header;

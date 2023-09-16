import React from "react";
import "./_header.scss";
import { Link, useLocation, useNavigate } from "react-router-dom";

// importing components
import AuthenticaionHeader from "../Authentication-Header/authentication_header";

const Header = ({ inverted = "" }) => {
	const navigate = useNavigate();
	const location = useLocation();

	const navigateHome = () => {
		if (location.pathname !== "/") navigate("/");
	};

	return (
		<div className="header-container">
			<div className={`logo-container ${inverted}`} onClick={navigateHome}>
				<img className="logo" src="images/Logo.png" alt="" />
			</div>

			<div className="menu-container">
				<div className="links-container">
					<Link
						className={`link-item ${location.pathname === "/" && "selected"}`}
						to="/"
					>
						Home
					</Link>

					<Link
						className={`link-item ${
							location.pathname === "/properties" && "selected"
						}`}
						to="/properties"
					>
						Properties
					</Link>

					<Link
						className={`link-item ${
							location.pathname === "/dashboard" && "selected"
						}`}
						to="/dashboard"
					>
						Dashboard
					</Link>
				</div>

				<AuthenticaionHeader />
			</div>
		</div>
	);
};

export default Header;

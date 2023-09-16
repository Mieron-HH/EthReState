import React, { useEffect, useState } from "react";
import "./_authentication_header.scss";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

// importing actions
import {
	setLoading,
	setLoginFormDisplayed,
	setUser,
} from "../../slices/common-slice";
import { setSigner } from "../../slices/config-slice";

// importing icons
import { BiUser, BiSolidDashboard, BiX } from "react-icons/bi";
import { BsArrowRight } from "react-icons/bs";
import { RiLogoutCircleRFill } from "react-icons/ri";
import { setSelectedMenu } from "../../slices/dashboard-slice";

// importing helpers
import { getUserData, logoutUser } from "../../services/api-calls";

const AuthenticaionHeader = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const { user } = useSelector((state) => state.common);
	const [menuExtended, setMenuExtended] = useState(false);

	useEffect(() => {
		if (!user) getUserDataHandler();
	}, []);

	const getUserDataHandler = async () => {
		try {
			const { data } = await getUserData();

			if (data !== null) dispatch(setUser(data));
		} catch (error) {
			console.error({ error });
		}
	};

	const handleUserLogin = () => {
		dispatch(setLoginFormDisplayed(true));
	};

	const handleUserLogout = async () => {
		dispatch(setLoading(true));

		await logoutUser();

		setTimeout(() => {
			dispatch(setUser(null));
			dispatch(setSigner(null));
			Cookies.remove("signer");
			Cookies.remove("user");
			dispatch(setLoading(false));
		}, 2000);
	};

	const goToDashboard = () => {
		dispatch(setLoading(true));
		dispatch(setSelectedMenu("dashboard"));
		navigate("/dashboard");
	};

	const goToMyProfile = () => {
		dispatch(setLoading(true));
		dispatch(setSelectedMenu("setting"));
		navigate("/dashboard");
	};

	return (
		<div className="authentication-header-container">
			<div className="auth-container">
				{!user && (
					<div className="not-logged-in">
						<div className="auth-button login" onClick={handleUserLogin}>
							Login
						</div>

						<div className="auth-button register">
							Register <BsArrowRight className="icon" />
						</div>
					</div>
				)}

				{user && (
					<div className="logged-in">
						<div className="user-icon-container">
							{menuExtended ? (
								<BiX className="icon" onClick={() => setMenuExtended(false)} />
							) : (
								<BiUser
									className="icon"
									onClick={() => setMenuExtended(true)}
								/>
							)}
						</div>

						{menuExtended && (
							<div className="menu-dropdown-container">
								<div className="user-info-container">
									<h3>{user.firstName.slice(0, 18)}</h3>
									<h4>{user.email.slice(0, 18)}</h4>
								</div>
								<div className="menu-items">
									<div className="menu-item" onClick={goToDashboard}>
										<BiSolidDashboard className="icon" /> Dashboard
									</div>
									<div className="menu-item" onClick={goToMyProfile}>
										<BiUser className="icon" /> My Profile
									</div>
									<div className="menu-item" onClick={handleUserLogout}>
										<RiLogoutCircleRFill className="icon" />
										Log-out
									</div>
								</div>
							</div>
						)}
					</div>
				)}
			</div>
		</div>
	);
};

export default AuthenticaionHeader;

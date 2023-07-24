import React, { useEffect, useState } from "react";
import "./_drawer.scss";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { BiUser, BiMenu, BiX, BiLogOut, BiHomeAlt2 } from "react-icons/bi";

// importing actions
import { setAccount, setSigner } from "../../slices/config-slice";
import { setLoginFormDisplayed, setUser } from "../../slices/common-slice";

// importing services
import { logoutUser } from "../../services/api-calls";

const Drawer = () => {
	const dispatch = useDispatch();

	const { provider, signer } = useSelector((state) => state.config);
	const { user } = useSelector((state) => state.common);
	const [isDisplayed, setIsDisplayed] = useState(false);

	useEffect(() => {
		// Add the event listener to the scroll event
		window.addEventListener("scroll", () => setIsDisplayed(false));
	}, []);

	const connectAccount = async () => {
		try {
			const accounts = await window.ethereum.request({
				method: "eth_requestAccounts",
			});
			dispatch(setAccount(accounts[0]));

			const signer = await provider.getSigner();
			dispatch(setSigner(signer));
		} catch (error) {
			console.log(error);
		}
	};

	const toggleDisplay = () => {
		setIsDisplayed(!isDisplayed);
	};

	const displayLoginForm = (e) => {
		e.preventDefault();

		setIsDisplayed(false);
		dispatch(setLoginFormDisplayed(true));
	};

	const displayName = (name) => {
		if (name.length > 20) return name.slice(0, 20) + "...";

		return name;
	};

	const handleLogout = async () => {
		const data = await logoutUser();

		dispatch(setUser(data));
	};

	const renderConnector = () => {
		return (
			user &&
			(signer ? (
				<>
					<div className="account-address">
						{signer.address.slice(0, 4) + "...." + signer.address.slice(38)}
					</div>

					<p>Wallet is connected 😎</p>
				</>
			) : (
				<>
					<button
						type="button"
						className="connector-button"
						onClick={connectAccount}
					>
						Connect Wallet
					</button>

					<p>Wallet is not connected 😐</p>
				</>
			))
		);
	};

	return (
		<>
			{!isDisplayed && (
				<div className="user-icon-container" onClick={toggleDisplay}>
					{isDisplayed ? (
						<BiX className="icon" />
					) : user !== null ? (
						<>
							{!signer && (
								<div
									className="indicator"
									style={{ backgroundColor: "red" }}
								></div>
							)}

							<BiUser className="icon" />
						</>
					) : (
						<BiMenu className="icon" />
					)}
				</div>
			)}

			<div
				className="drawer-container"
				style={{ width: isDisplayed ? "25vw" : "0vw" }}
			>
				{isDisplayed && (
					<div className="user-info-container">
						<div
							className="hide-drawer-button"
							onClick={() => setIsDisplayed(false)}
						>
							<BiX className="icon" />
						</div>

						{user !== null ? (
							<p className="user-email">{displayName(user.email)}</p>
						) : (
							<button className="login-button" onClick={displayLoginForm}>
								Login
							</button>
						)}
					</div>
				)}

				{isDisplayed && renderConnector()}

				{isDisplayed && user && (
					<div className="drawer-menu-container">
						<Link className="drawer-menu-item" to="/publish">
							<BiHomeAlt2 className="icon" /> Publish
						</Link>

						<div className="drawer-menu-item" onClick={handleLogout}>
							<BiLogOut className="icon" /> Logout
						</div>
					</div>
				)}

				{isDisplayed && !user && (
					<div className="login-instruction">
						Log-in required to load user data
					</div>
				)}
			</div>
		</>
	);
};

export default Drawer;

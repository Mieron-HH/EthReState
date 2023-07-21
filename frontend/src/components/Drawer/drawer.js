import React, { useState } from "react";
import "./_drawer.scss";
import { useDispatch, useSelector } from "react-redux";
import { BiUser, BiMenu, BiX } from "react-icons/bi";

// importing actions
import { setAccount, setSigner } from "../../slices/config-slice";
import { setLoginFormDisplayed } from "../../slices/common-slice";

const Drawer = () => {
	const dispatch = useDispatch();

	const { provider, signer } = useSelector((state) => state.config);
	const { user } = useSelector((state) => state.common);

	const [isDisplayed, setIsDisplayed] = useState(false);

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

	return (
		<>
			<div className="user-icon-container" onClick={toggleDisplay}>
				{isDisplayed ? (
					<BiX className="icon" />
				) : user !== null ? (
					<>
						<div
							className="indicator"
							style={{ backgroundColor: signer ? "lightgreen" : "red" }}
						></div>

						<BiUser className="icon" />
					</>
				) : (
					<BiMenu className="icon" />
				)}
			</div>

			{isDisplayed && (
				<div className="drawer-container">
					<div className="user-info-container">
						{user !== null ? (
							<p className="user-email">{displayName(user.email)}</p>
						) : (
							<button className="login-button" onClick={displayLoginForm}>
								Login
							</button>
						)}
					</div>

					{user ? (
						signer ? (
							<>
								<div className="account-address">
									{signer.address.slice(0, 4) +
										"...." +
										signer.address.slice(38)}
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
						)
					) : (
						<div className="login-instruction">
							Log-in required to load user data
						</div>
					)}
				</div>
			)}
		</>
	);
};

export default Drawer;
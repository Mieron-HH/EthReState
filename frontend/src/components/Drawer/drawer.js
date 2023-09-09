import React, { useEffect } from "react";
import "./_drawer.scss";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { BiLeftArrowAlt, BiRightArrowAlt, BiUser } from "react-icons/bi";
import { BsHouseUp } from "react-icons/bs";
import { IoMdLogIn, IoMdLogOut } from "react-icons/io";
import { GiCancel, GiChaingun } from "react-icons/gi";
import { TbPlugConnected } from "react-icons/tb";

// importing actions
import {
	setDrawerExtended,
	setLoading,
	setLoginFormDisplayed,
	setUser,
} from "../../slices/common-slice";
import { setSigner } from "../../slices/config-slice";

// importing API calls
import { logoutUser } from "../../services/api-calls";

const Drawer = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const { drawerExtended, user } = useSelector((state) => state.common);
	const { provider, signer } = useSelector((state) => state.config);

	useEffect(() => {
		if (Cookies.get("signer")) {
			const signer = JSON.parse(Cookies.get("signer"));
			dispatch(setSigner(signer));
		}
	}, []);

	const toggleDrawer = () => {
		dispatch(setDrawerExtended(!drawerExtended));
	};

	const displayUserDetails = () => {
		return drawerExtended ? (
			user ? (
				<div className="user-email">{user.email}</div>
			) : (
				<div className="login-button" onClick={dispatchLoginForm}>
					LOGIN
				</div>
			)
		) : user ? (
			<BiUser className="menu-icon" onClick={toggleDrawer} />
		) : (
			<IoMdLogIn className="menu-icon" onClick={dispatchLoginForm} />
		);
	};

	const renderConnectorButton = () => {
		return drawerExtended ? (
			signer ? (
				<div className="connector-button">
					{signer.address.slice(0, 4)}...{signer.address.slice(38, 42)}
					<GiCancel
						className="disconnect-icon"
						onClick={() => {
							dispatch(setSigner(null));
							Cookies.remove("signer");
						}}
					/>
				</div>
			) : (
				<div className="connector-button" onClick={getSigner}>
					CONNECT WALLET
				</div>
			)
		) : signer ? (
			<GiChaingun className="menu-icon" onClick={toggleDrawer} />
		) : (
			<TbPlugConnected className="menu-icon" onClick={getSigner} />
		);
	};

	const getSigner = async () => {
		try {
			const accounts = await window.ethereum.request({
				method: "eth_requestAccounts",
			});

			const signer = await provider.getSigner();
			dispatch(setSigner(signer));
			Cookies.set("signer", JSON.stringify(signer));
		} catch (error) {
			console.log(error);
		}
	};

	const handleUserLogout = async () => {
		dispatch(setDrawerExtended(false));
		dispatch(setLoading(true));

		await logoutUser();

		setTimeout(() => {
			dispatch(setUser(null));
			dispatch(setSigner(null));
			dispatch(setLoading(false));
			Cookies.remove("signer");
			Cookies.remove("user");
		}, 2000);
	};

	const dispatchLoginForm = () => {
		dispatch(setDrawerExtended(false));
		dispatch(setLoginFormDisplayed(true));
	};

	const navigateToListProperty = () => {
		dispatch(setLoading(true));
		navigate("/publish");
	};

	return (
		<div className={`drawer-container ${drawerExtended && "extended"}`}>
			<div className="drawer-toggler" onClick={toggleDrawer}>
				{drawerExtended ? (
					<BiRightArrowAlt className="toggler-icon" />
				) : (
					<BiLeftArrowAlt className="toggler-icon" />
				)}
			</div>

			<div
				className={`drawer-menu-item  ${
					drawerExtended ? "extended-user" : "hightlight user"
				} ${drawerExtended && user && "logged-in"} ${
					drawerExtended && !user && "logged-out"
				}`}
			>
				{displayUserDetails()}
			</div>

			<div
				className={`drawer-menu-item ${
					drawerExtended ? "connector" : "hightlight"
				} ${drawerExtended && signer && "no-cursor"}`}
			>
				{renderConnectorButton()}
			</div>

			<div
				className={`drawer-menu-item ${
					drawerExtended ? "extended" : "hightlight"
				}`}
				onClick={navigateToListProperty}
			>
				{drawerExtended ? (
					<>
						<BsHouseUp className="menu-icon" />
						<div className="menu-item-label">List Property</div>
					</>
				) : (
					<BsHouseUp className="menu-icon" />
				)}
			</div>

			{user && (
				<div
					className={`drawer-menu-item ${
						drawerExtended ? "extended" : "hightlight"
					}`}
					onClick={() => drawerExtended && handleUserLogout()}
				>
					{drawerExtended ? (
						<>
							<IoMdLogOut className="menu-icon" />
							<div className="menu-item-label">Logout</div>
						</>
					) : (
						<IoMdLogOut className="menu-icon" onClick={toggleDrawer} />
					)}
				</div>
			)}
		</div>
	);
};

export default Drawer;

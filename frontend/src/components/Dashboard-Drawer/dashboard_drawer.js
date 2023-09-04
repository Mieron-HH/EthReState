import React from "react";
import "./_dashbard_drawer.scss";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

// imporging icons
import { AiFillSetting } from "react-icons/ai";
import { BiSolidHeart, BiUser } from "react-icons/bi";
import { BsHouseFill, BsHouseUpFill } from "react-icons/bs";
import { GiHouseKeys } from "react-icons/gi";

// importing actions
import { setSelectedMenu } from "../../slices/dashboard-slice";
import { setLoading } from "../../slices/common-slice";

const DashboadDrawer = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const { selectedMenu } = useSelector((state) => state.dashboard);

	const changeSelectedMenu = (menu) => {
		if (selectedMenu === menu) return;

		dispatch(setLoading(true));
		dispatch(setSelectedMenu(menu));
		setTimeout(() => dispatch(setLoading(false)), 400);
	};

	return (
		<div className="dashboard-drawer">
			<div className="logo-container">
				<img
					className="logo"
					src={require("../../images/Logo.png")}
					onClick={() => navigate("/")}
				/>
			</div>

			<div className="user-container">
				<BiUser className="icon" />

				<div className="user-detail-container">
					<div className="user-name">Drake</div>

					<div className="user-email">drake@gmail.com</div>
				</div>
			</div>

			<div className="menu-container">
				<div
					className={`menu-item ${selectedMenu === "dashboard" && "selected"}`}
					onClick={() => changeSelectedMenu("dashboard")}
				>
					<div className="icon-container">
						<BsHouseFill className="icon" />
					</div>

					<div className="menu">Dashboard</div>
				</div>

				<div
					className={`menu-item ${
						selectedMenu === "my_properties" && "selected"
					}`}
					onClick={() => changeSelectedMenu("my_properties")}
				>
					<div className="icon-container">
						<GiHouseKeys className="icon" />
					</div>

					<div className="menu">My Properties</div>
				</div>

				<div
					className={`menu-item ${
						selectedMenu === "list_property" && "selected"
					}`}
					onClick={() => changeSelectedMenu("list_property")}
				>
					<div className="icon-container">
						<BsHouseUpFill className="icon" />
					</div>

					<div className="menu">List Property</div>
				</div>

				<div
					className={`menu-item ${selectedMenu === "favourites" && "selected"}`}
					onClick={() => changeSelectedMenu("favourites")}
				>
					<div className="icon-container">
						<BiSolidHeart className="icon" />
					</div>

					<div className="menu">Favourites</div>
				</div>

				<div
					className={`menu-item ${selectedMenu === "setting" && "selected"}`}
					onClick={() => changeSelectedMenu("setting")}
				>
					<div className="icon-container">
						<AiFillSetting className="icon" />
					</div>

					<div className="menu">Setting</div>
				</div>
			</div>
		</div>
	);
};

export default DashboadDrawer;

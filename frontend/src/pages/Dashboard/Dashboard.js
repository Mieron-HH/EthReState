import React, { useEffect } from "react";
import "./_dashboard.scss";
import { useDispatch, useSelector } from "react-redux";

// importing components
import DashboadDrawer from "../../components/Dashboard-Drawer/dashboard_drawer";
import Loader from "../../components/Loader/loader";
import ListProperty from "../../components/Dashboard-Components/List-Property/list_property";
import MyProperties from "../../components/Dashboard-Components/My-Properties/my_properties";
import Favourites from "../../components/Dashboard-Components/Favourites/favourites";

// importing actions
import { setLoading } from "../../slices/common-slice";

const Dashboard = () => {
	const dispatch = useDispatch();

	const { selectedMenu } = useSelector((state) => state.dashboard);
	const { loading } = useSelector((state) => state.common);

	useEffect(() => {
		dispatch(setLoading(true));

		setTimeout(() => dispatch(setLoading(false)), 400);
	}, []);

	return (
		<div className="Dashboard">
			<div className="dashboard-drawer-container">
				<DashboadDrawer />
			</div>

			<div className="dashboard-body-container">
				{loading && (
					<div className="dashboard-loader-container">
						<Loader />
					</div>
				)}

				{selectedMenu === "list_property" && <ListProperty />}

				{selectedMenu === "my_properties" && <MyProperties />}

				{selectedMenu === "favourites" && <Favourites />}
			</div>
		</div>
	);
};

export default Dashboard;

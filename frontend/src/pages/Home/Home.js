import React, { useEffect } from "react";
import "./_home.scss";
import { useDispatch, useSelector } from "react-redux";

// importing components
import Header from "../../components/Header/header";
import Login from "../../components/Login/login";
import Search from "../../components/Search/search";
import Cards from "../../components/Cards/cards";
import Popular from "../../components/Popular/popular";
import Testimonials from "../../components/Testimonials/testimonials";
import Footer from "../../components/Footer/footer";

// importing actions
import { setUser } from "../../slices/common-slice";

// importing services
import { getCurrentUser } from "../../services/api-calls";

const Home = () => {
	const dispatch = useDispatch();
	const { loginFormDisplayed } = useSelector((state) => state.common);

	useEffect(() => {
		currentUserHandler();
	}, []);

	const currentUserHandler = async () => {
		const data = await getCurrentUser();

		if (data !== null) dispatch(setUser(data));
	};

	return (
		<div className="Home">
			<img
				className="landing-page-image"
				src={require("../../images/landing_page_image.jpg")}
				alt=""
			/>
			<div className="shade"></div>

			<Header />

			{loginFormDisplayed && <Login />}

			<Search />
			<Cards />
			<Popular />
			<Testimonials />
			<Footer />
		</div>
	);
};

export default Home;

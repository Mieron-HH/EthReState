import React, { useEffect, useState } from "react";
import "./_home.scss";
import { useDispatch, useSelector } from "react-redux";

// importing components
import Loader from "../../components/Loader/loader";
import Header from "../../components/Header/header";
import Login from "../../components/Login/login";
import Impression from "../../components/Impression/impression";
import Cards from "../../components/Cards/cards";
import Popular from "../../components/Popular/popular";
import Testimonials from "../../components/Testimonials/testimonials";
import Footer from "../../components/Footer/footer";

// importing actions
import {
	setLoading,
	setLoginFormDisplayed,
	setUser,
} from "../../slices/common-slice";
import { fetchPopular } from "../../slices/property-slice";

const Home = () => {
	const dispatch = useDispatch();

	const { loading, loginFormDisplayed } = useSelector((state) => state.common);
	const { popular } = useSelector((state) => state.properties);
	const [displayContent, setDisplayContent] = useState(false);

	useEffect(() => {
		dispatch(setLoading(true));
		dispatch(fetchPopular());

		const handleScroll = () => {
			const scrollPosition = window.scrollY;

			const shouldShowDiv = scrollPosition > 250;

			setDisplayContent(shouldShowDiv);
		};

		window.addEventListener("scroll", handleScroll);

		setTimeout(() => {
			dispatch(setLoading(false), 800);
		});

		return () => {
			dispatch(setLoginFormDisplayed(false));
			window.removeEventListener("scroll", handleScroll);
		};
	}, []);

	return (
		<div className="Home">
			{loading && (
				<div className="home-loader-container">
					<Loader />
				</div>
			)}
			<img
				className="landing-page-image"
				src={require("../../images/landing_page_image.jpg")}
				alt=""
			/>
			<div className="shade"></div>

			<div className="home-header-container">
				<Header />
			</div>

			{loginFormDisplayed && <Login />}

			<Impression />

			<div
				className={`components-container ${displayContent ? "visible" : ""}`}
			>
				<Cards />
				{popular.length > 0 && <Popular />}
				<Testimonials />
				<Footer />
			</div>
		</div>
	);
};

export default Home;

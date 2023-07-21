import React, { useEffect, useState } from "react";
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
import { setLoginFormDisplayed, setUser } from "../../slices/common-slice";

// importing services
import { getCurrentUser } from "../../services/api-calls";

const Home = () => {
	const dispatch = useDispatch();
	const { loginFormDisplayed } = useSelector((state) => state.common);

	const [displayContent, setDisplayContent] = useState(false);

	useEffect(() => {
		currentUserHandler();

		const handleScroll = () => {
			const scrollPosition = window.scrollY;

			const shouldShowDiv = scrollPosition > 250;

			setDisplayContent(shouldShowDiv);
		};

		// Add the event listener to the scroll event
		window.addEventListener("scroll", handleScroll);

		return () => {
			dispatch(setLoginFormDisplayed(false));
			window.removeEventListener("scroll", handleScroll);
		};
	}, []);

	useEffect(() => {}, []);

	const currentUserHandler = async () => {
		try {
			const data = await getCurrentUser();

			if (data !== null) dispatch(setUser(data));
		} catch (error) {
			console.log({ error });
		}
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

			<div
				className={`components-container ${displayContent ? "visible" : ""}`}
			>
				<Cards />
				<Popular />
				<Testimonials />
				<Footer />
			</div>
		</div>
	);
};

export default Home;

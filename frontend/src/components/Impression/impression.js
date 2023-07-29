import React from "react";
import "./_impression.scss";

// importing components
import SearchBar from "../Search-Bar/search_bar";

const Impression = () => {
	return (
		<div className="impression-container">
			<h2 className="impression-header">FIND A PERFECT DREAM HOUSE</h2>

			<div className="impression-search-bar-container">
				<SearchBar />
			</div>

			<p className="catchy-sentence">
				Ethereum-powered real estate: limitless potential, seamless
				transactions!
			</p>
		</div>
	);
};

export default Impression;

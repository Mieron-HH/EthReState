import React from "react";
import "./_search.scss";

const Search = () => {
	return (
		<div className="search-container">
			<h2 className="search-header">FIND A PERFECT DREAM HOUSE</h2>

			<div className="input-group">
				<input
					className="text-input"
					type="text"
					placeholder="Your zip code or city. e.g New York"
				/>

				<button className="search-button" type="button">
					Search
				</button>
			</div>

			<p className="catchy-sentence">
				Ethereum-powered real estate: limitless potential, seamless
				transactions!
			</p>
		</div>
	);
};

export default Search;

import React from "react";
import "./_search_bar_large.scss";

// importing components
import SearchBar from "../Search-Bar/search_bar";
import SearchAdjuster from "../Search-Adjuster/search_adjuster";

const SearchBarLarge = () => {
	return (
		<div className="search-bar-large-container">
			<SearchBar backgroundColor="#ddd" height="53%" />

			<SearchAdjuster height="45%" />
		</div>
	);
};

export default SearchBarLarge;

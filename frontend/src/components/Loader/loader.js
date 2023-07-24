import React from "react";
import "./_loader.scss";
import spinner from "../../images/spinner.gif";

const Loader = () => {
	return (
		<div className="loader-container">
			<img className="spinner" src={spinner} alt="spinner" />
		</div>
	);
};

export default Loader;

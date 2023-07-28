import React, { useEffect } from "react";
import "./_popular.scss";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Scrollbar, A11y } from "swiper";
import "swiper/css/bundle";

// importing components
import Property from "../Property/property";

const Popular = () => {
	const navigate = useNavigate();

	const { popular } = useSelector((state) => state.properties);

	return (
		<div className="popular-container">
			<div className="popular-header">
				<h1>POPULAR PROPERTIES</h1>

				<button type="button" onClick={() => navigate("/properties")}>
					View all properties
				</button>
			</div>

			<Swiper
				className="popular-carousel"
				modules={[Navigation, Pagination, Scrollbar, A11y]}
				spaceBetween={15}
				slidesPerView={3}
				effect={"fade"}
				loop={true}
				navigation={true}
				pagination={{ clickable: true }}
				onSlideChange={() => {}}
				onSwiper={(swiper) => {}}
			>
				{popular.length > 0 &&
					popular.map((property) => {
						return (
							<SwiperSlide key={property.id} className="popular-carousel-item">
								<Property property={property} width="100%" height="100%" />
							</SwiperSlide>
						);
					})}
			</Swiper>
		</div>
	);
};

export default Popular;

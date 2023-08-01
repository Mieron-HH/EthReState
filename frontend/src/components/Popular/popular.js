import React from "react";
import "./_popular.scss";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Scrollbar, A11y } from "swiper";
import "swiper/css/bundle";

// importing components
import PropertyCard from "../Property-Card/property_card";

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
								<PropertyCard property={property} width="100%" height="100%" />
							</SwiperSlide>
						);
					})}
			</Swiper>
		</div>
	);
};

export default Popular;

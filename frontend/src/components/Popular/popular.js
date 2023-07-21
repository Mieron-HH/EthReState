import React from "react";
import "./_popular.scss";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Scrollbar, A11y } from "swiper";
import "swiper/css/bundle";
import { BiHeart } from "react-icons/bi";

const Popular = () => {
	return (
		<div className="popular-container">
			<div className="popular-header">
				<h1>POPULAR PROPERTIES</h1>

				<button type="button">View all properties</button>
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
				<SwiperSlide className="popular-carousel-item">
					<img
						className="popular-carousel-image"
						src={require("../../images/houses/house_1.jpg")}
						alt=""
					/>

					<div className="heart-container">
						<BiHeart className="icon" />
					</div>

					<div className="popular-carousel-info"></div>
				</SwiperSlide>
				<SwiperSlide className="popular-carousel-item">
					<img
						className="popular-carousel-image"
						src={require("../../images/houses/house_2.jpg")}
						alt=""
					/>

					<div className="heart-container">
						<BiHeart className="icon" />
					</div>

					<div className="popular-carousel-info"></div>
				</SwiperSlide>
				<SwiperSlide className="popular-carousel-item">
					<img
						className="popular-carousel-image"
						src={require("../../images/houses/house_3.jpg")}
						alt=""
					/>

					<div className="heart-container">
						<BiHeart className="icon" />
					</div>

					<div className="popular-carousel-info"></div>
				</SwiperSlide>
				<SwiperSlide className="popular-carousel-item">
					<img
						className="popular-carousel-image"
						src={require("../../images/houses/house_4.jpg")}
						alt=""
					/>

					<div className="heart-container">
						<BiHeart className="icon" />
					</div>

					<div className="popular-carousel-info"></div>
				</SwiperSlide>
				<SwiperSlide className="popular-carousel-item">
					<img
						className="popular-carousel-image"
						src={require("../../images/houses/house_5.jpg")}
						alt=""
					/>

					<div className="heart-container">
						<BiHeart className="icon" />
					</div>

					<div className="popular-carousel-info"></div>
				</SwiperSlide>
				<SwiperSlide className="popular-carousel-item">
					<img
						className="popular-carousel-image"
						src={require("../../images/houses/house_6.jpg")}
						alt=""
					/>

					<div className="heart-container">
						<BiHeart className="icon" />
					</div>

					<div className="popular-carousel-info"></div>
				</SwiperSlide>
			</Swiper>
		</div>
	);
};

export default Popular;

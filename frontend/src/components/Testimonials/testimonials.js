import React from "react";
import "./_testimonials.scss";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Scrollbar, A11y } from "swiper";
import "swiper/css/bundle";

const Testimonials = () => {
	return (
		<div className="testimonials-container">
			<div className="testimonials-header">
				<h1>TESTIMONIALS</h1>
			</div>

			<Swiper
				className="testimonials-carousel"
				modules={[Navigation, Pagination, Scrollbar, A11y]}
				spaceBetween={50}
				slidesPerView={3}
				effect={"fade"}
				loop={true}
				navigation={true}
				pagination={{ clickable: true }}
				onSlideChange={() => {}}
				onSwiper={(swiper) => {}}
			>
				<SwiperSlide className="testimonials-carousel-item">
					<img
						className="testimonials-carousel-image"
						src={require("../../images/testimonials/testimonials_1.jpg")}
						alt=""
					/>

					<div className="testimonials-carousel-info">
						<div className="author-name">Davin Smith</div>

						<div className="author-testimony">
							“Far far away, behind the word mountains, far from the countries
							Vokalia and Consonantia, there live the blind texts. Separated
							they live in Bookmarksgrove right at the coast of the Semantics, a
							large language ocean.”
						</div>

						<div className="author-position">Designer, Co Founder</div>
					</div>
				</SwiperSlide>

				<SwiperSlide className="testimonials-carousel-item">
					<img
						className="testimonials-carousel-image"
						src={require("../../images/testimonials/testimonials_2.jpg")}
						alt=""
					/>

					<div className="testimonials-carousel-info">
						<div className="author-name">Samuel Jackson</div>

						<div className="author-testimony">
							“Far far away, behind the word mountains, far from the countries
							Vokalia and Consonantia, there live the blind texts. Separated
							they live in Bookmarksgrove right at the coast of the Semantics, a
							large language ocean.”
						</div>

						<div className="author-position">Designer, Co Founder</div>
					</div>
				</SwiperSlide>

				<SwiperSlide className="testimonials-carousel-item">
					<img
						className="testimonials-carousel-image"
						src={require("../../images/testimonials/testimonials_3.jpg")}
						alt=""
					/>

					<div className="testimonials-carousel-info">
						<div className="author-name">Edward Anthony</div>

						<div className="author-testimony">
							“Far far away, behind the word mountains, far from the countries
							Vokalia and Consonantia, there live the blind texts. Separated
							they live in Bookmarksgrove right at the coast of the Semantics, a
							large language ocean.”
						</div>

						<div className="author-position">Designer, Co Founder</div>
					</div>
				</SwiperSlide>

				<SwiperSlide className="testimonials-carousel-item">
					<img
						className="testimonials-carousel-image"
						src={require("../../images/testimonials/testimonials_4.jpg")}
						alt=""
					/>

					<div className="testimonials-carousel-info">
						<div className="author-name">Jackob Brian</div>

						<div className="author-testimony">
							“Far far away, behind the word mountains, far from the countries
							Vokalia and Consonantia, there live the blind texts. Separated
							they live in Bookmarksgrove right at the coast of the Semantics, a
							large language ocean.”
						</div>

						<div className="author-position">Designer, Co Founder</div>
					</div>
				</SwiperSlide>

				<SwiperSlide className="testimonials-carousel-item">
					<img
						className="testimonials-carousel-image"
						src={require("../../images/testimonials/testimonials_5.jpg")}
						alt=""
					/>

					<div className="testimonials-carousel-info">
						<div className="author-name">Britney James</div>

						<div className="author-testimony">
							“Far far away, behind the word mountains, far from the countries
							Vokalia and Consonantia, there live the blind texts. Separated
							they live in Bookmarksgrove right at the coast of the Semantics, a
							large language ocean.”
						</div>

						<div className="author-position">Designer, Co Founder</div>
					</div>
				</SwiperSlide>

				<SwiperSlide className="testimonials-carousel-item">
					<img
						className="testimonials-carousel-image"
						src={require("../../images/testimonials/testimonials_6.jpg")}
						alt=""
					/>

					<div className="testimonials-carousel-info">
						<div className="author-name">Christina Alexander</div>

						<div className="author-testimony">
							“Far far away, behind the word mountains, far from the countries
							Vokalia and Consonantia, there live the blind texts. Separated
							they live in Bookmarksgrove right at the coast of the Semantics, a
							large language ocean.”
						</div>

						<div className="author-position">Designer, Co Founder</div>
					</div>
				</SwiperSlide>
			</Swiper>
		</div>
	);
};

export default Testimonials;

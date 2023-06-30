import React from "react";
import "./_footer.scss";
import {
	FaDribbble,
	FaFacebookF,
	FaInstagram,
	FaLinkedinIn,
	FaPinterest,
	FaTwitter,
} from "react-icons/fa";

const Footer = () => {
	return (
		<div className="footer-container">
			<div className="footer-header">
				<h2 className="footer-text">
					Be a part of our growing real state agents
				</h2>

				<button type="button">Apply for real estate agent</button>
			</div>

			<div className="footer-links">
				<div className="links-container">
					<div className="links-header">CONTACT</div>

					<address>43 Raymouth Rd. Baltemoer, London 3910</address>

					<ul className="links-content">
						<li>
							<a href="tel://11234567890">+1(123)-456-7890</a>
						</li>
						<li>
							<a href="tel://11234567890">+1(123)-456-7890</a>
						</li>
						<li>
							<a href="mailto:info@mydomain.com">info@mydomain.com</a>
						</li>
					</ul>
				</div>

				<div className="links-container">
					<div className="links-header">SOURCES</div>
					<div className="links-inner-container">
						<ul className="links-content">
							<li>
								<a href="/">About us</a>
							</li>
							<li>
								<a href="/">Services</a>
							</li>
							<li>
								<a href="/">Vision</a>
							</li>
							<li>
								<a href="/">Mission</a>
							</li>
							<li>
								<a href="/">Terms</a>
							</li>
							<li>
								<a href="/">Privacy</a>
							</li>
						</ul>

						<ul className="links-content">
							<li>
								<a href="/">Partners</a>
							</li>
							<li>
								<a href="/">Business</a>
							</li>
							<li>
								<a href="/">Careers</a>
							</li>
							<li>
								<a href="/">Blog</a>
							</li>
							<li>
								<a href="/">FAQ</a>
							</li>
							<li>
								<a href="/">Creative</a>
							</li>
						</ul>
					</div>
				</div>

				<div className="links-container">
					<div className="links-header">LINKS</div>

					<ul className="links-content">
						<li>
							<a href="/">Our Vision</a>
						</li>
						<li>
							<a href="/">About us</a>
						</li>
						<li>
							<a href="/">Contact us</a>
						</li>
					</ul>

					<div className="links-SM">
						<div className="SM-item">
							<FaInstagram className="SM-item-icon" color="#555" />
						</div>

						<div className="SM-item">
							<FaTwitter className="SM-item-icon" color="#555" />
						</div>

						<div className="SM-item">
							<FaFacebookF className="SM-item-icon" color="#555" />
						</div>

						<div className="SM-item">
							<FaLinkedinIn className="SM-item-icon" color="#555" />
						</div>

						<div className="SM-item">
							<FaPinterest className="SM-item-icon" color="#555" />
						</div>

						<div className="SM-item">
							<FaDribbble className="SM-item-icon" color="#555" />
						</div>
					</div>
				</div>
			</div>

			<div className="footer-copyright">
				Copyright ©2023 All rights reserved
			</div>
		</div>
	);
};

export default Footer;

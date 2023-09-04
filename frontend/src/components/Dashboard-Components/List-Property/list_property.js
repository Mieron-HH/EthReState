import React, { useContext, useEffect, useRef, useState } from "react";
import "./_list_property.scss";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { ContextValues } from "../../../App";
import Cookies from "js-cookie";
import ethereumLoader from "../../../images/ethereum_loader.gif";
import GreenCheckMark from "../../../images/green_check_mark.gif";

// imporging icons
import {
	BiBed,
	BiBath,
	BiPlus,
	BiPlusCircle,
	BiSolidRightArrow,
	BiX,
} from "react-icons/bi";
import { BsHouseFill } from "react-icons/bs";
import { RiNftFill } from "react-icons/ri";

// importing actions
import { setSigner } from "../../../slices/config-slice";
import { setLoading } from "../../../slices/common-slice";
import {
	setStreet,
	setCity,
	setStateEntry,
	setZipCode,
	setBedroomNumber,
	setBathroomNumber,
	setPrice,
	setDownPayment,
	setSize,
	resetPropertySlice,
	setListingContentDisplayed,
	setListingProgress,
	setSelectedProperty,
} from "../../../slices/property-slice";

// importing services
import { createProperty } from "../../../services/api-calls";
import { stateAbbreviations } from "../../../services/variables";

const web3 = require("web3");

const ListProperty = () => {
	const dispatch = useDispatch();

	const { rethState } = useContext(ContextValues);
	const { provider, signer } = useSelector((state) => state.config);
	const PostData = useRef(new FormData());
	const {
		street,
		city,
		stateEntry,
		zipCode,
		bedroomNumber,
		bathroomNumber,
		price,
		downPayment,
		size,
		listingContentDisplayed,
		listingProgress,
		selectedProperty,
	} = useSelector((state) => state.properties);
	const [error, setError] = useState("");
	const [progressLevel, setProgressLevel] = useState(2);
	const [thumbnailImage, setThumbnailImages] = useState(null);
	const [propertyImages, setPropertyImages] = useState([null]);
	const [submitEnabled, setSubmitEnabled] = useState(false);
	const [stateSuggestions, setStateSuggestions] = useState([]);
	const [displayStateSuggestions, setDisplayStateSuggestions] = useState(false);
	const [successfullyMinted, setSuccessfullyMinted] = useState(false);
	const [loadingMessage, setLoadingMessage] = useState("");
	const [arrowsArray, setArrowsArray] = useState([]);

	useEffect(() => {
		dispatch(resetPropertySlice());
		dispatch(setBedroomNumber("1"));
		dispatch(setBathroomNumber("1"));

		if (!selectedProperty) dispatch(setListingContentDisplayed("create"));

		setTimeout(() => {
			dispatch(setLoading(false));
		}, 800);

		if (Cookies.get("signer")) {
			const signer = JSON.parse(Cookies.get("signer"));
			dispatch(setSigner(signer));
		}

		return () => {
			dispatch(resetPropertySlice());
		};
	}, []);

	useEffect(() => {
		updateProgress();
	}, [propertyImages, thumbnailImage]);

	useEffect(() => {
		const intervalId = setInterval(() => {
			if (arrowsArray.length === 5) setArrowsArray([]);
			else
				setArrowsArray((array) => [
					...array,
					<BiSolidRightArrow
						className={`icon ${
							listingContentDisplayed === "mint" ? "mint" : "list"
						}`}
					/>,
				]);
		}, 350);

		return () => {
			clearInterval(intervalId);
		};
	}, [arrowsArray]);

	const updateProgress = () => {
		let updated_level = 2;

		if (street !== "") updated_level++;
		if (city !== "") updated_level++;
		if (stateEntry !== "") updated_level++;
		if (zipCode !== "") updated_level++;
		if (thumbnailImage !== null) updated_level++;
		if (propertyImages.filter((picture) => picture !== null).length >= 3)
			updated_level++;
		if (price !== "" && price !== "0") updated_level++;
		if (size !== "" && size !== "0") updated_level++;

		if (updated_level === 10) setSubmitEnabled(true);
		else setSubmitEnabled(false);

		setProgressLevel(updated_level);
	};

	const inputGroupDiv = ({
		label = "",
		smallLabel = "",
		type = "text",
		placeholder = "",
		width = "100%",
		height = "60px",
		marginTop = "0",
		maxChar = 100,
		state = null,
		setState = null,
	}) => {
		return state !== null && setState !== null ? (
			<div
				className="input-group"
				style={{ width, minHeight: height, marginTop }}
			>
				<div className="input-label">
					{label} <small>{smallLabel}</small>
				</div>

				<input
					className="input-item"
					type="text"
					value={state}
					onChange={(e) => {
						if (type === "number") {
							if (/^[0-9]*(\.[0-9]*)?$/.test(e.target.value))
								dispatch(setState(e.target.value));
							else dispatch(setState(""));
						} else dispatch(setState(e.target.value.toUpperCase()));
					}}
					onBlur={() => updateProgress()}
					maxLength={maxChar}
					placeholder={placeholder}
				/>
			</div>
		) : (
			<></>
		);
	};

	const inputCounterDiv = ({ state = null, setState = null }) => {
		return (
			<div className="input-counter">
				<div
					className="counter-button decrement"
					onClick={() => {
						if (state > 1) dispatch(setState(parseInt(state) - 1));
					}}
				>
					-
				</div>
				<div className="counter-number">{state}</div>
				<div
					className="counter-button increment"
					onClick={() => dispatch(setState(parseInt(state) + 1))}
				>
					+
				</div>
			</div>
		);
	};

	const handleStateChange = (event) => {
		const value = event.target.value.toLowerCase().trim();
		dispatch(setStateEntry(value.toUpperCase()));
		setDisplayStateSuggestions(true);

		setStateSuggestions(
			Object.values(stateAbbreviations)
				.filter((state) => value !== "" && state.toLowerCase().includes(value))
				.map((state) => (
					<li
						key={state}
						className="state-item"
						onClick={() => {
							dispatch(setStateEntry(state));
							setDisplayStateSuggestions(false);
							updateProgress();
						}}
					>
						{state}
					</li>
				))
		);
	};

	const addPictureUploader = () => {
		setPropertyImages((prevPictures) => [...prevPictures, null]);
		uploadPropertyPicture();
	};

	const removePictureUploader = (index = -1) => {
		if (index >= 0)
			setPropertyImages((prevPictures) => {
				const newPictures = [...prevPictures];
				const removedImage = newPictures.splice(index, 1)[0];

				if (removedImage) {
					const formDataEntries = PostData.current.getAll("propertyImage");

					for (let i = 0; i < formDataEntries.length; i++) {
						if (formDataEntries[i].name === removedImage.name) {
							PostData.current.delete("propertyImage", formDataEntries[i]);
							break;
						}
					}
				}
				updateProgress();

				return newPictures;
			});
		else {
			PostData.current.delete("thumbnailImage");
			setThumbnailImages(null);
		}
	};

	const uploadPropertyPicture = () => {
		const fileInput = document.createElement("input");
		fileInput.type = "file";
		fileInput.accept = "image/*";
		fileInput.addEventListener("change", handlePropertyPictureSelect);
		fileInput.click();
	};

	const uploadThumbnailPicture = () => {
		const fileInput = document.createElement("input");
		fileInput.type = "file";
		fileInput.accept = "image/*";
		fileInput.addEventListener("change", handleThumbnailPictureSelect);
		fileInput.click();
	};

	const handlePropertyPictureSelect = (event) => {
		const fileInput = event.target;

		if (event.target.files.length === 0) return;

		const file = event.target.files[0];
		dispatch(setLoading(true));

		if (file) {
			PostData.current.append("propertyImage", file);

			const reader = new FileReader();
			reader.onloadend = () => {
				setPropertyImages((prevPictures) => {
					const newPictures = [...prevPictures];

					newPictures[prevPictures.length - 1] = {
						name: file.name,
						data: reader.result,
					};

					updateProgress();

					return newPictures;
				});

				setTimeout(() => {
					dispatch(setLoading(false));
				}, 500);
			};
			reader.readAsDataURL(file);
		} else {
			dispatch(setLoading(false));
		}
	};

	const handleThumbnailPictureSelect = (event) => {
		const fileInput = event.target;

		if (event.target.files.length === 0) return;

		const file = event.target.files[0];
		dispatch(setLoading(true));

		if (file) {
			PostData.current.append("thumbnailImage", file);

			const reader = new FileReader();
			reader.onloadend = () => {
				updateProgress();

				setTimeout(() => {
					dispatch(setLoading(false));
					setThumbnailImages(reader.result);
				}, 500);
			};
			reader.readAsDataURL(file);
		} else {
			dispatch(setLoading(false));
		}
	};

	const handlePropertyCreation = async () => {
		setLoadingMessage("Creating Property...");
		dispatch(setListingContentDisplayed("loader"));

		if (signer === null) {
			setError("Connect wallet first");
			dispatch(setLoading(false));

			return;
		}

		PostData.current.append("owner", signer.address);
		PostData.current.append("street", street);
		PostData.current.append("city", city);
		PostData.current.append("state", stateEntry);
		PostData.current.append("zipCode", zipCode);
		PostData.current.append("size", size);
		PostData.current.append("bedroomNumber", bedroomNumber);
		PostData.current.append("bathroomNumber", bathroomNumber);
		PostData.current.append("price", price);
		PostData.current.append(
			"downPayment",
			downPayment === "" ? "0" : downPayment
		);

		const { data, error } = await createProperty(PostData.current);
		setError(error);

		if (data) {
			dispatch(setListingProgress(1));
			dispatch(setSelectedProperty(data));
			dispatch(setListingContentDisplayed("mint"));
		} else if (error !== "") dispatch(setListingContentDisplayed("create"));
	};

	const mintPropertyNFT = async () => {
		setLoadingMessage("Minting Property NFT...");
		dispatch(setListingContentDisplayed("loader"));
		const signer = await provider.getSigner();

		try {
			let transaction = await rethState
				.connect(signer)
				.mint(selectedProperty.metadata.url);

			const transactionResult = await transaction.wait();
			const receipt = await provider.getTransactionReceipt(
				transactionResult.hash
			);
			const tokenID = web3.utils.hexToNumber(receipt.logs[0].topics[3]);
			console.log({ tokenID });

			await axios
				.post(
					process.env.REACT_APP_BASE_URL + "/property/mint",
					{
						propertyID: selectedProperty._id,
						tokenID,
					},
					{ withCredentials: true }
				)
				.then(() => {
					setLoadingMessage("Successfully Minted");
					setSuccessfullyMinted(true);
					setTimeout(() => {
						dispatch(setListingProgress(2));
						dispatch(setListingContentDisplayed("list"));
					}, 2000);
				})
				.catch((err) => {
					setError("Error minting property NFT");
					dispatch(setListingContentDisplayed("create"));
					console.log({ err });
				});
		} catch (error) {
			setError("Error minting property NFT");
			dispatch(setListingContentDisplayed("create"));
			console.log({ error });
		}
	};

	const listProperty = async () => {
		setLoadingMessage("Listing Property...");
		dispatch(setListingContentDisplayed("loader"));
		const signer = await provider.getSigner();

		try {
			let transaction = await rethState.connect();
		} catch (error) {
			setError("Error listing property");
			dispatch(setListingContentDisplayed("create"));
			console.log({ error });
		}
	};

	const renderArrow = () => {
		return arrowsArray.map((arrow, index) => {
			return (
				<div key={index} className="arrow">
					{arrow}
				</div>
			);
		});
	};

	return (
		<div className="list">
			{listingContentDisplayed !== "create" && (
				<div className="listing-progress-indicator">
					<div className={`progress ${listingProgress > 0 && "reached"}`}></div>
					<div
						className={`progress-line ${listingProgress > 1 && "reached"}`}
					></div>

					<div className={`progress ${listingProgress > 1 && "reached"}`}></div>
					<div
						className={`progress-line ${listingProgress > 2 && "reached"}`}
					></div>

					<div className={`progress ${listingProgress > 2 && "reached"}`}></div>
				</div>
			)}

			{listingContentDisplayed === "loader" && (
				<div className="list-loader-container">
					<div className="loading-message">{loadingMessage}</div>

					{successfullyMinted ? (
						<img
							className="loader-gif larger"
							src={GreenCheckMark}
							alt="Successfully Minted"
						/>
					) : (
						<img
							className="loader-gif"
							src={ethereumLoader}
							alt="Ethereum Loader"
						/>
					)}
				</div>
			)}

			{listingContentDisplayed === "mint" && (
				<div className="mint-transfer-nft-container">
					<div className="instruction-container">
						<div className="icon-container">
							<BsHouseFill className="icon mint" />
						</div>

						<div className="arrows-container">{renderArrow()}</div>

						<div className="icon-container">
							<RiNftFill className="icon mint" />
						</div>
					</div>

					<div className="button mint" onClick={mintPropertyNFT}>
						Mint Property
					</div>
				</div>
			)}

			{listingContentDisplayed === "list" && (
				<div className="mint-transfer-nft-container">
					<div className="instruction-container">
						<div className="icon-container">
							<RiNftFill className="icon transfer" />
						</div>

						<div className="arrows-container">{renderArrow()}</div>

						<div className="logo-container">
							<img className="logo" src={require("../../../images/Logo.png")} />
						</div>
					</div>

					<div className="button transfer">List Property</div>
				</div>
			)}

			{listingContentDisplayed === "create" && (
				<div className="content-container">
					<div
						className="progress-indicator"
						style={{ width: `${10 * progressLevel}%` }}
					></div>

					<div className="form-container">
						<div className="error-message">{error}</div>

						{inputGroupDiv({
							label: "street",
							placeholder: "104 Elm St.",
							marginTop: "0",
							state: street,
							setState: setStreet,
						})}

						<div className="input-group-container">
							{inputGroupDiv({
								label: "city",
								placeholder: "San Jose",
								width: "40%",
								height: "100%",
								state: city,
								setState: setCity,
							})}

							<div
								className="input-group"
								style={{ width: "20%", minHeight: "100%" }}
							>
								<div className="input-label">State</div>

								<input
									className="input-item"
									type="text"
									value={stateEntry}
									onChange={handleStateChange}
									onBlur={() => {
										setDisplayStateSuggestions(false);
										updateProgress();
									}}
									maxLength={2}
									placeholder="CA"
								/>

								{displayStateSuggestions && stateSuggestions.length > 0 && (
									<ul className="states-list" value={stateEntry}>
										{stateSuggestions}
									</ul>
								)}
							</div>

							{inputGroupDiv({
								label: "zip code",
								type: "number",
								placeholder: "95281",
								width: "30%",
								height: "100%",
								maxChar: 5,
								state: zipCode,
								setState: setZipCode,
							})}
						</div>

						{inputGroupDiv({
							label: "Size",
							smallLabel: "(in sqft)",
							type: "number",
							placeholder: "450",
							marginTop: "20px",
							state: size,
							setState: setSize,
						})}

						<div className="input-group-container">
							<div
								className="input-group"
								style={{ width: "30%", height: "100%", alignItems: "center" }}
							>
								<div className="input-icon">
									<BiBed />
								</div>

								{inputCounterDiv({
									state: bedroomNumber,
									setState: setBedroomNumber,
								})}
							</div>

							<div
								className="input-group"
								style={{ width: "30%", height: "100%", alignItems: "center" }}
							>
								<div className="input-icon">
									<BiBath />
								</div>

								{inputCounterDiv({
									state: bathroomNumber,
									setState: setBathroomNumber,
								})}
							</div>
						</div>

						<div
							className="input-group-container"
							style={{ marginTop: "30px" }}
						>
							{inputGroupDiv({
								label: "Price",
								smallLabel: "(in ETH)",
								type: "number",
								placeholder: "50",
								width: "40%",
								state: price,
								setState: setPrice,
							})}

							{inputGroupDiv({
								label: "Down Payment",
								smallLabel: "(in ETH) optional",
								type: "number",
								placeholder: "20",
								width: "50%",
								state: downPayment,
								setState: setDownPayment,
							})}
						</div>

						<div className="thumbnail-container">
							<div className="input-label">Thumbnail Picture</div>

							<div className="picture-uploader">
								{thumbnailImage ? (
									<div className="picture-preview-container">
										<img
											src={thumbnailImage}
											alt="Thumbnail Picture"
											className="picture-preview"
										/>
										<BiX
											className="remove-picture-icon"
											title="Remove picture"
											onClick={removePictureUploader}
										/>
									</div>
								) : (
									<div
										className="add-picture-icon"
										onClick={uploadThumbnailPicture}
									>
										<BiPlus className="icon" title="Add picture" />
									</div>
								)}
							</div>
						</div>

						<div className="property-pictures-container">
							<div className="input-label">
								Property Pictures <small>(minimum 3 pictures required)</small>
							</div>

							<div className="property-pictures">
								<div className="picture-uploader" style={{ marginTop: "10px" }}>
									{propertyImages[0] ? (
										<div className="picture-preview-container">
											<img
												src={propertyImages[0].data}
												alt={`Picture ${1}`}
												className="picture-preview"
											/>
											<BiX
												className="remove-picture-icon"
												title="Remove picture"
												onClick={() => removePictureUploader(0)}
											/>
										</div>
									) : (
										<div
											className="add-picture-icon"
											onClick={uploadPropertyPicture}
										>
											<BiPlus className="icon" title="Add picture" />
										</div>
									)}
								</div>

								{propertyImages.map((picture, index) => {
									if (index === 0) return null;

									return (
										<div
											className="picture-uploader"
											style={{ marginTop: "10px" }}
											key={index}
										>
											{picture ? (
												<div className="picture-preview-container">
													<img
														src={picture.data}
														alt={`Picture ${index + 1}`}
														className="picture-preview"
													/>
													<BiX
														className="remove-picture-icon"
														title="Remove picture"
														onClick={() => removePictureUploader(index)}
													/>
												</div>
											) : (
												<div
													className="add-picture-icon"
													onClick={uploadPropertyPicture}
												>
													<BiPlus className="icon" title="Add picture" />
												</div>
											)}
										</div>
									);
								})}

								{propertyImages.length < 20 &&
									propertyImages[propertyImages.length - 1] !== null && (
										<div
											className="add-picture-uploader"
											onClick={addPictureUploader}
										>
											<BiPlusCircle className="icon" title="Add more picture" />
										</div>
									)}
							</div>
						</div>
					</div>

					<div className="submit-button-container">
						<button
							type="button"
							className="submit-button"
							style={{ opacity: submitEnabled ? 1 : 0.5 }}
							disabled={!submitEnabled}
							onClick={handlePropertyCreation}
						>
							Create Property
						</button>
					</div>
				</div>
			)}
		</div>
	);
};

export default ListProperty;

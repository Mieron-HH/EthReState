import React, { useEffect, useRef, useState } from "react";
import "./_publish.scss";
import { useDispatch, useSelector } from "react-redux";
import Cookies from "js-cookie";
import { BiBed, BiBath, BiPlus, BiPlusCircle, BiX } from "react-icons/bi";

// importing components
import Loader from "../../components/Loader/loader";

// importing actions
import { setSigner } from "../../slices/config-slice";

// importing services
import { publishProperty } from "../../services/api-calls";

const Publish = () => {
	const dispatch = useDispatch();
	const PostData = useRef(new FormData());

	const { signer } = useSelector((state) => state.config);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");
	const [progressLevel, setProgressLevel] = useState(2);
	const [street, setStreet] = useState("");
	const [city, setCity] = useState("");
	const [stateEntry, setStateEntry] = useState("");
	const [size, setSize] = useState("");
	const [bedroomNumber, setBedroomNumber] = useState(1);
	const [bathroomNumber, setBathroomNumber] = useState(1);
	const [thumbnailImage, setThumbnailImages] = useState(null);
	const [propertyImages, setPropertyImages] = useState([null]);
	const [price, setPrice] = useState("");
	const [submitEnabled, setSubmitEnabled] = useState(false);

	useEffect(() => {
		if (Cookies.get("signer")) {
			const signer = JSON.parse(Cookies.get("signer"));
			dispatch(setSigner(signer));
		}
	}, []);

	useEffect(() => {
		updateProgress();
	}, [propertyImages, thumbnailImage]);

	const updateProgress = () => {
		let updated_level = 2;

		if (street !== "") updated_level++;
		if (city !== "") updated_level++;
		if (stateEntry !== "") updated_level++;
		if (thumbnailImage !== null) updated_level++;
		if (propertyImages.filter((picture) => picture !== null).length >= 3)
			updated_level++;
		if (price !== "" && price !== "0") updated_level++;
		if (size !== "" && size !== "0") updated_level++;

		if (updated_level === 9) setSubmitEnabled(true);
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
								setState(e.target.value);
							else setState("");
						} else setState(e.target.value.toUpperCase());
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
						if (state > 1) setState(state - 1);
					}}
				>
					-
				</div>
				<div className="counter-number">{state}</div>
				<div
					className="counter-button increment"
					onClick={() => setState(state + 1)}
				>
					+
				</div>
			</div>
		);
	};

	const addPictureUploader = () => {
		setPropertyImages((prevPictures) => [...prevPictures, null]);
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
		setLoading(true);
	};

	const uploadThumbnailPicture = () => {
		const fileInput = document.createElement("input");
		fileInput.type = "file";
		fileInput.accept = "image/*";
		fileInput.addEventListener("change", handleThumbnailPictureSelect);
		fileInput.click();
		setLoading(true);
	};

	const handlePropertyPictureSelect = (event) => {
		const file = event.target.files[0];

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
					setLoading(false);
				}, 1000);
			};
			reader.readAsDataURL(file);
		} else {
			setLoading(false);
		}
	};

	const handleThumbnailPictureSelect = (event) => {
		const file = event.target.files[0];

		if (file) {
			PostData.current.append("thumbnailImage", file);

			const reader = new FileReader();
			reader.onloadend = () => {
				updateProgress();

				setTimeout(() => {
					setLoading(false);
					setThumbnailImages(reader.result);
				}, 1000);
			};
			reader.readAsDataURL(file);
		} else {
			setLoading(false);
		}
	};

	const handlePublish = async () => {
		setLoading(true);

		if (signer === null) {
			setError("Connect wallet first");
			setLoading(false);

			return;
		}

		PostData.current.append("owner", signer.address);
		PostData.current.append("street", street);
		PostData.current.append("city", city);
		PostData.current.append("state", stateEntry);
		PostData.current.append("size", size);
		PostData.current.append("bedroomNumber", bedroomNumber);
		PostData.current.append("bathroomNumber", bathroomNumber);
		PostData.current.append("price", price);

		const { error } = await publishProperty(PostData.current);
		setError(error);

		setTimeout(() => {
			setLoading(false);
		}, 2000);
	};

	return (
		<div className="Publish">
			{loading && <Loader />}

			<div className="content-container">
				<div
					className="status-indicator"
					style={{ width: `${11.1112 * progressLevel}%` }}
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

						{inputGroupDiv({
							label: "state",
							placeholder: "CA",
							width: "40%",
							height: "100%",
							maxChar: 2,
							state: stateEntry,
							setState: setStateEntry,
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

					{inputGroupDiv({
						label: "Price",
						smallLabel: "(in Eth)",
						type: "number",
						placeholder: "50",
						marginTop: "40px",
						state: price,
						setState: setPrice,
					})}

					<div
						className="submit-button-container"
						style={{ opacity: submitEnabled ? 1 : 0.5 }}
					>
						<button
							type="button"
							className="submit-button"
							disabled={!submitEnabled}
							onClick={handlePublish}
						>
							Publish
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Publish;

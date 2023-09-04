import React, { useEffect, useRef, useState } from "react";
import "./_selected_property.scss";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import LoadingPropertyImageGif from "../../../../images/loading-images.gif";

// importing icons
import { AiFillDelete } from "react-icons/ai";
import { BiSolidHeart, BiX } from "react-icons/bi";
import {
	BsEyeFill,
	BsHouseFill,
	BsHouseUpFill,
	BsPersonFillLock,
} from "react-icons/bs";
import { FaArrowLeft } from "react-icons/fa";
import { FiEdit3 } from "react-icons/fi";
import { GrAddCircle } from "react-icons/gr";
import { MdCelebration } from "react-icons/md";
import { RiNftFill } from "react-icons/ri";

// importing actions
import {
	addPropertyImage,
	changePropertyThumbnail,
	removePropertyImage,
	setListingContentDisplayed,
	setListingProgress,
	setSelectedProperty,
	setSelectedPropertyImages,
	setSelectedPropertyModified,
	setSelectedPropertyThumbnail,
} from "../../../../slices/property-slice";
import { setLoading } from "../../../../slices/common-slice";
import { setSelectedMenu } from "../../../../slices/dashboard-slice";

// importing helper functions
import { concatAddress } from "../../../../services/helpers";

const SellerPropertyDetail = () => {
	const dispatch = useDispatch();

	const {
		selectedProperty,
		selectedPropertyThumbnail,
		selectedPropertyImages,
		status,
	} = useSelector((state) => state.properties);
	const [fetchingPropertyImages, setFetchingPropertyImages] = useState(false);
	const [fetchingPropertyImagesError, setFetchingPropertyImagesError] =
		useState("");
	const PostData = useRef(new FormData());

	useEffect(() => {
		if (selectedProperty !== null) {
			console.log({ tokenId: selectedProperty.tokenId });
			dispatch(setLoading(false));
			dispatch(setSelectedPropertyThumbnail(selectedProperty.thumbnail));
			setFetchingPropertyImages(true);
			fetchPropertyImages();
		}
	}, []);

	useEffect(() => {
		if (["loading", "idle"].includes(status)) dispatch(setLoading(true));
		else dispatch(setLoading(false));
	}, [status]);

	const fetchPropertyImages = async () => {
		if (selectedProperty === null) return;

		await axios
			.post(
				process.env.REACT_APP_BASE_URL + "/property/getPropertyImages",
				{ propertyID: selectedProperty._id },
				{ withCredentials: true }
			)
			.then((response) => {
				dispatch(setSelectedPropertyImages(response.data.propertyImages));
				setFetchingPropertyImages(false);
			})
			.catch((error) => {
				setFetchingPropertyImages(false);
				setFetchingPropertyImagesError("Error fetching property images");

				console.log({ error });
			});
	};

	const renderPropertyStatus = (property) => {
		return (
			<>
				<div className="status active">
					<BsHouseFill className="icon" />
					Created
				</div>

				{selectedProperty.cancelled ? (
					<>
						<div
							className={`status-bar ${property.cancelled && "active"}`}
						></div>

						<div className={`status ${property.sold && "active"}`}>
							<AiFillDelete className="icon" />
							Deleted
						</div>
					</>
				) : (
					<>
						<div className={`status-bar ${property.minted && "active"}`}></div>

						<div className={`status ${property.minted && "active"}`}>
							<RiNftFill className="icon" />
							Minted
						</div>
						<div className={`status-bar ${property.listed && "active"}`}></div>

						<div className={`status ${property.listed && "active"}`}>
							<BsHouseUpFill className="icon" />
							Listed
						</div>

						<div className={`status-bar ${property.locked && "active"}`}></div>

						<div className={`status ${property.locked && "active"}`}>
							<BsPersonFillLock className="icon" />
							Locked
						</div>

						<div className={`status-bar ${property.sold && "active"}`}></div>

						<div className={`status ${property.sold && "active"}`}>
							<MdCelebration className="icon" />
							Sold
						</div>
					</>
				)}
			</>
		);
	};

	const changePropertyThumbnailHandler = () => {
		PostData.current.append("propertyID", selectedProperty._id);
		const fileInput = document.createElement("input");
		fileInput.type = "file";
		fileInput.accept = "image/*";
		fileInput.addEventListener("change", handlePropertyThumbnailSelect);
		fileInput.click();
	};

	const addPropertyImagelHandler = () => {
		PostData.current.append("propertyID", selectedProperty._id);
		const fileInput = document.createElement("input");
		fileInput.type = "file";
		fileInput.accept = "image/*";
		fileInput.addEventListener("change", handlePropertyImageSelect);
		fileInput.click();
	};

	const handlePropertyThumbnailSelect = (event) => {
		if (event.target.files.length === 0) return;

		const file = event.target.files[0];

		if (file) {
			PostData.current.append("thumbnailImage", file);
			dispatch(changePropertyThumbnail({ postdata: PostData.current }));
			dispatch(setSelectedPropertyModified(true));
			PostData.current = new FormData();

			const reader = new FileReader();
			reader.onloadend = () => {
				dispatch(
					setSelectedPropertyThumbnail({
						contentType: file.type,
						data: reader.result.split(",")[1],
					})
				);
			};
			reader.readAsDataURL(file);
		} else {
			dispatch(setLoading(false));
		}
	};

	const handlePropertyImageSelect = (event) => {
		if (event.target.files.length === 0) return;

		const file = event.target.files[0];

		if (file) {
			PostData.current.append("propertyImage", file);
			dispatch(addPropertyImage({ postdata: PostData.current }));
			dispatch(setSelectedPropertyModified(true));
			PostData.current = new FormData();

			const reader = new FileReader();
			reader.onloadend = () => {
				try {
					const newImage = {
						contentType: file.type,
						data: reader.result.split(",")[1],
					};

					const updatedImages = [...selectedPropertyImages, newImage];

					dispatch(setSelectedPropertyImages(updatedImages));
					dispatch(setSelectedPropertyModified(true));
				} catch (error) {
					console.error("Error while processing image:", error);
					dispatch(setLoading(false));
				}
			};
			reader.readAsDataURL(file);
		} else {
			dispatch(setLoading(false));
		}
	};

	const removePropertyImageHandler = async (index) => {
		dispatch(
			removePropertyImage({
				propertyID: selectedProperty._id,
				imageIndex: index,
			})
		);
		const updatedImages = selectedPropertyImages.filter((_, i) => i !== index);
		dispatch(setSelectedPropertyImages(updatedImages));
		dispatch(setSelectedPropertyModified(true));
	};

	const renderButtons = () => {
		const listProperty = () => {
			dispatch(setLoading(true));
			dispatch(setListingProgress(2));
			dispatch(setListingContentDisplayed("list"));
			dispatch(setSelectedMenu("list_property"));
		};

		const mintProperty = () => {
			dispatch(setLoading(true));
			dispatch(setListingProgress(1));
			dispatch(setListingContentDisplayed("mint"));
			dispatch(setSelectedMenu("list_property"));
		};

		if (selectedProperty.sold) return <></>;
		else if (selectedProperty.locked)
			return (
				<>
					<div className="button">Break Deal</div>
					<div className="button second">Finalize</div>
				</>
			);
		else if (selectedProperty.listed)
			return (
				<>
					<div className="button">Delete</div>
					<div className="button second">Un-List</div>
				</>
			);
		else if (selectedProperty.minted)
			return (
				<>
					<div className="button">Delete</div>
					<div className="button second" onClick={listProperty}>
						List
					</div>
				</>
			);
		else
			return (
				<>
					<div className="button">Delete</div>
					<div className="button second" onClick={mintProperty}>
						Mint
					</div>
				</>
			);
	};

	return (
		<div className="selected-property">
			<div className="header-container">
				<div
					className="return-button-container"
					onClick={() => dispatch(setSelectedProperty(null))}
				>
					<FaArrowLeft className="icon" />
				</div>

				<div className="address-container">
					{concatAddress({
						street: selectedProperty.street,
						city: selectedProperty.city,
						state: selectedProperty.state,
						zipcode: selectedProperty.zipCode,
					})}
				</div>
			</div>

			<div className="body-container">
				<div className="property-status-bar">
					{renderPropertyStatus(selectedProperty)}
				</div>

				<div
					className={`property-images-container ${
						fetchingPropertyImages && "loading"
					}`}
				>
					<div className="thumbnail-container">
						<div className="image-container">
							{selectedPropertyThumbnail && (
								<>
									<img
										className="image"
										src={`data:${selectedPropertyThumbnail.contentType};base64,${selectedPropertyThumbnail.data}`}
										alt="Property Image"
									/>

									<div
										className="change-thumbnail-button"
										onClick={changePropertyThumbnailHandler}
									>
										Change <FiEdit3 className="icon" />
									</div>
								</>
							)}
						</div>
					</div>

					<div
						className="images-container"
						style={{ padding: fetchingPropertyImages && "0" }}
					>
						{!fetchingPropertyImages && fetchingPropertyImagesError === "" && (
							<>
								{selectedPropertyImages.map(({ contentType, data }, index) => {
									return (
										<div
											key={index}
											className="image-container"
											style={{ minWidth: "150px", maxWidth: "150px" }}
										>
											<img
												className="image"
												src={`data:${contentType};base64,${data}`}
											/>

											{selectedPropertyImages.length > 3 && (
												<BiX
													className="remove-picture-button"
													title="Remove picture"
													onClick={() => removePropertyImageHandler(index)}
												/>
											)}
										</div>
									);
								})}

								<div
									className="add-image-container"
									onClick={addPropertyImagelHandler}
								>
									<GrAddCircle className="icon" />
								</div>
							</>
						)}

						{fetchingPropertyImages && (
							<div className="loading-gif-container">
								<img
									className="loader-gif"
									src={LoadingPropertyImageGif}
									alt="Loading Property Images"
								/>
							</div>
						)}

						{!fetchingPropertyImages &&
							selectedPropertyImages.length === 0 &&
							fetchingPropertyImagesError !== "" && (
								<div className="loading-property-images-error-container">
									<img
										className="image"
										src={require("../../../../images/error-fetching-data-image.png")}
										alt=""
									/>
									{fetchingPropertyImagesError}
								</div>
							)}
					</div>
				</div>

				{/* <div className="counts-container">
					<div className="count-item views">
						<BsEyeFill className="count-icon" />

						<div className="count">
							{parseInt(selectedProperty.views).toLocaleString("en-US", {
								maximumFractionDigits: 2,
							})}
						</div>
					</div>

					<div className="count-item likes">
						<BiSolidHeart className="count-icon" />

						<div className="count">
							{selectedProperty.likes.length.toLocaleString("en-US", {
								maximumFractionDigits: 2,
							})}
						</div>
					</div>
				</div> */}

				<div className="buttons-container">{renderButtons()}</div>
			</div>
		</div>
	);
};

export default SellerPropertyDetail;

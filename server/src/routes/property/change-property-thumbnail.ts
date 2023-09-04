import express, { Request, Response } from "express";
import { body } from "express-validator";
import mongoose from "mongoose";
import multer from "multer";
const sharp = require("sharp");

// importing models and services
import { User } from "../../models/user";
import { Property, ImageAttr } from "../../models/property";
import { validateSingleImage } from "../../services/validate-single-image";
import { DeleteImages } from "../../services/delete-images";

// importing types, middlewares, and errors
import {
	BadRequestError,
	currentUser,
	requireAuth,
	validateRequest,
} from "@kmalae.ltd/library";

const router = express.Router();
const upload = multer({ dest: "properties/" });

router.post(
	"/api/property/changePropertyThumbnail",
	upload.single("thumbnailImage"),
	[
		body("propertyID")
			.notEmpty()
			.withMessage("Property ID required")
			.custom((input) => mongoose.Types.ObjectId.isValid(input))
			.withMessage("Invalid property ID"),
	],
	currentUser,
	requireAuth,
	validateRequest,
	validateSingleImage,
	async (req: Request, res: Response) => {
		const { email } = req.currentUser!;
		const existingUser = await User.findOne({ email });
		if (!existingUser) {
			await DeleteImages.deleteMultipleImages(req);
			throw new BadRequestError("User not found");
		}

		const { propertyID } = req.body;
		const existingProperty = await Property.findById(propertyID);
		if (!existingProperty) throw new BadRequestError("Property not found");

		if (existingProperty.seller.toString() !== existingUser._id.toString())
			throw new BadRequestError("User does not own property");

		let thumbnail: ImageAttr = {
			data: Buffer.from([]),
			contentType: "",
		};

		try {
			const image = req.file;
			// @ts-ignore
			const imageBuffer = await sharp(image.path)
				.resize({ width: 500 })
				.toBuffer();

			thumbnail = {
				data: imageBuffer,
				contentType: image!.mimetype,
			};

			await DeleteImages.deleteSingleImage(req);

			existingProperty.set({ thumbnail });
			existingProperty.save();

			return res.status(201).send(existingProperty);
		} catch (error) {
			console.error(error);
			throw new BadRequestError("Error updating property thumbnail");
		}
	}
);

export { router as ChangePropertyThumbnailRouter };

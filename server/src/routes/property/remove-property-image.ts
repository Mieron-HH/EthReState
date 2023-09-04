import express, { Request, Response } from "express";
import { body } from "express-validator";
import mongoose from "mongoose";

// importing models
import { User } from "../../models/user";
import { Property } from "../../models/property";

// importing types, middlewares, and errors
import {
	BadRequestError,
	currentUser,
	requireAuth,
	validateRequest,
} from "@kmalae.ltd/library";

const router = express.Router();

router.post(
	"/api/property/removePropertyImage",
	[
		body("propertyID")
			.notEmpty()
			.withMessage("Property ID must be provided")
			.custom((input) => mongoose.Types.ObjectId.isValid(input))
			.withMessage("Invalid property ID"),
		body("imageIndex")
			.notEmpty()
			.withMessage("Image index must be provided")
			.isInt({ min: 0 })
			.withMessage("Invalid image index"),
	],
	currentUser,
	requireAuth,
	validateRequest,
	async (req: Request, res: Response) => {
		const { email } = req.currentUser!;
		const existingUser = await User.findOne({ email });
		if (!existingUser) throw new BadRequestError("User not found");

		const { propertyID, imageIndex } = req.body;
		const existingProperty = await Property.findById(propertyID);
		if (!existingProperty) throw new BadRequestError("Property not found");

		if (existingProperty.seller.toString() !== existingUser._id.toString())
			throw new BadRequestError("User does not own property");
		if (imageIndex < 0 || imageIndex >= existingProperty.images.length)
			throw new BadRequestError("Invalid image index");

		try {
			existingProperty.images.splice(imageIndex, 1);

			await existingProperty.save();

			return res.status(201).send(existingProperty);
		} catch (error) {
			console.error(error);
			throw new BadRequestError("Error removing property image");
		}
	}
);

export { router as RemovePropertyImageRouter };

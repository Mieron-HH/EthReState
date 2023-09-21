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
	"/api/property/changePropertyPrice",
	[
		body("propertyID")
			.notEmpty()
			.withMessage("Property ID required")
			.custom((input) => mongoose.Types.ObjectId.isValid(input))
			.withMessage("Invalid property ID"),
		body("price")
			.notEmpty()
			.withMessage("Price is required")
			.isNumeric()
			.withMessage("Price must be a numeric value")
			.custom((value) => parseFloat(value) >= 0)
			.withMessage("Price must be a non-negative value"),
	],
	currentUser,
	requireAuth,
	validateRequest,
	async (req: Request, res: Response) => {
		const { email } = req.currentUser!;
		const existingUser = await User.findOne({ email });
		if (!existingUser) throw new BadRequestError("User not found");

		const { propertyID, price } = req.body;
		const existingProperty = await Property.findById(propertyID);
		if (!existingProperty) throw new BadRequestError("Property not found");

		if (existingProperty.seller.toString() !== existingUser._id.toString())
			throw new BadRequestError("User does not own property");

		try {
			existingProperty.set({
				price,
			});

			existingProperty.save();

			return res.status(201).send(existingProperty);
		} catch (error) {
			console.error({ error });
			throw new BadRequestError("Error changing property price");
		}
	}
);

export { router as ChangePropertyPriceRouter };

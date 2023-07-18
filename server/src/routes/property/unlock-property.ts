import express, { Request, Response } from "express";
import { body } from "express-validator";
import mongoose from "mongoose";

// importing models
import { User } from "../../models/user";
import { Property } from "../../models/property";

// importing types, middlewares, and errors
import { BadRequestError, currentUser, requireAuth } from "@kmalae.ltd/library";

const router = express.Router();

router.post(
	"/api/property/unlock",
	[
		body("propertyID")
			.notEmpty()
			.withMessage("Property ID required")
			.custom((input) => mongoose.Types.ObjectId.isValid(input))
			.withMessage("Invalid property ID"),
	],
	currentUser,
	requireAuth,
	async (req: Request, res: Response) => {
		const { email } = req.currentUser!;
		const existingUser = await User.findOne({ email });
		if (!existingUser) throw new BadRequestError("User not found");

		const { propertyID } = req.body;
		const existingProperty = await Property.findById(propertyID);
		if (!existingProperty) throw new BadRequestError("Property not found");

		if (
			existingProperty.seller.toString() !== existingUser._id.toString() ||
			existingProperty.buyer?.toString() !== existingUser._id.toString()
		)
			throw new BadRequestError("User cannot unlock property");

		try {
			existingProperty.set({
				buyer: undefined,
				locked: false,
			});

			existingProperty.save();

			return res.status(201).send(existingProperty);
		} catch (error) {
			console.error(error);
			throw new BadRequestError("Error unlocking property");
		}
	}
);

export { router as UnlockRouter };

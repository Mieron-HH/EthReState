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
	"/api/property/fetchProperty",
	[
		body("propertyID")
			.notEmpty()
			.withMessage("Property ID must be provided")
			.custom((input) => mongoose.Types.ObjectId.isValid(input))
			.withMessage("Invalid property ID"),
	],
	currentUser,
	requireAuth,
	validateRequest,
	async (req: Request, res: Response) => {
		const { email } = req.currentUser!;
		const existingUser = await User.findOne({ email });
		if (!existingUser) throw new BadRequestError("User not found");

		const { propertyID } = req.body;
		const existingProperty = await Property.findById(propertyID);

		if (!existingProperty) throw new BadRequestError("Property not found");
		if (existingProperty.seller.toString() !== existingProperty._id.toString())
			throw new BadRequestError("User does not own property");

		res.status(200).send(existingProperty);
	}
);

export { router as FetchPropertyRouter };

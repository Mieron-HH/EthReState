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
	"/api/property/list",
	[
		body("propertyID")
			.notEmpty()
			.withMessage("Property ID is required")
			.custom((input) => mongoose.Types.ObjectId.isValid(input))
			.withMessage("Invalid property ID"),
	],
	currentUser,
	requireAuth,
	validateRequest,
	async (req: Request, res: Response) => {
		const { email, id } = req.currentUser!;
		const existingUser = await User.findOne({ email });
		if (!existingUser) throw new BadRequestError("User not found");

		const { propertyID } = req.body;
		const existingProperty = await Property.findById(propertyID);
		if (!existingProperty) throw new BadRequestError("Property not found");

		if (existingProperty.seller.toString() !== existingUser._id.toString())
			throw new BadRequestError("User does not own property");
		if (!existingProperty.minted)
			throw new BadRequestError("NFT for the property not minted");
		if (existingProperty.listed)
			throw new BadRequestError("Property already listed");
		try {
			existingProperty.set({
				owner: process.env.ETHRESTATE_ADDRESS,
				listed: true,
			});

			existingProperty.save();

			return res.status(201).send(existingProperty);
		} catch (error) {
			console.error(error);
			throw new BadRequestError("Error listing property");
		}
	}
);

export { router as ListRouter };

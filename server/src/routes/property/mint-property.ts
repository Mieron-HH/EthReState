import express, { Request, Response } from "express";
import { body } from "express-validator";

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
import mongoose from "mongoose";

const router = express.Router();

router.post(
	"/api/property/mint",
	[
		body("propertyID")
			.notEmpty()
			.withMessage("Property ID must be provided")
			.custom((input) => mongoose.Types.ObjectId.isValid(input))
			.withMessage("Invlaid property ID"),
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
		if (existingProperty.minted)
			throw new BadRequestError("NFT for the property already minted");

		try {
			existingProperty.set({
				minted: true,
			});

			existingProperty.save();
		} catch (error) {
			console.error(error);
			throw new BadRequestError("Error minting property");
		}

		return res.status(201).send(existingProperty);
	}
);

export { router as MintRouter };

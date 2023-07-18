import express, { Request, Response } from "express";
import { body } from "express-validator";
import mongoose from "mongoose";
const web3 = require("web3");

// importing models
import { User } from "../../models/user";
import { Property } from "../../models/property";

// importing types, middlewares, and errors
import { BadRequestError, validateRequest } from "@kmalae.ltd/library";

const router = express.Router();

router.post(
	"/api/property/lock",
	[
		body("propertyID")
			.notEmpty()
			.withMessage("Property ID required")
			.custom((input) => mongoose.Types.ObjectId.isValid(input))
			.withMessage("Invalid property ID"),
		body("buyerID")
			.notEmpty()
			.withMessage("Buyer ID required")
			.custom((input) => mongoose.Types.ObjectId.isValid(input))
			.withMessage("Invalid buyer ID"),
	],
	validateRequest,
	async (req: Request, res: Response) => {
		const { propertyID, buyerID, newOwner } = req.body;

		const existingUser = await User.findById(buyerID);
		if (!existingUser) throw new BadRequestError("User not found");

		const existingProperty = await Property.findById(propertyID);
		if (!existingProperty) throw new BadRequestError("Property not found");

		if (existingProperty.seller.toString() === existingUser._id.toString())
			throw new BadRequestError("Seller cannot buy property");

		if (
			!existingProperty.minted ||
			!existingProperty.listed ||
			existingProperty.locked
		)
			throw new BadRequestError("Cannot lock property");

		try {
			existingProperty.set({
				buyer: buyerID,
				locked: true,
			});

			existingProperty.save();

			return res.status(201).send(existingProperty);
		} catch (error) {
			console.error(error);
			throw new BadRequestError("Error locking property");
		}
	}
);

export { router as LockRouter };

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
	"/api/property/buy",
	[
		body("propertyID")
			.notEmpty()
			.withMessage("Property ID required")
			.custom((input) => mongoose.Types.ObjectId.isValid(input))
			.withMessage("Invalid property ID"),
		body("newOwner")
			.notEmpty()
			.withMessage("Buyer public address required")
			.custom((input) => web3.utils.isAddress(input))
			.withMessage("Invalid buyer public address"),
	],
	validateRequest,
	async (req: Request, res: Response) => {
		const { propertyID, buyerID, newOwner } = req.body;

		const existingUser = await User.findById(buyerID);
		if (!existingUser) throw new BadRequestError("User not found");

		const existingNFT = await Property.findById(propertyID);
		if (!existingNFT) throw new BadRequestError("Property not found");

		if (!existingNFT.minted || !existingNFT.listed || !existingNFT.locked)
			throw new BadRequestError("Cannot buy property");
		if (existingNFT.buyer!.toString() !== existingUser._id.toString())
			throw new BadRequestError("User is not the buyer");

		try {
			existingNFT.set({
				owner: newOwner,
				sold: true,
			});

			existingNFT.save();

			return res.status(201).send(existingNFT);
		} catch (error) {
			console.error(error);
			throw new BadRequestError("Error buying property");
		}
	}
);

export { router as BuyRouter };

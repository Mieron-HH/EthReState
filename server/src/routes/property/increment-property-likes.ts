import express, { Request, Response } from "express";
import { body } from "express-validator";
import mongoose from "mongoose";

// importing models
import { User } from "../../models/user";
import { Property } from "../../models/property";

// importing type, middlewares, and errors
import { BadRequestError, currentUser, requireAuth } from "@kmalae.ltd/library";

const router = express.Router();

router.post(
	"/api/property/incrementLikes",
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

		try {
			const userLikesProperty = existingProperty.likes.includes(
				existingUser.id
			);

			if (userLikesProperty) {
				// User has already liked the property, remove the like
				existingProperty.likes = existingProperty.likes.filter(
					(userId) => userId !== existingUser.id
				);
			} else {
				// User hasn't liked the property before, add the like
				existingProperty.likes.push(existingUser.id);
			}

			existingProperty.save();

			return res.status(201).send(existingProperty);
		} catch (error) {
			console.error({ error });
			throw new BadRequestError("Error incrementing property likes");
		}
	}
);

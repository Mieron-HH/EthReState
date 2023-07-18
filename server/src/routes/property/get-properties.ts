import express, { Request, Response } from "express";

// importing models
import { User } from "../../models/user";
import { Property } from "../../models/property";

// importing types, middlewares, and errors
import { BadRequestError, currentUser, requireAuth } from "@kmalae.ltd/library";

const router = express.Router();

router.get(
	"/api/property/getProperties",
	currentUser,
	requireAuth,
	async (req: Request, res: Response) => {
		const { email } = req.currentUser!;
		const existingUser = await User.findOne({ email });
		if (!existingUser) throw new BadRequestError("User not found");

		const properties = await Property.find({
			minted: true,
			listed: true,
			sold: false,
		});

		return res.status(200).send(properties);
	}
);

export { router as GetPropertiesRouter };

import express, { Request, Response } from "express";

// importing models
import { User } from "../../models/user";

// importing types, middlewares, and errors
import { BadRequestError, currentUser, requireAuth } from "@kmalae.ltd/library";

const router = express.Router();

router.get(
	"/api/user/getUer",
	currentUser,
	requireAuth,
	async (req: Request, res: Response) => {
		const { email } = req.currentUser!;
		const existingUser = await User.findOne({ email });
		if (!existingUser) throw new BadRequestError("User not found");

		return res.status(200).send(existingUser);
	}
);

export { router as GetUserRouter };

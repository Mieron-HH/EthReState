import express, { Request, Response } from "express";

// importing types, middlewares, and errors
import { currentUser } from "@kmalae.ltd/library";

const router = express.Router();

router.get(
	"/api/user/currentUser",
	currentUser,
	async (req: Request, res: Response) => {
		res.send({ currentUser: req.currentUser || null });
	}
);

export { router as CurrentUserRouter };

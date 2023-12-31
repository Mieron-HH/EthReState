import express, { Request, Response } from "express";

const router = express.Router();

router.get("/api/user/signout", (req: Request, res: Response) => {
	// @ts-ignore
	req.session = null;

	res.send({});
});

export { router as SignoutRouter };
